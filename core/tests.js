/* core/tests.js
   My tests: the pupil logs a class test, sees what he actually did beforehand,
   reflects on the gap to his target, plans the next stretch and suggests a new
   red list. The parent approves the list in the Parent view. */
(function(){
'use strict';
const S = window.Study, el = S.el, esc = S.esc;
const MARKS = [['most','Lost most'],['some','Lost some'],['fine','Fine'],['na','Not in it']];
const W = {};   // wizard state

S.screens.tests = function(params){
  const entry = params.entry;
  S.setContext(entry.child, entry, 'tests');
  if (params.log){ W.entry = entry; W.step = 1; W.rec = {name:'', date:S.todayKey(), score:'', outOf:'', marks:{}, reflect:{why:'', diff:'', minsPerWeek:'', focus:[]}}; }
  if (W.step === 4) W.step = 0;
  if (W.entry === entry && W.step) renderWizard(entry); else renderList(entry);
};

/* ---------- list and pattern ---------- */
function renderList(entry){
  W.step = 0;
  const def = S.defFor(entry), st = S.store(entry), goal = st.tests.goal;
  const L = S.testsSorted(entry);
  const rows = L.slice().reverse().map(t => {
    const sp = S.scorePct(t), ev = t.evidence || {};
    return `<tr><td>${S.fmtDateY(t.date)}</td><td>${esc(t.name)}</td><td>${esc(t.score)}/${esc(t.outOf)} (${sp}%)</td><td class="${sp >= goal ? 'ok' : 'flag'}">${sp >= goal ? 'Hit it' : (goal - sp) + ' short'}</td><td>${S.fmtDur(ev.s)}</td><td>${ev.q || 0}</td></tr>`;
  }).join('');
  el('app').innerHTML = `<button class="back" id="back">← ${esc(def.title)} topics</button>
  <header class="top"><span class="eyebrow">${esc(def.course)}</span><h1>My tests</h1>
    <p class="lede">Log every class test here. You'll see what you actually did beforehand, and work out what to change before the next one. Your target is ${goal}%.</p></header>
  <div><button class="btn" id="log">Log a test</button></div>
  ${L.length ? `<section class="group"><h2>Your tests so far</h2><div class="tblwrap"><table>
    <thead><tr><th>Date</th><th>Test</th><th>Score</th><th>Target ${goal}%</th><th>Study before</th><th>Questions</th></tr></thead><tbody>${rows}</tbody></table></div>
    <p class="note">"Study before" is active time in ${esc(def.title)} since the test before it.</p></section>` : `<div class="sumbox"><p>No tests logged yet. After your next class test, come back and log it.</p></div>`}
  ${pattern(L, goal)}
  ${L.length ? `<section class="group"><h2>What you said last time</h2>${lastReflection(L[L.length - 1])}</section>` : ''}`;
  el('back').onclick = () => S.go('subject', {entry});
  el('log').onclick = () => S.go('tests', {entry, log: true});
}

function pattern(L, goal){
  if (L.length < 3) return L.length ? `<p class="note">Log ${3 - L.length} more test${L.length === 2 ? '' : 's'} and you'll start to see a pattern between study time and score.</p>` : '';
  const hit = L.filter(t => S.scorePct(t) >= goal), miss = L.filter(t => S.scorePct(t) < goal);
  const avg = a => a.length ? Math.round(a.reduce((s, t) => s + (t.evidence ? t.evidence.s : 0), 0) / a.length) : 0;
  let msg;
  if (hit.length && miss.length) msg = `When you hit ${goal}%, you'd done about <b>${S.fmtDur(avg(hit))}</b> beforehand. When you missed, about <b>${S.fmtDur(avg(miss))}</b>.`;
  else if (hit.length) msg = `You've hit ${goal}% every time. You averaged about <b>${S.fmtDur(avg(hit))}</b> of study before each test.`;
  else msg = `You haven't hit ${goal}% yet. You averaged about <b>${S.fmtDur(avg(miss))}</b> of study before each test. What would doubling that look like?`;
  return `<section class="group"><h2>Your pattern</h2><div class="sumbox"><p>${msg}</p><p class="note">A rough guide from ${L.length} tests, not a prediction. Tests differ, and time only counts when it's real work.</p></div></section>`;
}

function lastReflection(t){
  const r = t.reflect || {};
  return `<div class="sumbox"><p class="note">After ${esc(t.name)}, ${S.fmtDateY(t.date)}</p>
    <p><b>Why I think I got that:</b> ${esc(r.why)}</p>
    <p><b>What I'll do differently:</b> ${esc(r.diff)}</p>
    <p><b>Plan:</b> ${esc(r.minsPerWeek)} minutes a week</p></div>`;
}

/* ---------- wizard ---------- */
function renderWizard(entry){
  const def = S.defFor(entry);
  const head = `<button class="back" id="back">← My tests</button><header class="top"><span class="eyebrow">Log a test · step ${W.step} of 3</span>`;
  if (W.step === 1) step1(entry, def, head);
  else if (W.step === 2) step2(entry, def, head);
  else if (W.step === 3) step3(entry, def, head);
  else done(entry, def);
  const b = el('back'); if (b) b.onclick = () => { W.step = 0; S.go('tests', {entry}); };
}

function step1(entry, def, head){
  const r = W.rec, L = S.topicList(entry);
  el('app').innerHTML = `${head}<h1>How did it go?</h1><p class="lede">Be honest. Nobody's grading this bit.</p></header>
  <div class="form">
    <label class="lab" for="tn">What was the test?</label><input id="tn" class="fld text" maxlength="60" placeholder="e.g. Unit 2 test" value="${esc(r.name)}">
    <label class="lab" for="td">When was it?</label><input id="td" class="fld text" type="date" max="${S.todayKey()}" value="${esc(r.date)}">
    <label class="lab">Your mark</label><div class="ansrow"><input id="ts" class="fld" inputmode="numeric" aria-label="Marks you got" value="${esc(r.score)}"><span class="affix">out of</span><input id="to" class="fld" inputmode="numeric" aria-label="Total marks" value="${esc(r.outOf)}"></div>
  </div>
  <section class="group"><h2>How did each topic go?</h2><p class="note">Pick "Not in it" if the test didn't cover it.</p>
    <div class="marks">${L.map(x => `<fieldset class="mrow"><legend>${esc(x.t.name)}</legend><div class="seg">${MARKS.map(([v, l]) => `<label><input type="radio" name="m-${x.t.id}" value="${v}" ${(r.marks[x.t.id] || 'na') === v ? 'checked' : ''}><span>${l}</span></label>`).join('')}</div></fieldset>`).join('')}</div></section>
  <p class="warn" id="warn" aria-live="polite"></p>
  <div class="actions"><button class="btn" id="nx">Next</button></div>`;
  el('nx').onclick = () => {
    r.name = el('tn').value.trim(); r.date = el('td').value; r.score = el('ts').value.trim(); r.outOf = el('to').value.trim();
    L.forEach(x => { const c = document.querySelector(`input[name="m-${x.t.id}"]:checked`); r.marks[x.t.id] = c ? c.value : 'na'; });
    const sc = Number(r.score), out = Number(r.outOf);
    let err = '';
    if (!r.name) err = 'Give the test a name.';
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(r.date) || r.date > S.todayKey()) err = 'Pick the date of the test. It can\'t be in the future.';
    else if (!/^\d+(\.\d+)?$/.test(r.score) || !/^\d+$/.test(r.outOf) || out < 1) err = 'Type your mark and the total as numbers.';
    else if (sc > out) err = 'Your mark can\'t be more than the total.';
    if (err){ el('warn').textContent = err; return; }
    r.score = sc; r.outOf = out;
    W.step = 2; renderWizard(entry); window.scrollTo(0, 0);
  };
}

function step2(entry, def, head){
  const r = W.rec, goal = S.store(entry).tests.goal, sp = Math.round(r.score / r.outOf * 100);
  const ev = S.evidenceFor(entry, r.date);
  const gap = goal - sp;
  const planLine = ev.prev && ev.prev.planMins != null && ev.prev.planMins !== ''
    ? `<p>After ${esc(ev.prev.name)} you planned <b>${esc(ev.prev.planMins)} minutes a week</b>. You actually averaged <b>${ev.minsPerWeek} minutes a week</b>.</p>` : '';
  el('app').innerHTML = `${head}<h1>${sp}%. ${gap > 0 ? `${gap} short of ${goal}%.` : gap === 0 ? `Right on ${goal}%.` : `${-gap} over ${goal}%.`}</h1></header>
  <div class="sumbox evid"><span class="eyebrow">What you actually did${ev.prev ? ` since ${esc(ev.prev.name)}` : ''}</span>
    <div class="evgrid"><div><span class="big">${S.fmtDur(ev.s)}</span><small>active time</small></div><div><span class="big">${ev.q}</span><small>questions</small></div><div><span class="big">${S.pct(ev.c, ev.q)}</span><small>right</small></div><div><span class="big">${ev.mastered}</span><small>topics mastered</small></div></div>
    <p class="note">${S.fmtDateY(ev.from)} to ${S.fmtDateY(ev.to)}, about ${ev.minsPerWeek} minutes a week.${ev.clipped ? ' Tracking on this device only started ' + S.fmtDateY(S.store(entry).log.since) + ', so earlier study isn\'t counted.' : ''}</p>
    ${planLine}
  </div>
  <div class="form">
    <label class="lab" for="rw">${gap > 0 ? 'Why do you think you were short?' : 'What do you think got you there?'}</label>
    <textarea id="rw" class="fld area" maxlength="500" placeholder="In your own words">${esc(r.reflect.why)}</textarea>
    <label class="lab" for="rd">What will you do differently before the next test?</label>
    <textarea id="rd" class="fld area" maxlength="500" placeholder="Be specific. Which topics, when, how?">${esc(r.reflect.diff)}</textarea>
    <label class="lab" for="rm">How many minutes a week will you spend on ${esc(def.title)}?</label>
    <div class="ansrow"><input id="rm" class="fld" inputmode="numeric" value="${esc(r.reflect.minsPerWeek)}"><span class="affix">minutes a week</span></div>
    <p class="note">You did about ${ev.minsPerWeek} a week last time. What's realistic, and what would close the gap?</p>
  </div>
  <p class="warn" id="warn" aria-live="polite"></p>
  <div class="actions"><button class="btn sec" id="pv">Back</button><button class="btn" id="nx">Next</button></div>`;
  const keep = () => { r.reflect.why = el('rw').value.trim(); r.reflect.diff = el('rd').value.trim(); r.reflect.minsPerWeek = el('rm').value.trim(); };
  el('pv').onclick = () => { keep(); W.step = 1; renderWizard(entry); };
  el('nx').onclick = () => {
    keep();
    let err = '';
    if (r.reflect.why.length < 15) err = 'Write a bit more about why. A full sentence at least.';
    else if (r.reflect.diff.length < 15) err = 'Write a bit more about what you\'ll change. A full sentence at least.';
    else if (!/^\d+$/.test(r.reflect.minsPerWeek) || +r.reflect.minsPerWeek > 1200) err = 'Type the minutes a week as a number.';
    if (err){ el('warn').textContent = err; return; }
    r.reflect.minsPerWeek = +r.reflect.minsPerWeek;
    const levels = S.proposedLevels(entry, r.marks);
    W.levels = levels;
    if (!r.reflect.focus.length || r.reflect.focus.some(id => levels[id] !== 'red')) r.reflect.focus = S.defaultRedOrder(entry, levels);
    W.step = 3; renderWizard(entry); window.scrollTo(0, 0);
  };
}

function step3(entry, def, head){
  const r = W.rec, levels = W.levels, byId = {};
  S.topicList(entry).forEach(x => byId[x.t.id] = x.t);
  const reds = r.reflect.focus;
  const amb = Object.keys(levels).filter(id => levels[id] === 'amber'), grn = Object.keys(levels).filter(id => levels[id] === 'green');
  el('app').innerHTML = `${head}<h1>Your red list</h1><p class="lede">These are the topics you'll fix first. Put them in the order you'll tackle them. Your parent will check it before it goes live.</p></header>
  ${reds.length ? `<ol class="order">${reds.map((id, i) => `<li><span class="no">${i + 1}</span><span class="nm">${esc(byId[id].name)}</span><span class="mv"><button class="ghost" data-up="${i}" ${i === 0 ? 'disabled' : ''} aria-label="Move up">↑</button><button class="ghost" data-dn="${i}" ${i === reds.length - 1 ? 'disabled' : ''} aria-label="Move down">↓</button></span></li>`).join('')}</ol>`
    : `<div class="sumbox"><p>No red topics from this test. Nice.</p></div>`}
  ${amb.length ? `<p class="note">Amber: ${amb.map(id => esc(byId[id].name)).join(', ')}.</p>` : ''}
  ${grn.length ? `<p class="note">Green: ${grn.map(id => esc(byId[id].name)).join(', ')}.</p>` : ''}
  <div class="actions"><button class="btn sec" id="pv">Back</button><button class="btn" id="sv">Save</button></div>`;
  const swap = (i, j) => { const a = reds.slice(); [a[i], a[j]] = [a[j], a[i]]; r.reflect.focus = a; step3(entry, def, head); el('back').onclick = () => { W.step = 0; S.go('tests', {entry}); }; };
  el('app').querySelectorAll('[data-up]').forEach(b => b.onclick = () => swap(+b.dataset.up, +b.dataset.up - 1));
  el('app').querySelectorAll('[data-dn]').forEach(b => b.onclick = () => swap(+b.dataset.dn, +b.dataset.dn + 1));
  el('pv').onclick = () => { W.step = 2; renderWizard(entry); };
  el('sv').onclick = () => { S.saveTest(entry, r); W.step = 4; renderWizard(entry); window.scrollTo(0, 0); };
}

function done(entry, def){
  el('app').innerHTML = `<header class="top"><span class="eyebrow">Saved</span><h1>Test logged</h1>
    <p class="lede">Your new red list has gone to your parent to approve. Until then you'll keep working on your current list.</p></header>
    <div class="actions"><button class="btn" id="tl">Back to ${esc(def.title)}</button><button class="btn sec" id="ml">My tests</button></div>`;
  el('tl').onclick = () => { W.step = 0; S.go('subject', {entry}); };
  el('ml').onclick = () => { W.step = 0; S.go('tests', {entry}); };
}
})();
