/* subjects/evan-biology-s3.js
   Evan, S3 Biology. Topics follow his school summary sheet, "Body Systems Summary, S3 Biology,
   Prestwick Academy", in the order the sheet reads, all red.
   Wording matches National 5 Biology (C807 75, Course Specification v5.0, June 2026, Qualifications
   Scotland) where the two overlap: specialisation and the hierarchy, nervous control (cerebrum,
   cerebellum, medulla, sensory, inter and motor neurons, reflex arc), hormonal control and blood
   glucose, blood vessels, the heart and white blood cells.
   Homeostasis and temperature, innate and learned behaviour, first-line barriers, vaccines and herd
   immunity are on his school sheet but not in the N5 spec, so they follow the sheet.
   Glucagon isn't on his sheet but is in N5. It's taught here, marked Advanced, and only appears
   in Practise after he's answered a few questions on insulin.
   Where the sheet's words differ from N5 (specific and non-specific white blood cells), his
   teacher's words come first with the N5 name in brackets. Mucus counts as a chemical barrier,
   as on his sheet.

   Practise: multiple choice and number questions, checked automatically. These count for mastery (5 in a row).
   Exam practice: written answers he marks himself. These never count for mastery. */
(function(){
'use strict';

/* ---------- helpers ---------- */
const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const NAMES=['Aidan','Kirsty','Callum','Eilidh','Ryan','Isla','Lewis','Freya','Ross','Ailsa','Jamie','Megan','Kyle','Erin'];

/* Plain-text multiple choice: right answer, a pool of wrong ones (3 are used), hint, working. */
function mcq(prompt,correct,wrongs,hint,why,extra){
  const ds=shuffle([...new Set(wrongs)].filter(w=>w!==correct)).slice(0,3);
  const opts=shuffle([correct,...ds]);
  return Object.assign({kind:'mc',plain:true,options:opts,correct:opts.indexOf(correct),prompt,hint,working:why,answerText:correct},extra||{});
}
/* Fixed-order options, e.g. True/False or Physical/Chemical. */
function fixed(prompt,options,correct,hint,why,extra){
  return Object.assign({kind:'mc',plain:true,options,correct:options.indexOf(correct),prompt,hint,working:why,answerText:correct},extra||{});
}
const tf=(s,t,hint,why)=>fixed(`True or false? "${s}"`,['True','False'],t?'True':'False',hint,[t?'True.':'False.'].concat(why));
/* Picks a question style at random, never the same style twice in a row. */
function rotate(list){let last=-1;return ()=>{let i;do{i=Math.floor(Math.random()*list.length);}while(list.length>1&&i===last);last=i;return list[i]();};}
const ADV='<b>Advanced (National 5).</b> ';

/* ---------- diagrams (own drawings, colours from the shared theme) ---------- */
const svgOpen=(w,h,label)=>`<svg class="diag" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">`;
const NONE='style="fill:none"';
const WALL='style="fill:var(--red-soft);stroke:var(--ink-2);stroke-width:1.5"';
const HOLE='style="fill:var(--sheet);stroke:var(--ink-2);stroke-width:1.5"';
const SOFT='style="fill:var(--blue-soft);stroke:var(--ink-2);stroke-width:1.5"';
const lead=(x1,y1,x2,y2,n,tx,ty)=>`<line class="nl" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><circle cx="${x1}" cy="${y1}" r="3" class="dot"/><text class="lb" x="${tx}" y="${ty}">${n}</text>`;
function arrow(x1,y1,x2,y2){const a=Math.atan2(y2-y1,x2-x1)*180/Math.PI;
  return `<line class="nl" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><path class="dot" d="M-8,-5 L3,0 L-8,5 Z" transform="translate(${x2},${y2}) rotate(${a.toFixed(1)})"/>`;}

/* Brain, side view. nums maps each part to the number shown. */
function brainSVG(nums){
  let s=svgOpen(360,230,'Side view of the brain with three numbered parts');
  s+=`<path ${SOFT} d="M62,122 C40,62 110,22 190,26 C272,30 322,72 312,126 C306,146 270,150 246,142 L222,146 C176,166 92,168 62,122 Z"/>`;
  s+=`<path class="nl" ${NONE} d="M100,80 C120,60 140,90 160,70 M180,50 C200,70 215,45 235,62 M120,120 C140,105 165,130 190,110 M235,95 C255,85 270,108 290,96 M80,100 C95,95 100,110 112,104"/>`;
  s+=`<path ${WALL} d="M246,142 C262,136 304,142 304,162 C302,184 266,190 244,177 C232,167 232,150 246,142 Z"/>`;
  s+=`<path class="nl" ${NONE} d="M248,152 C265,148 285,150 298,156 M244,162 C262,160 284,162 300,168 M248,172 C264,173 282,175 294,178"/>`;
  s+=`<path ${HOLE} d="M210,148 L236,150 L232,222 L214,222 Z"/>`;
  s+=lead(170,62,120,14,nums.cerebrum,108,18)+lead(282,170,338,206,nums.cerebellum,348,212)+lead(222,196,160,214,nums.medulla,148,219);
  return s+'</svg>';
}
/* Heart, front view, so the person's right side is on the left of the picture. */
function heartSVG(nums){
  let s=svgOpen(300,250,'Front view of the heart with four numbered chambers');
  s+=`<path ${WALL} d="M150,52 C120,22 40,22 34,92 C30,150 100,206 150,238 C200,206 270,150 266,92 C260,22 180,22 150,52 Z"/>`;
  s+=`<line class="nl" x1="150" y1="52" x2="150" y2="232"/><line class="nl" x1="40" y1="112" x2="260" y2="112"/>`;
  const box=(x,y,n)=>`<circle cx="${x}" cy="${y}" r="15" ${HOLE}/><text class="lb" x="${x}" y="${y+5}">${n}</text>`;
  s+=box(95,78,nums.ra)+box(205,78,nums.la)+box(105,155,nums.rv)+box(195,155,nums.lv);
  s+=`<text class="cap" x="150" y="14" text-anchor="middle">Front view: the person's right is on your left</text>`;
  return s+'</svg>';
}
/* Cross-section of one blood vessel. */
function vesselSVG(kind){
  kind=kind.toLowerCase();
  let s=svgOpen(240,160,'Cross-section of a blood vessel');
  if(kind==='artery') s+=`<circle cx="120" cy="80" r="62" ${WALL}/><circle cx="120" cy="80" r="44" class="nl" ${NONE}/><circle cx="120" cy="80" r="16" ${HOLE}/>`;
  if(kind==='vein') s+=`<circle cx="120" cy="80" r="62" ${WALL}/><circle cx="120" cy="80" r="50" ${HOLE}/>`;
  if(kind==='capillary') s+=`<circle cx="120" cy="80" r="16" ${WALL}/><circle cx="120" cy="80" r="11" ${HOLE}/><text class="cap" x="120" y="128" text-anchor="middle">Drawn much bigger than real life</text>`;
  return s+'</svg>';
}
/* Reflex arc as a flow: receptor, spinal cord, muscle, with the three neurons numbered. */
function arcSVG(){
  let s=svgOpen(360,150,'Reflex arc with three numbered neurons');
  const bx=(x,t1,t2)=>`<rect x="${x}" y="40" width="90" height="56" rx="6" ${SOFT}/><text class="nt" x="${x+45}" y="64">${t1}</text><text class="nt" x="${x+45}" y="82">${t2}</text>`;
  s+=bx(4,'Receptor','in skin')+bx(135,'Spinal cord','')+bx(266,'Muscle','');
  s+=arrow(96,68,133,68)+arrow(227,68,264,68);
  s+=`<line class="ray" x1="150" y1="84" x2="210" y2="84"/><line class="nl" x1="180" y1="86" x2="180" y2="106"/>`;
  s+=`<text class="lb" x="114" y="56">1</text><text class="lb" x="180" y="124">2</text><text class="lb" x="246" y="56">3</text>`;
  s+=`<text class="cap" x="180" y="144" text-anchor="middle">2 is the neuron inside the spinal cord</text>`;
  return s+'</svg>';
}
/* Small data table for number questions. */
const tbl=(head,rows)=>`<table style="border-collapse:collapse;margin:8px 0"><tr>${head.map(h=>`<th style="border:1px solid var(--line);padding:4px 10px;text-align:left">${h}</th>`).join('')}</tr>${rows.map(r=>`<tr>${r.map(c=>`<td style="border:1px solid var(--line);padding:4px 10px">${c}</td>`).join('')}</tr>`).join('')}</table>`;

/* ======================================================================
   1. Specialised cells and the body's building blocks
   ====================================================================== */
const LEVELS4=['Cell','Tissue','Organ','Organ system'];
const LEVEL_DEF={
  'Cell':'The building block of all living things',
  'Tissue':'A group of cells with a similar structure and job',
  'Organ':'Different tissues joined together',
  'Organ system':'Different organs working together to do a job'};
const EXAMPLES=[['A red blood cell','Cell'],['A nerve cell','Cell'],['A muscle cell','Cell'],['A sperm cell','Cell'],
  ['Brain tissue','Tissue'],['Muscle tissue','Tissue'],['Skin tissue','Tissue'],
  ['The heart','Organ'],['The brain','Organ'],['The stomach','Organ'],['A lung','Organ'],['The liver','Organ'],['The pancreas','Organ'],
  ['The nervous system','Organ system'],['The cardiovascular system','Organ system'],['The hormonal system','Organ system'],['The immune system','Organ system']];
const SPEC=[['red blood cell','It has no nucleus, so there is more room to carry oxygen'],['nerve cell','It is long and thin, to carry electrical messages a long way'],
  ['muscle cell','It can contract (get shorter) to make the body move'],['sperm cell','It has a tail, so it can swim to the egg'],
  ['cell lining the airways','It has tiny hairs that sweep mucus up out of the lungs']];
const SYSTEMS=[['the brain, spinal cord and nerves','Nervous system'],['the heart and blood vessels','Cardiovascular system'],['glands, like the pancreas','Hormonal system'],['organs, cells and proteins that fight infection','Immune system']];
const SYS_NAMES=['Nervous system','Cardiovascular system','Hormonal system','Immune system','Digestive system'];
const genCells=rotate([
  ()=>mcq(`Which is the right order, from smallest to biggest?`,'Cell → tissue → organ → organ system',
    ['Tissue → cell → organ → organ system','Cell → organ → tissue → organ system','Organ → tissue → cell → organ system','Cell → tissue → organ system → organ'],
    `Cells group into tissues first.`,[`Cells make tissues. Tissues make organs. Organs work together in an organ system.`]),
  ()=>{const lv=pick(LEVELS4);return mcq(`Which word means "${LEVEL_DEF[lv].toLowerCase()}"?`,lv,LEVELS4,
    `Think cell, tissue, organ, organ system. Which step is this?`,[`${lv}: ${LEVEL_DEF[lv].toLowerCase()}.`]);},
  ()=>{const lv=pick(LEVELS4);return mcq(`What is a ${lv.toLowerCase()}?`,LEVEL_DEF[lv],Object.values(LEVEL_DEF),
    `Cells make tissues, tissues make organs, organs make organ systems.`,[`A ${lv.toLowerCase()} is ${LEVEL_DEF[lv].charAt(0).toLowerCase()+LEVEL_DEF[lv].slice(1)}.`]);},
  ()=>{const [ex,lv]=pick(EXAMPLES);return mcq(`${ex}. Is it a cell, a tissue, an organ or an organ system?`,lv,LEVELS4,
    `Is it one cell, a group of the same cells, a body part made of several tissues, or several organs working together?`,[`${ex} is ${lv==='Organ'||lv==='Organ system'?'an':'a'} ${lv.toLowerCase()}.`,`Order: cell → tissue → organ → organ system.`]);},
  ()=>{const i=R(0,2),lv=LEVELS4[i];return mcq(`What comes straight after "${lv.toLowerCase()}" in the body's order?`,LEVELS4[i+1],LEVELS4.filter(x=>x!==lv),
    `Cell, tissue, organ, organ system.`,[`Cell → tissue → organ → organ system. After ${lv.toLowerCase()} comes ${LEVELS4[i+1].toLowerCase()}.`]);},
  ()=>{const [c,f]=pick(SPEC);return mcq(`A ${c} is a specialised cell. Which feature helps it do its job?`,f,SPEC.map(x=>x[1]),
    `What is a ${c} for?`,[`A ${c}: ${f.charAt(0).toLowerCase()+f.slice(1)}.`]);},
  ()=>{const [c,f]=pick(SPEC);return mcq(`Which specialised cell is this? "${f}."`,`A ${c}`,SPEC.map(x=>'A '+x[0]),
    `Match the feature to the job.`,[`That's a ${c}.`]);},
  ()=>mcq(`What is specialisation?`,'The process that gives a cell special features for a particular job',
    ['When a cell splits in two','When cells die and are replaced','When an organism grows bigger','When cells join to make blood'],
    `A specialised cell has special features. What's the process called that gives it them?`,[`Specialisation is the process that develops a cell's special features so it can do one particular job.`]),
  ()=>mcq(`What does multicellular mean?`,'Made of more than one cell',['Made of one cell','Made of many organs only','Able to move around','Made of cells with no nucleus'],
    `"Multi" means many.`,[`Multicellular organisms are made of more than one cell, like you, a dog or an oak tree.`]),
  ()=>{const lv=pick(LEVELS4),yes=EXAMPLES.filter(x=>x[1]===lv).map(x=>x[0]),no=EXAMPLES.filter(x=>x[1]!==lv).map(x=>x[0]);
    return mcq(`Which of these is ${lv==='Organ'||lv==='Organ system'?'an':'a'} ${lv.toLowerCase()}?`,pick(yes),no,`${LEVEL_DEF[lv]}.`,[`${lv}: ${LEVEL_DEF[lv].toLowerCase()}.`]);},
  ()=>{const lv=pick(LEVELS4),no=EXAMPLES.filter(x=>x[1]===lv).map(x=>x[0]),yes=EXAMPLES.filter(x=>x[1]!==lv).map(x=>x[0]);
    return mcq(`Which of these is NOT ${lv==='Organ'||lv==='Organ system'?'an':'a'} ${lv.toLowerCase()}?`,pick(yes),no,`${LEVEL_DEF[lv]}. Which one doesn't fit?`,[`${lv}: ${LEVEL_DEF[lv].toLowerCase()}.`]);},
  ()=>{const [p,s]=pick(SYSTEMS);return mcq(`Which organ system is made of ${p}?`,s,SYS_NAMES,`Which system have you studied with these parts?`,[`${p.charAt(0).toUpperCase()+p.slice(1)}: the ${s.toLowerCase()}.`]);}
]);

/* ======================================================================
   2. The nervous system and the brain
   ====================================================================== */
const BRAIN={cerebrum:'Cerebrum',cerebellum:'Cerebellum',medulla:'Medulla'};
const BRAIN_JOB={cerebrum:['memory','reasoning and logic','speech and language','vision','personality'],cerebellum:['balance','co-ordination of movement'],medulla:['breathing rate','heart rate']};
const BRAIN_SCEN=[['A boxer is hit on the back of the head and can\'t walk in a straight line.','cerebellum'],
  ['After an accident, someone can\'t remember things and their speech is slurred.','cerebrum'],
  ['Your heart speeds up during a race without you thinking about it.','medulla'],
  ['A gymnast keeps her balance on the beam.','cerebellum'],
  ['You work out the answer to a maths problem.','cerebrum'],
  ['You keep breathing while you\'re fast asleep.','medulla'],
  ['You read a page of a book and picture the story.','cerebrum'],
  ['A footballer dribbles past three players without losing control of the ball.','cerebellum'],
  ['You recognise your friend\'s face across the playground.','cerebrum'],
  ['You ride a bike without wobbling.','cerebellum'],
  ['Your breathing gets faster as you climb a steep hill.','medulla'],
  ['You learn the words of a new song.','cerebrum'],
  ['A drink-driver can\'t walk heel to toe in a straight line.','cerebellum']];
const VOL=['Kicking a ball','Writing your name','Talking to a friend','Picking up your phone','Waving to someone','Choosing what to eat','Typing a message','Climbing the stairs'];
const INVOL=['Your heart beating','Breathing while you sleep','Blinking when dust hits your eye','Pulling your hand off a hot plate','Sneezing','Your pupils getting smaller in bright light'];
const brainWork=k=>[`The ${BRAIN[k].toLowerCase()} controls ${BRAIN_JOB[k].join(', ')}.`,`Cerebrum: thinking, memory, speech, vision, personality. Cerebellum: balance and co-ordination. Medulla: breathing and heart rate.`];
const genBrain=rotate([
  ()=>{const n=shuffle([1,2,3]),nums={cerebrum:n[0],cerebellum:n[1],medulla:n[2]},k=pick(Object.keys(BRAIN));
    return mcq(`Which part of the brain is labelled ${nums[k]}?`,BRAIN[k],['Cerebrum','Cerebellum','Medulla','Spinal cord'],
      `The biggest part is on top. The small wrinkly part is at the back. The medulla joins the spinal cord.`,
      [`Part ${nums[k]} is the ${BRAIN[k].toLowerCase()}.`,`Cerebrum: the big top part. Cerebellum: small, at the back, underneath. Medulla: at the bottom, joining the spinal cord.`],{diagram:brainSVG(nums)});},
  ()=>{const n=shuffle([1,2,3]),nums={cerebrum:n[0],cerebellum:n[1],medulla:n[2]},k=pick(Object.keys(BRAIN));
    return fixed(`Which number shows the ${BRAIN[k].toLowerCase()}?`,['1','2','3'],String(nums[k]),
      `Cerebrum: the big top part. Cerebellum: small, at the back. Medulla: joins the spinal cord.`,
      [`The ${BRAIN[k].toLowerCase()} is number ${nums[k]}.`],{diagram:brainSVG(nums)});},
  ()=>{const k=pick(Object.keys(BRAIN)),j=pick(BRAIN_JOB[k]);return mcq(`Which part of the brain controls ${j}?`,BRAIN[k],['Cerebrum','Cerebellum','Medulla','Spinal cord'],
    `Thinking jobs: cerebrum. Balance: cerebellum. Life-support jobs you never think about: medulla.`,brainWork(k));},
  ()=>{const k=pick(Object.keys(BRAIN));return mcq(`What does the ${BRAIN[k].toLowerCase()} control?`,BRAIN_JOB[k].join(', ').replace(/^./,c=>c.toUpperCase()),
    Object.keys(BRAIN).filter(x=>x!==k).map(x=>BRAIN_JOB[x].join(', ').replace(/^./,c=>c.toUpperCase())).concat(['Digesting food','Making hormones']),
    `Cerebrum thinks, cerebellum balances, medulla keeps you alive.`,brainWork(k));},
  ()=>{const [s,k]=pick(BRAIN_SCEN);return mcq(`${s} Which part of the brain is mainly involved?`,BRAIN[k],['Cerebrum','Cerebellum','Medulla'],
    `Is it thinking, balance, or breathing and heartbeat?`,brainWork(k));},
  ()=>mcq(`What does the nervous system consist of?`,'The brain, spinal cord and nerves',['The heart and blood vessels','Glands and hormones','The brain only','The lungs and airways'],
    `Three parts. Two of them make up the central nervous system.`,[`The nervous system is the brain, spinal cord and nerves.`]),
  ()=>mcq(`What is the central nervous system (CNS) made of?`,'The brain and spinal cord',['The brain and nerves','The spinal cord and nerves','The brain only','The heart and brain'],
    `"Central" means the middle, the control centre.`,[`The CNS is the brain and spinal cord. Nerves branch out from it to the rest of the body.`]),
  ()=>mcq(`How do messages travel along nerves?`,'As electrical impulses',['As hormones in the blood','As sound waves','As chemicals in the stomach'],
    `That's why the nervous system is so fast.`,[`Nerves carry messages as electrical impulses, which is why the nervous system works so quickly.`]),
  ()=>{const v=Math.random()<.5,a=v?pick(VOL):pick(INVOL);return fixed(`${a}. Voluntary or involuntary?`,['Voluntary','Involuntary'],v?'Voluntary':'Involuntary',
    `Voluntary means you choose to do it.`,[`${a} is ${v?'voluntary. You decide to do it.':'involuntary. It happens without you deciding.'}`,`The nervous system controls both kinds.`]);},
  ()=>mcq(`Which of these is a job of the nervous system?`,pick(['Letting you react to your surroundings','Co-ordinating your behaviour']),['Pumping blood','Fighting pathogens','Storing glucose','Digesting food'],
    `It's the body's fast messaging system.`,[`The nervous system lets you react to your surroundings and co-ordinates your behaviour.`])
]);

/* ======================================================================
   3. Homeostasis and body temperature
   ====================================================================== */
const HOT=[['Sweating','When sweat evaporates, it cools you down'],['More blood flows to the skin','More heat is lost to the air around you'],['Hairs on the arms lie flat','No layer of warm air is trapped']];
const COLD=[['Shivering','Contracting muscles make heat'],['Less blood flows to the skin','Less heat is lost to the air around you'],['Hairs on the arms stand up (goosebumps)','A layer of warm air is trapped']];
const HOT_SC=['running a cross-country race','sunbathing on holiday in Spain','playing football on a hot day','sitting in a sauna'];
const COLD_SC=['waiting at a bus stop in January','swimming in the sea at Prestwick in March','walking home in the snow','sitting in a freezing changing room'];
const genHomeo=rotate([
  ()=>{const n=pick(NAMES);return mcq(`${n} is ${pick(HOT_SC)}. Which change happens in ${n}'s body to cool down?`,pick(HOT)[0],COLD.map(x=>x[0]),
    `Too hot means the body needs to lose heat.`,[`When you're too hot: sweating, more blood to the skin, hairs lie flat.`,`Shivering, less blood to the skin and goosebumps are for when you're cold.`]);},
  ()=>{const n=pick(NAMES);return mcq(`${n} is ${pick(COLD_SC)}. Which change happens in ${n}'s body to warm up?`,pick(COLD)[0],HOT.map(x=>x[0]),
    `Too cold means the body needs to keep heat in or make more.`,[`When you're too cold: shivering, less blood to the skin, goosebumps.`,`Sweating, more blood to the skin and hairs lying flat are for when you're hot.`]);},
  ()=>{const all=HOT.concat(COLD),[c,r]=pick(all);return mcq(`${c}. How does this help the body?`,r,all.map(x=>x[1]),
    `Is it cooling the body down or warming it up?`,[`${c}: ${r.charAt(0).toLowerCase()+r.slice(1)}.`]);},
  ()=>{const hot=Math.random()<.5,[c]=pick(hot?HOT:COLD);return fixed(`${c}. Does this happen when the body is too hot or too cold?`,['Too hot','Too cold'],hot?'Too hot':'Too cold',
    `Does it lose heat or keep heat in?`,[`${c} happens when the body is too ${hot?'hot. It helps lose heat.':'cold. It helps keep or make heat.'}`]);},
  ()=>mcq(`What is homeostasis?`,'Keeping the body\'s inside conditions steady when the outside changes',['Fighting off pathogens','Pumping blood around the body','Learning a new behaviour','Breaking down food'],
    `"Homeo" means same. "Stasis" means staying still.`,[`Homeostasis is keeping the body's internal conditions, like temperature, steady even when the environment changes.`]),
  ()=>mcq(`Which two conditions does the body keep steady, from your summary sheet?`,'Temperature and blood sugar',['Height and weight','Hair colour and eye colour','Blood sugar and shoe size','Heart size and lung size'],
    `One is about heat, one is about glucose.`,[`Temperature and blood sugar are both kept steady by homeostasis.`]),
  ()=>({kind:'num',post:'°C',answer:37,tol:0,prompt:`What temperature does the body try to keep its insides at?`,hint:`It's a little under 40.`,
    working:[`37°C.`,`Enzymes, which keep us alive, work best at this temperature.`],answerText:'37°C'}),
  ()=>mcq(`Why does the body keep its temperature at 37°C?`,'Enzymes work best at that temperature',['Blood can only flow at 37°C','Sweat only works at 37°C','Bones grow best at 37°C'],
    `Enzymes are needed to keep us alive.`,[`Enzymes are most active at 37°C, and we need them to stay alive.`]),
  ()=>mcq(`Which part of the brain detects changes in the temperature of the blood?`,'Hypothalamus',['Cerebellum','Medulla','Spinal cord','Pancreas'],
    `It's a long word beginning with "hypo".`,[`The hypothalamus detects blood temperature, then the brain sends signals to organs to bring it back to 37°C.`]),
  ()=>{const a=37,b=R(2,16)/10,up=Math.random()<.5,end=up?a+b:a-b;return {kind:'num',post:'°C',answer:b,tol:.05,
    prompt:`${pick(NAMES)}'s temperature was ${a.toFixed(1)}°C. After ${up?pick(HOT_SC):pick(COLD_SC)} it was ${end.toFixed(1)}°C. By how much did it ${up?'rise':'fall'}?`,
    hint:`Take the smaller number from the bigger one.`,working:[`${Math.max(a,end).toFixed(1)} − ${Math.min(a,end).toFixed(1)} = ${b.toFixed(1)}°C`],answerText:b.toFixed(1)+'°C'};}
]);

/* ======================================================================
   4. Reflex actions
   ====================================================================== */
const NEUR=['Sensory neuron','Inter neuron','Motor neuron'];
const NEUR_JOB={'Sensory neuron':'Carries messages from the receptors in sense organs to the CNS','Inter neuron':'Passes the message on inside the spinal cord','Motor neuron':'Carries messages away from the CNS to a muscle or organ'};
const REFL=['Pulling your hand away from a hot pan','Blinking when something flies towards your eye','Your knee jerking when it\'s tapped','Sneezing when dust gets up your nose','Coughing when food goes down the wrong way','Your pupils getting smaller in bright light'];
const NOTREFL=['Catching a ball','Writing a text message','Choosing a song','Riding a bike','Answering a question in class','Tying your laces'];
const SCEN=[{s:'touches a hot pan',stim:'Heat from the pan',rec:'Receptors in the skin of the hand',eff:'Muscles in the arm',res:'The hand pulls away'},
  {s:'pricks a finger on a pin',stim:'The sharp pin',rec:'Receptors in the skin of the finger',eff:'Muscles in the arm',res:'The finger pulls away'},
  {s:'walks into a dark room and someone switches on a bright light',stim:'The bright light',rec:'Receptors in the eye',eff:'Muscles in the iris',res:'The pupils get smaller'},
  {s:'gets dust blown towards the eye',stim:'The dust',rec:'Receptors on the eye',eff:'Muscles in the eyelid',res:'The eye blinks'}];
const PARTS={stim:'stimulus',rec:'receptor',eff:'effector',res:'response'};
const genReflex=rotate([
  ()=>mcq(`What order does a message pass through the neurons in a reflex arc?`,'Sensory → inter → motor',['Motor → inter → sensory','Inter → sensory → motor','Sensory → motor → inter','Motor → sensory → inter'],
    `Remember SIM.`,[`SIM: sensory, inter, motor.`,`Sensory takes the message in, inter passes it on in the spinal cord, motor takes it out to the muscle.`]),
  ()=>{const n=pick(NEUR);return mcq(`What does the ${n.toLowerCase()} do in a reflex arc?`,NEUR_JOB[n],Object.values(NEUR_JOB).concat(['Pumps blood to the muscle']),
    `Sensory comes in from the senses. Motor goes out to make something move.`,[`${n}: ${NEUR_JOB[n].charAt(0).toLowerCase()+NEUR_JOB[n].slice(1)}.`,`SIM: sensory, inter, motor.`]);},
  ()=>{const n=pick(NEUR);return mcq(`Which neuron ${NEUR_JOB[n].charAt(0).toLowerCase()+NEUR_JOB[n].slice(1)}?`,n,NEUR,
    `SIM: in from the senses, inter in the middle, motor out to the muscle.`,[`That's the ${n.toLowerCase()}.`]);},
  ()=>{const k=R(1,3);return mcq(`Which neuron is labelled ${k}?`,NEUR[k-1],NEUR,`SIM, from left to right.`,
    [`Left to right is SIM: 1 sensory, 2 inter, 3 motor.`,`So ${k} is the ${NEUR[k-1].toLowerCase()}.`],{diagram:arcSVG()});},
  ()=>mcq(`Which of these is a reflex action?`,pick(REFL),NOTREFL,`A reflex is fast and automatic. You don't decide to do it.`,
    [`Reflexes are rapid, automatic and involuntary.`,`Catching a ball or writing a text are things you choose to do.`]),
  ()=>mcq(`Why are reflex actions useful?`,'They protect the body from damage or harm',['They help you learn new skills','They make you breathe faster','They help you remember things','They make hormones'],
    `Think about pulling your hand off a hot pan.`,[`Reflexes protect the body from damage or harm because they're so fast.`]),
  ()=>{const t=pick([['Reflex actions are rapid and automatic.',true],['You have to think about a reflex before it happens.',false],['In a reflex, the message goes through the spinal cord.',true],
    ['The brain makes the decision in a reflex action.',false],['Messages travel along neurons as electrical impulses.',true],['A reflex is a voluntary action.',false]]);
    return tf(t[0],t[1],`Reflexes are rapid, automatic and involuntary. The brain isn't involved.`,[`Reflexes are rapid, automatic and involuntary. The message goes through the spinal cord, not the brain.`]);},
  ()=>{const sc=pick(SCEN),k=pick(Object.keys(PARTS)),n=pick(NAMES);return mcq(`${n} ${sc.s}. In this reflex, what is the <b>${PARTS[k]}</b>?`,sc[k],Object.keys(PARTS).map(x=>sc[x]),
    `Stimulus: what sets it off. Receptor: what detects it. Effector: the muscle that acts. Response: what happens.`,
    [`Stimulus: ${sc.stim.toLowerCase()}.`,`Receptor: ${sc.rec.toLowerCase()}.`,`Effector: ${sc.eff.toLowerCase()}.`,`Response: ${sc.res.toLowerCase()}.`]);},
  ()=>mcq(`Where is the inter neuron found?`,'In the spinal cord',['In the skin','In the muscle','In the heart','In the eye'],
    `It's in the middle, inside the central nervous system.`,[`The inter neuron is in the spinal cord. It links the sensory and motor neurons.`])
]);

/* ======================================================================
   5. Innate and learned behaviour
   ====================================================================== */
const INNATE=['A newborn baby crying when it\'s hungry','A spider spinning a web','A baby turtle crawling to the sea after hatching','A newborn baby sucking milk',
  'Woodlice moving to a damp, dark place','A baby bird opening its beak when a parent lands on the nest','A newborn foal standing up within an hour of birth','A newborn kitten crawling towards its mother','A chick pecking at grain soon after hatching','A newborn baby gripping a finger put in its hand'];
const LEARNED=['Riding a bike','A dog sitting when it\'s told to','Speaking English','A cat running to the kitchen when it hears the food tin','Playing the guitar',
  'Looking both ways before crossing the road','A parrot copying words','Tying your laces','A sheepdog herding sheep when it hears a whistle','Using a TV remote','Swimming lengths of a pool','A pet rabbit coming when its name is called','A horse jumping fences at a show'];
const genBehav=rotate([
  ()=>{const i=Math.random()<.5,b=i?pick(INNATE):pick(LEARNED);return fixed(`${b}. Innate or learned?`,['Innate','Learned'],i?'Innate':'Learned',
    `Could it do this the moment it was born, without being taught?`,[`${b} is ${i?'innate. It does it from birth without being taught.':'learned. It needs experience or practice first.'}`]);},
  ()=>mcq(`Which of these is innate behaviour?`,pick(INNATE),LEARNED,`Innate means born knowing how.`,[`Innate behaviour happens from birth and doesn't have to be learned.`]),
  ()=>mcq(`Which of these is learned behaviour?`,pick(LEARNED),INNATE,`Learned behaviour needs experience.`,[`Learned behaviour only happens after experience or practice.`]),
  ()=>mcq(`What is innate behaviour?`,'Behaviour an animal does from birth, without learning it',['Behaviour only some members of a species do','Behaviour learned from parents','Behaviour learned at school','Behaviour that changes every day'],
    `"Innate" means you were born with it.`,[`Innate behaviour is instinctive. It happens from birth and doesn't need to be learned.`]),
  ()=>mcq(`What is learned behaviour?`,'Behaviour that needs experience, so not every member of a species does it',['Behaviour every animal is born with','Behaviour controlled by hormones only','A reflex action'],
    `Do all dogs know how to sit on command?`,[`Learned behaviour comes from experience, so not every member of a species will do it.`]),
  ()=>mcq(`What does "behaviour" mean in biology?`,'The ways an animal reacts to its environment and other living things',['How big an animal grows','What an animal eats','How fast an animal\'s heart beats'],
    `It's about how an animal reacts.`,[`Behaviour is the ways an animal reacts to its environment and to other living things.`]),
  ()=>mcq(`Why is it important that a baby turtle knows to head for the sea as soon as it hatches?`,'It has no time to learn, and it needs to get there to survive',['So it can learn to swim from its parents','So it can find its nest again','Because it likes the sound of the waves'],
    `Its parents aren't there to teach it.`,[`Innate behaviour helps survival when there's no chance to learn, like a turtle escaping predators on the beach.`]),
  ()=>{const t=pick([['All members of a species show the same innate behaviour.',true],['Every dog knows how to fetch a ball from birth.',false],['Behaviour helps animals survive.',true],['Innate behaviour has to be taught.',false],['Learned behaviour needs experience.',true]]);
    return tf(t[0],t[1],`Innate: born with it, every member does it. Learned: needs experience.`,[`Innate behaviour is done by all members of a species from birth. Learned behaviour needs experience.`]);}
]);

/* ======================================================================
   6. Hormones and blood sugar (glucagon marked Advanced)
   ====================================================================== */
const genHormBase=rotate([
  ()=>mcq(`What are hormones?`,'Chemical messengers carried in the blood',['Electrical messages carried by nerves','Cells that fight pathogens','Tubes that carry blood','A type of sugar'],
    `They travel in the bloodstream.`,[`Hormones are chemical messengers that travel in the blood to target organs.`]),
  ()=>mcq(`What is a gland?`,'An organ that releases hormones',['A type of blood vessel','A nerve in the spinal cord','A white blood cell','A part of the brain'],
    `The hormonal system is made up of these.`,[`A gland is an organ that releases hormones. The pancreas is one.`]),
  ()=>mcq(`How do hormones travel to their target organ?`,'In the bloodstream',['Along nerves','Through the air','Through the stomach','Along the spinal cord'],
    `They're chemicals, not electrical messages.`,[`Hormones travel in the bloodstream to the organs they target.`]),
  ()=>mcq(`Which gland controls blood sugar levels?`,'The pancreas',['The liver','The heart','The brain','The stomach'],`It releases insulin.`,
    [`The pancreas releases hormones that control blood sugar.`,`The liver stores the extra sugar, but it doesn't release the hormone.`]),
  ()=>mcq(`After a big meal, blood sugar rises. Which hormone does the pancreas release?`,'Insulin',['Adrenaline','Glycogen','Glucose'],`It starts with "in".`,
    [`Insulin is released when blood sugar rises.`,`Glycogen and glucose aren't hormones. They're forms of sugar.`]),
  ()=>mcq(`What does insulin do?`,'Removes extra glucose from the blood and stores it in the liver as glycogen',['Releases glucose from the liver into the blood','Makes the heart beat faster','Breaks down food in the stomach'],
    `Insulin is released when there's too much sugar in the blood.`,[`Insulin removes extra glucose from the blood. It's stored in the liver as glycogen.`]),
  ()=>mcq(`Where is extra glucose stored as glycogen?`,'The liver',['The pancreas','The heart','The brain','The lungs'],`It's a big organ under your ribs on the right.`,
    [`Extra glucose is stored in the liver as glycogen.`]),
  ()=>mcq(`Why do our cells need a steady supply of glucose?`,'To supply energy',['To fight pathogens','To make bones','To carry oxygen'],`Glucose is a sugar.`,
    [`Cells use glucose for energy.`]),
  ()=>{const t1=pick([['People with type 1 diabetes don\'t produce insulin.',true],['People with type 2 diabetes don\'t produce any glucose.',false],
    ['In type 2 diabetes, the cells don\'t respond to insulin properly.',true],['Too much or too little sugar in the blood can be dangerous.',true],['Insulin is made in the liver.',false]]);
    return tf(t1[0],t1[1],`Type 1: no insulin made. Type 2: the body doesn't respond to it.`,[`Type 1: the pancreas doesn't produce insulin. Type 2: cells don't respond to the insulin that's made.`,`Insulin is made in the pancreas.`]);},
  ()=>{const t=pick(['1','2']);return mcq(`Which describes type ${t} diabetes?`,t==='1'?'The body doesn\'t produce insulin':'The body\'s cells don\'t respond to insulin',
    ['The body doesn\'t produce insulin','The body\'s cells don\'t respond to insulin','The body makes too much glycogen','The liver stops working'],
    `One means no insulin. The other means insulin doesn't work.`,[`Type 1: no insulin is produced. Type 2: cells don't respond to insulin.`]);},
  ()=>{const t0=R(0,1),base=R(42,52)/10,peak=+(base+R(18,40)/10).toFixed(1),times=['7:00 am','8:00 am','9:00 am','10:00 am','11:00 am'];
    const vals=[base,+(base+R(0,2)/10).toFixed(1),peak,+(peak-R(10,20)/10).toFixed(1),+(base+R(1,4)/10).toFixed(1)];
    const a=t0,b=2,rise=+(vals[b]-vals[a]).toFixed(1);
    return {kind:'num',post:'mmol/l',answer:rise,tol:.05,prompt:`${pick(NAMES)} had breakfast at 8:00 am. The table shows blood sugar level in mmol/l (a unit for how much sugar is in the blood).${tbl(['Time','Blood sugar (mmol/l)'],times.map((t,i)=>[t,vals[i].toFixed(1)]))}By how much did blood sugar rise between ${times[a]} and ${times[b]}?`,
      hint:`Find both numbers in the table, then take one from the other.`,working:[`${times[b]}: ${vals[b].toFixed(1)}. ${times[a]}: ${vals[a].toFixed(1)}.`,`${vals[b].toFixed(1)} − ${vals[a].toFixed(1)} = ${rise.toFixed(1)} mmol/l`,`It went up after breakfast. Then insulin brought it back down.`],answerText:rise.toFixed(1)+' mmol/l'};},
  ()=>mcq(`Which is a difference between the nervous system and the hormonal system?`,'Nerves carry fast electrical messages, hormones are slower chemicals in the blood',
    ['Hormones travel along nerves','Nerves carry hormones in the blood','The hormonal system is faster than the nervous system'],`Which one uses electricity?`,
    [`Nervous system: electrical impulses along nerves, very fast.`,`Hormonal system: chemical messengers in the blood, slower.`])
]);
const genHormAdv=rotate([
  ()=>mcq(ADV+`Blood sugar falls too low. Which hormone does the pancreas release?`,'Glucagon',['Insulin','Glycogen','Glucose'],`Not insulin. Its name sounds a bit like glucose.`,
    [`Glucagon is released when blood sugar is too low.`,`Insulin brings sugar down. Glucagon brings it back up.`]),
  ()=>mcq(ADV+`What does glucagon do?`,'Changes glycogen in the liver back into glucose, which goes into the blood',['Stores glucose in the liver as glycogen','Makes the pancreas release insulin','Carries oxygen to cells'],
    `It does the opposite of insulin.`,[`Glucagon makes the liver turn glycogen back into glucose and release it into the blood.`]),
  ()=>{const hi=Math.random()<.5;return fixed(ADV+`Blood sugar is too ${hi?'high':'low'}. Which hormone is released?`,['Insulin','Glucagon'],hi?'Insulin':'Glucagon',
    `Insulin brings it down. Glucagon brings it up.`,[hi?'Too high: insulin, which stores the extra as glycogen in the liver.':'Too low: glucagon, which turns glycogen back into glucose.']);},
  ()=>mcq(ADV+`Hormones travel all round the body in the blood. Why does only the target organ respond?`,'Its cells have receptors that match that hormone',['The hormone only travels to that organ','Other organs have no blood','The brain blocks it everywhere else'],
    `Think of a key and a lock.`,[`Target cells have receptor proteins that match the hormone, so only they respond. Other cells don't have the right receptor.`]),
  ()=>tf(ADV+'Glucagon and glycogen are the same thing.',false,`One is a hormone, one is stored sugar.`,[`Glucagon is a hormone. Glycogen is the sugar stored in the liver. Easy to mix up, so watch the spelling.`])
]);
let hormServed=0;
const genHorm=()=>{hormServed++;return hormServed>4&&Math.random()<.25?genHormAdv():genHormBase();};

/* ======================================================================
   7. Blood vessels
   ====================================================================== */
const VESSEL={Artery:['Carries blood away from the heart','Has a thick, muscular wall','Carries blood at high pressure','Has a narrow central channel','Has a pulse with every heartbeat'],
  Vein:['Carries blood back into the heart','Has valves to stop blood flowing backwards','Carries blood at low pressure','Has a wide central channel','Has a thinner wall'],
  Capillary:['Has a wall only one cell thick','Forms networks at organs and tissues','Lets oxygen and glucose pass into the cells','Has a large surface area']};
const VN=['Artery','Vein','Capillary'];
const vWork=k=>[`${k}: ${VESSEL[k].map(x=>x.charAt(0).toLowerCase()+x.slice(1)).join(', ')}.`];
const genVessels=rotate([
  ()=>{const k=pick(VN),f=pick(VESSEL[k]);return mcq(`Which blood vessel ${f.charAt(0).toLowerCase()+f.slice(1)}?`,k,VN,
    `Arteries: Away. Veins: in. Capillaries: tiny, for swapping things with cells.`,vWork(k));},
  ()=>{const k=pick(VN),others=VN.filter(x=>x!==k);return mcq(`Which of these is true of a${k==='Artery'?'n':''} ${k.toLowerCase()}?`,pick(VESSEL[k]),VESSEL[others[0]].concat(VESSEL[others[1]]),
    `Arteries: Away. Veins: in. Capillaries: tiny.`,vWork(k));},
  ()=>{const k=pick(VN);return mcq(`Which blood vessel is shown in this cross-section?`,k,VN,
    `Look at how thick the wall is compared with the hole in the middle.`,
    [`Artery: thick wall, narrow channel. Vein: thinner wall, wide channel. Capillary: tiny, wall one cell thick.`,`This one is a${k==='Artery'?'n':''} ${k.toLowerCase()}.`],{diagram:vesselSVG(k)});},
  ()=>mcq(`Why do arteries have a thick, muscular wall?`,'To cope with blood at high pressure',['To stop blood flowing backwards','To let oxygen pass through easily','To store blood'],
    `The heart pumps blood straight into arteries.`,[`Blood leaves the heart at high pressure, so arteries need thick, muscular walls.`]),
  ()=>mcq(`What do the valves in veins do?`,'Stop blood flowing backwards',['Push blood away from the heart','Let oxygen out of the blood','Make the pulse'],
    `Blood in veins is at low pressure.`,[`Valves in veins prevent the backflow of blood.`]),
  ()=>mcq(`Why are capillary walls only one cell thick?`,'So materials like oxygen and glucose can pass through easily',['So they can cope with high pressure','So blood can flow backwards','So they can make a pulse'],
    `Capillaries are where things swap between blood and cells.`,[`Thin walls and a large surface area make exchange of oxygen, glucose and carbon dioxide efficient.`]),
  ()=>mcq(`What can you feel as a pulse?`,'A pressure wave in an artery with each heartbeat',['Blood flowing through a vein','Air in the lungs','A valve closing in a capillary'],
    `It's the vessel with blood at high pressure.`,[`With every heartbeat, a pressure wave passes along the arteries. That's the pulse.`]),
  ()=>{const b=R(18,32),s=pick([15,20,30]),bpm=b*60/s;return {kind:'num',post:'beats per minute',answer:bpm,tol:0,
    prompt:`${pick(NAMES)} counts ${b} pulse beats in ${s} seconds. What is the pulse rate in beats per minute?`,hint:`How many lots of ${s} seconds are in 60 seconds?`,
    working:[`60 ÷ ${s} = ${60/s}`,`${b} × ${60/s} = ${bpm} beats per minute`],answerText:bpm+' beats per minute'};},
  ()=>{const t=pick([['Arteries carry blood away from the heart.',true],['Veins carry blood at high pressure.',false],['Capillaries form networks at organs and tissues.',true],
    ['Arteries have valves.',false],['Veins have a wider central channel than arteries.',true],['Capillary walls are thick and muscular.',false]]);
    return tf(t[0],t[1],`Arteries: Away, high pressure. Veins: in, valves. Capillaries: thin walls.`,[`Arteries: away from the heart, thick wall, high pressure. Veins: back to the heart, valves, low pressure, wide channel. Capillaries: one cell thick.`]);},
  ()=>mcq(`Which substances pass between capillaries and body cells?`,'Oxygen, glucose and carbon dioxide',['Only red blood cells','Hormones and bone','Valves and muscle'],
    `Cells need fuel and oxygen, and need to get rid of waste.`,[`Oxygen and glucose go into the cells. Carbon dioxide comes out.`])
]);

/* ======================================================================
   8. The heart
   ====================================================================== */
const CH={ra:'Right atrium',la:'Left atrium',rv:'Right ventricle',lv:'Left ventricle'};
const genHeart=rotate([
  ()=>{const n=shuffle([1,2,3,4]),nums={ra:n[0],la:n[1],rv:n[2],lv:n[3]},k=pick(Object.keys(CH));
    return mcq(`Which chamber of the heart is labelled ${nums[k]}?`,CH[k],Object.values(CH),
      `Atria are on top. The person's right side is on the left of the picture.`,
      [`Top chambers are atria, bottom chambers are ventricles.`,`The diagram is a front view, so the person's right side is on your left.`,`${nums[k]} is the ${CH[k].toLowerCase()}.`],{diagram:heartSVG(nums)});},
  ()=>{const n=shuffle([1,2,3,4]),nums={ra:n[0],la:n[1],rv:n[2],lv:n[3]},k=pick(Object.keys(CH));
    return fixed(`Which number shows the ${CH[k].toLowerCase()}?`,['1','2','3','4'],String(nums[k]),
      `Atria on top. The person's right is on your left.`,[`The ${CH[k].toLowerCase()} is number ${nums[k]}.`,`Front view: the person's right side is on the left of the picture.`],{diagram:heartSVG(nums)});},
  ()=>{const k=pick(['rv','lv']);return mcq(`Which chamber pumps blood ${k==='rv'?'to the lungs':'to the rest of the body'}?`,CH[k],Object.values(CH),
    `Ventricles do the pumping. Right goes to the lungs, left to the body.`,[`${CH[k]}: pumps blood ${k==='rv'?'to the lungs':'to the body'}.`]);},
  ()=>{const k=pick(['ra','la']);return mcq(`Which chamber receives blood coming back ${k==='ra'?'from the body':'from the lungs'}?`,CH[k],Object.values(CH),
    `Atria receive. Blood from the lungs is full of oxygen, so it goes to the left.`,[`${CH[k]}: receives blood ${k==='ra'?'from the body':'from the lungs'}.`]);},
  ()=>{const k=pick(Object.keys(CH)),hi=k[0]==='l';return fixed(`Does the blood in the ${CH[k].toLowerCase()} have a high or low level of oxygen?`,['High in oxygen','Low in oxygen'],hi?'High in oxygen':'Low in oxygen',
    `Left side: just back from the lungs.`,[`The ${CH[k].toLowerCase()} is on the ${hi?'left':'right'} side, so its blood is ${hi?'high':'low'} in oxygen.`]);},
  ()=>{const lung=Math.random()<.5;return fixed(`Which side of the heart pumps blood to the ${lung?'lungs':'rest of the body'}?`,['Right side','Left side'],lung?'Right side':'Left side',
    `The right side's blood is low in oxygen. Where does it need to go?`,[`Right side: pumps blood to the lungs to pick up oxygen.`,`Left side: pumps oxygen-rich blood to the body.`]);},
  ()=>{const r=Math.random()<.5;return fixed(`Is the blood in the ${r?'right':'left'} side of the heart high or low in oxygen?`,['High in oxygen','Low in oxygen'],r?'Low in oxygen':'High in oxygen',
    `The left side's blood has just come back from the lungs.`,[`Right side: blood has come from the body, so it's low in oxygen.`,`Left side: blood has come from the lungs, so it's high in oxygen.`]);},
  ()=>{const up=Math.random()<.5;return mcq(`What are the ${up?'upper':'lower'} chambers of the heart called?`,up?'Atria':'Ventricles',['Atria','Ventricles','Valves','Capillaries'],
    `"A" for above: atria are on top.`,[`Upper chambers: atria. They receive blood.`,`Lower chambers: ventricles. They pump blood out.`]);},
  ()=>{const rec=Math.random()<.5;return fixed(`Which chambers ${rec?'receive blood coming into the heart':'pump blood out to the lungs or body'}?`,['Atria','Ventricles'],rec?'Atria':'Ventricles',
    `Atria on top receive. Ventricles below pump.`,[`Atria receive blood. Ventricles pump it to the lungs or body.`]);},
  ()=>{const v=Math.random()<.5;return fixed(`Which chambers are ${v?'veins':'arteries'} connected to?`,['Atria','Ventricles'],v?'Atria':'Ventricles',
    `Veins bring blood IN. Arteries take blood Away.`,[`Veins bring blood into the atria.`,`Arteries carry blood away from the ventricles.`]);},
  ()=>mcq(`Which is the right route for blood going from the body to the lungs?`,'Vein → right atrium → right ventricle → artery to lungs',
    ['Vein → right ventricle → right atrium → artery to lungs','Artery → right atrium → right ventricle → vein to lungs','Vein → left atrium → left ventricle → artery to lungs'],
    `Blood from the body is low in oxygen, so it's on the right. It goes in at the top.`,[`Blood from the body comes in by a vein to the right atrium, down to the right ventricle, then out by an artery to the lungs.`]),
  ()=>mcq(`Which is the right route for blood coming back from the lungs to go to the body?`,'Vein → left atrium → left ventricle → artery to body',
    ['Vein → left ventricle → left atrium → artery to body','Artery → left atrium → left ventricle → vein to body','Vein → right atrium → right ventricle → artery to body'],
    `Blood from the lungs is full of oxygen, so it's on the left. It goes in at the top.`,[`Blood from the lungs comes in by a vein to the left atrium, down to the left ventricle, then out by an artery to the body.`]),
  ()=>{const k=pick(Object.keys(CH)),where={ra:'the right ventricle',la:'the left ventricle',rv:'the lungs',lv:'the body'}[k];
    return mcq(`Where does blood go when it leaves the ${CH[k].toLowerCase()}?`,where.charAt(0).toUpperCase()+where.slice(1),['The right ventricle','The left ventricle','The lungs','The body','The right atrium'],
      `Atria pass blood down to the ventricle on the same side. Right ventricle goes to the lungs, left to the body.`,[`${CH[k]} → ${where}.`]);},
  ()=>{const t=pick([['The heart is made of muscle.',true],['The heart has four chambers.',true],['The right side pumps blood to the body.',false],['Ventricles receive blood from veins.',false],['Arteries are connected to the ventricles.',true]]);
    return tf(t[0],t[1],`Right side to the lungs. Atria receive. Ventricles pump out through arteries.`,[`The heart is a muscle with four chambers. The right side pumps to the lungs, the left to the body. Veins go into the atria, arteries leave the ventricles.`]);}
]);

/* ======================================================================
   9. The body's first defences
   ====================================================================== */
const BAR=[{org:'Skin',how:'Covers almost all of the body so pathogens can\'t get in',type:'Physical'},
  {org:'Nose',how:'Hairs inside catch pathogens before they get further in',type:'Physical'},
  {org:'Nose',how:'Sticky mucus traps pathogens before they reach the lungs',type:'Chemical'},
  {org:'Lungs',how:'Tiny hairs move mucus and pathogens up towards the throat',type:'Physical'},
  {org:'Stomach',how:'Acid kills pathogens that are swallowed or caught in mucus',type:'Chemical'},
  {org:'Eyes',how:'Tears contain enzymes that break down pathogens',type:'Chemical'}];
const ORGS=['Skin','Nose','Lungs','Stomach','Eyes'];
const genBarrier=rotate([
  ()=>{const b=pick(BAR);return mcq(`Which part of the body does this? "${b.how}."`,b.org,ORGS,`Think about where you'd find it.`,[`${b.org}: ${b.how.charAt(0).toLowerCase()+b.how.slice(1)}.`]);},
  ()=>{const b=pick(BAR);return fixed(`${b.org}: "${b.how}." Is this a physical or a chemical barrier?`,['Physical','Chemical'],b.type,
    `Physical blocks or sweeps pathogens. Chemical uses a substance like acid, mucus or enzymes.`,[`${b.type}.`,`Physical: skin, nose hairs, lung hairs. Chemical: mucus, stomach acid, enzymes in tears.`]);},
  ()=>mcq(`What is a pathogen?`,'A microbe that causes disease',['A white blood cell','An antibody','A type of vaccine','A blood vessel'],`Bacteria and viruses are examples.`,
    [`A pathogen is a disease-causing microbe, like a bacterium, virus or fungus.`]),
  ()=>mcq(`Which of these is NOT a type of pathogen?`,pick(['Antibody','White blood cell','Glucose']),['Bacteria','Virus','Fungus'],`Three of these cause disease.`,
    [`Pathogens are bacteria, viruses and fungi.`]),
  ()=>mcq(`If the skin is cut or grazed, what does it form to keep pathogens out?`,'A scab',['A valve','A blister of mucus','A new layer of hair'],`It forms over a graze as it heals.`,
    [`A cut forms a scab (a clot), which seals the gap so pathogens can't get in.`]),
  ()=>mcq(`The hairs in the airways move mucus up to the throat. What happens to it next?`,'It\'s swallowed into the stomach, where acid kills the pathogens',['It goes back into the lungs','It goes into the blood','It turns into white blood cells'],
    `Where is the acid?`,[`The mucus is swallowed into the stomach, where the acid kills any pathogens.`]),
  ()=>mcq(`What do the first lines of defence try to do?`,'Stop pathogens getting into the body',['Make antibodies','Remember pathogens','Digest food'],`They're the outside defences.`,
    [`The first lines of defence stop pathogens from entering the body.`]),
  ()=>mcq(`Why are the first lines of defence called non-specific?`,'They work against any pathogen, not just one kind',['They only work on one type of virus','They are made by vaccines','They only work in the stomach'],
    `"Specific" means for one particular thing.`,[`They're general defences. They work against any pathogen.`]),
  ()=>{const ty=pick(['Physical','Chemical']),yes=BAR.filter(b=>b.type===ty).map(b=>`${b.org}: ${b.how.charAt(0).toLowerCase()+b.how.slice(1)}`),no=BAR.filter(b=>b.type!==ty).map(b=>`${b.org}: ${b.how.charAt(0).toLowerCase()+b.how.slice(1)}`);
    return mcq(`Which of these is a ${ty.toLowerCase()} barrier?`,pick(yes),no,`Physical blocks or sweeps. Chemical uses a substance like mucus, acid or enzymes.`,[`Physical: skin, nose hairs, lung hairs. Chemical: mucus, stomach acid, enzymes in tears.`]);},
  ()=>{const [sc,org]=pick([['grazes a knee falling off a bike','Skin'],['has a scratched, sore eye','Eyes'],['takes medicine that makes the stomach less acidic','Stomach'],['has damaged hairs in the airways from smoking','Lungs']]);
    return mcq(`${pick(NAMES)} ${sc}, and is more likely to pick up an infection. Which barrier isn't working properly?`,org,ORGS,`Which part of the body is affected?`,[`The ${org.toLowerCase()} normally helps keep pathogens out.`]);},
  ()=>{const [sub,org]=pick([['enzymes in tears','Eyes'],['acid','Stomach'],['tiny hairs that move mucus up to the throat','Lungs'],['hairs and sticky mucus','Nose'],['a covering over almost the whole body','Skin']]);
    return mcq(`Which part of the body uses ${sub} to protect against pathogens?`,org,ORGS,`Picture where you'd find it.`,[`${org}: ${sub}.`]);},
  ()=>mcq(`What happens to pathogens trapped in the nose when you blow it?`,'They are removed with the mucus',['They are digested','They make antibodies','They go into the blood'],`Where does the mucus go?`,[`Blowing your nose removes the mucus and any pathogens trapped in it.`]),
  ()=>mcq(`Which barrier uses acid?`,'The stomach',ORGS,`Where does food go after you swallow?`,[`Stomach acid is strong enough to kill pathogens. That's a chemical barrier.`]),
  ()=>{const t=pick([['Mucus in the nose traps pathogens.',true],['Tears contain enzymes that break down pathogens.',true],['Skin is a chemical barrier.',false],['Bacteria, viruses and fungi can all be pathogens.',true],['Stomach acid is a physical barrier.',false]]);
    return tf(t[0],t[1],`Physical blocks. Chemical uses a substance.`,[`Skin and hairs are physical. Mucus, acid and enzymes are chemical.`]);}
]);

/* ======================================================================
   10. White blood cells and vaccines
   ====================================================================== */
const WBC={Specific:'Make antibodies, which make one type of pathogen inactive',Non:'Engulf and digest pathogens'};
const genWbc=rotate([
  ()=>{const s=Math.random()<.5;return mcq(`What do ${s?'specific white blood cells (lymphocytes)':'non-specific white blood cells (phagocytes)'} do?`,s?WBC.Specific:WBC.Non,
    [WBC.Specific,WBC.Non,'Carry oxygen around the body','Make insulin','Form a scab'],`Specific means for one type. Non-specific means any.`,
    [`Specific (lymphocytes): make antibodies that make pathogens inactive.`,`Non-specific (phagocytes): engulf and digest pathogens.`]);},
  ()=>{const s=Math.random()<.5;return fixed(`This white blood cell ${s?'makes antibodies':'engulfs and digests pathogens'}. Which type is it?`,['Specific (lymphocyte)','Non-specific (phagocyte)'],s?'Specific (lymphocyte)':'Non-specific (phagocyte)',
    `Antibodies only work on one type of pathogen.`,[`Making antibodies: specific (lymphocyte). Engulfing: non-specific (phagocyte).`]);},
  ()=>mcq(`What do antibodies do?`,'Make pathogens inactive',['Carry oxygen','Engulf pathogens','Make insulin','Form a scab'],`They're made by specific white blood cells.`,[`Antibodies make pathogens inactive. Each one works on a particular pathogen.`]),
  ()=>mcq(`Why are you usually less ill the second time you catch the same disease?`,'Your white blood cells remember it and make antibodies faster',['The pathogen gets weaker each time','Your skin gets thicker','You have more red blood cells'],
    `Think about memory.`,[`White blood cells remember the pathogen, so they make more antibodies in a shorter time. The disease is stopped or less severe.`]),
  ()=>mcq(`What does a vaccine make your white blood cells do?`,'Make antibodies, without you being unwell',['Make you ill so you learn','Stop making antibodies','Turn into pathogens'],`A vaccine is a safe first meeting.`,[`Vaccines cause white blood cells to make antibodies without you having symptoms.`]),
  ()=>mcq(`How do people who can't be vaccinated get protected?`,'Enough other people are vaccinated, so the disease can\'t spread to them',['They take extra vitamins','They get antibodies from food','They stay away from all other people forever'],
    `It's called herd immunity.`,[`They rely on the rest of the population being vaccinated. That's herd immunity.`]),
  ()=>mcq(`When do white blood cells start to work against a pathogen?`,'When it gets past the first lines of defence',['Before it touches the skin','Only after a vaccine','Only in the stomach'],`They're the second line.`,[`If the first lines of defence fail, white blood cells stop the pathogen spreading.`]),
  ()=>mcq(`Where are white blood cells made?`,'Bone marrow',['The heart','The liver','The stomach','The pancreas'],`It's inside your bones.`,[`White blood cells are produced by the bone marrow.`]),
  ()=>mcq(`What is a vaccine made of?`,'A dead or inactive pathogen',['Antibodies from a doctor','Live, harmful bacteria','White blood cells','Stomach acid'],`It can't make you ill.`,
    [`Vaccines contain a dead or inactive pathogen, so the body can learn to fight it without getting ill.`]),
  ()=>mcq(`How does a vaccine protect you?`,'White blood cells make antibodies and remember the pathogen, so they act faster next time',['It kills every germ in your body','It makes your skin thicker','It stops your body making antibodies'],
    `Think about memory.`,[`The vaccine makes white blood cells produce antibodies without you being ill.`,`They remember the pathogen, so next time they make more antibodies in a shorter time.`]),
  ()=>mcq(`If you meet a pathogen a second time, what do your specific white blood cells do?`,'Make more antibodies, more quickly',['Make fewer antibodies, more slowly','Nothing, they\'ve forgotten it','Turn into red blood cells'],
    `They developed a memory the first time.`,[`Memory means more antibodies, faster, so the disease is stopped or is less severe.`]),
  ()=>mcq(`What is herd immunity?`,'When enough people are vaccinated that the disease can\'t spread easily',['When animals give people immunity','When one person is vaccinated twice','When antibodies are shared between people'],
    `It protects people who can't have the vaccine.`,[`Herd immunity is when enough of a population is vaccinated to protect everyone, including people who can't be vaccinated.`]),
  ()=>mcq(`Why might someone not be able to have a vaccine?`,pick(['Because of an illness','Because of their age']),['Because they are too tall','Because they have had a cold before','Because they live in Scotland'],
    `Your summary sheet gives two reasons.`,[`Some people can't have vaccines because of illness, age or other reasons. They rely on everyone else being vaccinated.`]),
  ()=>{const dev=Math.random()<.5;return mcq(`Which is a challenge to vaccinating people in ${dev?'developed':'developing'} countries, from your summary sheet?`,
    dev?pick(['Hesitancy and conspiracy theories','People unsure whether to trust vaccines']):pick(['Access to healthcare','Money to pay for vaccines']),
    dev?['Access to healthcare','Money to pay for vaccines','Too many doctors']:['Hesitancy and conspiracy theories','Too many vaccines','People are too healthy'],
    `Developed: richer countries. Developing: poorer countries.`,[`Developed countries: hesitancy and conspiracy theories.`,`Developing countries: access, money and healthcare.`]);},
  ()=>{const tot=pick([600,800,1000,1200]),pct=R(14,19)*5,v=tot*pct/100;return {kind:'num',post:'%',answer:pct,tol:0,
    prompt:`A school has ${tot} pupils. ${v} of them have had a flu vaccine. What percentage is that?`,hint:`Divide the vaccinated by the total, then multiply by 100.`,
    working:[`${v} ÷ ${tot} = ${pct/100}`,`${pct/100} × 100 = ${pct}%`],answerText:pct+'%'};},
  ()=>{const t=pick([['Vaccines contain a dead or inactive pathogen.',true],['A vaccine makes you ill with the disease first.',false],['Antibodies make pathogens inactive.',true],['Phagocytes engulf and digest pathogens.',true],['White blood cells are made in the heart.',false]]);
    return tf(t[0],t[1],`Vaccines can't make you ill. White blood cells come from bone marrow.`,[`Vaccines use a dead or inactive pathogen. Lymphocytes make antibodies, phagocytes engulf pathogens, and both come from bone marrow.`]);}
]);

/* ======================================================================
   Topics, in the order his summary sheet reads. All red.
   ====================================================================== */
const TOPICS=[
 {id:'cells',level:'red',name:'Specialised cells and the body\'s building blocks',blurb:'Cell, tissue, organ, organ system',gen:genCells,learn:{
   analogy:`A football club is built up in layers. Players make a team, teams make the club. Your body is built the same way, from tiny cells up to whole systems.`,
   key:`Cells get special features for their job. That's called specialisation. Similar cells group into tissues, tissues make organs, and organs work together as organ systems.`,
   rules:[['Cell','The building block of all living things'],['Tissue','Cells with a similar structure and job, e.g. brain tissue'],['Organ','Different tissues joined together, e.g. the heart'],['Organ system','Different organs working together, e.g. the nervous system']],
   steps:[`Remember the order: cell → tissue → organ → organ system.`,`To place an example, ask: is it one cell, lots of the same cells, a body part, or several body parts working together?`,`For a specialised cell, link its feature to its job, e.g. a sperm cell has a tail to swim.`],
   ex:{q:`Put these in order from smallest to biggest: organ, cell, organ system, tissue. (1 mark)`,lines:[`Cell → tissue → organ → organ system. (1 mark)`]},
   traps:[`Mixing up tissue and organ. A tissue is one kind of cell. An organ has several tissues.`,`Calling the heart an organ system. It's an organ. The heart plus blood vessels is the system.`,`Describing a feature without saying how it helps the job.`],
   examLabel:'In the test',exam:`Usually the order, definitions, and examples. Also in National 5 Biology, so it's worth learning well.`},
  written:[
   {q:`Describe the order the body is organised in, from smallest to largest.`,marks:2,points:[`Cells make up tissues`,`Tissues make up organs, which make up organ systems`],model:`Cells group together to make tissues. Tissues join to make organs, and organs work together as organ systems.`},
   {q:`What is meant by a specialised cell?`,marks:1,points:[`A cell with special features that let it do a particular job`],model:`A specialised cell has special features that allow it to carry out a particular job.`},
   {q:`Explain the difference between a tissue and an organ.`,marks:2,points:[`A tissue is a group of cells with a similar structure and job`,`An organ is made of different tissues joined together`],model:`A tissue is a group of similar cells doing the same job. An organ is made of several different tissues joined together.`},
   {q:`Give one example of a specialised cell and explain how it's suited to its job.`,marks:2,points:[`A correct specialised cell, e.g. red blood cell, nerve cell, sperm cell`,`A matching feature and job, e.g. a sperm cell has a tail to swim to the egg`],model:`A sperm cell. It has a tail so it can swim to the egg.`}]},
 {id:'brain',level:'red',name:'The nervous system and the brain',blurb:'Brain, spinal cord, nerves and the brain\'s three parts',gen:genBrain,learn:{
   analogy:`The nervous system is like a phone network. The brain is head office, the spinal cord is the main cable, and nerves are the lines running out to every house.`,
   key:`The nervous system is the brain, spinal cord and nerves. The brain and spinal cord together are the central nervous system (CNS). Messages travel as electrical impulses, so it's very fast.`,
   rules:[['Cerebrum','Memory, reasoning, speech, language, vision and personality'],['Cerebellum','Balance and co-ordination'],['Medulla','Breathing rate and heart rate']],
   steps:[`Learn the three parts: brain, spinal cord, nerves.`,`CNS = brain + spinal cord.`,`For a brain question, decide: is it thinking (cerebrum), balance (cerebellum), or life-support you never think about (medulla)?`,`Voluntary actions are ones you choose. Involuntary actions happen on their own. The nervous system controls both.`],
   ex:{q:`A rugby player is injured and keeps losing his balance. Which part of his brain is most likely damaged? (1 mark)`,lines:[`Balance is controlled by the cerebellum. (1 mark)`]},
   traps:[`Mixing up cerebrum and cerebellum. Cerebellum ends in "bellum" like a bell swinging: balance.`,`Saying the medulla controls thinking. It controls breathing and heart rate.`,`Forgetting that the CNS is only the brain and spinal cord, not the nerves.`],
   examLabel:'In the test',exam:`Labelling the brain and matching parts to jobs is very common. Also National 5 content.`},
  written:[
   {q:`Name the three main parts of the nervous system.`,marks:3,points:[`Brain`,`Spinal cord`,`Nerves`],model:`The brain, the spinal cord and nerves.`},
   {q:`Name the three main parts of the brain and give the job of each.`,marks:3,points:[`Cerebrum: memory, reasoning, speech, vision or personality`,`Cerebellum: balance and co-ordination`,`Medulla: breathing rate and heart rate`],model:`The cerebrum controls memory, reasoning and speech. The cerebellum controls balance and co-ordination. The medulla controls breathing and heart rate.`},
   {q:`Explain why the nervous system can work so quickly.`,marks:1,points:[`Messages travel along nerves as electrical impulses`],model:`Messages are carried along nerves as electrical impulses, which are very fast.`},
   {q:`Explain the difference between a voluntary and an involuntary action, with an example of each.`,marks:2,points:[`Voluntary: you choose to do it, e.g. kicking a ball`,`Involuntary: it happens automatically, e.g. your heart beating`],model:`A voluntary action is one you choose to do, like kicking a ball. An involuntary action happens without you deciding, like your heart beating.`}]},
 {id:'homeo',level:'red',name:'Homeostasis and body temperature',blurb:'Keeping your insides at 37°C',gen:genHomeo,learn:{
   analogy:`Your body works like the heating at home. The thermostat checks the temperature and switches the heating on or off to keep it steady.`,
   key:`Homeostasis is keeping the body's inside conditions steady, like temperature and blood sugar. The hypothalamus in the brain checks the blood's temperature and tells the body how to get back to 37°C.`,
   rules:[['Too hot: sweating','Sweat evaporates and cools you down'],['Too hot: more blood to the skin','More heat is lost to the air'],['Too hot: hairs lie flat','No warm air is trapped'],['Too cold: shivering','Contracting muscles make heat'],['Too cold: less blood to the skin','Less heat is lost to the air'],['Too cold: goosebumps','Raised hairs trap a layer of warm air']],
   steps:[`Decide if the body is too hot or too cold.`,`Pick the change: hot means lose heat, cold means keep or make heat.`,`Give the reason as well. Marks often need both the change and why it works.`],
   ex:{q:`Explain how sweating helps keep body temperature at 37°C. (1 mark)`,lines:[`When sweat evaporates from the skin it cools the body down. (1 mark)`]},
   traps:[`Saying blood vessels "move" closer to the skin. Say more blood flows to the skin.`,`Writing "sweating cools you" without saying it's the sweat evaporating.`,`Mixing up the two lists. Shivering and goosebumps are for cold only.`],
   examLabel:'In the test',exam:`Expect "describe one change when hot or cold" and "explain how it helps". Not in National 5, but it's on your school sheet.`},
  written:[
   {q:`What is meant by homeostasis?`,marks:1,points:[`Keeping the body's internal conditions steady when the outside changes`],model:`Homeostasis is keeping the body's internal conditions, like temperature, steady even when the outside environment changes.`},
   {q:`Describe two ways the body responds when it is too hot, and explain how each helps.`,marks:2,points:[`Sweating: sweat evaporates and cools the body`,`More blood flows to the skin, so more heat is lost to the air`,`Hairs lie flat, so no insulating air is trapped`],model:`It sweats, and when the sweat evaporates it cools the body. More blood flows to the skin, so more heat is lost to the air.`},
   {q:`Describe two ways the body responds when it is too cold, and explain how each helps.`,marks:2,points:[`Shivering: contracting muscles make heat`,`Less blood flows to the skin, so less heat is lost`,`Hairs stand up (goosebumps), trapping a layer of insulating air`],model:`It shivers, and the contracting muscles make heat. Hairs stand up and trap a layer of insulating air.`},
   {q:`Explain why the body needs to stay at 37°C.`,marks:1,points:[`Enzymes work best at 37°C, and they're needed to keep us alive`],model:`Enzymes are most active at 37°C, and we need enzymes to stay alive.`}]},
 {id:'reflex',level:'red',name:'Reflex actions',blurb:'Sensory, inter, motor: remember SIM',gen:genReflex,learn:{
   analogy:`A reflex is like a smoke alarm that turns on the sprinklers by itself. It doesn't wait for anyone to decide. It just acts, fast.`,
   key:`A reflex is a rapid, automatic, involuntary action that protects you from harm. The message goes from a receptor, along three neurons, to a muscle. The brain isn't involved.`,
   rules:[['Sensory neuron','Carries the message from receptors in a sense organ to the CNS'],['Inter neuron','Passes the message on inside the spinal cord'],['Motor neuron','Carries the message out to a muscle or organ, which responds']],
   steps:[`Stimulus: something sets it off, like heat.`,`Receptor: detects it, like heat receptors in the skin.`,`Sensory neuron → inter neuron (spinal cord) → motor neuron. Remember SIM.`,`Effector: the muscle or organ that acts.`,`Response: what happens, like your hand pulling away.`],
   ex:{q:`Describe the pathway of a reflex arc when you touch a hot plate. (3 marks)`,lines:[`Receptors in the skin detect the heat and the sensory neuron carries the message to the spinal cord. (1 mark)`,`The inter neuron passes the message to the motor neuron. (1 mark)`,`The motor neuron carries it to the arm muscle, which pulls the hand away. (1 mark)`]},
   traps:[`Getting the neurons in the wrong order. SIM: sensory, inter, motor.`,`Saying the brain decides. In a reflex the message goes through the spinal cord.`,`Mixing up receptor (detects) and effector (acts).`],
   examLabel:'In the test',exam:`Ordering the neurons and labelling a reflex arc are common. Also National 5 content.`},
  written:[
   {q:`Name the three types of neuron in a reflex arc, in the order the message travels.`,marks:1,points:[`Sensory, inter, motor, in that order`],model:`Sensory neuron, inter neuron, motor neuron.`},
   {q:`Give two features of a reflex action.`,marks:2,points:[`Rapid`,`Automatic or involuntary`,`The brain is not involved`,`Protects the body from harm`],model:`Reflex actions are rapid and automatic. They protect the body from harm.`},
   {q:`Describe the job of the sensory neuron and the motor neuron.`,marks:2,points:[`Sensory neuron: carries the message from the receptor to the CNS`,`Motor neuron: carries the message from the CNS to the muscle or organ`],model:`The sensory neuron carries information from receptors to the spinal cord. The motor neuron carries it from the spinal cord to the muscle.`},
   {q:`Explain why reflex actions are important.`,marks:1,points:[`They protect the body from damage, because they happen so fast`],model:`They protect the body from harm, because they happen faster than you could think.`}]},
 {id:'behav',level:'red',name:'Innate and learned behaviour',blurb:'Born knowing it, or learned from experience',gen:genBehav,learn:{
   analogy:`Innate behaviour is like the apps that come already installed on a new phone. Learned behaviour is like the apps you add yourself later.`,
   key:`Behaviour is how an animal reacts to its environment and other living things. It helps animals survive. Innate behaviour happens from birth. Learned behaviour needs experience, so not every member of a species does it.`,
   rules:[['Innate','From birth, not taught, every member of the species does it. E.g. a spider spinning a web.'],['Learned','Needs experience or practice, only some do it. E.g. a dog sitting on command.']],
   steps:[`Ask: could it do this the moment it was born?`,`If yes, it's innate. If it had to be taught or practised, it's learned.`,`For an "explain" question, link it to survival.`],
   ex:{q:`A newborn baby sucks milk. Is this innate or learned? Explain your answer. (1 mark)`,lines:[`Innate, because the baby does it from birth without being taught. (1 mark)`]},
   traps:[`Saying "innate" without explaining why. Say "from birth, without being taught".`,`Thinking animals can't learn. Dogs, parrots and cats all learn behaviour.`,`Writing "learned" for anything clever. Spiders spin complex webs, but it's innate.`],
   examLabel:'In the test',exam:`Expect "innate or learned?" with an example to explain. Not in National 5, but it's on your school sheet.`},
  written:[
   {q:`Explain the difference between innate and learned behaviour.`,marks:2,points:[`Innate behaviour happens from birth and doesn't have to be learned`,`Learned behaviour needs experience, so not all members of a species do it`],model:`Innate behaviour happens from birth without being learned. Learned behaviour needs experience, so not every member of a species will do it.`},
   {q:`Give one example of innate behaviour and one example of learned behaviour.`,marks:2,points:[`A correct innate example, e.g. a spider spinning a web`,`A correct learned example, e.g. riding a bike`],model:`Innate: a spider spinning a web. Learned: a person riding a bike.`},
   {q:`Explain why behaviour is important to animals.`,marks:1,points:[`It helps them survive`],model:`How animals behave is vital to their survival, for example finding food or escaping predators.`}]},
 {id:'hormone',level:'red',name:'Hormones and blood sugar',blurb:'Glands, the pancreas, insulin and diabetes',gen:genHorm,learn:{
   analogy:`Your liver is like a sugar bank. Insulin is the deposit slip: it puts extra sugar away. Glucagon is the withdrawal slip: it takes some back out.`,
   key:`The hormonal system is made of glands, which release hormones. Hormones are chemical messengers that travel in the blood to target organs. The pancreas controls blood sugar.`,
   steps:[`You eat, and blood sugar rises.`,`The pancreas releases insulin into the blood.`,`Insulin removes the extra glucose and it's stored in the liver as glycogen.`,`If blood sugar falls too low, the stored glycogen is turned back into glucose and released into the blood.`,`<b>Advanced (National 5):</b> step 4 happens because the pancreas releases a second hormone, glucagon. Insulin brings blood sugar down. Glucagon brings it up.`,`Diabetes: type 1, the pancreas doesn't make insulin. Type 2, the cells don't respond to it.`],
   ex:{q:`Describe what happens when blood sugar rises after a meal. (2 marks)`,lines:[`The pancreas releases insulin into the blood. (1 mark)`,`Insulin removes extra glucose, which is stored in the liver as glycogen. (1 mark)`]},
   traps:[`Mixing up glycogen, glucagon and glucose. Glucose: sugar in the blood. Glycogen: stored sugar in the liver. Glucagon: a hormone.`,`Saying the liver makes insulin. The pancreas makes it. The liver stores glycogen.`,`Saying hormones travel along nerves. They travel in the blood.`],
   examLabel:'In the test',exam:`The insulin and glycogen steps come up often, plus type 1 and type 2 diabetes. National 5 adds glucagon.`},
  written:[
   {q:`What is a hormone?`,marks:1,points:[`A chemical messenger that travels in the blood to a target organ`],model:`A hormone is a chemical messenger that travels in the bloodstream to a target organ.`},
   {q:`Describe how the body lowers blood sugar after a meal.`,marks:3,points:[`The pancreas detects the rise and releases insulin`,`Insulin travels in the blood`,`Extra glucose is removed and stored as glycogen in the liver`],model:`The pancreas releases insulin into the blood. Insulin removes the extra glucose from the blood. It's stored in the liver as glycogen.`},
   {q:`Explain the difference between type 1 and type 2 diabetes.`,marks:2,points:[`Type 1: the body doesn't produce insulin`,`Type 2: the cells don't respond to the insulin produced`],model:`In type 1 diabetes the body doesn't produce insulin. In type 2 the cells don't respond to the insulin that is produced.`},
   {q:`Advanced (National 5). Describe what happens when blood sugar falls too low.`,marks:2,points:[`The pancreas releases glucagon`,`Glycogen in the liver is changed back into glucose and released into the blood`],model:`The pancreas releases glucagon. This makes the liver change glycogen back into glucose, which goes into the blood.`}]},
 {id:'vessels',level:'red',name:'Blood vessels',blurb:'Arteries, veins and capillaries',gen:genVessels,learn:{
   analogy:`Blood vessels are like a road network. Arteries are the big main roads out from the heart, veins are the roads back, and capillaries are the tiny side streets that reach every house.`,
   key:`There are three types of blood vessel. Arteries carry blood away from the heart. Veins carry it back in. Capillaries swap materials with cells.`,
   rules:[['Artery','Away from the heart. Thick muscular wall, high pressure, narrow channel, pulse.'],['Vein','Back into the heart. Thinner wall, low pressure, wide channel, valves stop backflow.'],['Capillary','Wall one cell thick, large surface area, networks at organs, lets oxygen, glucose and carbon dioxide pass through.']],
   steps:[`Arteries: A for Away from the heart.`,`Veins: in to the heart. Valves stop the low-pressure blood going backwards.`,`Capillaries: tiny and thin, so things pass in and out easily.`,`Link each feature to a reason. Thick wall because of high pressure. Thin wall so materials pass through.`],
   ex:{q:`Explain why arteries have thick, muscular walls. (1 mark)`,lines:[`Arteries carry blood at high pressure, so they need thick walls to cope with it. (1 mark)`]},
   traps:[`Saying arteries have valves. Veins have valves.`,`Saying veins carry blood at high pressure. Arteries do.`,`Giving a feature without a reason when the question says "explain".`],
   examLabel:'In the test',exam:`"Which vessel?" from a description or diagram, and "explain" a feature. Also National 5 content.`},
  written:[
   {q:`Describe two features of an artery.`,marks:2,points:[`Carries blood away from the heart`,`Thick, muscular wall`,`Blood at high pressure`,`Narrow central channel`],model:`An artery carries blood away from the heart. It has a thick, muscular wall to cope with high pressure.`},
   {q:`Describe two features of a vein.`,marks:2,points:[`Carries blood back to the heart`,`Has valves to stop backflow`,`Thinner wall`,`Low pressure`,`Wide central channel`],model:`A vein carries blood back to the heart. It has valves to stop blood flowing backwards.`},
   {q:`Explain how capillaries are suited to exchanging materials with cells.`,marks:2,points:[`Thin walls, one cell thick`,`Large surface area`,`Form networks at organs and tissues`],model:`Capillary walls are only one cell thick, so materials pass through easily. They have a large surface area.`},
   {q:`Explain why veins contain valves.`,marks:1,points:[`To stop blood flowing backwards, because it's at low pressure`],model:`Blood in veins is at low pressure, so valves stop it flowing backwards.`}]},
 {id:'heart',level:'red',name:'The heart',blurb:'Four chambers, two sides, two jobs',gen:genHeart,learn:{
   analogy:`The heart is like two pumps stuck together. The right pump sends blood a short trip to the lungs. The left pump sends it the long way round the whole body.`,
   key:`The heart is a muscle with four chambers and two sides. The right side pumps blood to the lungs to pick up oxygen. The left side pumps oxygen-rich blood to the body.`,
   rules:[['Atria (top)','Receive blood. Veins bring blood into them.'],['Ventricles (bottom)','Pump blood out to the lungs or body. Arteries take blood away from them.'],['Right side','Blood low in oxygen, pumped to the lungs.'],['Left side','Blood high in oxygen, pumped to the body.']],
   steps:[`Body → vein → right atrium → right ventricle → artery → lungs.`,`Lungs → vein → left atrium → left ventricle → artery → body.`,`On a diagram, you're looking at the person from the front, so their right side is on your left.`,`<b>Advanced (National 5):</b> you'll also name the four big blood vessels and the valves.`],
   ex:{q:`Describe the job of the right side of the heart. (1 mark)`,lines:[`It pumps blood to the lungs to pick up oxygen. (1 mark)`]},
   traps:[`Labelling the diagram the wrong way round. The person's right is on your left.`,`Mixing up atria and ventricles. Atria are on top and receive. Ventricles are below and pump.`,`Saying the right side pumps to the body.`],
   examLabel:'In the test',exam:`Labelling the four chambers and describing each side's job are favourites. Also National 5 content.`},
  written:[
   {q:`Describe the difference between the jobs of the left and right sides of the heart.`,marks:2,points:[`Right side pumps blood to the lungs to pick up oxygen`,`Left side pumps oxygen-rich blood to the body`],model:`The right side pumps blood to the lungs to pick up oxygen. The left side pumps the oxygen-rich blood to the rest of the body.`},
   {q:`Explain why the blood in the left side of the heart has more oxygen than the right side.`,marks:1,points:[`It has just come back from the lungs, where it picked up oxygen`],model:`Blood in the left side has just come back from the lungs, where it picked up oxygen.`},
   {q:`Describe the jobs of the atria and the ventricles.`,marks:2,points:[`Atria receive blood coming into the heart`,`Ventricles pump blood out to the lungs or body`],model:`The atria receive blood coming into the heart. The ventricles pump blood out to the lungs or the body.`},
   {q:`Describe the route blood takes from the body, through the heart, to the lungs.`,marks:2,points:[`Into the right atrium through a vein`,`Into the right ventricle, then out through an artery to the lungs`],model:`Blood comes in through a vein to the right atrium. It goes down to the right ventricle and is pumped out through an artery to the lungs.`}]},
 {id:'barrier',level:'red',name:'The body\'s first defences',blurb:'Skin, nose, lungs, stomach and eyes',gen:genBarrier,learn:{
   analogy:`Your first defences are like a castle's walls and moat. They don't fight the invaders. They just stop them getting in.`,
   key:`Pathogens (bacteria, viruses and fungi) cause disease. The first lines of defence stop them entering the body. They're non-specific, which means they work against any pathogen, and they're either physical or chemical.`,
   rules:[['Skin (physical)','Covers the body. A cut forms a scab.'],['Nose','Hairs (physical) and mucus (chemical) trap pathogens. Blowing your nose removes them.'],['Lungs','Tiny hairs (physical) move mucus (chemical) up to the throat to be swallowed.'],['Stomach (chemical)','Acid kills pathogens.'],['Eyes (chemical)','Tears contain enzymes that break down pathogens.']],
   steps:[`Name the organ.`,`Say how it protects.`,`Say whether it's physical (blocks or sweeps) or chemical (uses a substance).`],
   ex:{q:`Describe how the stomach protects the body against pathogens. (1 mark)`,lines:[`Stomach acid kills pathogens that are swallowed in food or caught in mucus. (1 mark)`]},
   traps:[`Calling skin a chemical barrier. It's physical.`,`Your summary sheet counts mucus as chemical. Use that in your school test.`,`Saying first defences make antibodies. That's white blood cells, the next line.`],
   examLabel:'In the test',exam:`Expect the table: organ, how it protects, physical or chemical. Not in National 5, but it's on your school sheet.`},
  written:[
   {q:`What is a pathogen? Give two examples.`,marks:2,points:[`A microbe that causes disease`,`Two of: bacteria, viruses, fungi`],model:`A pathogen is a microbe that causes disease, like bacteria or viruses.`},
   {q:`Describe two physical barriers that stop pathogens getting into the body.`,marks:2,points:[`Skin covers the body`,`Hairs in the nose`,`Tiny hairs in the airways move mucus up to the throat`],model:`The skin covers the body so pathogens can't get in. Hairs in the nose trap pathogens.`},
   {q:`Describe two chemical barriers that protect the body against pathogens.`,marks:2,points:[`Mucus traps pathogens`,`Stomach acid kills pathogens`,`Tears contain enzymes that break down pathogens`],model:`Stomach acid kills pathogens that are swallowed. Tears contain enzymes that break down pathogens.`},
   {q:`Explain how the lungs and stomach work together to remove pathogens.`,marks:2,points:[`Hairs in the airways move mucus and trapped pathogens up to the throat`,`It's swallowed and stomach acid kills the pathogens`],model:`Tiny hairs in the airways sweep mucus with trapped pathogens up to the throat. It's swallowed, and the stomach acid kills the pathogens.`}]},
 {id:'wbc',level:'red',name:'White blood cells and vaccines',blurb:'Antibodies, memory, vaccines and herd immunity',gen:genWbc,learn:{
   analogy:`A vaccine is like a wanted poster. Your white blood cells see what the criminal looks like before it ever shows up, so they catch it fast if it does.`,
   key:`If pathogens get past the first defences, white blood cells from the bone marrow stop them spreading. They then remember the pathogen. Vaccines use that memory to protect you before you're ever infected.`,
   rules:[['Specific white blood cells (lymphocytes)','Make antibodies that make one type of pathogen inactive'],['Non-specific white blood cells (phagocytes)','Engulf and digest pathogens'],['Vaccine','Dead or inactive pathogen. Antibodies are made without you being ill.'],['Herd immunity','Enough people vaccinated to protect everyone, including those who can\'t be']],
   steps:[`Pathogen gets in. White blood cells attack.`,`Specific ones make antibodies. Non-specific ones engulf and digest.`,`The cells remember the pathogen.`,`Next time, they make more antibodies in a shorter time, so the disease is stopped or milder.`,`A vaccine gives the first meeting safely, without the illness.`],
   ex:{q:`Explain how a vaccine protects someone against a disease. (2 marks)`,lines:[`The vaccine contains a dead or inactive pathogen, which makes white blood cells produce antibodies without the person being ill. (1 mark)`,`The cells remember it, so if the real pathogen appears they make more antibodies faster. (1 mark)`]},
   traps:[`Saying vaccines contain antibodies. They contain a dead or inactive pathogen. Your body makes the antibodies.`,`Mixing up the two cell types. Specific: antibodies. Non-specific: engulf.`,`Forgetting the memory part when explaining vaccines.`],
   examLabel:'In the test',exam:`The two cell types are National 5 too. Vaccines, herd immunity and the challenges table are from your school sheet.`},
  written:[
   {q:`Describe the jobs of the two types of white blood cell.`,marks:2,points:[`Specific (lymphocytes) make antibodies that make pathogens inactive`,`Non-specific (phagocytes) engulf and digest pathogens`],model:`Specific white blood cells make antibodies that make pathogens inactive. Non-specific white blood cells engulf and digest pathogens.`},
   {q:`Explain how a vaccine protects you from a disease.`,marks:3,points:[`It contains a dead or inactive pathogen`,`White blood cells make antibodies without you being ill`,`They remember it, so next time they make more antibodies faster`],model:`A vaccine contains a dead or inactive pathogen. White blood cells make antibodies against it without you getting ill. They remember it, so if you meet the real pathogen they make more antibodies in a shorter time.`},
   {q:`What is herd immunity and why is it important?`,marks:2,points:[`Enough of a population is vaccinated that the disease can't spread easily`,`It protects people who can't be vaccinated, e.g. due to illness or age`],model:`Herd immunity is when enough people are vaccinated to stop a disease spreading. It protects people who can't have vaccines because of illness or age.`},
   {q:`Describe one challenge to vaccination in a developed country and one in a developing country.`,marks:2,points:[`Developed: hesitancy or conspiracy theories`,`Developing: access, money or healthcare`],model:`In developed countries some people are hesitant or believe conspiracy theories. In developing countries it can be hard to get access to healthcare and pay for vaccines.`}]}
];

/* ---------- simple explanations ----------
   Rules: 50 words max across both parts, a 10-year-old could follow it, no jargon,
   one everyday example, the idea not the method, one symbol at most. */
const NUT={
 cells:{what:`Your body is built from tiny living cells. Each type is shaped for one job, and cells doing the same job group into bigger teams.`,
   why:`It's like a football club. Players make a team, and teams make a club. Muscle cells make muscle, and muscle helps make your heart.`},
 brain:{what:`Your nervous system is your brain, your spinal cord (the thick bundle of nerves down your back) and your nerves. It sends super-fast electrical messages.`,
   why:`It's how you catch a ball. Your brain's three main parts each run different jobs, like thinking, balance and breathing.`},
 homeo:{what:`Homeostasis means your body keeping things steady inside, like its temperature, even when it's hot or cold outside.`,
   why:`Your body works best at 37°C, a bit like a heating thermostat at home. That's why you sweat after football and shiver at the bus stop.`},
 reflex:{what:`A reflex is a super-fast action your body does without you deciding to, like pulling your hand off a hot pan.`,
   why:`Reflexes protect you from harm. The message takes a shortcut through your spinal cord, the nerves down your back, so you move before your brain catches up.`},
 behav:{what:`Behaviour is how an animal reacts to the world around it. Innate behaviour is something you're born knowing. Learned behaviour comes from experience.`,
   why:`A newborn baby knows how to feed, but nobody is born able to ride a bike. Both kinds help animals survive.`},
 hormone:{what:`Hormones are chemical messages carried in your blood. One of their jobs is keeping your blood sugar steady.`,
   why:`After a big bowl of cereal, sugar floods your blood. Hormones help store the extra and release it later, so your body never runs out of fuel.`},
 vessels:{what:`Blood vessels are the tubes that carry blood around your body. There are three kinds: arteries, veins and capillaries.`,
   why:`They're like roads. Big main roads lead away from the heart, others lead back, and tiny side streets reach every house.`},
 heart:{what:`Your heart is a muscle that pumps blood all day. It's really two pumps side by side, split into four chambers, or rooms.`,
   why:`The right side sends blood to your lungs to collect oxygen. The left side pushes it round your body. Your pulse is each squeeze.`},
 barrier:{what:`Pathogens are germs, like bacteria and viruses, that make you ill. Your first defences try to stop them getting in at all.`,
   why:`Your skin works like a wall around a castle, and the sticky mucus in your nose traps germs like flypaper. Fewer germs in means less illness.`},
 wbc:{what:`White blood cells are your body's germ fighters. Some swallow germs whole. Others make antibodies, chemicals that grab one type of germ and stop it.`,
   why:`A vaccine is a harmless practice germ. Your body learns to fight it before the real one turns up, like with your school jags.`}
};
TOPICS.forEach(t=>{t.nut=NUT[t.id];});

Study.registerSubject('evan-biology-s3',{
  title:'Biology',
  level:'S3',
  course:'S3 Biology · Body Systems summary sheet',
  intro:'Work down your summary sheet in order. Get 5 right in a row to master a topic. Then try Exam practice: write answers like you would in the test, and mark them yourself. You\'ve got this.',
  topics:TOPICS
});
})();
