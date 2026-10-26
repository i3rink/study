/* core/engine.js
   Shared engine for every subject: storage, active-use timer, mastery, logging,
   tests and reflections, topic priorities and parent settings.
   Subject files never touch storage directly. They call Study.registerSubject(). */
(function(){
'use strict';

const APP = 'studyapp';
const APP_VERSION = '1.2.0';   // must match the footer and the commit message
const TARGET = 5;              // correct in a row to master a topic
const IDLE_MS = 60000;         // timer stops 1 minute after the last action
const DEFAULT_GOAL = 65;       // % placeholder for B+, parent can change per subject
const LEVELS = ['red','amber','green'];

const REG = window.STUDY_REGISTRY || {children:[], subjects:[]};

/* ---------- small utils ---------- */
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const el = id => document.getElementById(id);
const pad = n => String(n).padStart(2,'0');
const dkey = d => d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const todayKey = () => dkey(new Date());
const kdate = k => new Date(k+'T12:00:00');
const addDays = (k,n) => { const d = kdate(k); d.setDate(d.getDate()+n); return dkey(d); };
const daysBetween = (a,b) => Math.round((kdate(b)-kdate(a))/864e5);
const fmtDur = s => { s = Math.round(s||0); const m = Math.floor(s/60), h = Math.floor(m/60); return h ? `${h}h ${m%60}m` : `${m}m`; };
const fmtDate = k => kdate(k).toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'});
const fmtDateY = k => kdate(k).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
const pct = (c,q) => q ? Math.round(c/q*100)+'%' : '-';
const perTen = (q,s) => s >= 120 ? (q/(s/600)).toFixed(1) : '-';
const lowRate = (q,s) => s >= 600 && q/(s/600) < 1;

/* ---------- storage ----------
   Every key is studyapp:<child>:<subject>:<part> (parts: progress, log, tests, plan, written), so nothing clashes with the
   other child or with other apps on the same GitHub Pages address.
   The parent PIN covers both children, so it lives at studyapp:parent:settings. */
const key = (child, subject, part) => [APP, child, subject, part].join(':');
const PARENT_KEY = APP + ':parent:settings';
function read(k, def){ try { const raw = localStorage.getItem(k); if (raw == null) return def; const v = JSON.parse(raw); return v == null ? def : v; } catch(e){ return def; } }
function write(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch(e){ return false; } }

const cache = {};
function store(entry){
  const id = entry.child + ':' + entry.subject;
  if (cache[id]) return cache[id];
  const k = p => key(entry.child, entry.subject, p);
  const hadLog = read(k('log'), null) != null;
  const s = {
    progress: read(k('progress'), null) || {p:{}, unlock:false},
    log:      read(k('log'), null)      || {since: todayKey(), days:{}},
    tests:    read(k('tests'), null)    || {goal: DEFAULT_GOAL, list:[], proposal:null},
    plan:     read(k('plan'), null),
    written:  read(k('written'), null)  || {list:[]},
    save(part){ write(k(part), s[part]); }
  };
  if (!Array.isArray(s.written.list)) s.written.list = [];
  if (!s.progress.p) s.progress.p = {};
  if (!s.log.days) s.log.days = {};
  if (!s.log.since) s.log.since = todayKey();
  if (!Array.isArray(s.tests.list)) s.tests.list = [];
  if (typeof s.tests.goal !== 'number') s.tests.goal = DEFAULT_GOAL;
  cache[id] = s;
  if (!hadLog) s.save('log');   // fixes the "tracking since" date the first time this subject is used
  return s;
}

/* ---------- registry and content files ---------- */
const children = () => REG.children;
const childById = id => REG.children.find(c => c.id === id) || null;
const subjectsFor = child => REG.subjects.filter(s => s.child === child);
const fileKey = e => e.child + '-' + e.subject;
const defs = {};
function registerSubject(fk, def){ defs[fk] = def; }
const defFor = e => defs[fileKey(e)] || null;
function loadSubject(entry){
  const fk = fileKey(entry);
  if (defs[fk]) return Promise.resolve(defs[fk]);
  return new Promise((res, rej) => {
    const sc = document.createElement('script');
    sc.src = entry.file + '?v=' + APP_VERSION;
    sc.onload = () => defs[fk] ? res(defs[fk]) : rej(new Error(entry.file + ' loaded but did not register "' + fk + '"'));
    sc.onerror = () => rej(new Error('Could not load ' + entry.file));
    document.head.appendChild(sc);
  });
}
const loadChild = child => Promise.all(subjectsFor(child).map(loadSubject).concat(window.Study && window.Study.plan ? [window.Study.plan.load(child)] : []));

/* ---------- topics, priorities and mastery ---------- */
function topicList(entry){
  const def = defFor(entry); if (!def) return [];
  const plan = store(entry).plan;
  const byId = {}; def.topics.forEach(t => byId[t.id] = t);
  const ids = plan && Array.isArray(plan.order) ? plan.order.filter(id => byId[id]) : [];
  def.topics.forEach(t => { if (!ids.includes(t.id)) ids.push(t.id); });
  return ids.map(id => {
    const lv = plan && plan.levels && plan.levels[id];
    return {t: byId[id], level: LEVELS.includes(lv) ? lv : (byId[id].level || 'amber')};
  });
}
function prog(entry, id){ const P = store(entry).progress.p; return P[id] = P[id] || {a:0, c:0, streak:0, best:0, mastered:false}; }
function groups(entry){
  const L = topicList(entry);
  return {red: L.filter(x => x.level === 'red'), amber: L.filter(x => x.level === 'amber'), green: L.filter(x => x.level === 'green')};
}
const redsDone = entry => groups(entry).red.every(x => prog(entry, x.t.id).mastered);
const ambersOpen = entry => !!store(entry).progress.unlock || redsDone(entry);
const isLocked = (entry, level) => level === 'amber' && !ambersOpen(entry);
function nextTopic(entry){
  const g = groups(entry), f = a => a.find(x => !prog(entry, x.t.id).mastered);
  return f(g.red) || (ambersOpen(entry) && f(g.amber)) || null;
}
function day(entry, k){ const L = store(entry).log; k = k || todayKey(); return L.days[k] = L.days[k] || {s:0, q:0, c:0, h:0, t:{}, tq:{}}; }
function recordAnswer(entry, topicId, ok, revealed){
  const st = store(entry), p = prog(entry, topicId), was = p.mastered;
  p.a++;
  if (ok){ p.c++; p.streak++; p.best = Math.max(p.best, p.streak); if (p.streak >= TARGET && !p.mastered){ p.mastered = true; p.masteredOn = todayKey(); } }
  else p.streak = 0;
  st.save('progress');
  const d = day(entry); d.q++; if (ok) d.c++; if (revealed) d.h++;
  d.tq = d.tq || {}; const tq = d.tq[topicId] = d.tq[topicId] || {q:0, c:0}; tq.q++; if (ok) tq.c++;
  st.save('log');
  return {newlyMastered: !was && p.mastered};
}
/* A written answer the pupil marked himself. Kept apart from checked answers:
   it never changes mastery, streaks, questions answered or percentage right. */
function recordWritten(entry, topicId, rec){
  const st = store(entry), d = day(entry);
  d.w = (d.w || 0) + 1; d.wm = (d.wm || 0) + (rec.got || 0); d.wo = (d.wo || 0) + (rec.of || 0);
  st.written.list.push(Object.assign({date: todayKey(), at: Date.now(), topic: topicId}, rec));
  if (st.written.list.length > 300) st.written.list.shift();
  st.save('written'); st.save('log');
}

/* ---------- active-use timer ----------
   Counts only while a subject is open, the page is on screen, and there has been
   a tap, key, scroll or typing in the last minute. */
let lastAct = 0, ticks = 0, clockHook = null;
const ctx = {child: null, entry: null, area: null};
['pointerdown','keydown','input','wheel','touchmove','scroll'].forEach(ev =>
  window.addEventListener(ev, () => { lastAct = Date.now(); }, {passive: true, capture: true}));
const timing = () => !!ctx.entry && lastAct > 0 && document.visibilityState === 'visible' && Date.now() - lastAct < IDLE_MS;
function flush(){ if (ctx.entry) store(ctx.entry).save('log'); }
setInterval(() => {
  const on = timing();
  if (on){ const d = day(ctx.entry), a = ctx.area || 'list'; d.s++; d.t[a] = (d.t[a] || 0) + 1; if (++ticks % 10 === 0) flush(); }
  if (clockHook) clockHook(on);
}, 1000);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
window.addEventListener('pagehide', flush);
function setContext(child, entry, area){ if (ctx.entry && ctx.entry !== entry) flush(); ctx.child = child; ctx.entry = entry || null; ctx.area = area || null; }

/* ---------- totals ---------- */
function sumRange(entry, from, to){
  const D = store(entry).log.days, r = {s:0, q:0, c:0, h:0};
  Object.keys(D).forEach(k => { if (k >= from && k <= to){ const d = D[k]; r.s += d.s; r.q += d.q; r.c += d.c; r.h += d.h; } });
  return r;
}
/* One child's totals for a day across all his subjects (tracked time only, never the focus timer). */
function dailyTotals(child, k){
  k = k || todayKey();
  return subjectsFor(child).reduce((a, e) => { const d = store(e).log.days[k]; if (d){ a.s += d.s; a.q += d.q; a.c += d.c; a.h += d.h; } return a; }, {s:0, q:0, c:0, h:0});
}
function rangeTotals(child, from, to){
  return subjectsFor(child).reduce((a, e) => { const r = sumRange(e, from, to); a.s += r.s; a.q += r.q; a.c += r.c; a.h += r.h; return a; }, {s:0, q:0, c:0, h:0});
}
const childSince = child => subjectsFor(child).map(e => store(e).log.since).sort()[0] || todayKey();

/* ---------- tests, reflections and suggested priorities ---------- */
const testsSorted = entry => store(entry).tests.list.slice().sort((a,b) => a.date < b.date ? -1 : a.date > b.date ? 1 : a.loggedAt - b.loggedAt);
const lastTest = entry => { const L = testsSorted(entry); return L.length ? L[L.length-1] : null; };
const scorePct = t => t.outOf ? Math.round(t.score / t.outOf * 100) : 0;

/* What he actually did between the previous test and this one. */
function evidenceFor(entry, date, excludeId){
  const st = store(entry);
  const prev = testsSorted(entry).filter(t => t.date < date && t.id !== excludeId).pop() || null;
  let from = prev ? addDays(prev.date, 1) : st.log.since;
  const clipped = from < st.log.since;
  if (clipped) from = st.log.since;
  if (from > date) from = date;
  const r = sumRange(entry, from, date);
  r.from = from; r.to = date; r.days = Math.max(1, daysBetween(from, date) + 1);
  r.minsPerWeek = Math.round(r.s / 60 / r.days * 7);
  r.clipped = clipped || (!prev && st.log.since > date);
  r.mastered = Object.values(st.progress.p).filter(p => p.masteredOn && p.masteredOn >= from && p.masteredOn <= date).length;
  r.prev = prev ? {name: prev.name, date: prev.date, planMins: prev.reflect ? prev.reflect.minsPerWeek : null, diff: prev.reflect ? prev.reflect.diff : ''} : null;
  return r;
}
/* Turn "lost most / some / fine / not in it" into suggested levels. */
function proposedLevels(entry, marks){
  const levels = {};
  topicList(entry).forEach(x => { const m = marks[x.t.id]; levels[x.t.id] = m === 'most' ? 'red' : m === 'some' ? 'amber' : m === 'fine' ? 'green' : x.level; });
  return levels;
}
function defaultRedOrder(entry, levels){ return topicList(entry).map(x => x.t.id).filter(id => levels[id] === 'red'); }
/* Reds first, then ambers, then greens, each kept in the preferred order given. */
function buildOrder(entry, levels, pref){
  const all = topicList(entry).map(x => x.t.id);
  const seq = (pref || []).filter(id => all.includes(id));
  all.forEach(id => { if (!seq.includes(id)) seq.push(id); });
  return LEVELS.flatMap(l => seq.filter(id => levels[id] === l));
}
function saveTest(entry, rec){
  const st = store(entry);
  rec.id = 't' + Date.now().toString(36);
  rec.loggedAt = Date.now();
  rec.evidence = evidenceFor(entry, rec.date);
  st.tests.list.push(rec);
  const levels = proposedLevels(entry, rec.marks || {});
  st.tests.proposal = {
    fromTest: rec.id, testName: rec.name, at: todayKey(),
    order: buildOrder(entry, levels, rec.reflect && rec.reflect.focus),
    levels,
    reopen: Object.keys(rec.marks || {}).filter(id => rec.marks[id] === 'most' && prog(entry, id).mastered)
  };
  st.save('tests');
  return rec;
}
/* Parent approves a list. A mastered topic is re-opened if it has newly become red,
   or if the test it came from shows he lost most of the marks on it. */
function applyPlan(entry, order, levels, reopenIds){
  const st = store(entry), before = {};
  topicList(entry).forEach(x => before[x.t.id] = x.level);
  const reopen = new Set(reopenIds || []);
  order.forEach(id => { if (levels[id] === 'red' && before[id] !== 'red') reopen.add(id); });
  reopen.forEach(id => { if (levels[id] !== 'red') return; const p = prog(entry, id); if (p.mastered){ p.mastered = false; p.streak = 0; p.reopened = todayKey(); } });
  st.plan = {order, levels, approved: todayKey()};
  st.save('plan'); st.save('progress');
  st.tests.proposal = null; st.save('tests');
}
function rejectProposal(entry){ const st = store(entry); st.tests.proposal = null; st.save('tests'); }
function willReopen(entry, order, levels, reopenIds){
  const before = {}; topicList(entry).forEach(x => before[x.t.id] = x.level);
  const R = new Set(reopenIds || []);
  return order.filter(id => levels[id] === 'red' && prog(entry, id).mastered && (before[id] !== 'red' || R.has(id)));
}

/* ---------- parent settings ---------- */
function parent(){ return read(PARENT_KEY, null) || {pin: null}; }
function saveParent(p){ write(PARENT_KEY, p); }
const phash = s => { let h = 5381; for (const ch of APP + ':' + s) h = ((h << 5) + h + ch.charCodeAt(0)) | 0; return String(h >>> 0); };
function resetProgress(entry){ const st = store(entry); st.progress = {p:{}, unlock:false}; st.save('progress'); }
function clearLog(entry){ const st = store(entry); st.log = {since: todayKey(), days:{}}; st.save('log'); st.written = {list:[]}; st.save('written'); }

window.Study = {
  APP, APP_VERSION, TARGET, IDLE_MS, DEFAULT_GOAL, LEVELS,
  esc, el, dkey, todayKey, addDays, daysBetween, fmtDur, fmtDate, fmtDateY, pct, perTen, lowRate,
  key, store, children, childById, subjectsFor, registerSubject, defFor, loadSubject, loadChild,
  topicList, prog, groups, redsDone, ambersOpen, isLocked, nextTopic, day, recordAnswer, recordWritten,
  ctx, setContext, timing, setClockHook: fn => { clockHook = fn; },
  sumRange, dailyTotals, rangeTotals, childSince,
  testsSorted, lastTest, scorePct, evidenceFor, proposedLevels, defaultRedOrder, buildOrder, saveTest, applyPlan, rejectProposal, willReopen,
  parent, saveParent, phash, resetProgress, clearLog,
  screens: {}
};
})();
