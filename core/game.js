/* core/game.js
   Gamification shared by every subject: XP and levels, study streak with one free
   miss a week, Question of the day, Boss rounds and badges.
   Scoring rewards correct work without help, not time or clicks:
   - Show me how earns nothing. A hint halves the XP.
   - Practising an already mastered topic earns very little, so easy wins can't be farmed.
   - Boss rounds only earn XP for the first 2 rounds a day in each subject.
   XP is stored per child per day, so it can be turned into PlayStation time later.
   Storage: studyapp:<child>:all:game (one per child, across all his subjects). */
(function(){
'use strict';
const S = window.Study, el = S.el, esc = S.esc;

const XP = {correct:10, hinted:5, practiseMastered:2, qotd:20, qotdHint:10, boss:15, master:50, remaster:75, bossBest:50};
const BOSS_LEN = 8, BOSS_XP_ROUNDS = 2, STREAK_Q = 10, STREAK_PCT = 60, CLEAN_RUN = 10;
const BADGES = [
  {id:'first',    name:'First steps',   desc:'Master your first topic'},
  {id:'clean',    name:'Clean sheet',   desc:'10 right in a row with no hints'},
  {id:'comeback', name:'Comeback',      desc:'Re-master a topic a test flagged'},
  {id:'word',     name:'Kept my word',  desc:'Hit the minutes a week you planned'},
  {id:'target',   name:'Target hit',    desc:'Log a test at or above your target'},
  {id:'streak7',  name:'Seven days',    desc:'Study 7 days in a row'},
  {id:'boss',     name:'Boss beaten',   desc:'Full marks in a boss round'}
];
const badgeInfo = id => BADGES.find(b => b.id === id);

/* ---------- state ---------- */
const gkey = child => S.key(child, 'all', 'game');
const cache = {};
function G(child){
  if (cache[child]) return cache[child];
  let g = null; try { g = JSON.parse(localStorage.getItem(gkey(child))); } catch(e){}
  g = g && typeof g === 'object' ? g : {};
  g.xp = g.xp || 0; g.days = g.days || {}; g.badges = g.badges || {}; g.run = g.run || 0;
  g.bestStreak = g.bestStreak || 0; g.boss = g.boss || {}; g.marks = g.marks || {};
  return cache[child] = g;
}
function save(child){ try { localStorage.setItem(gkey(child), JSON.stringify(G(child))); } catch(e){} }
function reset(child){ cache[child] = null; try { localStorage.removeItem(gkey(child)); } catch(e){} }

/* Level 2 at 100 XP, 3 at 300, 4 at 600, 5 at 1000. Quick at first, slower later. */
function levelOf(xp){ let L = 1; while (xp >= 50 * L * (L + 1)) L++; return {level: L, from: 50 * (L - 1) * L, to: 50 * L * (L + 1)}; }
function add(child, xp){ if (!xp) return; const g = G(child), k = S.todayKey(); g.xp += xp; g.days[k] = (g.days[k] || 0) + xp; }
function badge(child, id){
  const g = G(child), k = S.todayKey(), b = g.badges[id];
  if (!b){ g.badges[id] = {on: k, n: 1}; return {id, first: true, n: 1}; }
  b.n++; b.last = k; return {id, first: false, n: b.n};
}

/* ---------- streak ----------
   A day counts with at least 10 questions at 60% or better, across all his subjects.
   One missed day per week (Monday to Sunday) is forgiven. Today never breaks it. */
const weekKey = k => { const d = new Date(k + 'T12:00:00'); return S.addDays(k, -((d.getDay() + 6) % 7)); };
function dayOk(child, k){ const d = S.dailyTotals(child, k); return d.q >= STREAK_Q && d.c / d.q * 100 >= STREAK_PCT; }
function streak(child){
  const today = S.todayKey(), since = S.childSince(child), t = S.dailyTotals(child, today);
  const todayOk = dayOk(child, today), used = {};
  let n = todayOk ? 1 : 0, k = S.addDays(today, -1);
  while (k >= since){
    if (dayOk(child, k)) n++;
    else { const w = weekKey(k); if (used[w]) break; used[w] = true; }
    k = S.addDays(k, -1);
  }
  const g = G(child); if (n > g.bestStreak){ g.bestStreak = n; save(child); }
  return {n, best: g.bestStreak, todayOk, todayQ: t.q, todayPct: t.q ? Math.round(t.c / t.q * 100) : 0, freeUsed: n > 0 && !!used[weekKey(today)]};
}
function checkStreak(child){
  const s = streak(child), g = G(child), k = S.todayKey();
  if (s.todayOk && s.n >= 7 && s.n % 7 === 0 && g.marks.s7 !== k){ g.marks.s7 = k; return badge(child, 'streak7'); }
  return null;
}
function checkWord(child){
  const g = G(child), today = S.todayKey(), wk = weekKey(today);
  for (const e of S.subjectsFor(child)){
    const lt = S.lastTest(e), plan = lt && lt.reflect && +lt.reflect.minsPerWeek;
    if (!plan) continue;
    const from = [S.addDays(today, -6), S.addDays(lt.date, 1)].sort()[1];
    if (from > today) continue;
    const mins = S.sumRange(e, from, today).s / 60, mk = 'word:' + e.subject;
    if (mins >= plan && g.marks[mk] !== wk){ g.marks[mk] = wk; return badge(child, 'word'); }
  }
  return null;
}
function finish(child, before, xp, got, extra){
  add(child, xp);
  [checkWord(child), checkStreak(child)].forEach(b => { if (b) got.push(b); });
  save(child);
  const after = levelOf(G(child).xp).level;
  return Object.assign({xp, level: after, levelUp: after > before ? after : 0, badges: got.filter(Boolean)}, extra || {});
}

/* ---------- hooks ---------- */
function onAnswer(entry, topicId, o){
  const child = entry.child, g = G(child), before = levelOf(g.xp).level, got = [], p = S.prog(entry, topicId);
  let xp = 0;
  if (o.mode === 'qotd') xp = o.ok && !o.reveal ? (o.hinted ? XP.qotdHint : XP.qotd) : 0;
  else if (o.ok && !o.reveal) xp = o.wasMastered ? XP.practiseMastered : (o.hinted ? XP.hinted : XP.correct);
  if (o.newlyMastered){
    if (p.reopened){ xp += XP.remaster; got.push(badge(child, 'comeback')); delete p.reopened; S.store(entry).save('progress'); }
    else xp += XP.master;
    if (!g.badges.first) got.push(badge(child, 'first'));
  }
  if (o.ok && !o.hinted && !o.reveal){ g.run++; if (g.run >= CLEAN_RUN){ g.run = 0; got.push(badge(child, 'clean')); } }
  else g.run = 0;
  return finish(child, before, xp, got);
}
function onTest(entry, rec){
  const child = entry.child, before = levelOf(G(child).xp).level, got = [];
  if (S.scorePct(rec) >= S.store(entry).tests.goal) got.push(badge(child, 'target'));
  return finish(child, before, 0, got);
}
function bossState(entry){ const g = G(entry.child); return g.boss[entry.subject] = g.boss[entry.subject] || {best: null, rounds: []}; }
function onBoss(entry, score, secs){
  const child = entry.child, before = levelOf(G(child).xp).level, b = bossState(entry), k = S.todayKey(), got = [];
  const earns = b.rounds.filter(r => r.date === k).length < BOSS_XP_ROUNDS;
  const prev = b.best, isBest = !prev || score > prev.score || (score === prev.score && secs < prev.secs);
  let xp = earns ? score * XP.boss : 0;
  if (earns && isBest && prev && score > 0) xp += XP.bossBest;
  b.rounds.push({date: k, score, secs, xp}); if (b.rounds.length > 60) b.rounds.shift();
  if (isBest) b.best = {score, secs, date: k};
  if (score === BOSS_LEN) got.push(badge(child, 'boss'));
  return finish(child, before, xp, got, {earns, isBest, prev});
}

/* ---------- Question of the day ---------- */
function masteredAll(child){
  const out = [];
  S.subjectsFor(child).forEach(e => { if (!S.defFor(e)) return; S.topicList(e).forEach(x => { if (S.prog(e, x.t.id).mastered) out.push({e, x}); }); });
  return out;
}
function qotd(child){
  const g = G(child), k = S.todayKey();
  if (g.qotd && g.qotd.date === k) return g.qotd;
  const list = masteredAll(child); if (!list.length) return null;
  let h = 7; for (const ch of child + k) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const c = list[h % list.length];
  g.qotd = {date: k, subject: c.e.subject, topicId: c.x.t.id, q: c.x.t.gen(), done: false};
  save(child); return g.qotd;
}

/* ---------- summary for screens ---------- */
function summary(child){
  const g = G(child), L = levelOf(g.xp), s = streak(child), k = S.todayKey();
  let wk = 0; for (let i = 0; i < 7; i++) wk += g.days[S.addDays(k, -i)] || 0;
  const qd = g.qotd && g.qotd.date === k ? g.qotd : null;
  return {xp: g.xp, L, s, today: g.days[k] || 0, week: wk, badges: g.badges, run: g.run, qotd: qd, qotdReady: !!qd || masteredAll(child).length > 0, boss: g.boss, days: g.days};
}

/* ---------- shared bits of HTML ---------- */
function bannersHTML(r){
  if (!r) return '';
  let h = '';
  if (r.levelUp) h += `<div class="banner">Level up. You're now level ${r.levelUp}.</div>`;
  r.badges.forEach(b => { const i = badgeInfo(b.id); h += `<div class="banner bdg-win">${b.first ? 'New badge' : 'Badge again'}: <b>${esc(i.name)}</b>${b.first ? '. ' + esc(i.desc) + '.' : ` (×${b.n})`}</div>`; });
  return h;
}
const xpTag = r => r && r.xp ? `<span class="xp">+${r.xp} XP</span>` : '';
const fmtClock = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
function badgesHTML(g, small){
  return `<div class="badges">${BADGES.map(b => { const on = g.badges[b.id]; return `<span class="bdg ${on ? 'on' : ''}" title="${esc(b.desc)}"><b>${esc(b.name)}</b>${small ? '' : `<small>${on ? (on.n > 1 ? '×' + on.n + ' · ' : '') + 'since ' + S.fmtDate(on.on) : esc(b.desc)}</small>`}</span>`; }).join('')}</div>`;
}
function panelHTML(child){
  const m = summary(child), L = m.L, s = m.s;
  const pctL = Math.round((m.xp - L.from) / (L.to - L.from) * 100);
  const qd = m.qotd;
  const qBtn = !m.qotdReady ? `<div class="qotd off"><b>Question of the day</b><span>Master your first topic to unlock it.</span></div>`
    : qd && qd.done ? `<div class="qotd off"><b>Question of the day</b><span>${qd.ok ? 'Done. +' + (qd.xp || 0) + ' XP.' : 'Done for today.'} Back tomorrow.</span></div>`
    : `<button class="qotd" id="qotd"><b>Question of the day</b><span>One question from a topic you've mastered. Double XP.</span></button>`;
  return `<section class="game">
    <div class="sumbox"><span class="eyebrow">Level ${L.level}</span><span class="big">${m.xp.toLocaleString('en-GB')} XP</span><div class="bar"><span style="width:${pctL}%"></span></div><small>${(L.to - m.xp).toLocaleString('en-GB')} XP to level ${L.level + 1} · ${m.today} today</small></div>
    <div class="sumbox"><span class="eyebrow">Streak</span><span class="big">${s.n} day${s.n === 1 ? '' : 's'}</span><small>${s.todayOk ? 'Today counts. Nice.' : `Today: ${s.todayQ} of ${STREAK_Q} questions${s.todayQ ? ' at ' + s.todayPct + '%' : ''}. Need ${STREAK_PCT}% or better.`}</small><small>Free miss this week: ${s.freeUsed ? 'used' : 'available'} · Best ${s.best}</small></div>
  </section>
  ${qBtn}
  <details class="bdgwrap"><summary>Badges (${Object.keys(G(child).badges).length} of ${BADGES.length})</summary>${badgesHTML(G(child))}</details>`;
}
function bossCardHTML(entry){
  const n = S.topicList(entry).filter(x => S.prog(entry, x.t.id).mastered).length, b = bossState(entry), k = S.todayKey();
  const left = Math.max(0, BOSS_XP_ROUNDS - b.rounds.filter(r => r.date === k).length);
  if (n < 2) return `<div class="boss off"><b>Boss round</b><span>Master ${2 - n} more topic${2 - n === 1 ? '' : 's'} to unlock. ${BOSS_LEN} mixed questions, no hints, against the clock.</span></div>`;
  return `<button class="boss" id="bossGo"><b>Boss round</b><span>${BOSS_LEN} mixed questions from your ${n} mastered topics. No hints. ${b.best ? `Your best: ${b.best.score}/${BOSS_LEN} in ${fmtClock(b.best.secs)}.` : 'Set your first score.'}</span><small>${left ? `${left} XP round${left === 1 ? '' : 's'} left today` : 'No XP left today, but you can still beat your best'}</small></button>`;
}

/* ---------- Question of the day screen ---------- */
const QV = {};
S.screens.qotd = function(params){
  const child = params.child, qd = qotd(child);
  if (!qd){ S.go('child', {child}); return; }
  const entry = S.subjectsFor(child).find(e => e.subject === qd.subject), item = entry && S.topicList(entry).find(x => x.t.id === qd.topicId);
  if (!item){ G(child).qotd = null; save(child); S.go('child', {child}); return; }
  S.setContext(child, entry, 'qotd');
  const q = qd.q;
  el('app').innerHTML = `<button class="back" id="back">← Your subjects</button>
  <header class="top"><span class="eyebrow">Question of the day · ${esc(S.defFor(entry).title)}</span><h1>${esc(item.t.name)}</h1><p class="lede">One go, double XP. A hint halves it. Show me how earns nothing.</p></header>
  <article class="sheet"><span class="qno">★</span>
    ${q.calc != null ? `<div class="qtop"><span class="calc">${q.calc ? 'Calculator' : 'Non-calculator'}</span></div>` : ''}
    <p class="qtext">${q.prompt}</p>${q.diagram || ''}
    <div id="ans">${S.qui.answerHTML(q)}</div><div id="hintBox"></div><p class="warn" id="warn" aria-live="polite"></p>
    <div class="actions" id="acts">${qd.done ? '' : `<button class="btn" id="check">Check</button><button class="btn sec" id="hint">Hint</button><button class="btn sec" id="show">Show me how</button>`}</div>
    <div id="fb" aria-live="polite">${qd.done ? doneHTML(qd) : ''}</div></article>`;
  el('back').onclick = () => S.go('child', {child});
  if (qd.done){ el('ans').querySelectorAll('input').forEach(i => i.disabled = true); return; }
  QV.hinted = false;
  el('hint').onclick = () => { QV.hinted = true; el('hintBox').innerHTML = `<div class="hint">${q.hint}</div>`; };
  const go = reveal => {
    let ok = false;
    if (!reveal){ const g = S.qui.grade(q); if (g === null){ el('warn').textContent = q.kind === 'mc' ? 'Pick an answer first.' : 'Type a number in every box first.'; return; } ok = g; }
    const wasM = S.prog(entry, item.t.id).mastered;
    const res = S.recordAnswer(entry, item.t.id, ok, reveal);
    const r = onAnswer(entry, item.t.id, {ok, reveal, hinted: QV.hinted, mode: 'qotd', wasMastered: wasM, newlyMastered: res.newlyMastered});
    Object.assign(qd, {done: true, ok, xp: r.xp}); save(child);
    S.qui.lock(q);
    el('acts').innerHTML = `<button class="btn" id="home">Back to your subjects</button>`;
    el('home').onclick = () => S.go('child', {child});
    el('fb').innerHTML = doneHTML(qd) + bannersHTML(r);
  };
  el('check').onclick = () => go(false);
  el('show').onclick = () => go(true);
};
function doneHTML(qd){
  const q = qd.q;
  return `<div class="fb"><span class="mark">${qd.ok ? '✓ Spot on' : '✗ Not this time'}</span>${qd.ok ? `<span class="xp">+${qd.xp} XP</span>` : `<p class="ans">Answer: ${q.answerText}</p>`}<ol>${q.working.map(w => `<li>${w}</li>`).join('')}</ol><p class="note">Next question of the day tomorrow.</p></div>`;
}

/* ---------- Boss round screen ---------- */
const B = {};
function buildBoss(entry){
  const topics = S.topicList(entry).filter(x => S.prog(entry, x.t.id).mastered).map(x => x.t);
  const order = []; let pool = [];
  while (order.length < BOSS_LEN){ if (!pool.length) pool = topics.slice().sort(() => Math.random() - .5); order.push(pool.pop()); }
  const qs = order.map(t => ({t, q: t.gen()}));
  return qs.filter(x => x.q.calc === false).concat(qs.filter(x => x.q.calc !== false));
}
S.screens.boss = function(params){
  const entry = params.entry;
  S.setContext(entry.child, entry, 'boss');
  if (B.entry !== entry){ B.entry = entry; B.state = 'intro'; }
  if (params.start){ B.qs = buildBoss(entry); B.i = 0; B.res = []; B.t0 = Date.now(); B.state = 'run'; }
  clearInterval(B.tick);
  if (B.state === 'run') renderRun(entry); else if (B.state === 'done') renderDone(entry); else renderIntro(entry);
};
function renderIntro(entry){
  const def = S.defFor(entry), b = bossState(entry), n = S.topicList(entry).filter(x => S.prog(entry, x.t.id).mastered).length;
  el('app').innerHTML = `<button class="back" id="back">← ${esc(def.title)} topics</button>
  <header class="top"><span class="eyebrow">${esc(def.title)} · Boss round</span><h1>Boss round</h1>
  <p class="lede">${BOSS_LEN} questions mixed from your mastered topics, set out like a real paper: non-calculator first. No hints, no Show me how. The clock runs from the first question. Beat your best score, or match it faster.</p></header>
  <div class="summary"><div class="sumbox"><span class="eyebrow">Your best</span><span class="big">${b.best ? b.best.score + '/' + BOSS_LEN : '-'}</span><span>${b.best ? 'in ' + fmtClock(b.best.secs) + ', ' + S.fmtDate(b.best.date) : 'No rounds yet'}</span></div>
  <div class="sumbox"><span class="eyebrow">XP</span><span class="big">${XP.boss} a question</span><span>+${XP.bossBest} for a new best. First ${BOSS_XP_ROUNDS} rounds a day only.</span></div></div>
  ${n < 2 ? `<div class="hint">Master at least 2 topics to unlock boss rounds.</div>` : `<div><button class="btn" id="start">Start the round</button></div>`}`;
  el('back').onclick = () => S.go('subject', {entry});
  const s = el('start'); if (s) s.onclick = () => S.go('boss', {entry, start: true});
}
function renderRun(entry){
  const cur = B.qs[B.i], q = cur.q;
  el('app').innerHTML = `<button class="back" id="back">← Quit round</button>
  <div class="bossbar"><b>Boss round</b><span>Question ${B.i + 1} of ${BOSS_LEN}</span><span class="bclock" id="bclock">${fmtClock(Math.round((Date.now() - B.t0) / 1000))}</span></div>
  <article class="sheet"><span class="qno">Q${B.i + 1}</span>
    <div class="qtop"><span class="calc">${q.calc ? 'Calculator' : 'Non-calculator'}</span></div>
    <p class="qtext">${q.prompt}</p>${q.diagram || ''}
    <div id="ans">${S.qui.answerHTML(q)}</div><p class="warn" id="warn" aria-live="polite"></p>
    <div class="actions"><button class="btn" id="check">${B.i === BOSS_LEN - 1 ? 'Finish' : 'Next'}</button><button class="btn sec" id="skip">Skip</button></div></article>`;
  el('back').onclick = () => { clearInterval(B.tick); B.state = 'intro'; S.go('boss', {entry}); };
  B.tick = setInterval(() => { const c = el('bclock'); if (!c || B.state !== 'run'){ clearInterval(B.tick); return; } c.textContent = fmtClock(Math.round((Date.now() - B.t0) / 1000)); }, 1000);
  const go = skip => {
    let ok = false;
    if (!skip){ const g = S.qui.grade(q); if (g === null){ el('warn').textContent = q.kind === 'mc' ? 'Pick an answer, or skip it.' : 'Fill in every box, or skip it.'; return; } ok = g; }
    S.recordAnswer(entry, cur.t.id, ok, false);
    B.res.push({t: cur.t, q, ok, skipped: skip});
    B.i++;
    if (B.i >= BOSS_LEN){
      clearInterval(B.tick);
      B.secs = Math.round((Date.now() - B.t0) / 1000);
      B.score = B.res.filter(r => r.ok).length;
      B.out = onBoss(entry, B.score, B.secs);
      B.state = 'done'; renderDone(entry);
    } else renderRun(entry);
    window.scrollTo(0, 0);
  };
  el('check').onclick = () => go(false);
  el('skip').onclick = () => go(true);
  el('ans').querySelectorAll('input.fld').forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter'){ e.preventDefault(); go(false); } }));
}
function renderDone(entry){
  const def = S.defFor(entry), o = B.out, prev = o.prev;
  el('app').innerHTML = `<header class="top"><span class="eyebrow">${esc(def.title)} · Boss round</span><h1>${B.score}/${BOSS_LEN} in ${fmtClock(B.secs)}</h1>
  <p class="lede">${o.isBest ? (prev ? `New personal best. Last best was ${prev.score}/${BOSS_LEN} in ${fmtClock(prev.secs)}.` : 'Your first score. Now beat it.') : `Your best is still ${prev.score}/${BOSS_LEN} in ${fmtClock(prev.secs)}.`}</p></header>
  ${o.earns ? `<div class="sumbox"><span class="big">+${o.xp} XP</span></div>` : `<p class="note">No XP this time. Only your first ${BOSS_XP_ROUNDS} boss rounds a day earn XP.</p>`}
  ${bannersHTML(o)}
  <section class="group"><h2>How you did</h2><ol class="review">${B.res.map((r, i) => `<li class="${r.ok ? 'r-ok' : 'r-bad'}"><details${r.ok ? '' : ' open'}><summary>Q${i + 1} ${esc(r.t.name)}: ${r.ok ? '✓' : r.skipped ? 'skipped' : '✗'}</summary>
    <p>${r.q.prompt}</p>${r.ok ? '' : `<p class="ans">Answer: ${r.q.answerText}</p>`}<ol>${r.q.working.map(w => `<li>${w}</li>`).join('')}</ol></details></li>`).join('')}</ol></section>
  <div class="actions"><button class="btn" id="again">Another round</button><button class="btn sec" id="back2">Back to ${esc(def.title)}</button></div>`;
  el('again').onclick = () => S.go('boss', {entry, start: true});
  el('back2').onclick = () => { B.state = 'intro'; S.go('subject', {entry}); };
}

S.game = {XP, BOSS_LEN, BOSS_XP_ROUNDS, STREAK_Q, STREAK_PCT, CLEAN_RUN, BADGES, G, save, reset, levelOf, streak, onAnswer, onTest, onBoss, qotd, summary,
  bannersHTML, xpTag, badgesHTML, panelHTML, bossCardHTML, fmtClock, weekKey};
})();
