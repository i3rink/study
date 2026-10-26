/* core/plan.js
   Study plans, shared by every child. A plan file in plans/ holds exam dates and which
   subject to study each weeknight. This file works out tonight's target, the Friday rule,
   the "Training cancelled" override, the self-reported focus timer, and the plan screens.

   Rules:
   - Weeknights only. Football nights (registry `football`) are short, other nights long.
   - "Training cancelled" makes a football night long. The pupil can press it. The Parent view logs it.
   - Friday is off when every Monday to Thursday minute was done, counted as the total of time
     spent on each night's planned subject. Friday is always on in an exam week.
   - A subject with a content file uses tracked active time. A subject without one uses the
     focus timer, which is self-reported and always shown separately from tracked time.

   Focus timer honesty checks:
   - Pauses the moment the page is hidden or the pupil leaves the timer screen.
   - Asks "Still working?" every 15 minutes. No answer within 2 minutes takes those 2 minutes
     back off and pauses.
   - Stop keeps the time done so far. Under a minute isn't logged.
   - Every session ends with a one-line note on what was covered.

   Storage:
   - studyapp:<child>:all:plan        "Training cancelled" presses
   - studyapp:<child>:<subject>:focus focus timer sessions for one subject */
(function(){
'use strict';
const S = window.Study, el = S.el, esc = S.esc;
const REG = window.STUDY_REGISTRY || {};
const CHECK_EVERY = 15 * 60, CHECK_GRACE = 2 * 60, MIN_LOG = 60, SAVE_EVERY = 10;
const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/* ---------- plan files ---------- */
const plans = {};
function registerPlan(p){ plans[p.child] = p; }
const planFor = child => plans[child] || null;
const planEntry = child => (REG.plans || []).find(p => p.child === child) || null;
const loading = {};
function load(child){
  const pe = planEntry(child);
  if (!pe || plans[child]) return Promise.resolve(plans[child] || null);
  if (loading[child]) return loading[child];
  return loading[child] = new Promise((res, rej) => {
    const sc = document.createElement('script');
    sc.src = pe.file + '?v=' + S.APP_VERSION;
    sc.onload = () => plans[child] ? res(plans[child]) : rej(new Error(pe.file + ' loaded but did not register a plan for ' + child));
    sc.onerror = () => { loading[child] = null; rej(new Error('Could not load ' + pe.file)); };
    document.head.appendChild(sc);
  });
}

/* ---------- storage ---------- */
function read(k, def){ try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; } catch(e){ return def; } }
function write(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
const psCache = {}, flCache = {};
function PS(child){
  if (psCache[child]) return psCache[child];
  const v = read(S.key(child, 'all', 'plan'), null) || {};
  v.cancelled = v.cancelled || {};
  return psCache[child] = v;
}
const savePS = child => write(S.key(child, 'all', 'plan'), PS(child));
function FL(child, subject){
  const id = child + ':' + subject;
  if (flCache[id]) return flCache[id];
  const v = read(S.key(child, subject, 'focus'), null) || {};
  v.since = v.since || S.todayKey(); v.sessions = Array.isArray(v.sessions) ? v.sessions : [];
  return flCache[id] = v;
}
const saveFL = (child, subject) => write(S.key(child, subject, 'focus'), FL(child, subject));

/* ---------- dates ---------- */
const dow = k => new Date(k + 'T12:00:00').getDay();
const weekStart = k => S.addDays(k, -((dow(k) + 6) % 7));
const mins = s => Math.floor((s || 0) / 60);
const clock = s => { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
function inDays(k){ const n = S.daysBetween(S.todayKey(), k); return n === 0 ? 'today' : n === 1 ? 'tomorrow' : `in ${n} days`; }

/* ---------- nights ---------- */
const tracked = (child, subject) => S.subjectsFor(child).find(e => e.subject === subject) || null;
const phaseOf = (plan, k) => (plan.phases || []).find(p => k >= p.from && k <= p.to) || null;
const football = (child, k) => { const c = S.childById(child); return !!(c && c.football && c.football.includes(dow(k))); };
const isCancelled = (child, k) => !!PS(child).cancelled[k];
const examsOn = (plan, k) => plan.exams.filter(e => e.date === k);
function examWeek(plan, k){
  const ws = weekStart(k), fri = S.addDays(ws, 4), nextMon = S.addDays(ws, 7);
  return plan.exams.some(e => (e.date >= ws && e.date <= fri) || e.date === nextMon);
}
function rawNight(plan, k){
  if (k < plan.start || k > plan.end) return null;
  const d = dow(k); if (d === 0 || d === 6) return null;
  if (plan.days && plan.days[k]){ const v = plan.days[k]; return Array.isArray(v) ? {s: v} : v; }
  const ph = phaseOf(plan, k); if (!ph || !ph.nights || !ph.nights[d]) return null;
  const wi = Math.floor(S.daysBetween(weekStart(plan.start), weekStart(k)) / 7);
  return {s: ph.nights[d].map(x => Array.isArray(x) ? x[wi % x.length] : x)};
}
function secsFor(child, subject, k){
  const e = tracked(child, subject); let t = 0, f = 0;
  if (e){ const d = S.store(e).log.days[k]; t = d ? d.s : 0; }
  FL(child, subject).sessions.forEach(s => { if (s.date === k) f += s.secs || 0; });
  return {t, f};
}
/* One night without the Friday rule applied. */
function baseNight(child, k){
  const plan = planFor(child); if (!plan) return null;
  const r = rawNight(plan, k); if (!r || !r.s.length) return null;
  const fb = football(child, k), canc = fb && isCancelled(child, k);
  const len = fb && !canc ? (plan.short || 45) : (plan.long || 90);
  const each = Math.round(len / r.s.length);
  const blocks = r.s.map(id => {
    const sd = plan.subjects[id], sec = secsFor(child, sd.subject, k);
    return {id, name: sd.name, subject: sd.subject, mins: each, entry: tracked(child, sd.subject), t: sec.t, f: sec.f, s: sec.t + sec.f};
  });
  const done = blocks.reduce((a, b) => a + b.s, 0);
  return {k, dow: dow(k), len, football: fb, cancelled: canc, blocks, done, note: r.note || '', phase: phaseOf(plan, k), exams: examsOn(plan, k)};
}
/* Monday to Thursday of k's week. */
function monThu(child, k){
  const ws = weekStart(k); let target = 0, done = 0, count = 0;
  for (let i = 0; i < 4; i++){ const n = baseNight(child, S.addDays(ws, i)); if (n){ target += n.len * 60; done += n.done; count++; } }
  return {target, done, count, met: count > 0 && done >= target};
}
/* One night with the Friday rule applied. */
function night(child, k){
  const n = baseNight(child, k); if (!n) return null;
  n.target = n.len * 60; n.off = false; n.forced = false;
  if (n.dow === 5){
    n.forced = examWeek(planFor(child), k);
    n.mt = monThu(child, k);
    if (!n.forced && n.mt.met){ n.off = true; n.target = 0; }
  }
  const today = S.todayKey();
  n.status = n.off ? 'off' : n.done >= n.target ? 'hit' : k > today ? 'later' : k === today ? 'now' : 'short';
  return n;
}
function nextNight(child, from){
  const plan = planFor(child); if (!plan) return null;
  for (let k = from; k <= plan.end; k = S.addDays(k, 1)){ const n = night(child, k); if (n) return n; }
  return null;
}
function nextExam(child){
  const plan = planFor(child), t = S.todayKey(); if (!plan) return null;
  return plan.exams.filter(e => e.date >= t).sort((a, b) => a.date < b.date ? -1 : 1)[0] || null;
}

/* ---------- pupil: plan card on the subjects screen ---------- */
function blockHTML(child, n, b){
  const pc = b.mins ? Math.min(100, Math.round(b.s / 60 / b.mins * 100)) : 0;
  const btn = b.entry ? `<button class="btn" data-open="${esc(b.subject)}">Open ${esc(b.name)}</button>`
    : `<button class="btn" data-focus="${esc(b.id)}">${b.s > 0 ? 'Start another session' : `Start ${b.mins} min timer`}</button>`;
  return `<li class="pblk"><div class="pbtop"><b>${esc(b.name)}</b><span>${mins(b.s)} of ${b.mins} min${n.off ? ', optional' : ''}</span></div>
    <div class="bar"><span style="width:${pc}%"></span></div>
    <div class="pbbot">${btn}<small>${b.entry ? 'Timed in the app' : 'Self-reported focus timer'}${b.entry && b.f ? `, plus ${mins(b.f)} min self-reported` : ''}</small></div></li>`;
}
function weekStrip(child, k){
  const ws = weekStart(k), today = S.todayKey();
  const cells = [0, 1, 2, 3, 4].map(i => {
    const d = S.addDays(ws, i), n = night(child, d);
    const lab = DAY[dow(d)].slice(0, 3);
    if (!n) return `<li class="wk none"><b>${lab}</b><span>-</span>${examsOn(planFor(child), d).length ? '<i>Exam</i>' : ''}</li>`;
    const txt = n.off ? 'Off' : `${mins(n.done)}/${n.len}`;
    return `<li class="wk ${n.status}${d === today ? ' today' : ''}"><b>${lab}</b><span>${txt}</span>${n.exams.length ? '<i>Exam</i>' : ''}</li>`;
  }).join('');
  return `<ol class="wkstrip">${cells}</ol>`;
}
function cardHTML(child){
  const plan = planFor(child); if (!plan) return '';
  const today = S.todayKey(), nx = nextExam(child);
  const head = `<div class="planhead"><span class="eyebrow">My plan · ${esc(plan.title)}</span>
    ${nx ? `<span class="cd">Next exam: <b>${esc(nx.name)}</b> ${inDays(nx.date)}${nx.date !== today ? `, ${S.fmtDate(nx.date)}` : `, ${esc(nx.time)}. Good luck.`}</span>` : `<span class="cd">All exams done. Well played.</span>`}</div>`;
  if (today > plan.end) return `<section class="plan">${head}</section>`;
  const n = night(child, today);
  let body;
  if (!n){
    const nn = nextNight(child, S.addDays(today, 1));
    const why = today < plan.start ? 'The plan starts ' + S.fmtDate(plan.start) + '.' : [0, 6].includes(dow(today)) ? 'Weekends are off.' : 'Nothing planned tonight.';
    body = `<div class="tonight"><h2>No plan tonight</h2><p class="note">${why}${nn ? ` Next: ${DAY[nn.dow]}, ${nn.len} minutes of ${nn.blocks.map(b => esc(b.name)).join(' and ')}.` : ''}</p></div>`;
  } else {
    const lines = [];
    if (n.exams.length) lines.push(n.exams.map(e => `${esc(e.name)} exam today, ${esc(e.time)}.`).join(' '));
    if (n.phase) lines.push(esc(n.phase.label) + '.');
    if (n.note) lines.push(esc(n.note) + '.');
    if (n.football && !n.cancelled) lines.push('Football night, so 45 minutes.');
    if (n.cancelled) lines.push('Training cancelled, so 90 minutes.');
    if (n.dow === 5 && n.forced) lines.push("Exam week, so Friday's on.");
    if (n.off) lines.push(`Friday off. You did ${mins(n.mt.done)} of ${mins(n.mt.target)} minutes Monday to Thursday. Earned.`);
    if (n.dow === 5 && !n.forced && !n.off && n.mt && n.mt.count) lines.push(`Monday to Thursday was ${mins(n.mt.done)} of ${mins(n.mt.target)} minutes, so Friday's on.`);
    if (n.dow === 4){ const mt = monThu(child, today), fri = night(child, S.addDays(today, 1)); if (fri && !fri.forced) lines.push(mt.met ? "Monday to Thursday done. Friday's off." : `Finish Monday to Thursday (${mins(mt.done)} of ${mins(mt.target)} minutes so far) and Friday's off.`); }
    const fbBtn = n.football ? (n.cancelled ? `<button class="ghost" id="tcUndo">Training's back on</button>` : `<button class="btn sec" id="tcGo">Training cancelled? Make it 90</button>`) : '';
    body = `<div class="tonight"><h2>${n.off ? 'Tonight: off' : `Tonight: ${n.len} minutes`}${n.status === 'hit' && !n.off ? ' <span class="pill done">Done</span>' : ''}</h2>
      <p class="note">${lines.join(' ')}</p>${fbBtn ? `<div class="actions">${fbBtn}</div>` : ''}
      <ol class="pblocks">${n.blocks.map(b => blockHTML(child, n, b)).join('')}</ol></div>`;
  }
  return `<section class="plan">${head}${body}<div class="group"><span class="eyebrow">This week</span>${weekStrip(child, today)}</div>
    <div><button class="ghost" id="planAll">See the whole plan</button></div></section>`;
}
function wire(child){
  const app = el('app');
  app.querySelectorAll('[data-open]').forEach(b => b.onclick = () => S.go('subject', {entry: tracked(child, b.dataset.open)}));
  app.querySelectorAll('[data-focus]').forEach(b => b.onclick = () => S.go('focus', {child, id: b.dataset.focus}));
  const all = el('planAll'); if (all) all.onclick = () => S.go('plan', {child});
  const k = S.todayKey();
  const go = el('tcGo'); if (go) go.onclick = () => { PS(child).cancelled[k] = {at: Date.now()}; savePS(child); S.go('child', {child}); };
  const un = el('tcUndo'); if (un) un.onclick = () => { const c = PS(child).cancelled[k]; PS(child).undone = PS(child).undone || {}; PS(child).undone[k] = {at: Date.now(), was: c && c.at}; delete PS(child).cancelled[k]; savePS(child); S.go('child', {child}); };
}

/* ---------- pupil: the whole plan ---------- */
S.screens.plan = function(params){
  const child = params.child, plan = planFor(child), kid = S.childById(child);
  if (!plan){ S.go('child', {child}); return; }
  const today = S.todayKey();
  const weeks = [];
  for (let ws = weekStart(plan.start); ws <= plan.end; ws = S.addDays(ws, 7)) weeks.push(ws);
  const exams = plan.exams.map(e => `<tr class="${e.date < today ? 'past' : ''}"><td>${S.fmtDate(e.date)}</td><td>${esc(e.name)}</td><td>${esc(e.time)}</td><td>${e.date < today ? 'Done' : inDays(e.date)}</td></tr>`).join('');
  const weekHTML = ws => {
    const rows = [0, 1, 2, 3, 4].map(i => {
      const d = S.addDays(ws, i), n = night(child, d), ex = examsOn(plan, d);
      if (!n && !ex.length) return '';
      const what = n ? n.blocks.map(b => esc(b.name)).join(' and ') + (n.note ? ` <small>${esc(n.note)}</small>` : '') : 'Nothing planned';
      const len = n ? (n.off ? 'Off' : n.len + ' min' + (n.football ? ' (football)' : '') + (n.cancelled ? ' (training cancelled)' : '')) : '';
      const res = !n ? '' : n.off ? 'Earned' : d > today ? '' : n.status === 'hit' ? `<span class="ok">${mins(n.done)} min</span>` : d === today ? `${mins(n.done)} min so far` : `<span class="flag">${mins(n.done)} min</span>`;
      return `<tr class="${d === today ? 'today' : ''}"><td>${S.fmtDate(d)}${ex.length ? `<br><span class="pill red">Exam</span>` : ''}</td><td>${what}${ex.length ? `<br><small>Exam: ${ex.map(e => esc(e.name)).join(', ')}</small>` : ''}</td><td>${len}</td><td>${res}</td></tr>`;
    }).join('');
    if (!rows) return '';
    const ph = phaseOf(plan, ws) || phaseOf(plan, S.addDays(ws, 4));
    return `<section class="group"><h3>Week of ${S.fmtDate(ws)}${ph ? ` · ${esc(ph.label)}` : ''}${ws === weekStart(today) ? ' <span class="pill done">This week</span>' : ''}</h3>
      <div class="tblwrap"><table><thead><tr><th>Night</th><th>Study</th><th>Length</th><th>Done</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
  };
  el('app').innerHTML = `<button class="back" id="back">← ${esc(kid.name)}'s subjects</button>
  <header class="top"><span class="eyebrow">My plan</span><h1>${esc(plan.title)}</h1>
    <p class="lede">Weeknights only. Football nights are 45 minutes, other nights 90. Hit every minute Monday to Thursday and Friday's off, except in exam weeks.</p></header>
  <section class="group"><h2>Exams</h2><div class="tblwrap"><table><thead><tr><th>Date</th><th>Exam</th><th>Time</th><th></th></tr></thead><tbody>${exams}</tbody></table></div></section>
  ${weeks.map(weekHTML).join('')}`;
  el('back').onclick = () => S.go('child', {child});
};

/* ---------- pupil: focus timer ---------- */
const F = {};
function cur(){ return F.running ? F.base + (Date.now() - F.since) / 1000 : F.base; }
function persist(){
  if (!F.rec) return;
  F.rec.secs = Math.floor(cur()); F.rec.missed = F.missed; F.rec.last = Date.now();
  saveFL(F.child, F.subject);
}
function pause(why){
  if (!F.running) return;
  if (F.stage === 'prompt') F.base = F.promptSecs; else F.base = cur();
  F.running = false; F.stage = 'paused'; F.why = why || '';
  persist();
}
function startTick(){
  clearInterval(F.tick);
  F.tick = setInterval(() => {
    if (!F.running){ clearInterval(F.tick); return; }
    if (!S.view || S.view.name !== 'focus'){ pause('You left the timer, so it paused.'); clearInterval(F.tick); return; }
    if (document.visibilityState !== 'visible'){ pause('The page was hidden, so the timer paused.'); renderFocus(); return; }
    const s = cur();
    if (s >= F.target){ F.base = F.target; F.running = false; F.stage = 'note'; F.why = 'Time. Nice work.'; persist(); renderFocus(); return; }
    if (F.stage === 'run' && s >= F.nextCheck){ F.stage = 'prompt'; F.promptAt = Date.now(); F.promptSecs = s; renderFocus(); return; }
    if (F.stage === 'prompt' && Date.now() - F.promptAt >= CHECK_GRACE * 1000){
      F.missed++; F.base = F.promptSecs; F.running = false; F.stage = 'paused'; F.nextCheck = F.promptSecs + CHECK_EVERY;
      F.why = "You didn't answer the check, so the last 2 minutes weren't counted."; persist(); renderFocus(); return;
    }
    if (++F.n % SAVE_EVERY === 0) persist();
    const c = el('fclock'); if (c) c.textContent = clock(F.target - s);
    const b = el('fbar'); if (b) b.style.width = Math.min(100, s / F.target * 100) + '%';
  }, 1000);
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && F.running){ pause('The page was hidden, so the timer paused.'); if (S.view && S.view.name === 'focus') renderFocus(); } });
window.addEventListener('pagehide', () => { if (F.running) pause('The page was closed, so the timer paused.'); });

S.screens.focus = function(params){
  const child = params.child, plan = planFor(child);
  const sd = plan && plan.subjects[params.id];
  if (!sd){ S.go('child', {child}); return; }
  const k = S.todayKey();
  if (F.child !== child || F.id !== params.id || F.date !== k){
    clearInterval(F.tick);
    const n = night(child, k), b = n && n.blocks.find(x => x.id === params.id);
    const left = b ? b.mins * 60 - b.s : 45 * 60;
    const open = FL(child, sd.subject).sessions.find(s => s.date === k && s.open);
    Object.assign(F, {child, id: params.id, subject: sd.subject, name: sd.name, date: k, rec: open || null,
      target: open ? open.target : Math.max(10 * 60, Math.round(left / 60) * 60), base: open ? open.secs : 0,
      missed: open ? open.missed || 0 : 0, running: false, stage: open ? 'paused' : 'ready', why: open ? 'You have an unfinished session. Carry on or stop it.' : '', n: 0});
    F.nextCheck = (Math.floor(F.base / CHECK_EVERY) + 1) * CHECK_EVERY;
  }
  renderFocus();
};
function renderFocus(){
  if (!S.view || S.view.name !== 'focus') return;
  const kid = S.childById(F.child), s = cur();
  const bigLine = F.stage === 'saved' ? '' : `<div class="fclock" id="fclock">${clock(F.target - s)}</div><div class="bar fbar"><span id="fbar" style="width:${Math.min(100, s / F.target * 100)}%"></span></div>
    <p class="note">${mins(s)} of ${mins(F.target)} minutes${F.missed ? ` · ${F.missed} check${F.missed === 1 ? '' : 's'} missed` : ''}</p>`;
  let mid = '';
  if (F.stage === 'ready') mid = `<div class="actions"><button class="btn big" id="fGo">Go</button></div>`;
  if (F.stage === 'run') mid = `<div class="actions"><button class="btn sec" id="fPause">Pause</button><button class="btn sec" id="fStop">Stop and log it</button></div>`;
  if (F.stage === 'prompt') mid = `<div class="checkin"><b>Still working?</b><span>Tap within 2 minutes or the timer pauses and takes those 2 minutes back.</span><button class="btn big" id="fYes">Yes, still working</button></div>`;
  if (F.stage === 'paused') mid = `${F.why ? `<div class="hint">${esc(F.why)}</div>` : ''}<div class="actions"><button class="btn" id="fGo">Carry on</button><button class="btn sec" id="fStop">Stop and log it</button></div>`;
  if (F.stage === 'note') mid = `${F.why ? `<div class="banner">${esc(F.why)}</div>` : ''}${s < MIN_LOG ? `<p class="note">That's under a minute, so nothing gets logged.</p><div class="actions"><button class="btn" id="fDrop">OK</button>${F.why ? '' : `<button class="btn sec" id="fGo">Carry on</button>`}</div>`
    : `<div class="form"><label class="lab" for="fnote">What did you cover?</label><input id="fnote" class="fld text wide2" maxlength="140" placeholder="e.g. Cells and organelles, 2 past paper questions"><p class="warn" id="fwarn" aria-live="polite"></p></div>
      <div class="actions"><button class="btn" id="fSave">Save</button>${F.why ? '' : `<button class="btn sec" id="fGo">Carry on instead</button>`}</div>`}`;
  if (F.stage === 'saved') mid = `<div class="banner">${esc(F.saved)}</div><div class="actions"><button class="btn" id="fHome">Back to your plan</button></div>`;
  el('app').innerHTML = `<button class="back" id="back">← ${esc(kid.name)}'s subjects</button>
  <header class="top"><span class="eyebrow">Focus timer · self-reported</span><h1>${esc(F.name)}</h1>
    <p class="lede">For study away from the app: notes, past papers, flashcards. Keep this screen open. It pauses if you switch apps, and checks in every 15 minutes.</p></header>
  <section class="focus">${bigLine}${mid}</section>
  <p class="note">This shows in the Parent view as self-reported, separate from time tracked in the app.</p>`;
  el('back').onclick = () => S.go('child', {child: F.child});
  const on = (id, fn) => { const b = el(id); if (b) b.onclick = fn; };
  on('fGo', () => {
    if (!F.rec){ F.rec = {id: 'f' + Date.now().toString(36), date: F.date, startedAt: Date.now(), target: F.target, secs: 0, missed: 0, note: '', open: true}; FL(F.child, F.subject).sessions.push(F.rec); }
    F.running = true; F.since = Date.now(); F.stage = 'run'; F.why = ''; persist(); startTick(); renderFocus();
  });
  on('fPause', () => { pause(''); renderFocus(); });
  on('fYes', () => { F.stage = 'run'; F.nextCheck += CHECK_EVERY; renderFocus(); });
  on('fStop', () => { pause(''); F.stage = 'note'; F.why = ''; renderFocus(); });
  on('fDrop', () => { dropRec(); F.stage = 'ready'; F.base = 0; F.missed = 0; F.why = ''; S.go('child', {child: F.child}); });
  on('fSave', () => {
    const note = el('fnote').value.trim();
    if (note.length < 10){ el('fwarn').textContent = 'Write a short line on what you covered.'; return; }
    F.rec.note = note; F.rec.open = false; F.rec.secs = Math.floor(F.base); F.rec.missed = F.missed; F.rec.endedAt = Date.now();
    saveFL(F.child, F.subject);
    F.saved = `Logged ${mins(F.base)} minutes of ${F.name}.`; F.stage = 'saved'; F.rec = null; F.date = null;
    renderFocus();
  });
  on('fHome', () => S.go('child', {child: F.child}));
  const nt = el('fnote'); if (nt){ nt.addEventListener('keydown', e => { if (e.key === 'Enter'){ e.preventDefault(); el('fSave').click(); } }); if (window.matchMedia('(pointer:fine)').matches) nt.focus(); }
  if (F.running) startTick();
}
function dropRec(){
  if (!F.rec) return;
  const L = FL(F.child, F.subject).sessions, i = L.indexOf(F.rec);
  if (i >= 0) L.splice(i, 1);
  saveFL(F.child, F.subject); F.rec = null;
}

/* ---------- Parent view ---------- */
function parentHTML(child){
  const plan = planFor(child); if (!plan) return '';
  const today = S.todayKey(), last = today < plan.end ? today : plan.end;
  const nights = [];
  for (let k = plan.start; k <= last; k = S.addDays(k, 1)){ const n = night(child, k); if (n) nights.push(n); }
  const wkT = monThu(child, today), fri = night(child, S.addDays(weekStart(today), 4));
  const rows = nights.slice().reverse().map(n => {
    const res = n.off ? '<span class="ok">Friday off, earned</span>' : n.status === 'hit' ? '<span class="ok">Hit</span>' : n.k === today ? 'Tonight' : `<span class="flag">${mins(n.target - n.done)} min short</span>`;
    const t = n.blocks.reduce((a, b) => a + b.t, 0), f = n.blocks.reduce((a, b) => a + b.f, 0);
    const len = n.off ? 'Off' : n.len + (n.football ? (n.cancelled ? ', training cancelled' : ', football') : '') + (n.dow === 5 && n.forced ? ', exam week' : '');
    return `<tr><td>${S.fmtDate(n.k)}</td><td>${n.blocks.map(b => esc(b.name)).join(' + ')}</td><td>${len}</td><td>${S.fmtDur(t)}</td><td>${S.fmtDur(f)}</td><td>${res}</td></tr>`;
  }).join('') || `<tr><td colspan="6">The plan starts ${S.fmtDate(plan.start)}.</td></tr>`;
  const bySub = Object.keys(plan.subjects).map(id => {
    const sd = plan.subjects[id]; let planned = 0, onT = 0, onF = 0;
    nights.forEach(n => n.blocks.forEach(b => { if (b.id === id && !n.off){ planned += b.mins * 60; onT += b.t; onF += b.f; } }));
    let offT = 0, offF = 0;
    for (let k = plan.start; k <= last; k = S.addDays(k, 1)){
      const n = night(child, k); if (n && n.blocks.some(b => b.id === id)) continue;
      const s = secsFor(child, sd.subject, k); offT += s.t; offF += s.f;
    }
    return `<tr><td>${esc(sd.name)}</td><td>${S.fmtDur(planned)}</td><td>${S.fmtDur(onT)}</td><td>${S.fmtDur(onF)}</td><td>${S.fmtDur(offT + offF)}</td><td>${tracked(child, sd.subject) ? 'In the app' : 'Focus timer'}</td></tr>`;
  }).join('');
  const sess = [];
  Object.keys(plan.subjects).forEach(id => { const sd = plan.subjects[id]; FL(child, sd.subject).sessions.forEach(s => sess.push({s, name: sd.name})); });
  sess.sort((a, b) => (b.s.startedAt || 0) - (a.s.startedAt || 0));
  const srows = sess.slice(0, 40).map(({s, name}) => `<tr><td>${S.fmtDate(s.date)}</td><td>${esc(name)}</td><td>${S.fmtDur(s.secs)} of ${mins(s.target)}m</td><td class="${s.missed ? 'flag' : ''}">${s.missed || 0}</td><td class="wrapcell">${s.open ? '<i>Not finished</i>' : esc(s.note)}</td></tr>`).join('');
  const canc = Object.keys(PS(child).cancelled).sort().reverse();
  const undone = Object.keys(PS(child).undone || {}).sort().reverse();
  return `<section class="group pplan"><h2>Study plan · ${esc(plan.title)}</h2>
    <div class="summary">
      <div class="sumbox"><span class="eyebrow">This week, Mon to Thu</span><span class="big">${mins(wkT.done)} of ${mins(wkT.target)} min</span><div class="bar"><span style="width:${wkT.target ? Math.min(100, wkT.done / wkT.target * 100) : 0}%"></span></div></div>
      <div class="sumbox"><span class="eyebrow">Friday</span><span class="big">${!fri ? 'Not planned' : fri.forced ? 'On' : fri.off ? 'Off' : 'On'}</span><span>${!fri ? '' : fri.forced ? 'Exam week, always on' : fri.off ? 'Mon to Thu target met' : 'Until Mon to Thu is met'}</span></div>
    </div>
    <h3>Night by night</h3>
    <div class="tblwrap"><table><thead><tr><th>Night</th><th>Planned</th><th>Minutes</th><th>In app</th><th>Self-reported</th><th>Result</th></tr></thead><tbody>${rows}</tbody></table></div>
    <h3>By subject, plan to date</h3>
    <div class="tblwrap"><table><thead><tr><th>Subject</th><th>Planned</th><th>In app</th><th>Self-reported</th><th>Other nights</th><th>How</th></tr></thead><tbody>${bySub}</tbody></table></div>
    <h3>Focus timer sessions (self-reported)</h3>
    ${srows ? `<div class="tblwrap"><table><thead><tr><th>Day</th><th>Subject</th><th>Time</th><th>Checks missed</th><th>What he covered</th></tr></thead><tbody>${srows}</tbody></table></div>` : '<p class="note">No focus timer sessions yet.</p>'}
    <p class="note">Training cancelled: ${canc.length ? canc.map(k => S.fmtDate(k)).join(', ') : 'never pressed'}.${undone.length ? ` Pressed then undone: ${undone.map(k => S.fmtDate(k)).join(', ')}.` : ''}</p>
  </section>`;
}

S.plan = {registerPlan, load, planFor, night, monThu, nextExam, cardHTML, wire, parentHTML, CHECK_EVERY, CHECK_GRACE};
S.registerPlan = registerPlan;
})();
