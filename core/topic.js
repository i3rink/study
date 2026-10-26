/* core/topic.js
   The topic screen every subject shares: simple explanation, Learn tab, Practise tab,
   Hint, Show me how, full working, and the 5-in-a-row mastery rule.
   Question objects come from the subject file. Supported kinds:
     mc     { options:[html], correct:index }
     num    { answer, tol, rel?, pre?, post?, im? }
     fields { template:'html with {0} {1}', fields:[{answer, tol}] }
   Every question also has prompt, hint, working:[html], answerText, and optional calc, note, diagram.
   A num question can list alt:[{answer, tol, note}] for other answers that also count, e.g. using 3.14 for π.
   Set plain:true on an mc question for ordinary text options (not maths type), e.g. Business.
   A topic can also have written:[{q, marks, points:[...], model}] for the Exam practice tab.
   Written answers are self-marked, so they never count towards mastery, streaks or % right. */
(function(){
'use strict';
const S = window.Study, el = S.el, esc = S.esc;

function parseNum(s){
  if (s == null) return NaN;
  s = String(s).trim().replace(/[£,%°\s]/g,'').replace(/[−–—]/g,'-');
  if (!s) return NaN;
  const f = s.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
  if (f){ const d = parseFloat(f[2]); return d ? parseFloat(f[1]) / d : NaN; }
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return NaN;
  return parseFloat(s);
}
const close = (x, a, tol, rel) => rel ? Math.abs(x - a) <= Math.abs(a) * 1e-9 + 1e-15 : Math.abs(x - a) <= (tol || 0) + 1e-9;
const dots = n => `<span class="dots" aria-label="${n} of ${S.TARGET}">${Array.from({length: S.TARGET}, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</span>`;
S.dots = dots;
S.nutHTML = t => t.nut ? `<div class="nut"><p><b>What it is.</b> ${t.nut.what}</p><p><b>Why it matters.</b> ${t.nut.why}</p></div>` : '';

const V = {};   // view state for the open topic

S.screens.topic = function(params){
  const entry = params.entry, item = S.topicList(entry).find(x => x.t.id === params.topicId);
  if (!item){ S.go('subject', {entry}); return; }
  if (V.id !== item.t.id){ V.id = item.t.id; V.tab = S.prog(entry, item.t.id).a ? 'practise' : 'learn'; V.q = null; V.qn = 0; V.answered = false; V.w = null; V.wn = 0; V.wseen = []; }
  if (V.tab === 'write' && !(item.t.written && item.t.written.length)) V.tab = 'practise';
  if (params.tab) V.tab = params.tab;
  S.setContext(entry.child, entry, item.t.id);
  render(entry, item);
};

function render(entry, item){
  const t = item.t, p = S.prog(entry, t.id);
  const lvl = p.mastered ? 'done' : item.level;
  const lvlText = p.mastered ? 'Mastered' : {red:'Red topic', amber:'Amber topic', green:'Green topic'}[item.level];
  el('app').innerHTML = `<button class="back" id="back">← ${esc(S.defFor(entry).title)} topics</button>
  <div class="thead"><div><span class="pill ${lvl}">${lvlText}</span></div><h1>${esc(t.name)}</h1>${S.nutHTML(t)}</div>
  <div class="tabs" role="tablist">
    <button class="tab" role="tab" id="tab-learn" aria-selected="${V.tab === 'learn'}">Learn</button>
    <button class="tab" role="tab" id="tab-prac" aria-selected="${V.tab === 'practise'}">Practise</button>
    ${t.written && t.written.length ? `<button class="tab" role="tab" id="tab-write" aria-selected="${V.tab === 'write'}">Exam practice</button>` : ''}
  </div><div id="panel"></div>`;
  el('back').onclick = () => { V.id = null; S.go('subject', {entry}); };
  el('tab-learn').onclick = () => { V.tab = 'learn'; render(entry, item); };
  el('tab-prac').onclick = () => { V.tab = 'practise'; render(entry, item); };
  const tw = el('tab-write'); if (tw) tw.onclick = () => { V.tab = 'write'; render(entry, item); };
  if (V.tab === 'learn') renderLearn(entry, item); else if (V.tab === 'write') renderWrite(entry, item); else renderPractise(entry, item);
}

function renderLearn(entry, item){
  const L = item.t.learn || {};
  el('panel').innerHTML = `<div class="learn">
    ${L.analogy ? `<div class="callout"><span class="lbl">Think of it like this</span><p>${L.analogy}</p></div>` : ''}
    ${L.key ? `<div class="blk"><h3>The key idea</h3><p>${L.key}</p></div>` : ''}
    ${L.rules ? `<div class="blk"><h3>The rules</h3><div class="rules">${L.rules.map(r => `<div><span>${r[0]}</span><small>${r[1]}</small></div>`).join('')}</div></div>` : ''}
    ${L.steps ? `<div class="blk"><h3>How to do it</h3><ol>${L.steps.map(s => `<li>${s}</li>`).join('')}</ol></div>` : ''}
    ${L.ex ? `<div class="blk"><h3>Worked example</h3><div class="example"><p>${L.ex.q}</p>${L.ex.lines.map(l => `<p class="ln">${l}</p>`).join('')}</div></div>` : ''}
    ${L.traps ? `<div class="blk"><h3>Where marks go missing</h3><ul class="traps">${L.traps.map(s => `<li>${s}</li>`).join('')}</ul></div>` : ''}
    ${L.exam ? `<p class="exam">${esc(L.examLabel || 'In the exam')}: ${L.exam}</p>` : ''}
    <div><button class="btn" id="go">Start practising</button></div></div>`;
  el('go').onclick = () => { V.tab = 'practise'; render(entry, item); window.scrollTo(0, 0); };
}

const streakHTML = p => `${dots(p.streak)}<span class="meta">Streak ${p.streak} · Best ${p.best} · ${p.c} of ${p.a} right</span>`;

function answerHTML(q){
  if (q.kind === 'mc') return `<fieldset class="mc${q.plain ? ' plain' : ''}"><legend class="sr">Choose an answer</legend>${q.options.map((o, i) => `<label class="opt" id="opt${i}"><input type="radio" name="mc" id="mc${i}" value="${i}"><span class="${q.plain ? 'ot' : 'm'}">${o}</span></label>`).join('')}</fieldset>`;
  if (q.kind === 'num') return `<div class="ansrow"><label for="f0" class="sr">Your answer</label>${q.pre ? `<span class="affix">${q.pre}</span>` : ''}<input id="f0" class="fld wide" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="${q.im || 'decimal'}" placeholder="Your answer">${q.post ? `<span class="affix">${q.post}</span>` : ''}</div>${q.note ? `<p class="note">${q.note}</p>` : ''}`;
  return `<div class="ansrow m">${q.template.replace(/\{(\d)\}/g, (m, i) => `<input id="f${i}" class="fld" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="text" aria-label="Box ${+i + 1}">`)}</div>${q.note ? `<p class="note">${q.note}</p>` : ''}`;
}

/* Mark a multiple choice answer, or lock the input boxes. */
function lock(q){
  if (q.kind === 'mc'){
    document.querySelectorAll('input[name="mc"]').forEach(i => i.disabled = true);
    const c = el('opt' + q.correct); if (c) c.classList.add('right');
    const s = document.querySelector('input[name="mc"]:checked'); if (s && +s.value !== q.correct) el('opt' + s.value).classList.add('wrong');
  } else el('ans').querySelectorAll('input.fld').forEach(i => i.disabled = true);
}
S.qui = {answerHTML: q => answerHTML(q), grade: q => grade(q), lock, parseNum, slipHTML: () => slipHTML()};

function renderPractise(entry, item){
  const t = item.t, p = S.prog(entry, t.id);
  if (S.isLocked(entry, item.level)){
    el('panel').innerHTML = `<div class="prac"><div class="hint">This topic unlocks once every red topic is mastered.</div></div>`;
    return;
  }
  if (!V.q){ V.q = t.gen(); V.qn++; V.answered = false; V.hinted = false; }
  const q = V.q;
  el('panel').innerHTML = `<div class="prac">
    <div class="streakbar" id="streak">${streakHTML(p)}</div>
    ${p.mastered ? `<div class="banner">Topic mastered. Keep going for practice, or head back and pick the next one.</div>` : ''}
    <article class="sheet">
      <span class="qno">Q${V.qn}</span>
      ${q.calc != null ? `<div class="qtop"><span class="calc">${q.calc ? 'Calculator' : 'Non-calculator'}</span></div>` : ''}
      <p class="qtext">${q.prompt}</p>
      ${q.diagram || ''}
      <div id="ans">${answerHTML(q)}</div>
      <div id="hintBox"></div>
      <p class="warn" id="warn" aria-live="polite"></p>
      <div class="actions" id="acts"><button class="btn" id="check">Check</button><button class="btn sec" id="hint">Hint</button><button class="btn sec" id="show">Show me how</button></div>
      <div id="fb" aria-live="polite"></div>
    </article></div>`;
  el('check').onclick = () => submit(entry, item, false);
  el('hint').onclick = () => { V.hinted = true; el('hintBox').innerHTML = `<div class="hint">${q.hint}</div>${S.game ? `<p class="note">Using a hint halves the XP for this question.</p>` : ''}`; };
  el('show').onclick = () => submit(entry, item, true);
  el('ans').querySelectorAll('input.fld').forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter'){ e.preventDefault(); V.answered ? next(entry, item) : submit(entry, item, false); } }));
  const f = el('f0'); if (f && window.matchMedia('(pointer:fine)').matches) f.focus();
}

/* signSlip is set when a wrong answer would be right with the opposite sign, e.g. 1 instead of -1. */
let signSlip = false, altNote = '';
const flipped = (x, a, tol, rel) => a !== 0 && close(-x, a, tol, rel);
function grade(q){
  signSlip = false; altNote = '';
  if (q.kind === 'mc'){ const s = document.querySelector('input[name="mc"]:checked'); if (!s) return null; return +s.value === q.correct; }
  if (q.kind === 'num'){
    const x = parseNum(el('f0').value); if (isNaN(x)) return null;
    let ok = close(x, q.answer, q.tol, q.rel);
    if (!ok && q.alt){ const a = q.alt.find(a => close(x, a.answer, a.tol)); if (a){ ok = true; altNote = a.note || ''; } }
    el('f0').classList.add(ok ? 'right' : 'wrong'); if (!ok && flipped(x, q.answer, q.tol, q.rel)) signSlip = true; return ok;
  }
  const vals = q.fields.map((f, i) => parseNum(el('f' + i).value));
  if (vals.some(isNaN)) return null;
  let all = true;
  q.fields.forEach((f, i) => { const ok = close(vals[i], f.answer, f.tol); el('f' + i).classList.add(ok ? 'right' : 'wrong'); if (!ok){ all = false; if (flipped(vals[i], f.answer, f.tol)) signSlip = true; } });
  return all;
}
const slipHTML = () => signSlip ? `<p class="slip">Right number, wrong sign. If the term is negative, type the minus sign in the box, even when there's a + in front of it.</p>` : '';

function submit(entry, item, reveal){
  if (V.answered) return;
  const t = item.t, q = V.q;
  let ok = false;
  signSlip = false;
  if (!reveal){
    const g = grade(q);
    if (g === null){ el('warn').textContent = q.kind === 'mc' ? 'Pick an answer first.' : 'Type a number in every box first.'; return; }
    ok = g;
  }
  el('warn').textContent = '';
  V.answered = true;
  const wasRedsDone = S.redsDone(entry), wasMastered = S.prog(entry, t.id).mastered;
  const res = S.recordAnswer(entry, t.id, ok, reveal);
  const gm = S.game ? S.game.onAnswer(entry, t.id, {ok, reveal, hinted: V.hinted, mode: 'practice', wasMastered, newlyMastered: res.newlyMastered}) : null;
  const p = S.prog(entry, t.id);
  lock(q);
  el('streak').innerHTML = streakHTML(p);
  let extra = '';
  if (res.newlyMastered){
    const unlocked = !wasRedsDone && S.redsDone(entry) && !S.store(entry).progress.unlock && S.groups(entry).amber.length;
    extra = `<div class="banner">${S.TARGET} in a row. ${esc(t.name)} is mastered.${unlocked ? ' That was the last red. The amber topics are now unlocked.' : ''}</div>`;
  }
  el('fb').innerHTML = `<div class="fb">
    <span class="markrow"><span class="mark">${ok ? '✓ Spot on' : reveal ? 'Here’s how' : '✗ Not quite'}</span>${S.game ? S.game.xpTag(gm) : ''}</span>
    ${ok ? (altNote ? `<p class="note">${altNote}</p>` : '') : `<p class="ans">Answer: ${q.answerText}</p>`}${ok || reveal ? '' : slipHTML()}
    <ol>${q.working.map(w => `<li>${w}</li>`).join('')}</ol>
    ${!ok ? `<p class="note">${reveal ? 'Showing the answer counts as a miss, so your streak resets.' : 'Streak reset.'} Read the working, then have another go.</p>` : ''}
    ${ok && wasMastered && S.game ? `<p class="note">You've mastered this one, so it earns less XP. Question of the day and boss rounds are where mastered topics pay out.</p>` : ''}
    ${extra}${S.game ? S.game.bannersHTML(gm) : ''}</div>`;
  el('acts').innerHTML = `<button class="btn" id="next">Next question</button>${res.newlyMastered ? `<button class="btn sec" id="home">Back to topics</button>` : ''}`;
  el('next').onclick = () => next(entry, item);
  const h = el('home'); if (h) h.onclick = () => { V.id = null; S.go('subject', {entry}); };
  el('next').focus({preventScroll: true});
}
function next(entry, item){ V.q = null; renderPractise(entry, item); }

/* ---------- Exam practice: written answers, self-marked ----------
   He writes first, then sees the marking points and ticks the ones he made.
   Logged apart from checked answers. Never changes mastery, streaks or % right. */
const MIN_WRITE = 15;
function pickWritten(t){
  const n = t.written.length, seen = V.wseen.slice(-Math.max(0, n - 1));
  const pool = t.written.map((w, i) => i).filter(i => !seen.includes(i));
  const i = pool[Math.floor(Math.random() * pool.length)];
  V.wseen.push(i);
  return t.written[i];
}
function renderWrite(entry, item){
  const t = item.t;
  if (S.isLocked(entry, item.level)){ el('panel').innerHTML = `<div class="prac"><div class="hint">This topic unlocks once every red topic is mastered.</div></div>`; return; }
  if (!V.w){ V.w = {q: pickWritten(t), stage: 'write', text: ''}; V.wn++; }
  const w = V.w, q = w.q;
  const head = `<article class="sheet"><span class="qno">W${V.wn}</span><div class="qtop"><span class="calc">Written · ${q.marks} mark${q.marks === 1 ? '' : 's'}</span></div><p class="qtext">${q.q}</p>`;
  if (w.stage === 'write'){
    el('panel').innerHTML = `<div class="prac"><p class="note">Write your answer the way you would in the test. Then check it against the marking points and mark it yourself. Be honest, it's only you it helps.</p>
      ${head}<label class="sr" for="wans">Your answer</label><textarea id="wans" class="fld area" maxlength="800" placeholder="Your answer">${esc(w.text)}</textarea>
      <p class="warn" id="warn" aria-live="polite"></p>
      <div class="actions"><button class="btn" id="wchk">Check my answer</button><button class="btn sec" id="wdk">I don't know</button></div></article></div>`;
    el('wchk').onclick = () => { const v = el('wans').value.trim(); if (v.length < MIN_WRITE){ el('warn').textContent = 'Write a full sentence first.'; return; } w.text = v; w.stage = 'mark'; renderWrite(entry, item); };
    el('wdk').onclick = () => { w.text = ''; w.gaveUp = true; w.stage = 'done'; save(entry, t, w, 0); renderWrite(entry, item); };
    if (window.matchMedia('(pointer:fine)').matches) el('wans').focus();
    return;
  }
  const points = `<ul class="mpts">${q.points.map((pt, i) => `<li><label><input type="checkbox" data-pt="${i}" ${w.stage === 'done' ? 'disabled' : ''} ${w.ticked && w.ticked.includes(i) ? 'checked' : ''}><span>${pt}</span></label></li>`).join('')}</ul>`;
  const yours = w.text ? `<div class="yours"><span class="eyebrow">Your answer</span><p>${esc(w.text)}</p></div>` : '';
  if (w.stage === 'mark'){
    el('panel').innerHTML = `<div class="prac">${head}${yours}
      <div class="blk"><h3>Marking points</h3><p class="note">Tick each point your answer actually makes. 1 mark each, up to ${q.marks}. Saying it in your own words is fine.</p>${points}</div>
      <div class="model"><span class="eyebrow">A full-marks answer</span><p>${q.model}</p></div>
      <div class="actions"><button class="btn" id="wsave">Save my mark</button></div></article></div>`;
    el('wsave').onclick = () => {
      w.ticked = [...el('panel').querySelectorAll('[data-pt]:checked')].map(c => +c.dataset.pt);
      w.stage = 'done'; save(entry, t, w, Math.min(q.marks, w.ticked.length)); renderWrite(entry, item);
    };
    return;
  }
  el('panel').innerHTML = `<div class="prac">${head}${yours}
    <div class="fb"><span class="markrow"><span class="mark">${w.gaveUp ? 'Here’s how' : `${w.got} out of ${q.marks}`}</span>${S.game ? S.game.xpTag(w.gm) : ''}</span>
    ${w.gaveUp ? `<div class="blk"><h3>Marking points</h3><ul class="mpts">${q.points.map(pt => `<li>${pt}</li>`).join('')}</ul></div>` : points}
    <div class="model"><span class="eyebrow">A full-marks answer</span><p>${q.model}</p></div>
    <p class="note">Self-marked. It shows in the Parent view with your answer, but it doesn't count towards mastery.</p>
    ${S.game ? S.game.bannersHTML(w.gm) : ''}</div>
    <div class="actions"><button class="btn" id="wnext">Next question</button></div></article></div>`;
  el('wnext').onclick = () => { V.w = null; renderWrite(entry, item); window.scrollTo(0, 0); };
}
function save(entry, t, w, got){
  w.got = got;
  S.recordWritten(entry, t.id, {q: w.q.q, marks: w.q.marks, answer: w.text, got, of: w.q.marks, gaveUp: !!w.gaveUp});
  w.gm = S.game ? S.game.onWritten(entry, !!w.gaveUp) : null;
}
})();
