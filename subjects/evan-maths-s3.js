/* subjects/evan-maths-s3.js
   Evan, S3 Mathematics, matched to his school revision booklet (17 pages).
   The booklet works at National 5 standard, so topic content follows the SQA
   National 5 Mathematics Course Specification (C847 75, v3.0, May 2023),
   pitched simpler and more encouraging for a 13 to 14 year old.
   Topics are all red, in booklet page order. */
(function(){
'use strict';

/* ---------- helpers ---------- */
const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a||1;};
const MINUS='−';
const v=s=>`<i>${s}</i>`;
const sup=s=>`<sup>${s}</sup>`;
const M=s=>`<span class="m">${s}</span>`;
const fr=(t,b)=>`<span class="frac"><span class="num">${t}</span><span class="den">${b}</span></span>`;
const sq=r=>`<span class="surd">√<span class="rad">${r}</span></span>`;
const rnd=(x,d)=>Number(Math.round(Number(x+'e'+d))+'e-'+d);
const fix=x=>Number(Number(x).toPrecision(12));
const fmt=(x,dp)=>Number(fix(x)).toLocaleString('en-GB',{maximumFractionDigits:dp==null?12:dp,minimumFractionDigits:dp==null?0:dp}).replace('-',MINUS);
const n_=n=>fmt(n);
const sig=(x,n)=>Number(Number(x).toPrecision(n));
const sigUnit=(x,n)=>Math.pow(10,Math.floor(Math.log10(Math.abs(x)))-n+1);
const money=x=>'£'+fmt(x,2);
const plural=(n,w)=>`${n} ${w}${n===1?'':'s'}`;
const PI='π';
const NOTE_NEG='Use a minus sign for negative numbers.';

/* Rounded answers. Accepts the correctly rounded value, or an unrounded one that rounds to it. */
const sfAns=(x,n)=>({answer:sig(x,n),tol:sigUnit(x,n)*.6});
const dpAns=(x,d)=>({answer:rnd(x,d),tol:Math.pow(10,-d)*.6});

/* Fractions: show p/q in lowest terms. */
function fracVal(p,q){if(q<0){p=-p;q=-q;}const g=gcd(p,q);return [p/g,q/g];}
function fracHTML(p,q){[p,q]=fracVal(p,q);if(q===1)return n_(p);return (p<0?MINUS:'')+fr(Math.abs(p),q);}

/* Polynomials, highest power first. powers: e.g. [2,1,0]. */
function poly(coefs,powers,letter){
  letter=letter||'x';let out='';
  coefs.forEach((c,i)=>{
    if(c===0)return;const p=powers[i],a=Math.abs(c);
    const body=p===0?String(a):(a===1?'':a)+v(letter)+(p>1?sup(p):'');
    out+=out===''?(c<0?MINUS:'')+body:(c<0?' '+MINUS+' ':' + ')+body;
  });
  return out||'0';
}
const polyTemplate=powers=>`<span class="tight">${powers.map((p,i)=>`<span class="term">{${i}}${M((p===0?'':v('x')+(p>1?sup(p):''))+(i<powers.length-1?' +':''))}</span>`).join('')}</span>`;
const sgn=n=>n<0?` ${MINUS} ${Math.abs(n)}`:` + ${n}`;

/* Multiple choice. */
function mc(correct,others){
  const seen=new Set([correct]);const ds=[];
  for(const c of others){if(!seen.has(c)){seen.add(c);ds.push(c);}if(ds.length===3)break;}
  const opts=shuffle([correct,...ds]);
  return {kind:'mc',options:opts,correct:opts.indexOf(correct),answerText:M(correct)};
}

/* Vectors and points */
const bv=s=>`<b>${s}</b>`;
const colv=arr=>`<span class="colv">${arr.map(x=>`<span>${typeof x==='number'?n_(x):x}</span>`).join('')}</span>`;
const arw=s=>`<span class="arw">${s}</span>`;
const pt=(...a)=>`(${a.map(n_).join(', ')})`;

/* ---------- diagrams ---------- */
const svgOpen=(w,h,label)=>`<svg class="diag" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">`;
const notToScale=(x,y)=>`<text class="cap" x="${x}" y="${y}">Not to scale</text>`;
function arrowHead(p1,p2,t){t=t==null?.55:t;const x=p1[0]+(p2[0]-p1[0])*t,y=p1[1]+(p2[1]-p1[1])*t,ang=Math.atan2(p2[1]-p1[1],p2[0]-p1[0])*180/Math.PI;
  return `<path class="dot" d="M-7,-5 L5,0 L-7,5 Z" transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${ang.toFixed(1)})"/>`;}

/* Cuboid in oblique view. O at front-bottom-left. x right, y back, z up. */
function cuboidSVG(o){
  const L=150,W=80,H=85,ox=55,oy=190;
  const P=(x,y,z)=>[ox+x*L+y*W*.62,oy-z*H-y*W*.5];
  const V={O:P(0,0,0),A:P(1,0,0),B:P(1,1,0),C:P(0,1,0),D:P(0,0,1),E:P(1,0,1),F:P(1,1,1),G:P(0,1,1)};
  const edges=[['O','A'],['A','B'],['B','F'],['F','E'],['E','A'],['E','D'],['D','O'],['D','G'],['G','F'],['O','C',1],['C','B',1],['C','G',1]];
  let s=svgOpen(360,225,'Cuboid diagram');
  if(o.axes){
    s+=`<path class="nl" d="M${V.A} L${V.A[0]+40},${V.A[1]}"/><text class="nt" x="${V.A[0]+48}" y="${V.A[1]+5}">x</text>`;
    s+=`<path class="nl" d="M${V.D} L${V.D[0]},${V.D[1]-28}"/><text class="nt" x="${V.D[0]}" y="${V.D[1]-33}">z</text>`;
    s+=`<path class="dash" d="M${V.C} L${V.C[0]+18},${V.C[1]-15}"/><text class="nt" x="${V.C[0]+25}" y="${V.C[1]-18}">y</text>`;
  }
  edges.forEach(([a,b,h])=>{s+=`<path class="${h?'dash':'nl'}" d="M${V[a]} L${V[b]}"/>`;});
  if(o.diag)s+=`<path class="arc" d="M${V.O} L${V.F}" style="stroke-width:2.2"/>`;
  const off={O:[-12,14],A:[4,16],B:[12,8],C:[-14,-4],D:[-12,-4],E:[0,-8],F:[14,-4],G:[-12,-6]};
  (o.labels||[]).forEach(([k,txt])=>{s+=`<text class="lb" x="${V[k][0]+off[k][0]}" y="${V[k][1]+off[k][1]}">${txt}</text>`;});
  if(o.dims){
    const mid=(a,b)=>[(V[a][0]+V[b][0])/2,(V[a][1]+V[b][1])/2];
    const [m1,m2,m3]=[mid('O','A'),mid('A','B'),mid('B','F')];
    s+=`<text class="nt" x="${m1[0]}" y="${m1[1]+18}">${o.dims[0]}</text><text class="nt" x="${m2[0]+10}" y="${m2[1]+14}" style="text-anchor:start">${o.dims[1]}</text><text class="nt" x="${m3[0]+8}" y="${m3[1]+4}" style="text-anchor:start">${o.dims[2]}</text>`;
  }
  if(o.cap)s+=`<text class="nt" x="${V.F[0]-10}" y="${V.F[1]-16}">${o.cap}</text>`;
  return s+notToScale(8,218)+'</svg>';
}
/* Right-angled triangle, right angle bottom-left. */
function rtriSVG(lv,lh,lc){
  return `${svgOpen(300,205,'Right-angled triangle')}<path class="nl" fill="none" d="M50,170 L260,170 L50,40 Z"/><path class="nl" fill="none" d="M50,155 L65,155 L65,170"/>
  <text class="lb" x="42" y="110" style="text-anchor:end">${lv}</text><text class="lb" x="155" y="192">${lh}</text><text class="lb" x="170" y="96" style="text-anchor:start">${lc}</text>${notToScale(205,200)}</svg>`;
}
/* Slope with rise and run. */
function slopeSVG(rise,run){
  return `${svgOpen(300,195,'Slope')}<path class="nl" fill="none" d="M30,160 L270,160 L270,70"/><path class="ray" d="M30,160 L270,70"/><path class="nl" fill="none" d="M255,160 L255,145 L270,145"/>
  <text class="lb" x="150" y="182">${run}</text><text class="lb" x="278" y="120" style="text-anchor:start">${rise}</text>${notToScale(30,190)}</svg>`;
}
/* Parallelogram PQRS with PQ = a and PS = b. */
function paraSVG(){
  const P=[50,165],Q=[210,165],R=[280,60],S=[120,60];
  return `${svgOpen(320,200,'Parallelogram PQRS')}<path class="nl" fill="none" d="M${P} L${Q} L${R} L${S} Z"/><path class="ray" d="M${P} L${Q}"/><path class="ray" d="M${P} L${S}"/>
  ${arrowHead(P,Q)}${arrowHead(P,S)}
  <text class="lb" x="${P[0]-10}" y="${P[1]+16}">P</text><text class="lb" x="${Q[0]+8}" y="${Q[1]+16}">Q</text><text class="lb" x="${R[0]+10}" y="${R[1]-4}">R</text><text class="lb" x="${S[0]-10}" y="${S[1]-6}">S</text>
  <text class="lb" x="130" y="188" style="font-weight:800">a</text><text class="lb" x="72" y="110" style="font-weight:800">b</text></svg>`;
}
function circleSVG(type,label){
  const cx=150,cy=110,r=85;
  const line=type==='d'?`<path class="ray" d="M${cx-r},${cy} L${cx+r},${cy}"/><circle class="dot" cx="${cx}" cy="${cy}" r="3"/><text class="lb" x="${cx}" y="${cy-8}">${label}</text>`
    :`<path class="ray" d="M${cx},${cy} L${cx+r},${cy}"/><circle class="dot" cx="${cx}" cy="${cy}" r="3"/><text class="lb" x="${cx+r/2}" y="${cy-8}">${label}</text>`;
  return `${svgOpen(300,220,'Circle')}<circle class="nl" fill="none" cx="${cx}" cy="${cy}" r="${r}"/>${line}</svg>`;
}
function sectorSVG(r,deg){
  const cx=140,cy=130,rr=100,t=deg*Math.PI/180;
  const p1=[cx+rr,cy],p2=[+(cx+rr*Math.cos(t)).toFixed(1),+(cy-rr*Math.sin(t)).toFixed(1)];
  const la=[cx+34*Math.cos(t/2),cy-34*Math.sin(t/2)+5];
  const H=deg<=180?160:250;
  return `${svgOpen(280,H,'Sector of a circle')}<path class="nl" fill="var(--blue-soft)" d="M${cx},${cy} L${p1} A${rr},${rr} 0 ${deg>180?1:0} 0 ${p2} Z"/>
  <path class="arc" d="M${cx+20},${cy} A20,20 0 ${deg>180?1:0} 0 ${(cx+20*Math.cos(t)).toFixed(1)},${(cy-20*Math.sin(t)).toFixed(1)}"/>
  <text class="lb" x="${la[0].toFixed(1)}" y="${la[1].toFixed(1)}" style="text-anchor:start">${deg}°</text><text class="lb" x="${cx+rr/2}" y="${cy+18}">${r}</text>${notToScale(8,H-5)}</svg>`;
}
/* Coordinate grid from -6 to 6 with a line y = mx + c. */
function graphSVG(m,c,px,py){
  const s=18,o=130,X=x=>o+x*s,Y=y=>o-y*s;
  let g='';for(let i=-6;i<=6;i++){g+=`<path d="M${X(i)},${Y(-6)} L${X(i)},${Y(6)}" stroke="currentColor" stroke-opacity=".12"/><path d="M${X(-6)},${Y(i)} L${X(6)},${Y(i)}" stroke="currentColor" stroke-opacity=".12"/>`;}
  const id='clip'+Math.random().toString(36).slice(2,7);
  return `${svgOpen(260,260,'Graph of a straight line')}<defs><clipPath id="${id}"><rect x="${X(-6)}" y="${Y(6)}" width="${12*s}" height="${12*s}"/></clipPath></defs>${g}
  <path class="nl" d="M${X(-6)},${o} L${X(6)},${o} M${o},${Y(-6)} L${o},${Y(6)}"/><text class="nt" x="${X(6)+10}" y="${o+5}">x</text><text class="nt" x="${o}" y="${Y(6)-6}">y</text>
  <path class="ray" clip-path="url(#${id})" d="M${X(-7)},${Y(m*-7+c)} L${X(7)},${Y(m*7+c)}"/>
  <circle class="dot" cx="${X(0)}" cy="${Y(c)}" r="4"/><circle class="dot" cx="${X(px)}" cy="${Y(py)}" r="4"/>
  <text class="nt" x="${X(0)-14}" y="${Y(c)+4}" style="text-anchor:end">${n_(c)}</text><text class="nt" x="${X(px)+6}" y="${Y(py)-8}" style="text-anchor:start">${pt(px,py)}</text></svg>`;
}

/* ======================================================================
   1. Vectors (booklet pages 2 to 3)
   ====================================================================== */
const VEC_ROUTES={QR:['b','QR runs the same way as PS and is the same length.'],SR:['a','SR runs the same way as PQ and is the same length.'],
  PR:['a + b','Go P to Q (a), then Q to R (b).'],QS:['b − a','Go Q to P (−a), then P to S (b).'],SQ:['a − b','Go S to P (−b), then P to Q (a).'],
  RP:['−a − b','Go R to Q (−b), then Q to P (−a).'],RS:['−a','RS is PQ backwards.'],RQ:['−b','RQ is PS backwards.']};
const bold=s=>s.replace(/[ab]/g,m=>bv(m));
function genVec(){
  const t=pick([1,1,2,2,3,3,4,4]);
  if(t===1){
    const l=R(3,15),w=R(2,10),h=R(2,10);
    const P={A:[l,0,0],B:[l,w,0],C:[0,w,0],D:[0,0,h],E:[l,0,h],G:[0,w,h]};
    const k=pick(Object.keys(P)),a=P[k];
    return {kind:'fields',fields:a.map(n=>({answer:n,tol:0})),calc:false,
      template:`<span class="tight">${M(`${k}(`)}{0}${M(',')}{1}${M(',')}{2}${M(')')}</span>`,
      prompt:`O is the origin. The edges of the cuboid run along the ${v('x')}, ${v('y')} and ${v('z')} axes. F is ${M(pt(l,w,h))}. Write down the coordinates of ${k}.`,
      diagram:cuboidSVG({axes:true,labels:['O','A','B','C','D','E','F','G'].map(x=>[x,x]),cap:`F${pt(l,w,h)}`}),
      hint:`F tells you the length (${v('x')}), depth (${v('y')}) and height (${v('z')}). Corners on the floor have ${v('z')} = 0. Corners on the front face have ${v('y')} = 0.`,
      working:[`F ${pt(l,w,h)} means the cuboid is ${l} along, ${w} back and ${h} up.`,`To reach ${k} from O you go ${a[0]} along ${v('x')}, ${a[1]} back along ${v('y')} and ${a[2]} up ${v('z')}.`,`So ${k} is ${M(pt(...a))}.`],
      answerText:M(k+pt(...a))};
  }
  if(t===2){
    const dim=pick([2,2,3]),mk=()=>Array.from({length:dim},()=>R(-7,8));
    const a=mk(),b=mk(),k=pick([1,2,3,4]),m=pick([1,-1,2,-2,3,-3]);
    const ka=a.map(x=>k*x),mb=b.map(x=>m*x),res=ka.map((x,i)=>x+mb[i]);
    const expr=`${k===1?'':k}${bv('a')} ${m<0?MINUS:'+'} ${Math.abs(m)===1?'':Math.abs(m)}${bv('b')}`;
    return {kind:'fields',fields:res.map(n=>({answer:n,tol:0})),calc:false,
      template:`<span class="colv">${res.map((_,i)=>`{${i}}`).join('')}</span>`,note:NOTE_NEG,
      prompt:`${M(bv('a')+' = '+colv(a))} and ${M(bv('b')+' = '+colv(b))}. Find ${M(expr)} in component form.`,
      hint:`Multiply every number in the vector first. Then add or subtract matching rows: top with top, and so on.`,
      working:[k===1?`${bv('a')} stays as ${M(colv(a))}`:`${M(k+bv('a'))} = ${M(colv(ka))} (every number times ${k})`,`${M((m<0?MINUS:'')+(Math.abs(m)===1?'':Math.abs(m))+bv('b'))} = ${M(colv(mb))}`,`Add each row: ${M(colv(ka.map((x,i)=>`${n_(x)} + ${mb[i]<0?'('+n_(mb[i])+')':mb[i]}`)))} = ${M(colv(res))}`],
      answerText:M(colv(res))};
  }
  if(t===3){
    const dim=pick([2,3]),mk=()=>Array.from({length:dim},()=>R(-9,9));
    const both=Math.random()<.4,a=mk(),b=mk(),u=both?a.map((x,i)=>x+b[i]):a;
    if(u.every(x=>x===0))return genVec();
    const mag=Math.sqrt(u.reduce((s,x)=>s+x*x,0)),sum=u.reduce((s,x)=>s+x*x,0);
    return {kind:'num',...dpAns(mag,1),calc:true,
      prompt:both?`${M(bv('p')+' = '+colv(a))} and ${M(bv('q')+' = '+colv(b))}. Calculate ${M('|'+bv('p')+' + '+bv('q')+'|')}. Give your answer to 1 decimal place.`
        :`Calculate the magnitude of ${M(bv('a')+' = '+colv(a))}. Give your answer to 1 decimal place.`,
      hint:`Magnitude means length. It's Pythagoras: square each number, add them, then square root.${both?' Add the vectors first.':''}`,
      working:[...(both?[`First add them: ${M(bv('p')+' + '+bv('q')+' = '+colv(u))}`]:[]),`Square each number: ${u.map(x=>`${x<0?'('+n_(x)+')':x}${sup(2)}`).join(' + ')} = ${u.map(x=>x*x).join(' + ')} = ${sum}`,`Square root: ${M(sq(sum))} = ${fmt(mag,4)}...`,`To 1 decimal place: ${fmt(rnd(mag,1),1)}`],
      answerText:fmt(rnd(mag,1),1)};
  }
  const key=pick(Object.keys(VEC_ROUTES)),[ans,why]=VEC_ROUTES[key];
  const q=mc(bold(ans),shuffle(['a','b','−a','−b','a + b','a − b','b − a','−a − b'].filter(x=>x!==ans)).map(bold));
  return Object.assign(q,{calc:false,
    prompt:`PQRS is a parallelogram. ${M(arw('PQ')+' = '+bv('a'))} and ${M(arw('PS')+' = '+bv('b'))}. Find ${M(arw(key))} in terms of ${bv('a')} and ${bv('b')}.`,
    diagram:paraSVG(),
    hint:`Find a route from ${key[0]} to ${key[1]} using only the sides you know. Going against an arrow makes it negative.`,
    working:[why,`So ${M(arw(key)+' = '+bold(ans))}`]});
}

/* ======================================================================
   2. Speed, Distance, Time (page 4)
   ====================================================================== */
const hm=mins=>{const h=Math.floor(mins/60),m=mins%60;return [h?plural(h,'hour'):'',m?plural(m,'minute'):''].filter(Boolean).join(' ');};
const MOVERS=[['A car','km','km/h'],['A train','km','km/h'],['A coach','miles','mph'],['A cyclist','km','km/h'],['A plane','km','km/h'],['A lorry','miles','mph']];
function genSDT(){
  const t=pick([1,2,3,3,4,4,5]);
  if(t===1){
    const h=pick([0,0,1,2,3]),m=pick([6,9,12,15,18,20,24,30,36,40,42,45,48,50,54]),d=h+m/60;
    return {kind:'num',...dpAns(d,2),tol:.006,calc:true,post:'hours',
      prompt:`Change ${hm(h*60+m)} into hours, as a decimal. Give your answer to 2 decimal places.`,
      hint:`There are 60 minutes in an hour, so divide the minutes by 60.`,
      working:[`${m} ÷ 60 = ${fmt(m/60,4)}`,h?`Add the ${plural(h,'hour')}: ${h} + ${fmt(m/60,4)} = ${fmt(d,4)}`:`That's already the answer.`,`To 2 decimal places: ${fmt(rnd(d,2),2)} hours`],answerText:fmt(rnd(d,2),2)+' hours'};
  }
  if(t===2){
    const h=R(0,5),m=3*R(1,19),d=h+m/60;
    return {kind:'fields',fields:[{answer:h,tol:0},{answer:m,tol:0}],calc:true,template:`{0} hours {1} minutes`,
      prompt:`Change ${fmt(d)} hours into hours and minutes.`,
      hint:`The whole number is the hours. Multiply the decimal part by 60 to get the minutes.`,
      working:[`Whole hours: ${h}`,`Decimal part: 0${fmt(d-h).replace(/^0/,'')} × 60 = ${m} minutes`,`So ${h} hours ${m} minutes`],answerText:`${h} hours ${m} minutes`};
  }
  const [who,du,su]=pick(MOVERS);
  let T;do{T=6*R(5,50);}while(T%60===0);const Th=T/60;
  if(t===3){
    const s=R(12,95),D=fix(s*Th);
    return {kind:'num',answer:s,tol:.05,calc:true,post:su,
      prompt:`${who} travels ${fmt(D)} ${du} in ${hm(T)}. Calculate its average speed.`,
      hint:`Speed = distance ÷ time. Change the time into decimal hours first.`,
      working:[`Time: ${hm(T)} = ${fmt(Th)} hours`,`Speed = ${fmt(D)} ÷ ${fmt(Th)}`,`= ${s} ${su}`],answerText:`${s} ${su}`};
  }
  if(t===4){
    const s=10*R(3,9),D=fix(s*Th),h=Math.floor(T/60),m=T%60;
    return {kind:'fields',fields:[{answer:h,tol:0},{answer:m,tol:0}],calc:true,template:`{0} hours {1} minutes`,
      prompt:`${who} travels ${fmt(D)} ${du} at an average speed of ${s} ${su}. How long does the journey take? Give your answer in hours and minutes.`,
      hint:`Time = distance ÷ speed. Your answer comes out in decimal hours, so change the decimal part into minutes.`,
      working:[`Time = ${fmt(D)} ÷ ${s} = ${fmt(Th)} hours`,`0${fmt(Th-h).replace(/^0/,'')} × 60 = ${m} minutes`,`So ${h} hours ${m} minutes`],answerText:`${h} hours ${m} minutes`};
  }
  const s=R(12,95),D=fix(s*Th);
  return {kind:'num',answer:D,tol:.05,calc:true,post:du,
    prompt:`${who} travels at an average speed of ${s} ${su} for ${hm(T)}. How far does it travel?`,
    hint:`Distance = speed × time. Change the time into decimal hours first.`,
    working:[`Time: ${hm(T)} = ${fmt(Th)} hours`,`Distance = ${s} × ${fmt(Th)}`,`= ${fmt(D)} ${du}`],answerText:`${fmt(D)} ${du}`};
}

/* ======================================================================
   3. Scientific Notation (page 5)
   ====================================================================== */
const sciShow=(m,e)=>M(`${fmt(m)} × 10${sup(n_(e))}`);
const sciT=`{0} ${M('× 10')}<span class="pow">{1}</span>`;
function toSci(x){const e=Math.floor(Math.log10(Math.abs(x)));let m=fix(x/Math.pow(10,e));if(Math.abs(m)>=10){m=fix(m/10);return [m,e+1];}return [m,e];}
function sciQ(x,calc,prompt,hint,pre,sf){
  const [m0,e]=toSci(x),m=sf?sig(m0,sf):m0;
  return {kind:'fields',fields:[{answer:m,tol:sf?Math.pow(10,1-sf)+1e-9:1e-9},{answer:e,tol:0}],template:sciT,calc,prompt,hint,
    note:`Type the front number in the first box and the power in the small box. ${NOTE_NEG}`,
    working:[...pre,`In scientific notation: ${sciShow(m,e)}`],answerText:sciShow(m,e)};
}
function genSci(){
  const t=pick([1,1,2,3,3,4,5,5]);
  if(t===1){
    const big=Math.random()<.5,m=pick([R(11,99)/10,R(101,999)/100]),e=big?R(3,8):-R(2,6),x=fix(m*Math.pow(10,e));
    return sciQ(x,true,`Write ${M(fmt(x))} in scientific notation.`,
      `Put the decimal point after the first digit that isn't zero. Count how many places it moved. ${big?'Big number, so the power is positive.':'Smaller than 1, so the power is negative.'}`,
      [`Move the point to get a number between 1 and 10: ${fmt(m)}`,`It moved ${Math.abs(e)} places, ${big?'so the power is '+e:'and the number is smaller than 1, so the power is '+n_(e)}`]);
  }
  if(t===2){
    const m=pick([R(11,99)/10,R(101,999)/100]),e=pick([R(3,7),-R(2,5)]),x=fix(m*Math.pow(10,e));
    return {kind:'num',answer:x,rel:true,calc:true,
      prompt:`Write ${sciShow(m,e)} as an ordinary number.`,
      hint:e>0?`A positive power means a big number. Move the decimal point ${e} places to the right.`:`A negative power means a number smaller than 1. Move the decimal point ${-e} places to the left.`,
      working:[`Move the decimal point ${Math.abs(e)} places to the ${e>0?'right':'left'}`,`${fmt(m)} becomes ${fmt(x)}`],answerText:fmt(x)};
  }
  if(t===3){
    const a=R(2,9),b=R(2,9),p=R(-8,9),q=R(-8,9),c=a*b,x=c*Math.pow(10,p+q);
    const [m,e]=toSci(c);
    return sciQ(x,false,`Without a calculator, work out ${M(`(${a} × 10${sup(n_(p))}) × (${b} × 10${sup(n_(q))})`)}. Give your answer in scientific notation.`,
      `Multiply the front numbers. Add the powers. If the front number ends up 10 or more, fix it.`,
      [`Front numbers: ${a} × ${b} = ${c}`,`Powers: ${n_(p)} + ${q<0?'('+n_(q)+')':q} = ${n_(p+q)}`,c>=10?`${c} × 10${sup(n_(p+q))} isn't finished. ${c} = ${fmt(m)} × 10, so add 1 to the power.`:`${c} is already between 1 and 10.`]);
  }
  if(t===4){
    const div=Math.random()<.4,a=R(101,999)/100,b=R(101,999)/100,p=R(-12,12),q=R(-12,12);
    const x=div?(a/b)*Math.pow(10,p-q):a*b*Math.pow(10,p+q);
    return sciQ(x,true,`Calculate ${M(`(${fmt(a)} × 10${sup(n_(p))}) ${div?'÷':'×'} (${fmt(b)} × 10${sup(n_(q))})`)}. Give your answer in scientific notation, correct to 3 significant figures.`,
      `Use the ×10ˣ (or EXP) button on your calculator for each number. Then round the front number to 3 figures.`,
      [`Front numbers: ${fmt(a)} ${div?'÷':'×'} ${fmt(b)} = ${fmt(div?a/b:a*b,5)}`,`Powers: ${n_(p)} ${div?MINUS:'+'} ${q<0?'('+n_(q)+')':q} = ${n_(div?p-q:p+q)}`,`Adjust so the front number is between 1 and 10, then round to 3 significant figures.`],3);
  }
  const k=pick([1,2,3]);
  if(k===1){const m=R(101,999)/100,e=-R(3,6),f=R(21,89)/10,w=m*Math.pow(10,e),x=w*(1+f);
    return sciQ(x,true,`An insect weighs ${sciShow(m,e)} grams. One day it eats ${fmt(f)} times its own weight in food. How much does it weigh after eating? Give your answer in scientific notation, correct to 3 significant figures.`,
      `After eating, it weighs its own weight plus the food. That's ${fmt(1+f)} times its weight.`,[`Food eaten: ${fmt(f)} × its weight`,`New weight = weight × (1 + ${fmt(f)}) = ${sciShow(m,e)} × ${fmt(1+f)}`],3);}
  if(k===2){const m=R(101,999)/100,e=R(3,5),h=R(2,6),x=m*Math.pow(10,e)*3600*h;
    return sciQ(x,true,`An asteroid travels at ${sciShow(m,e)} metres per second. How far does it travel in ${h} hours, in metres? Give your answer in scientific notation, correct to 3 significant figures.`,
      `Change ${h} hours into seconds first. There are 3600 seconds in an hour.`,[`${h} hours = ${h} × 3600 = ${h*3600} seconds`,`Distance = ${sciShow(m,e)} × ${h*3600}`],3);}
  const m=R(1001,9999)/1000,e=R(7,9),f=R(3,30),x=m*Math.pow(10,e)*f;
  return sciQ(x,true,`A planet is ${sciShow(m,e)} kilometres from the Sun. Another planet is ${f} times further away. How far is that planet from the Sun? Give your answer in scientific notation, correct to 3 significant figures.`,
    `"${f} times further" means multiply by ${f}.`,[`${sciShow(m,e)} × ${f} = ${fmt(m*f,5)} × 10${sup(e)}`],3);
}

/* ======================================================================
   4. Integers (page 6)
   ====================================================================== */
function genInt(){
  const t=pick([1,2,2,2,3,3,4,4,5]);
  if(t===1){
    const set=new Set();while(set.size<5){const n=R(-20,20);if(n!==0)set.add(n);}
    const nums=[...set];if(nums.filter(n=>n<0).length<2)return genInt();
    const asc=nums.slice().sort((a,b)=>a-b),show=a=>a.map(n_).join(', ');
    const byAbs=nums.slice().sort((a,b)=>Math.abs(a)-Math.abs(b)||a-b);
    const negWrong=[...asc.filter(n=>n<0).sort((a,b)=>b-a),...asc.filter(n=>n>0)];
    const q=mc(show(asc),[show(negWrong),show(byAbs),show(asc.slice().reverse()),show(shuffle(nums)),show(shuffle(nums))]);
    if(q.options.length<4)return genInt();
    return Object.assign(q,{calc:false,prompt:`Put these numbers in order, from smallest to largest: ${M(show(shuffle(nums)))}`,
      hint:`Picture a number line. The further left, the smaller. A big negative number like ${n_(asc[0])} is further left than a small one.`,
      working:[`Negatives first, the biggest-looking negative is the smallest: ${asc.filter(n=>n<0).map(n_).join(', ')}`,`Then the positives: ${asc.filter(n=>n>0).join(', ')}`,`So ${show(asc)}`]});
  }
  if(t===2){
    const a=R(2,40),b=R(2,40);
    const forms=[
      [`${MINUS}${a} ${MINUS} ${b}`,-a-b,`Start at ${n_(-a)} and move ${b} further down.`],
      [`${MINUS}${a} + (${MINUS}${b})`,-a-b,`+ (${MINUS}${b}) is the same as ${MINUS} ${b}. So ${n_(-a)} ${MINUS} ${b}.`],
      [`${a} ${MINUS} (${MINUS}${b})`,a+b,`Two minus signs together make a plus. So ${a} + ${b}.`],
      [`${Math.min(a,b)} ${MINUS} ${Math.max(a,b)+1}`,Math.min(a,b)-Math.max(a,b)-1,`Taking away more than you have takes you below zero.`],
      [`${MINUS}${a} ${MINUS} (${MINUS}${b})`,-a+b,`Two minus signs together make a plus. So ${n_(-a)} + ${b}.`],
      [`${a} + (${MINUS}${b})`,a-b,`+ (${MINUS}${b}) is the same as ${MINUS} ${b}. So ${a} ${MINUS} ${b}.`],
      [`${MINUS}${a} + ${b}`,b-a,`Start at ${n_(-a)} and move ${b} up.`]];
    const [e,ans,w]=pick(forms);
    return {kind:'num',answer:ans,tol:0,calc:false,im:'text',note:NOTE_NEG,prompt:`Calculate ${M(e)}`,
      hint:`Sort out any double signs first. Same signs side by side make plus. Different signs make minus.`,working:[w,`= ${n_(ans)}`],answerText:n_(ans)};
  }
  if(t===3||t===4){
    const x=R(2,12),y=R(2,12),sa=pick([1,-1]),sb=pick([1,-1]);
    const div=t===4,a=div?sa*x*y:sa*x,b=sb*(div?x:y),ans=div?a/b:a*b;
    const show=n=>n<0?`(${n_(n)})`:String(n);
    return {kind:'num',answer:ans,tol:0,calc:false,im:'text',note:NOTE_NEG,prompt:`Calculate ${M(`${show(a)} ${div?'÷':'×'} ${show(b)}`)}`,
      hint:`Do the numbers first, then the sign. Same signs give a positive answer. Different signs give a negative.`,
      working:[`Numbers: ${Math.abs(a)} ${div?'÷':'×'} ${Math.abs(b)} = ${Math.abs(ans)}`,`Signs: ${(a<0)===(b<0)?'same, so positive':'different, so negative'}`,`Answer: ${n_(ans)}`],answerText:n_(ans)};
  }
  const start=-R(1,15),up=Math.random()<.6,ch=R(3,20),end=up?start+ch:start-ch,place=pick(['Aviemore','Braemar','Oslo','Moscow','a ski resort']);
  return {kind:'num',answer:end,tol:0,calc:false,im:'text',post:'°C',note:NOTE_NEG,
    prompt:`At 6am the temperature in ${place} was ${n_(start)}°C. By midday it had ${up?'risen':'fallen'} by ${ch} degrees. What was the temperature at midday?`,
    hint:`Picture a thermometer. ${up?'Rising means move up.':'Falling means move further down.'}`,
    working:[`${n_(start)} ${up?'+':MINUS} ${ch} = ${n_(end)}`,`So ${n_(end)}°C`],answerText:n_(end)+'°C'};
}

/* ======================================================================
   5. Percentages (page 7)
   ====================================================================== */
function genPct(){
  const t=pick([1,1,2,3,4,4,5,5]);
  if(t===1){
    if(Math.random()<.5){
      const P=pick([1500,2000,2500,3000,4000,5000,8000]),r=pick([2,2.5,3,3.5,4,4.5,5]),n=R(2,6),mult=1+r/100,x=P*Math.pow(mult,n);
      return {kind:'num',...dpAns(x,2),tol:.006,calc:true,pre:'£',
        prompt:`A bank offers an interest rate of ${r}% per annum on a savings account. If £${fmt(P)} is invested, how much will it be worth after ${n} years? Give your answer to the nearest penny.`,
        hint:`"Per annum" means each year. Each year the money is multiplied by ${fmt(mult)}.`,
        working:[`Up ${r}%, so the multiplier is ${fmt(mult)}`,`${fmt(P)} × ${fmt(mult)}${sup(n)} = ${fmt(x,4)}`,`To the nearest penny: ${money(rnd(x,2))}`],answerText:money(rnd(x,2))};
    }
    const P=R(120,260)*1000,r=R(3,12),n=R(2,5),mult=1+r/100,x=P*Math.pow(mult,n);
    return {kind:'num',answer:Math.round(x),tol:.51,calc:true,pre:'£',
      prompt:`A house appreciates in value by ${r}% each year. It was bought for £${fmt(P)}. How much will it be worth after ${n} years? Give your answer to the nearest pound.`,
      hint:`"Appreciates" means goes up in value. Use a multiplier of ${fmt(mult)} for each year.`,
      working:[`Multiplier: 1 + ${fmt(r/100)} = ${fmt(mult)}`,`${fmt(P)} × ${fmt(mult)}${sup(n)} = ${fmt(x,2)}`,`To the nearest pound: £${fmt(Math.round(x))}`],answerText:'£'+fmt(Math.round(x))};
  }
  if(t===2){
    const P=R(10,60)*1000,r=R(5,25),n=R(3,8),mult=1-r/100,x=P*Math.pow(mult,n);
    return {kind:'num',answer:Math.round(x),tol:.51,calc:true,pre:'£',
      prompt:`Shares in a company are losing value at a steady rate of ${r}% per month. Zoe has shares worth £${fmt(P)}. How much will they be worth in ${n} months' time? Give your answer to the nearest pound.`,
      hint:`Losing ${r}% means you keep ${100-r}%. So multiply by ${fmt(mult)} for each month.`,
      working:[`Down ${r}%, so the multiplier is ${fmt(mult)}`,`${fmt(P)} × ${fmt(mult)}${sup(n)} = ${fmt(x,2)}`,`To the nearest pound: £${fmt(Math.round(x))}`],answerText:'£'+fmt(Math.round(x))};
  }
  if(t===3){
    const r=R(5,15),n=R(3,6),mult=1-r/100,x=100*Math.pow(mult,n);
    return {kind:'num',...dpAns(x,1),tol:.06,calc:true,post:'%',
      prompt:`A city plans to cut its pollution by ${r}% each year for the next ${n} years. What percentage of today's pollution will be left in ${n} years' time? Give your answer to 1 decimal place.`,
      hint:`Start with 100%. Each year you keep ${100-r}% of what's left, so multiply by ${fmt(mult)}.`,
      working:[`Multiplier: ${fmt(mult)}`,`100 × ${fmt(mult)}${sup(n)} = ${fmt(x,3)}`,`To 1 decimal place: ${fmt(rnd(x,1),1)}%`,`It's not ${100-r*n}%. Each cut is taken from a smaller amount.`],answerText:fmt(rnd(x,1),1)+'%'};
  }
  if(t===4){
    const k=pick([1,2,3]);
    if(k===1){const before=R(40,900),inc=fix(before*1.2);
      return {kind:'num',answer:before,tol:.006,calc:true,pre:'£',
        prompt:`A vacuum cleaner costs ${money(inc)} including VAT at 20%. How much did it cost before the VAT was added?`,
        hint:`The price with VAT is 120% of the original. So divide by 1.2. Don't take 20% off.`,
        working:[`With VAT = 120% of the original`,`${fmt(inc,2)} ÷ 1.2 = ${fmt(before,2)}`,`Check: ${fmt(before,2)} × 1.2 = ${fmt(inc,2)}`],answerText:money(before)};}
    if(k===2){const r=pick([5,8,12,15,20,25]),orig=R(80,300)*1000,now=fix(orig*(1+r/100));
      return {kind:'num',answer:orig,tol:.51,calc:true,pre:'£',
        prompt:`A house increased in value by ${r}% to £${fmt(now)}. How much was it worth before the increase?`,
        hint:`£${fmt(now)} is ${100+r}% of the old value. Divide by ${fmt(1+r/100)}.`,
        working:[`New value = ${100+r}% of the old value, so the multiplier is ${fmt(1+r/100)}`,`${fmt(now)} ÷ ${fmt(1+r/100)} = ${fmt(orig)}`],answerText:'£'+fmt(orig)};}
    const p=pick([60,75,80,85,90,95]),total=100*R(20,150),sold=total*p/100;
    return {kind:'num',answer:total-sold,tol:0,calc:true,
      prompt:`A theatre has sold ${fmt(sold)} tickets for a show. This is ${p}% of all the tickets. How many tickets are still available?`,
      hint:`${fmt(sold)} is ${p}% of the total. Divide by ${fmt(p/100)} to find the total first.`,
      working:[`Total = ${fmt(sold)} ÷ ${fmt(p/100)} = ${fmt(total)}`,`Still available = ${fmt(total)} ${MINUS} ${fmt(sold)} = ${fmt(total-sold)}`],answerText:fmt(total-sold)};
  }
  const k=pick([1,2,3]);
  if(k===1){const p=pick([10,20,25,30,40,50]),orig=10*R(3,15),sale=orig*(100-p)/100,item=pick(['pair of trainers','bag','jacket','games console','pair of headphones']);
    return {kind:'num',answer:orig,tol:0,calc:false,pre:'£',
      prompt:`A ${item} costs £${fmt(sale)} in a ${p}% off sale. What did it cost before the sale?`,
      hint:`After ${p}% off you pay ${100-p}%. So £${fmt(sale)} is ${100-p}% of the old price. Find 1% or 10% first.`,
      working:[`£${fmt(sale)} is ${100-p}% of the old price`,`${p%10===0?`10% = ${fmt(sale)} ÷ ${(100-p)/10} = ${fmt(orig/10)}`:`1% = ${fmt(sale)} ÷ ${100-p} = ${fmt(orig/100)}`}`,`100% = £${fmt(orig)}`],answerText:'£'+fmt(orig)};}
  if(k===2){const bill=10*R(4,20),tot=fix(bill*1.1);
    return {kind:'num',answer:fix(bill*0.1),tol:.001,calc:false,pre:'£',
      prompt:`A restaurant bill came to £${fmt(tot)} including a 10% tip. How much was the tip?`,
      hint:`£${fmt(tot)} is 110% of the bill. Find 10% of the bill first.`,
      working:[`£${fmt(tot)} = 110% of the bill`,`10% = ${fmt(tot)} ÷ 11 = ${fmt(bill*.1)}`,`The tip was 10%, so £${fmt(bill*.1)}`],answerText:'£'+fmt(bill*.1)};}
  const p=pick([10,20,25,30,50]),orig=100*R(10,60),now=orig*(100+p)/100;
  return {kind:'num',answer:orig,tol:0,calc:false,pre:'£',
    prompt:`An investment increased by ${p}% to £${fmt(now)}. How much was the starting investment?`,
    hint:`£${fmt(now)} is ${100+p}% of the start. Find 10% or 1% first.`,
    working:[`£${fmt(now)} = ${100+p}% of the start`,`${p%10===0?`10% = ${fmt(now)} ÷ ${(100+p)/10} = ${fmt(orig/10)}`:`1% = ${fmt(now)} ÷ ${100+p} = ${fmt(orig/100)}`}`,`100% = £${fmt(orig)}`],answerText:'£'+fmt(orig)};
}

/* ======================================================================
   6. Tolerance
   ====================================================================== */
const TOL_UNITS=['cm','ml','mm','kg','g','litres','m'];
const limitsT=`Lower limit {0} &nbsp; Upper limit {1}`;
function genTol(){
  const t=pick([1,1,2,2,3,4,5,6]);
  if(t===1){
    const u=pick(TOL_UNITS),dec=pick([0,1,2]),a=dec?R(50,999)/Math.pow(10,dec):R(10,250),b=dec?R(1,Math.max(1,Math.floor(a*Math.pow(10,dec)/10)))/Math.pow(10,dec):R(1,12);
    const lo=fix(a-b),hi=fix(a+b);
    return {kind:'fields',fields:[{answer:lo,tol:1e-9},{answer:hi,tol:1e-9}],template:limitsT,calc:true,
      prompt:`Calculate the upper and lower limits of ${M(`(${fmt(a)} ± ${fmt(b)})`)} ${u}.`,
      hint:`Lower limit: take ${fmt(b)} away. Upper limit: add ${fmt(b)}.`,
      working:[`Lower: ${fmt(a)} ${MINUS} ${fmt(b)} = ${fmt(lo)} ${u}`,`Upper: ${fmt(a)} + ${fmt(b)} = ${fmt(hi)} ${u}`],answerText:`${fmt(lo)} to ${fmt(hi)} ${u}`};
  }
  if(t===2){
    const u=pick(['cm','ml','mm','kg','°C']),a=pick([R(10,100),R(2,20)*5]),p=pick([2,2.4,3.4,5,10,20,25,0.2]),b=fix(a*p/100),lo=fix(a-b),hi=fix(a+b);
    return {kind:'fields',fields:[{answer:lo,tol:1e-6},{answer:hi,tol:1e-6}],template:limitsT,calc:true,
      prompt:`Calculate the upper and lower limits of ${M(`${a} ${u} ± ${fmt(p)}%`)}.`,
      hint:`Work out ${fmt(p)}% of ${a} first. That's the tolerance.`,
      working:[`${fmt(p)}% of ${a} = ${fmt(p/100)} × ${a} = ${fmt(b)}`,`Lower: ${a} ${MINUS} ${fmt(b)} = ${fmt(lo)}`,`Upper: ${a} + ${fmt(b)} = ${fmt(hi)}`],answerText:`${fmt(lo)} to ${fmt(hi)} ${u}`};
  }
  if(t===3){
    const u=pick(['litres','mph','cm','kg','g']),dec=pick([0,0,1]),a=dec?R(50,800)/10:R(10,150),b=dec?R(1,40)/10:R(1,10),lo=fix(a-b),hi=fix(a+b);
    return {kind:'fields',fields:[{answer:a,tol:1e-9},{answer:b,tol:1e-9}],template:M('(')+'{0}'+M(' ± ')+'{1}'+M(')')+' '+u,calc:true,
      prompt:`A measurement has a lower limit of ${fmt(lo)} ${u} and an upper limit of ${fmt(hi)} ${u}. Write it in tolerance notation.`,
      hint:`The target is exactly halfway between the limits. The tolerance is half the gap.`,
      working:[`Target: (${fmt(lo)} + ${fmt(hi)}) ÷ 2 = ${fmt(a)}`,`Gap: ${fmt(hi)} ${MINUS} ${fmt(lo)} = ${fmt(2*b)}, half of that is ${fmt(b)}`,`So (${fmt(a)} ± ${fmt(b)}) ${u}`],answerText:`(${fmt(a)} ± ${fmt(b)}) ${u}`};
  }
  if(t===4){
    const u=pick(['litres','cm','kg','mph']),a=R(30,500)/10,b=R(2,40)/10;
    if(b>=a/2)return genTol();
    const lo=fix(a-b),hi=fix(a+b),p=b/a*100;
    return {kind:'fields',fields:[{answer:a,tol:1e-9},{answer:rnd(p,1),tol:.06}],template:'{0} '+u+M(' ± ')+'{1} %',calc:true,
      prompt:`A measurement has a lower limit of ${fmt(lo)} ${u} and an upper limit of ${fmt(hi)} ${u}. Write it in tolerance notation, with the tolerance as a percentage to 1 decimal place.`,
      hint:`Find the target (halfway) and the tolerance (half the gap). Then the tolerance as a percentage of the target.`,
      working:[`Target: ${fmt(a)}. Tolerance: ${fmt(b)}`,`${fmt(b)} ÷ ${fmt(a)} × 100 = ${fmt(p,3)}%`,`So ${fmt(a)} ${u} ± ${fmt(rnd(p,1),1)}%`],answerText:`${fmt(a)} ${u} ± ${fmt(rnd(p,1),1)}%`};
  }
  if(t===5){
    const T=pick([180,200,220,250]),tl=pick([10,12,15,20]),bad=R(1,4),vals=[];
    for(let i=0;i<10-bad;i++)vals.push(R(T-tl,T+tl));
    for(let i=0;i<bad;i++)vals.push(Math.random()<.5?T-tl-R(1,10):T+tl+R(1,10));
    const sample=shuffle(vals),badList=sample.filter(x=>x<T-tl||x>T+tl);
    return {kind:'num',answer:bad*10,tol:0,calc:true,post:'%',
      prompt:`A sweet factory makes chocolate eggs that should weigh (${T} ± ${tl}) grams. Quality control weighs a sample of 10 eggs: ${M(sample.join(', '))}. What percentage of the sample did NOT pass quality control?`,
      hint:`Work out the limits first. Anything below ${T-tl} or above ${T+tl} fails. A weight exactly on a limit passes.`,
      working:[`Limits: ${T-tl} g to ${T+tl} g`,`Fails: ${badList.join(', ')}. That's ${bad} out of 10`,`${bad} ÷ 10 × 100 = ${bad*10}%`],answerText:bad*10+'%'};
  }
  const s=pick([150,200,250,300]),e=R(2,15),p=R(4,8),q=R(4,8),lo=s-e,hi=s+e,mn=p*lo*q*lo/1e6,mx=p*hi*q*hi/1e6;
  return {kind:'fields',fields:[dpAns(mn,2),dpAns(mx,2)].map(o=>({answer:o.answer,tol:.006})),template:`Minimum {0} m² &nbsp; Maximum {1} m²`,calc:true,
    prompt:`Brandon is tiling a wall with handmade square tiles that measure (${s} ± ${e}) mm along each side. He lays them ${p} tiles across and ${q} tiles up, with no gaps. Calculate the minimum and maximum area the tiles could cover, in m² to 2 decimal places.`,
    hint:`Smallest tile is ${lo} mm, biggest is ${hi} mm. Work out the width and height of the whole wall in each case. 1 m = 1000 mm.`,
    working:[`Smallest tiles: ${p} × ${lo} = ${p*lo} mm across, ${q} × ${lo} = ${q*lo} mm up`,`Minimum area: ${fmt(p*lo/1000)} m × ${fmt(q*lo/1000)} m = ${fmt(mn,4)} m²`,`Biggest tiles: ${p*hi} mm by ${q*hi} mm`,`Maximum area: ${fmt(p*hi/1000)} m × ${fmt(q*hi/1000)} m = ${fmt(mx,4)} m²`,`To 2 decimal places: ${fmt(rnd(mn,2),2)} m² and ${fmt(rnd(mx,2),2)} m²`],answerText:`${fmt(rnd(mn,2),2)} m² and ${fmt(rnd(mx,2),2)} m²`};
}

/* ======================================================================
   7. Pythagoras
   ====================================================================== */
const sideV=()=>pick([R(30,250)/10,R(4,40)]);
function genPyth(){
  const t=pick([1,1,2,2,3,4,5]);
  if(t===1){
    const a=sideV(),b=sideV(),c=Math.hypot(a,b),u=pick(['cm','m','mm']);
    return {kind:'num',...dpAns(c,1),tol:.06,calc:true,post:u,
      prompt:`Use Pythagoras' Theorem to calculate the length of the side marked ${v('x')}. Give your answer to 1 decimal place.`,
      diagram:rtriSVG(`${fmt(a)} ${u}`,`${fmt(b)} ${u}`,v('x')),
      hint:`${v('x')} is opposite the right angle, so it's the longest side. Square the other two, add, then square root.`,
      working:[`${v('x')}${sup(2)} = ${fmt(a)}${sup(2)} + ${fmt(b)}${sup(2)} = ${fmt(a*a)} + ${fmt(b*b)} = ${fmt(a*a+b*b)}`,`${v('x')} = ${M(sq(fmt(a*a+b*b)))} = ${fmt(c,4)}...`,`To 1 decimal place: ${fmt(rnd(c,1),1)} ${u}`],answerText:`${fmt(rnd(c,1),1)} ${u}`};
  }
  if(t===2){
    const a=sideV(),c=fix(a+pick([R(15,200)/10,R(3,30)])),b=Math.sqrt(c*c-a*a),u=pick(['cm','m','mm']),top=Math.random()<.5;
    return {kind:'num',...dpAns(b,1),tol:.06,calc:true,post:u,
      prompt:`Use Pythagoras' Theorem to calculate the length of the side marked ${v('x')}. Give your answer to 1 decimal place.`,
      diagram:top?rtriSVG(v('x'),`${fmt(a)} ${u}`,`${fmt(c)} ${u}`):rtriSVG(`${fmt(a)} ${u}`,v('x'),`${fmt(c)} ${u}`),
      hint:`The hypotenuse (${fmt(c)}) is given, so ${v('x')} is a shorter side. Square both, subtract, then square root.`,
      working:[`${v('x')}${sup(2)} = ${fmt(c)}${sup(2)} ${MINUS} ${fmt(a)}${sup(2)} = ${fmt(c*c)} ${MINUS} ${fmt(a*a)} = ${fmt(c*c-a*a)}`,`${v('x')} = ${M(sq(fmt(c*c-a*a)))} = ${fmt(b,4)}...`,`To 1 decimal place: ${fmt(rnd(b,1),1)} ${u}`],answerText:`${fmt(rnd(b,1),1)} ${u}`};
  }
  if(t===3){
    const [p,q,r]=pick([[3,4,5],[5,12,13],[8,15,17],[7,24,25],[20,21,29],[9,40,41]]),k=pick([1,1.1,1.5,2,2.5,0.5,1.2]);
    const right=Math.random()<.5,a=fix(p*k),b=fix(q*k),c=right?fix(r*k):fix(r*k+pick([-1,1])*pick([.1,.2,.3,.5,1]));
    const s2=fix(a*a+b*b),c2=fix(c*c);
    const yes='Yes. The two shorter sides squared add up to the longest side squared.',no='No. The two shorter sides squared don\'t add up to the longest side squared.',cant='You can\'t tell without measuring the angle.';
    const q2=mc(right?yes:no,[right?no:yes,cant]);
    q2.answerText=right?yes:no;
    return Object.assign(q2,{calc:true,prompt:`A triangle has sides of ${fmt(a)} cm, ${fmt(b)} cm and ${fmt(c)} cm. Is it right-angled?`,
      hint:`Use the converse of Pythagoras. Square the two shorter sides and add. Compare with the longest side squared.`,
      working:[`Shorter sides: ${fmt(a)}${sup(2)} + ${fmt(b)}${sup(2)} = ${fmt(a*a)} + ${fmt(b*b)} = ${fmt(s2)}`,`Longest side: ${fmt(c)}${sup(2)} = ${fmt(c2)}`,right?`They're equal, so it IS right-angled.`:`${fmt(s2)} isn't ${fmt(c2)}, so it is NOT right-angled.`]});
  }
  if(t===4){
    let x1,y1,x2,y2;do{x1=R(-12,12);y1=R(-12,12);x2=R(-12,12);y2=R(-12,12);}while(x1===x2||y1===y2);
    const dx=x2-x1,dy=y2-y1,d=Math.hypot(dx,dy);
    return {kind:'num',...dpAns(d,1),tol:.06,calc:true,
      prompt:`Calculate the distance between the points ${M(pt(x1,y1))} and ${M(pt(x2,y2))}. Give your answer to 1 decimal place.`,
      hint:`Draw a right-angled triangle between the points. How far across? How far up or down? Those are the shorter sides.`,
      working:[`Across: ${n_(x2)} ${MINUS} ${x1<0?'('+n_(x1)+')':x1} = ${Math.abs(dx)}. Up or down: ${n_(y2)} ${MINUS} ${y1<0?'('+n_(y1)+')':y1} = ${n_(dy)}, so ${Math.abs(dy)}`,`Distance${sup(2)} = ${Math.abs(dx)}${sup(2)} + ${Math.abs(dy)}${sup(2)} = ${dx*dx+dy*dy}`,`Distance = ${M(sq(dx*dx+dy*dy))} = ${fmt(rnd(d,1),1)}`],answerText:fmt(rnd(d,1),1)};
  }
  const l=R(10,60),w=R(5,40),h=R(5,40),fl=l*l+w*w,d=Math.sqrt(fl+h*h);
  return {kind:'num',...dpAns(d,1),tol:.06,calc:true,post:'cm',
    prompt:`The cuboid measures ${l} cm by ${w} cm by ${h} cm. Calculate the length of the diagonal AB. Give your answer to 1 decimal place.`,
    diagram:cuboidSVG({diag:true,labels:[['O','A'],['F','B']],dims:[`${l} cm`,`${w} cm`,`${h} cm`]}),
    hint:`Do it in two steps. First find the diagonal across the floor. Then use that and the height to find AB.`,
    working:[`Floor diagonal${sup(2)} = ${l}${sup(2)} + ${w}${sup(2)} = ${fl}`,`AB${sup(2)} = floor diagonal${sup(2)} + ${h}${sup(2)} = ${fl} + ${h*h} = ${fl+h*h}`,`AB = ${M(sq(fl+h*h))} = ${fmt(rnd(d,1),1)} cm`],answerText:`${fmt(rnd(d,1),1)} cm`};
}

/* ---------- 3.14 or the π button ----------
   Lots of pupils use 3.14 instead of the π button, which can change the last digit.
   P is the value of π the circle and volume questions use. withPi314 builds each question
   twice from the same random numbers, once with π and once with 3.14, and accepts either answer. */
let P=Math.PI;
function withPi314(gen){
  return ()=>{
    const orig=Math.random,seq=[];let q,q2,i=0;
    try{Math.random=()=>{const r=orig();seq.push(r);return r;};P=Math.PI;q=gen();}finally{Math.random=orig;}
    try{Math.random=()=>i<seq.length?seq[i++]:orig();P=3.14;q2=gen();}finally{Math.random=orig;P=Math.PI;}
    if(q.kind==='num'&&q2.kind==='num'&&Math.abs(q2.answer-q.answer)>(q.tol||0)+1e-9){
      q.alt=[{answer:q2.answer,tol:q2.tol,note:`You used 3.14 for ${PI}, so your answer is slightly different. That still counts. The ${PI} button gives ${q.answerText}, which is more accurate.`}];
      q.answerText+=` (or ${q2.answerText} using 3.14)`;
    }
    return q;
  };
}

/* ======================================================================
   8. The Circle 1
   ====================================================================== */
const sf3=x=>fmt(sig(x,3));
function genCirc(){
  const t=pick([1,1,2,2,3,4,4,5,5]),u=pick(['cm','m','mm']);
  if(t===1||t===2){
    const useD=Math.random()<.5,val=pick([R(3,40),R(25,250)/10]),r=useD?val/2:val,area=t===2;
    const x=area?P*r*r:2*P*r;
    return {kind:'num',...sfAns(x,3),calc:true,post:area?u+'²':u,
      prompt:`A circle has a ${useD?'diameter':'radius'} of ${fmt(val)} ${u}. Calculate its ${area?'area':'circumference'}. Give your answer to 3 significant figures.`,
      diagram:circleSVG(useD?'d':'r',`${fmt(val)} ${u}`),
      hint:area?`Area = ${PI} × radius × radius.${useD?' Halve the diameter first.':''}`:`Circumference = ${PI} × diameter.${useD?'':' Double the radius first.'}`,
      working:area?[...(useD?[`Radius = ${fmt(val)} ÷ 2 = ${fmt(r)}`]:[]),`A = ${PI} × ${fmt(r)}${sup(2)} = ${fmt(x,4)}...`,`To 3 significant figures: ${sf3(x)} ${u}²`]
        :[...(useD?[]:[`Diameter = 2 × ${fmt(r)} = ${fmt(2*r)}`]),`C = ${PI} × ${fmt(2*r)} = ${fmt(x,4)}...`,`To 3 significant figures: ${sf3(x)} ${u}`],
      answerText:`${sf3(x)} ${area?u+'²':u}`};
  }
  if(t===3){
    const fromA=Math.random()<.5,want=pick(['radius','diameter']),given=fromA?R(50,900)/10:R(10,150);
    const r=fromA?Math.sqrt(given/P):given/(2*P),x=want==='radius'?r:2*r;
    return {kind:'num',...sfAns(x,3),calc:true,post:u,
      prompt:`A circle has ${fromA?`an area of ${fmt(given)} ${u}²`:`a circumference of ${fmt(given)} ${u}`}. Calculate its ${want}. Give your answer to 3 significant figures.`,
      hint:fromA?`Area = ${PI}r². Working backwards: divide by ${PI}, then square root to get the radius.`:`Circumference = ${PI}d. Working backwards: divide by ${PI} to get the diameter.`,
      working:fromA?[`r${sup(2)} = ${fmt(given)} ÷ ${PI} = ${fmt(given/P,4)}`,`r = ${M(sq(fmt(given/P,4)))} = ${fmt(r,4)}`,...(want==='diameter'?[`d = 2 × ${fmt(r,4)} = ${fmt(2*r,4)}`]:[]),`To 3 significant figures: ${sf3(x)} ${u}`]
        :[`d = ${fmt(given)} ÷ ${PI} = ${fmt(2*r,4)}`,...(want==='radius'?[`r = ${fmt(2*r,4)} ÷ 2 = ${fmt(r,4)}`]:[]),`To 3 significant figures: ${sf3(x)} ${u}`],
      answerText:`${sf3(x)} ${u}`};
  }
  const r=R(4,25),deg=pick([30,40,45,60,72,80,90,100,110,120,135,140,150,210,240,270,300]);
  if(t===4){
    const x=deg/360*P*2*r;
    return {kind:'num',...dpAns(x,2),tol:.006,calc:true,post:u,
      prompt:`Calculate the arc length of this sector. The radius is ${r} ${u}. Give your answer to 2 decimal places.`,
      diagram:sectorSVG(`${r} ${u}`,deg),
      hint:`The arc is ${deg}/360 of the whole circumference. Circumference = ${PI} × diameter.`,
      working:[`Fraction of the circle: ${deg} ÷ 360`,`Arc = ${deg} ÷ 360 × ${PI} × ${2*r}`,`= ${fmt(x,4)}...`,`To 2 decimal places: ${fmt(rnd(x,2),2)} ${u}`],answerText:`${fmt(rnd(x,2),2)} ${u}`};
  }
  const x=deg/360*P*r*r;
  return {kind:'num',...sfAns(x,3),calc:true,post:u+'²',
    prompt:`Calculate the area of this sector. The radius is ${r} ${u}. Give your answer to 3 significant figures.`,
    diagram:sectorSVG(`${r} ${u}`,deg),
    hint:`The sector is ${deg}/360 of the whole circle's area. Area = ${PI} × r².`,
    working:[`Fraction of the circle: ${deg} ÷ 360`,`Area = ${deg} ÷ 360 × ${PI} × ${r}${sup(2)}`,`= ${fmt(x,4)}...`,`To 3 significant figures: ${sf3(x)} ${u}²`],answerText:`${sf3(x)} ${u}²`};
}

/* ======================================================================
   9. Straight Line (non-calculator)
   ====================================================================== */
const lineT=M(v('y')+' = ')+'{0}'+M(v('x')+' + ')+'{1}';
const FRAC_NOTE=`${NOTE_NEG} You can type a fraction like 1/2 or ${MINUS}3/4.`;
const yeq=(mp,mq,c)=>{const [p,q]=fracVal(mp,mq);const mT=q===1?(p===1?'':p===-1?MINUS:n_(p)):fracHTML(p,q);return M(`${v('y')} = ${mT}${v('x')}${c===0?'':c<0?' '+MINUS+' '+Math.abs(c):' + '+c}`);};
function genLine(){
  const t=pick([1,2,3,3,4,4,5,6]);
  if(t===1){
    const rise=pick([2,3,4,5,6,8,9,10,12,15]),run=pick([6,8,10,12,15,18,20,24,30]);
    if(rise>=run)return genLine();
    const [p,q]=fracVal(rise,run);
    return {kind:'num',answer:rise/run,tol:.0051,calc:false,im:'text',note:'You can type a fraction like 1/3.',
      prompt:`Calculate the gradient of this slope. Give your answer as a fraction in its simplest form.`,diagram:slopeSVG(`${rise} m`,`${run} m`),
      hint:`Gradient = how far up ÷ how far across.`,
      working:[`Gradient = up ÷ across = ${fr(rise,run)}`,q!==run?`Simplify by dividing top and bottom by ${run/q}: ${fracHTML(p,q)}`:`That's already as simple as it gets.`],answerText:M(fracHTML(p,q))};
  }
  const mOpts=[[1,1],[2,1],[3,1],[4,1],[-1,1],[-2,1],[-3,1],[1,2],[-1,2],[3,2],[-3,2],[1,3],[-2,3]];
  if(t===2){
    const [p,q]=pick(mOpts),x1=R(-6,6),y1=R(-8,8),k=pick([1,2,3]),x2=x1+q*k*pick([1,-1]),y2=y1+(x2-x1)/q*p;
    return {kind:'num',answer:p/q,tol:.0051,calc:false,im:'text',note:FRAC_NOTE,
      prompt:`Calculate the gradient of the line joining ${M(pt(x1,y1))} and ${M(pt(x2,y2))}.`,
      hint:`Gradient = (difference in ${v('y')}) ÷ (difference in ${v('x')}). Take them in the same order on top and bottom.`,
      working:[`m = (${n_(y2)} ${MINUS} ${y1<0?'('+n_(y1)+')':y1}) ÷ (${n_(x2)} ${MINUS} ${x1<0?'('+n_(x1)+')':x1})`,`= ${n_(y2-y1)} ÷ ${n_(x2-x1)}`,`= ${M(fracHTML(y2-y1,x2-x1))}`],answerText:M(fracHTML(p,q))};
  }
  if(t===3||t===4){
    let p,q,c,x1,y1,x2,y2;
    for(let i=0;i<50;i++){[p,q]=pick(mOpts);c=R(-5,5);x1=q*R(-2,2);x2=x1+q*pick([1,2]);y1=x1/q*p+c;y2=x2/q*p+c;
      if(t===3||(Math.abs(y1)<=6&&Math.abs(y2)<=6&&Math.abs(x2)<=6&&x2!==0))break;}
    if(t===4){
      x2=q*pick([1,-1]);y2=x2/q*p+c;
      if(Math.abs(y2)>6)return genLine();
      return {kind:'fields',fields:[{answer:p/q,tol:.0051},{answer:c,tol:1e-9}],template:lineT,calc:false,note:FRAC_NOTE,
        prompt:`Find the equation of the straight line shown. Write it as ${M(v('y')+' = '+v('m')+v('x')+' + '+v('c'))}.`,diagram:graphSVG(p/q,c,x2,y2),
        hint:`${v('c')} is where the line crosses the ${v('y')}-axis. For the gradient, count how far up (or down) you go for each step across.`,
        working:[`It crosses the ${v('y')}-axis at ${n_(c)}, so ${v('c')} = ${n_(c)}`,`From ${M(pt(0,c))} to ${M(pt(x2,y2))}: up ${n_(y2-c)}, across ${n_(x2)}, so ${v('m')} = ${M(fracHTML(y2-c,x2))}`,`So ${yeq(p,q,c)}`],answerText:yeq(p,q,c)};
    }
    return {kind:'fields',fields:[{answer:p/q,tol:.0051},{answer:c,tol:1e-9}],template:lineT,calc:false,note:FRAC_NOTE,
      prompt:`Find the equation of the straight line passing through ${M(pt(x1,y1))} and ${M(pt(x2,y2))}.`,
      hint:`Find the gradient first. Then put one of the points into ${M(v('y')+' = '+v('m')+v('x')+' + '+v('c'))} to find ${v('c')}.`,
      working:[`m = (${n_(y2)} ${MINUS} ${y1<0?'('+n_(y1)+')':y1}) ÷ (${n_(x2)} ${MINUS} ${x1<0?'('+n_(x1)+')':x1}) = ${M(fracHTML(y2-y1,x2-x1))}`,`Put in ${M(pt(x1,y1))}: ${n_(y1)} = ${M(fracHTML(p,q))} × ${x1<0?'('+n_(x1)+')':x1} + ${v('c')}, so ${n_(y1)} = ${n_(x1/q*p)} + ${v('c')}`,`${v('c')} = ${n_(c)}`,`So ${yeq(p,q,c)}`],answerText:yeq(p,q,c)};
  }
  if(t===5){
    const a=pick([1,2,3,4,5,-2,-3]),b=pick([1,2,3,-1,-2,4,6]),k=R(-12,12);
    const lhs=(a===1?'':a===-1?MINUS:n_(a))+v('x')+(b<0?' '+MINUS+' ':' + ')+(Math.abs(b)===1?'':Math.abs(b))+v('y')+(k===0?'':k<0?' '+MINUS+' '+Math.abs(k):' + '+k)+' = 0';
    const [mp,mq]=fracVal(-a,b),[cp,cq]=fracVal(-k,b);
    return {kind:'fields',fields:[{answer:mp/mq,tol:.0051},{answer:cp/cq,tol:.0051}],template:`Gradient {0} &nbsp; ${v('y')}-intercept {1}`,calc:false,note:FRAC_NOTE,
      prompt:`Find the gradient and the ${v('y')}-intercept of the line ${M(lhs)}.`,
      hint:`Rearrange to get ${v('y')} on its own. Then it's in the form ${M(v('y')+' = '+v('m')+v('x')+' + '+v('c'))}.`,
      working:[`Move the other terms over: ${M((b===1?'':b===-1?MINUS:n_(b))+v('y')+' = '+poly([-a,-k],[1,0]))}`,b===1?`${v('y')} is already on its own.`:`Divide everything by ${n_(b)}`,`Gradient = ${M(fracHTML(-a,b))}, ${v('y')}-intercept = ${M(fracHTML(-k,b))}`],
      answerText:`Gradient ${M(fracHTML(-a,b))}, ${v('y')}-intercept ${M(fracHTML(-k,b))}`};
  }
  const a=R(1,6),b=R(1,6),l=a*b/gcd(a,b),k=l*pick([1,2,3,-1,-2]),xi=k/a,yi=k/b;
  const lhs=`${a===1?'':a}${v('x')} + ${b===1?'':b}${v('y')} = ${n_(k)}`;
  return {kind:'fields',fields:[{answer:xi,tol:1e-9},{answer:yi,tol:1e-9}],template:`${v('x')}-axis at ${M('(')}{0}${M(', 0)')} &nbsp; ${v('y')}-axis at ${M('(0, ')}{1}${M(')')}`,calc:false,note:NOTE_NEG,
    prompt:`Find the coordinates of the points where the line ${M(lhs)} cuts the ${v('x')}-axis and the ${v('y')}-axis.`,
    hint:`On the ${v('x')}-axis, ${v('y')} = 0. On the ${v('y')}-axis, ${v('x')} = 0. Put each in and solve.`,
    working:[`${v('y')} = 0: ${a===1?'':a}${v('x')} = ${n_(k)}, so ${v('x')} = ${n_(xi)}. Point ${M(pt(xi,0))}`,`${v('x')} = 0: ${b===1?'':b}${v('y')} = ${n_(k)}, so ${v('y')} = ${n_(yi)}. Point ${M(pt(0,yi))}`],
    answerText:`${M(pt(xi,0))} and ${M(pt(0,yi))}`};
}

/* ======================================================================
   10. Volume
   ====================================================================== */
function genVol(){
  const t=pick([1,2,3,4,5,6,6,7,7]);
  const rOrD=()=>{const useD=Math.random()<.5,val=R(2,30);return {useD,val,r:useD?val/2:val,txt:`${useD?'diameter':'radius'} ${val} cm`};};
  const vq=(x,prompt,hint,working)=>({kind:'num',...sfAns(x,3),calc:true,post:'cm³',prompt:prompt+' Give your answer to 3 significant figures.',hint,working:[...working,`= ${fmt(x,3)}...`,`To 3 significant figures: ${sf3(x)} cm³`],answerText:sf3(x)+' cm³'});
  const halve=o=>o.useD?[`Radius = ${o.val} ÷ 2 = ${fmt(o.r)} cm`]:[];
  if(t===1){const o=rOrD(),h=R(3,40),x=P*o.r*o.r*h;
    return vq(x,`A cylinder has ${o.txt} and height ${h} cm. Calculate its volume.`,`Cylinder: ${PI} × r² × h.${o.useD?' Halve the diameter first.':''}`,[...halve(o),`V = ${PI} × ${fmt(o.r)}${sup(2)} × ${h}`]);}
  if(t===2){const o=rOrD(),h=R(3,40),x=P*o.r*o.r*h/3;
    return vq(x,`A cone has ${o.txt} and height ${h} cm. Calculate its volume.`,`Cone: ${PI} × r² × h ÷ 3. It's a third of the cylinder.`,[...halve(o),`V = ${PI} × ${fmt(o.r)}${sup(2)} × ${h} ÷ 3`]);}
  if(t===3){const o=rOrD(),x=4/3*P*Math.pow(o.r,3);
    return vq(x,`A sphere has ${o.txt}. Calculate its volume.`,`Sphere: 4 × ${PI} × r³ ÷ 3.`,[...halve(o),`V = 4 × ${PI} × ${fmt(o.r)}${sup(3)} ÷ 3`]);}
  if(t===4){const l=R(4,30),w=Math.random()<.5?l:R(4,30),h=R(4,40),x=l*w*h/3;
    return vq(x,`A pyramid has a ${l===w?'square':'rectangular'} base measuring ${l} cm by ${w} cm. Its height is ${h} cm. Calculate its volume.`,`Pyramid: area of the base × height ÷ 3.`,[`Base area = ${l} × ${w} = ${l*w} cm²`,`V = ${l*w} × ${h} ÷ 3`]);}
  if(t===5){const b=R(4,30),h=R(3,25),L=R(10,60),x=b*h/2*L;
    return vq(x,`A triangular prism has a triangular end with base ${b} cm and height ${h} cm. The prism is ${L} cm long. Calculate its volume.`,`Prism: area of the end × length. The end is a triangle, so ½ × base × height.`,[`End area = ½ × ${b} × ${h} = ${fmt(b*h/2)} cm²`,`V = ${fmt(b*h/2)} × ${L}`]);}
  if(t===6){
    const k=pick([1,2,3]);
    if(k===1){const r=R(3,12),V=R(200,3000),h=3*V/(P*r*r);
      return {kind:'num',...dpAns(h,1),tol:.06,calc:true,post:'cm',prompt:`A cone has radius ${r} cm and volume ${fmt(V)} cm³. Calculate its height. Give your answer to 1 decimal place.`,
        hint:`Put what you know into V = ${PI} × r² × h ÷ 3, then work backwards to find h.`,
        working:[`${fmt(V)} = ${PI} × ${r}${sup(2)} × h ÷ 3`,`Multiply by 3: ${fmt(3*V)} = ${PI} × ${r*r} × h`,`h = ${fmt(3*V)} ÷ (${PI} × ${r*r}) = ${fmt(h,3)}...`,`To 1 decimal place: ${fmt(rnd(h,1),1)} cm`],answerText:fmt(rnd(h,1),1)+' cm'};}
    if(k===2){const r=R(5,15),Lt=R(10,90)/10,V=Lt*1000,h=V/(P*r*r);
      return {kind:'num',...dpAns(h,1),tol:.06,calc:true,post:'cm',prompt:`A cylinder has radius ${r} cm and holds ${fmt(Lt)} litres. Calculate its height. Give your answer to 1 decimal place.`,
        hint:`1 litre = 1000 cm³, so change the litres to cm³ first. Then V = ${PI} × r² × h.`,
        working:[`${fmt(Lt)} litres = ${fmt(V)} cm³`,`${fmt(V)} = ${PI} × ${r}${sup(2)} × h`,`h = ${fmt(V)} ÷ (${PI} × ${r*r}) = ${fmt(h,3)}...`,`To 1 decimal place: ${fmt(rnd(h,1),1)} cm`],answerText:fmt(rnd(h,1),1)+' cm'};}
    const Lt=R(5,60)/10,V=Lt*1000,r=Math.cbrt(3*V/(4*P));
    return {kind:'num',...dpAns(r,1),tol:.06,calc:true,post:'cm',prompt:`A sphere holds ${fmt(Lt)} litres. Calculate its radius. Give your answer to 1 decimal place.`,
      hint:`Change litres to cm³ (× 1000). Then V = 4 × ${PI} × r³ ÷ 3, so r³ = 3V ÷ (4${PI}). Finish with a cube root.`,
      working:[`${fmt(Lt)} litres = ${fmt(V)} cm³`,`r${sup(3)} = 3 × ${fmt(V)} ÷ (4 × ${PI}) = ${fmt(3*V/(4*P),3)}`,`r = cube root = ${fmt(r,3)}...`,`To 1 decimal place: ${fmt(rnd(r,1),1)} cm`],answerText:fmt(rnd(r,1),1)+' cm'};
  }
  const k=pick([1,2,3]),r=R(3,15);
  if(k===1){const h1=R(5,30),h2=R(4,20),a=P*r*r*h1,b=P*r*r*h2/3,x=a+b;
    return vq(x,`A solid is made from a cylinder with a cone on top. Both have radius ${r} cm. The cylinder is ${h1} cm tall and the cone is ${h2} cm tall. Calculate the total volume.`,`Work out the cylinder and the cone separately, then add.`,[`Cylinder: ${PI} × ${r}${sup(2)} × ${h1} = ${fmt(a,2)}`,`Cone: ${PI} × ${r}${sup(2)} × ${h2} ÷ 3 = ${fmt(b,2)}`,`Total = ${fmt(a,2)} + ${fmt(b,2)}`]);}
  if(k===2){const h=R(6,25),a=P*r*r*h/3,b=2/3*P*Math.pow(r,3),x=a+b;
    return vq(x,`An ice cream is a cone of height ${h} cm with a hemisphere of ice cream on top. Both have radius ${r} cm. Calculate the total volume.`,`A hemisphere is half a sphere. Work out the cone and the hemisphere, then add.`,[`Cone: ${PI} × ${r}${sup(2)} × ${h} ÷ 3 = ${fmt(a,2)}`,`Hemisphere: half of 4 × ${PI} × ${r}${sup(3)} ÷ 3 = ${fmt(b,2)}`,`Total = ${fmt(a,2)} + ${fmt(b,2)}`]);}
  const L=R(8,40),a=P*r*r*L,b=4/3*P*Math.pow(r,3),x=a+b;
  return vq(x,`A capsule is a cylinder ${L} cm long with a hemisphere on each end. The radius is ${r} cm. Calculate the total volume.`,`Two hemispheres make one whole sphere. Add that to the cylinder.`,[`Cylinder: ${PI} × ${r}${sup(2)} × ${L} = ${fmt(a,2)}`,`Two hemispheres = one sphere: 4 × ${PI} × ${r}${sup(3)} ÷ 3 = ${fmt(b,2)}`,`Total = ${fmt(a,2)} + ${fmt(b,2)}`]);
}

/* ======================================================================
   11. Foreign Exchange
   Practice rates only. Real rates change every day.
   ====================================================================== */
const RATES={USD:['US dollar',1.34],EUR:['Euro',1.16],CAD:['Canadian dollar',1.85],AUD:['Australian dollar',2.05],JPY:['Japanese yen',198.5],INR:['Indian rupee',114.6],CHF:['Swiss franc',1.08],CNY:['Chinese yuan',9.62],SGD:['Singapore dollar',1.73]};
const BIG=['JPY','INR'];
function rateTable(codes){
  return `<div class="tblwrap rates"><table><thead><tr><th>£1 (GBP) buys</th><th></th></tr></thead><tbody>${codes.map(c=>`<tr><td>${RATES[c][0]}</td><td>${fmt(RATES[c][1])} ${c}</td></tr>`).join('')}</tbody></table></div><p class="note">Practice rates. Real rates change every day.</p>`;
}
const PEOPLE=['Jamal','Carmen','Carter','Louise','Aisha','Ross','Mhairi','Kai'];
function genFX(){
  const t=pick([1,1,2,2,3,4,4,5]),codes=Object.keys(RATES);
  if(t===1){
    const c=pick(codes),amt=R(15,200)*10,x=amt*RATES[c][1],big=BIG.includes(c);
    return {kind:'num',answer:big?Math.round(x):rnd(x,2),tol:big?.51:.011,calc:true,post:c,
      prompt:`Use the table to change £${fmt(amt)} into ${RATES[c][0]}s. Give your answer ${big?'to the nearest whole number':'to 2 decimal places'}.`,diagram:rateTable([c,...shuffle(codes.filter(x=>x!==c)).slice(0,2)]),
      hint:`Pounds to another currency: multiply by the rate.`,
      working:[`£1 = ${fmt(RATES[c][1])} ${c}`,`${fmt(amt)} × ${fmt(RATES[c][1])} = ${fmt(x,4)}`,`${big?'To the nearest whole number':'To 2 decimal places'}: ${big?fmt(Math.round(x)):fmt(rnd(x,2),2)} ${c}`],answerText:`${big?fmt(Math.round(x)):fmt(rnd(x,2),2)} ${c}`};
  }
  if(t===2){
    const c=pick(codes),big=BIG.includes(c),amt=big?R(10,500)*100:R(10,300)*5,x=amt/RATES[c][1];
    return {kind:'num',answer:rnd(x,2),tol:.006,calc:true,pre:'£',
      prompt:`Use the table to change ${fmt(amt)} ${c} into pounds. Give your answer to the nearest penny.`,diagram:rateTable([c,...shuffle(codes.filter(x=>x!==c)).slice(0,2)]),
      hint:`Another currency to pounds: divide by the rate. You should get fewer pounds${big?' (a lot fewer)':''}.`,
      working:[`£1 = ${fmt(RATES[c][1])} ${c}`,`${fmt(amt)} ÷ ${fmt(RATES[c][1])} = ${fmt(x,4)}`,`To the nearest penny: ${money(rnd(x,2))}`],answerText:money(rnd(x,2))};
  }
  if(t===3){
    const [a,b]=shuffle(codes),amt=BIG.includes(a)?R(10,500)*100:R(20,300)*5,gbp=amt/RATES[a][1],x=gbp*RATES[b][1];
    return {kind:'num',answer:Math.round(x),tol:1,calc:true,post:b,
      prompt:`Use the table to work out how many ${RATES[b][0]}s you would get for ${fmt(amt)} ${a}. Give your answer to the nearest whole number.`,diagram:rateTable([a,b]),
      hint:`Change to pounds first (divide), then into the new currency (multiply).`,
      working:[`To pounds: ${fmt(amt)} ÷ ${fmt(RATES[a][1])} = £${fmt(gbp,4)}`,`To ${b}: ${fmt(gbp,4)} × ${fmt(RATES[b][1])} = ${fmt(x,2)}`,`To the nearest whole number: ${fmt(Math.round(x))} ${b}`],answerText:`${fmt(Math.round(x))} ${b}`};
  }
  if(t===4){
    const who=pick(PEOPLE),[a,b]=shuffle(codes),P=R(4,40)*100,got=P*RATES[a][1],spent=Math.round(got*R(15,60)/100/10)*10,left=got-spent,gbp=left/RATES[a][1],x=gbp*RATES[b][1];
    return {kind:'num',answer:Math.round(x),tol:1,calc:true,post:b,
      prompt:`${who} changed £${fmt(P)} into ${RATES[a][0]}s. ${who} spent ${fmt(spent)} ${a}, then changed the rest into ${RATES[b][0]}s. How many ${b} did ${who} get? Give your answer to the nearest whole number.`,diagram:rateTable([a,b]),
      hint:`Three steps. Change the pounds into ${a}. Take off what was spent. Change what's left into ${b} by going through pounds.`,
      working:[`£${fmt(P)} × ${fmt(RATES[a][1])} = ${fmt(got,2)} ${a}`,`Left after spending: ${fmt(got,2)} ${MINUS} ${fmt(spent)} = ${fmt(left,2)} ${a}`,`Back to pounds: ${fmt(left,2)} ÷ ${fmt(RATES[a][1])} = £${fmt(gbp,4)}`,`Into ${b}: ${fmt(gbp,4)} × ${fmt(RATES[b][1])} = ${fmt(x,2)}`,`To the nearest whole number: ${fmt(Math.round(x))} ${b}`],answerText:`${fmt(Math.round(x))} ${b}`};
  }
  const item=pick(['an e-bike','a laptop','a guitar','a camera']),eur=R(400,1500)+.95,duty=pick([2.5,5,7.5,10]);
  const gE=eur/RATES.EUR[1],gC0=gE*pick([.9,.95,1.05,1.1]),cny=Math.round(gC0*RATES.CNY[1]),cnyD=cny*(1+duty/100),gC=cnyD/RATES.CNY[1];
  return {kind:'fields',fields:[{answer:rnd(gE,2),tol:.006},{answer:rnd(gC,2),tol:.006}],template:`From France £{0} &nbsp; From China £{1}`,calc:true,
    prompt:`You can buy ${item} from France for ${fmt(eur,2)} EUR, or from China for ${fmt(cny)} CNY plus ${fmt(duty)}% import duty. Work out each price in pounds, to the nearest penny.`,diagram:rateTable(['EUR','CNY']),
    hint:`France: divide by the euro rate. China: add the ${fmt(duty)}% duty first, then divide by the yuan rate.`,
    working:[`France: ${fmt(eur,2)} ÷ ${fmt(RATES.EUR[1])} = ${money(rnd(gE,2))}`,`China with duty: ${fmt(cny)} × ${fmt(1+duty/100)} = ${fmt(cnyD,2)} CNY`,`${fmt(cnyD,2)} ÷ ${fmt(RATES.CNY[1])} = ${money(rnd(gC,2))}`,`${gE<gC?'France':'China'} is cheaper, by ${money(Math.abs(rnd(gE,2)-rnd(gC,2)))}.`],
    answerText:`France ${money(rnd(gE,2))}, China ${money(rnd(gC,2))}`};
}

/* ======================================================================
   12. Algebra (Brackets) (non-calculator)
   ====================================================================== */
const nz=(a,b)=>{let n;do{n=R(a,b);}while(n===0);return n;};
const bx=(a,b)=>`(${a===1?'':a===-1?MINUS:n_(a)}${v('x')}${b<0?' '+MINUS+' '+Math.abs(b):' + '+b})`;
const term=(k,inner)=>`${k<0?' '+MINUS+' ':' + '}${Math.abs(k)===1?'':Math.abs(k)}${inner}`;
/* One working line for each power with more than one term to collect,
   e.g. "x² terms: 8x² − 9x² = −x², so that box is −1". */
function collect(terms){
  const by={};terms.forEach(([c,p])=>{(by[p]=by[p]||[]).push(c);});
  return Object.keys(by).map(Number).sort((a,b)=>b-a).filter(p=>by[p].length>1).map(p=>{
    const cs=by[p],sum=cs.reduce((a,b)=>a+b,0),lab=p===0?'Numbers':M(v('x')+(p>1?sup(p):''))+' terms';
    return `${lab}: ${M(poly(cs,cs.map(()=>p))||'0')} = ${M(poly([sum],[p])||'0')}, so that box is ${n_(sum)}`;});
}
function polyQ(coefs,powers,prompt,hint,working){
  return {kind:'fields',fields:coefs.map(c=>({answer:c,tol:0})),template:polyTemplate(powers),calc:false,
    note:`Fill in every box. ${NOTE_NEG} Type 0 if a term isn't there, and 1 if there's no number in front.`,
    prompt,hint,working:[...working,`= ${M(poly(coefs,powers))}`],answerText:M(poly(coefs,powers))};
}
function genAlg(){
  const t=pick([1,1,2,3,3,4,5,6]);
  if(t===1){
    let a,b,c,d;do{a=R(2,9);b=nz(-9,9);c=nz(-9,9);d=nz(-9,9);}while(Math.abs(c)<2||a+c===0);
    return polyQ([a+c,a*b+c*d],[1,0],`Expand and simplify ${M(a+bx(1,b)+term(c,bx(1,d)))}`,
      `Multiply the number outside by everything inside each bracket. Watch the sign in front of the second bracket.`,
      [`${M(`${a}${v('x')}${sgn(a*b)}`)} and ${M(`${n_(c)}${v('x')}${sgn(c*d)}`)}`,`Collect: ${a} ${c<0?MINUS:'+'} ${Math.abs(c)} = ${n_(a+c)} lots of ${v('x')}, and ${n_(a*b)} ${c*d<0?MINUS:'+'} ${Math.abs(c*d)} = ${n_(a*b+c*d)}`]);
  }
  if(t===2){
    const p=R(2,5),q=R(1,4),r=nz(-6,6),s=nz(-4,4),u=nz(-6,6);
    const co=[p*q-s,p*r,-s*u];
    if(co[0]===0)return genAlg();
    return polyQ(co,[2,1,0],`Expand and simplify ${M(`${p}${v('x')}${bx(q,r)}${term(-s,`(${v('x')}${sup(2)}${sgn(u)})`)}`)}`,
      `${p}${v('x')} × ${q===1?'':q}${v('x')} gives an ${v('x')}${sup(2)} term. Then expand the second bracket, watching the sign.`,
      [`${p}${v('x')} × ${bx(q,r)} = ${M(poly([p*q,p*r],[2,1]))}`,`${n_(-s)} × (${v('x')}${sup(2)}${sgn(u)}) = ${M(poly([-s,-s*u],[2,0]))}`,...collect([[p*q,2],[p*r,1],[-s,2],[-s*u,0]])]);
  }
  if(t===3){
    const a=pick([1,1,1,2,3,5]),c=pick([1,1,2,3,4]),b=nz(-9,9),d=nz(-9,9);
    return polyQ([a*c,a*d+b*c,b*d],[2,1,0],`Expand and simplify ${M(bx(a,b)+bx(c,d))}`,
      `Every term in the first bracket multiplies every term in the second. That's 4 multiplications. Then collect the ${v('x')} terms.`,
      [`${M(`${a===1?'':a}${v('x')} × ${c===1?'':c}${v('x')} = ${poly([a*c],[2])}`)}, ${M(`${a===1?'':a}${v('x')} × ${n_(d)} = ${poly([a*d],[1])}`)}`,`${M(`${n_(b)} × ${c===1?'':c}${v('x')} = ${poly([b*c],[1])}`)}, ${M(`${n_(b)} × ${n_(d)} = ${n_(b*d)}`)}`,`Collect the ${v('x')} terms: ${n_(a*d)} + ${b*c<0?'('+n_(b*c)+')':b*c} = ${n_(a*d+b*c)}`]);
  }
  if(t===4){
    if(Math.random()<.6){const a=pick([1,1,2,3,5]),b=nz(-9,9);
      return polyQ([a*a,2*a*b,b*b],[2,1,0],`Expand and simplify ${M(bx(a,b)+sup(2))}`,
        `Write it out as two brackets: ${M(bx(a,b)+bx(a,b))}. It's NOT just squaring each part.`,
        [`${M(bx(a,b)+bx(a,b))}`,`= ${M(poly([a*a,a*b,a*b,b*b],[2,1,1,0]))}`]);}
    const k=pick([2,3,-2]),b=nz(-6,6);
    return polyQ([k,2*k*b,k*b*b],[2,1,0],`Expand and simplify ${M(n_(k)+bx(1,b)+sup(2))}`,
      `Square the bracket first, then multiply everything by ${n_(k)}.`,
      [`${M(bx(1,b)+sup(2))} = ${M(poly([1,2*b,b*b],[2,1,0]))}`,`Multiply each term by ${n_(k)}`]);
  }
  if(t===5){
    const a=nz(-7,7),b=nz(-7,7),s=pick([-2,-3,-4,2]),c=nz(-5,5);
    const co=[1+s,a+b,a*b+s*c];
    if(co[0]===0)return genAlg();
    return polyQ(co,[2,1,0],`Expand and simplify ${M(bx(1,a)+bx(1,b)+term(s,`(${v('x')}${sup(2)}${sgn(c)})`))}`,
      `Do each part separately, then collect. The ${n_(s)} multiplies both terms in its bracket.`,
      [`${M(bx(1,a)+bx(1,b))} = ${M(poly([1,a+b,a*b],[2,1,0]))}`,`${n_(s)}(${v('x')}${sup(2)}${sgn(c)}) = ${M(poly([s,s*c],[2,0]))}`,...collect([[1,2],[a+b,1],[a*b,0],[s,2],[s*c,0]])]);
  }
  const a=pick([1,1,2,5]),b=nz(-6,6),c=nz(-7,7),d=nz(-6,6);
  return polyQ([a,a*c+b,a*d+b*c,b*d],[3,2,1,0],`Expand and simplify ${M(`${bx(a,b)}(${poly([1,c,d],[2,1,0])})`)}`,
    `2 terms × 3 terms = 6 multiplications. Do the ${a===1?'':a}${v('x')} first, then the ${n_(b)}. Then collect.`,
    [`${a===1?'':a}${v('x')} × each: ${M(poly([a,a*c,a*d],[3,2,1]))}`,`${n_(b)} × each: ${M(poly([b,b*c,b*d],[2,1,0]))}`,...collect([[a,3],[a*c,2],[a*d,1],[b,2],[b*c,1],[b*d,0]])]);
}

/* ======================================================================
   Topics in booklet page order. All red.
   ====================================================================== */
const TOPICS=[
 {id:'vec',level:'red',name:'Vectors',blurb:'3D coordinates, adding vectors, magnitude and routes',gen:genVec,learn:{
   analogy:`A vector is like directions in a treasure hunt. "3 right and 2 up" is the same move wherever you start from.`,
   key:`In 2D the top number is across and the bottom is up. In 3D there are three numbers: ${v('x')}, ${v('y')} and ${v('z')}. To add vectors, add the matching numbers.`,
   steps:[`To multiply a vector by a number, multiply every number inside it.`,`To add or subtract vectors, do the top row, then the next row, and so on.`,`For the size (magnitude), square each number, add them, then square root. It's just Pythagoras.`,`For 3D coordinates, read along (${v('x')}), back (${v('y')}), then up (${v('z')}).`,`For routes in shapes, go along sides you know. Going against an arrow makes it negative.`],
   ex:{q:`${M(bv('a')+' = '+colv([3,-1]))} and ${M(bv('b')+' = '+colv([2,4]))}. Find ${M('2'+bv('a')+' + '+bv('b'))}.`,lines:[M('2'+bv('a')+' = '+colv([6,-2])),M('2'+bv('a')+' + '+bv('b')+' = '+colv(['6 + 2',`${MINUS}2 + 4`])+' = '+colv([8,2]))]},
   traps:[`Doubling a vector but forgetting to double every number.`,`Minus a minus. 3 ${MINUS} (${MINUS}2) is 5.`,`Mixing up the order of coordinates. It's always ${v('x')}, ${v('y')}, ${v('z')}.`],
   exam:`National 5, often Paper 1. Usually 2 or 3 marks a part. Your booklet does components and coordinates without a calculator, and magnitude with one.`}},
 {id:'sdt',level:'red',name:'Speed, Distance, Time',blurb:'Decimal hours and the D S T triangle',gen:genSDT,learn:{
   analogy:`Picture the D S T triangle. D sits on top, S and T underneath. Cover the one you want and the other two show you what to do.`,
   key:`Speed = distance ÷ time. Time = distance ÷ speed. Distance = speed × time. Times must be in decimal hours before you calculate.`,
   steps:[`Write down what you know and what you want.`,`Change a time like 2 hours 15 minutes into decimal hours. Divide the minutes by 60: 15 ÷ 60 = 0.25, so 2.25 hours.`,`Use the triangle to pick the right calculation.`,`If your answer is a time, change the decimal part back into minutes by multiplying it by 60.`],
   ex:{q:`A car travels 153 km in 4 hours 15 minutes. Find its average speed.`,lines:[`15 ÷ 60 = 0.25, so the time is 4.25 hours`,`Speed = 153 ÷ 4.25`,`= 36 km/h`]},
   traps:[`Writing 2 hours 15 minutes as 2.15. It's 2.25.`,`Turning 3.5 hours into 3 hours 50 minutes. It's 3 hours 30 minutes.`,`Mixing units, like metres with km/h.`],
   exam:`National 5 and everyday life. Usually 2 or 3 marks. The decimal time step is where most marks go.`}},
 {id:'sci',level:'red',name:'Scientific Notation',blurb:'Writing huge and tiny numbers the short way',gen:genSci,learn:{
   analogy:`Shorthand for numbers too big or too small to write out comfortably. The power of 10 tells you how many places the decimal point jumps.`,
   key:`A number between 1 and 10, times a power of 10. Big numbers get a positive power. Numbers smaller than 1 get a negative power.`,
   steps:[`Put the decimal point after the first digit that isn't zero.`,`Count how many places the point moved.`,`Big number? Positive power. Smaller than 1? Negative power.`,`Multiplying: multiply the front numbers and add the powers.`,`If the front number ends up 10 or more, fix it and add 1 to the power.`],
   ex:{q:`Calculate ${M('(5 × 10'+sup(3)+') × (7.2 × 10'+sup(4)+')')} without a calculator.`,lines:[`5 × 7.2 = 36 and 3 + 4 = 7`,M('36 × 10'+sup(7)),M('= 3.6 × 10'+sup(8))]},
   traps:[`Leaving 36 × 10${sup(7)} as the answer. The front number has to be under 10.`,`Getting the sign of the power the wrong way round. 0.0053 is 5.3 × 10${sup(MINUS+'3')}.`,`On a calculator, use the ×10ˣ (EXP) button. Typing × 10 ^ can go wrong when dividing.`],
   exam:`National 5, both papers. 1 to 3 marks. Often hidden in a question about planets, insects or atoms.`}},
 {id:'int',level:'red',name:'Integers',blurb:'Working with negative numbers',gen:genInt,learn:{
   analogy:`A number line is a thermometer lying on its side. Adding moves you right, warmer. Taking away moves you left, colder.`,
   key:`Two signs side by side: the same make plus, different make minus. So 5 ${MINUS} (${MINUS}3) is 5 + 3. For × and ÷, same signs give a positive answer and different signs give a negative.`,
   steps:[`Sort out any double signs first. ${MINUS} (${MINUS}) becomes +, and + (${MINUS}) becomes ${MINUS}.`,`For adding and taking away, picture the number line and move.`,`For × and ÷, do the numbers first, then sort out the sign.`,`For ordering, the further left on the number line, the smaller. ${MINUS}20 is smaller than ${MINUS}3.`],
   ex:{q:`Calculate ${M(MINUS+'56 '+MINUS+' ('+MINUS+'39)')}`,lines:[`${MINUS} (${MINUS}39) becomes + 39`,`${MINUS}56 + 39`,`= ${MINUS}17`]},
   traps:[`Thinking ${MINUS}20 is bigger than ${MINUS}3 because 20 is bigger than 3.`,`(${MINUS}3) × (${MINUS}9) is 27, not ${MINUS}27.`,`Dropping the minus sign at the end.`],
   exam:`No calculator. These skills sit inside loads of other questions, especially algebra and straight lines.`}},
 {id:'pct',level:'red',name:'Percentages',blurb:'Growing, shrinking and working backwards',gen:genPct,learn:{
   analogy:`A snowball rolling downhill. Each year it grows by a percentage of how big it already is, so the growth gets bigger every time.`,
   key:`Use a multiplier. Up 4% means × 1.04. Down 12% means × 0.88. For several years, use a power: × 1.04${sup(3)} for 3 years.`,
   steps:[`Turn the percentage into a multiplier. Going up: 1 + the decimal. Going down: 1 ${MINUS} the decimal.`,`For several years or months, raise the multiplier to that power.`,`Multiply by the starting amount.`,`Working backwards to the original? Divide by the multiplier instead.`,`Round only at the very end.`],
   ex:{q:`£3000 is invested at 4% per annum. How much is it worth after 3 years?`,lines:[`Multiplier = 1.04`,`3000 × 1.04${sup(3)}`,`= £3374.59`]},
   traps:[`Doing 4% × 3 = 12%. Each year's interest is on the new, bigger amount.`,`Working backwards by taking the percentage off. £96 including 20% VAT is 96 ÷ 1.2 = £80, not £76.80.`,`Rounding each year as you go.`],
   exam:`National 5 Paper 2 for growth and decay. Non-calculator ones use friendly numbers. Usually 3 marks.`}},
 {id:'tol',level:'red',name:'Tolerance',blurb:'How much a measurement is allowed to vary',gen:genTol,learn:{
   analogy:`Like the height sign on a fairground ride, but with wiggle room. There's a target, and a bit either side that's still allowed.`,
   key:`Target ± tolerance. Lower limit = target ${MINUS} tolerance. Upper limit = target + tolerance. Anything between the limits passes, including the limits themselves.`,
   steps:[`Lower limit: take the tolerance away from the target.`,`Upper limit: add the tolerance to the target.`,`If the tolerance is a percentage, work out that percentage of the target first.`,`Given the limits? The target is halfway between them, and the tolerance is half the gap.`,`For areas, use the smallest size for the minimum and the biggest size for the maximum.`],
   ex:{q:`Write 26 cm ± 5% as limits.`,lines:[`5% of 26 = 1.3`,`Lower: 26 ${MINUS} 1.3 = 24.7 cm`,`Upper: 26 + 1.3 = 27.3 cm`]},
   traps:[`Using the percentage as the tolerance. 5% of 26 is 1.3, not 5.`,`Failing a value that sits exactly on a limit. It passes.`,`Mixing mm and m. 1 m = 1000 mm.`],
   exam:`Calculator. Tolerance turns up in practical, real-life problems. Usually 2 or 3 marks.`}},
 {id:'pyth',level:'red',name:'Pythagoras',blurb:'Finding sides, checking right angles, 3D diagonals',gen:genPyth,learn:{
   analogy:`Picture a square drawn on each side of a right-angled triangle. The two smaller squares together exactly fill the big one.`,
   key:`${M(v('a')+sup(2)+' + '+v('b')+sup(2)+' = '+v('c')+sup(2))}, where ${v('c')} is the longest side, opposite the right angle. It's called the hypotenuse.`,
   steps:[`Find the hypotenuse. It's opposite the square corner.`,`Finding the hypotenuse? Square the two short sides, add, then square root.`,`Finding a short side? Square the two you know, take the small one from the big one, then square root.`,`Is it right-angled? If the two short sides squared add up to the longest side squared, yes.`,`Distance between points: across and up are the short sides.`,`3D diagonal: do the floor diagonal first, then use it with the height.`],
   ex:{q:`The short sides are 6 cm and 8 cm. Find the hypotenuse.`,lines:[`6${sup(2)} + 8${sup(2)} = 36 + 64 = 100`,`${M(sq(100))} = 10`,`Hypotenuse = 10 cm`]},
   traps:[`Adding when you should take away. If the hypotenuse is given, take away.`,`Forgetting the square root at the end.`,`In 3D, using a side of the floor instead of the floor diagonal.`],
   exam:`National 5 Paper 2. Often hidden inside a bigger problem. 3 or 4 marks.`}},
 {id:'circ',level:'red',name:'The Circle 1',blurb:'Circumference, area, arcs and sectors',gen:withPi314(genCirc),learn:{
   analogy:`A pizza. The crust is the circumference. The whole pizza is the area. A slice is a sector, and its bit of crust is the arc.`,
   key:`Circumference = ${PI} × diameter. Area = ${PI} × radius${sup(2)}. An arc or sector is a fraction of the circle: angle ÷ 360.`,
   steps:[`Check whether you've got the radius or the diameter. The diameter is twice the radius.`,`Circumference: ${PI} × d.`,`Area: ${PI} × r × r.`,`Arc length: angle ÷ 360 × ${PI} × d.`,`Sector area: angle ÷ 360 × ${PI} × r${sup(2)}.`,`Working backwards from the area: divide by ${PI}, then square root to get r.`],
   ex:{q:`Find the arc length of a 60° sector of a circle with radius 9 cm.`,lines:[`d = 18 cm`,`60 ÷ 360 × ${PI} × 18`,`= 9.42 cm (2 d.p.)`]},
   traps:[`Using the diameter in the area formula. Area needs the radius.`,`Squaring ${PI} × r instead of just r.`,`Using the diameter in the arc but the radius in the sector, and mixing them up.`],
   exam:`National 5 Paper 2. Arcs and sectors are a favourite. Usually 3 or 4 marks.`}},
 {id:'line',level:'red',name:'Straight Line',blurb:'Gradient and the equation of a line',gen:genLine,learn:{
   analogy:`Gradient is how steep a hill is. Take one step across: how far up do you climb? Going downhill gives a negative gradient.`,
   key:`Gradient = up ÷ across. A straight line's equation is ${M(v('y')+' = '+v('m')+v('x')+' + '+v('c'))}. ${v('m')} is the gradient and ${v('c')} is where it crosses the ${v('y')}-axis.`,
   steps:[`Gradient between two points: (difference in ${v('y')}) ÷ (difference in ${v('x')}).`,`Equation through two points: find ${v('m')}, then put one point into ${M(v('y')+' = '+v('m')+v('x')+' + '+v('c'))} to find ${v('c')}.`,`From a graph: read ${v('c')} where the line crosses the ${v('y')}-axis, then count up and across for ${v('m')}.`,`From something like ${M('3'+v('x')+' '+MINUS+' 2'+v('y')+' + 8 = 0')}: get ${v('y')} on its own first.`,`Where a line cuts an axis: put ${v('x')} = 0 for the ${v('y')}-axis, and ${v('y')} = 0 for the ${v('x')}-axis.`],
   ex:{q:`Find the equation of the line through (1, 5) and (3, 9).`,lines:[`${v('m')} = (9 ${MINUS} 5) ÷ (3 ${MINUS} 1) = 2`,`5 = 2 × 1 + ${v('c')}, so ${v('c')} = 3`,M(v('y')+' = 2'+v('x')+' + 3')]},
   traps:[`Doing across ÷ up instead of up ÷ across.`,`Taking the points in a different order on the top and the bottom.`,`Reading off ${v('m')} and ${v('c')} before ${v('y')} is on its own.`],
   exam:`National 5 Paper 1 (no calculator). Usually 3 marks.`}},
 {id:'vol',level:'red',name:'Volume',blurb:'Cylinders, cones, spheres, pyramids and prisms',gen:withPi314(genVol),learn:{
   analogy:`Volume is how many sugar cubes would fill a shape. Prisms and cylinders are stacks of the same slice, like a pile of coins.`,
   key:`Prism or cylinder: area of the end × length. Cone or pyramid: a third of that. Sphere: 4 × ${PI} × r${sup(3)} ÷ 3.`,
   steps:[`Get the radius. Halve the diameter if that's what you're given.`,`Pick the formula for the shape.`,`Cylinder: ${PI} × r${sup(2)} × h. Cone: ${PI} × r${sup(2)} × h ÷ 3.`,`Sphere: 4 × ${PI} × r${sup(3)} ÷ 3. A hemisphere is half of that.`,`Shapes made of two solids: work out each one, then add.`,`1 litre = 1000 cm³.`],
   ex:{q:`A cone has radius 5 cm and height 12 cm. Find its volume.`,lines:[`${PI} × 5${sup(2)} × 12 ÷ 3`,`= 314.159...`,`= 314 cm³ (3 s.f.)`]},
   traps:[`Using the diameter instead of the radius.`,`Forgetting to divide by 3 for cones and pyramids.`,`Mixing litres and cm³. Change litres to cm³ first.`],
   exam:`National 5 Paper 2. Usually 2 to 4 marks, more for shapes made of two solids.`}},
 {id:'fx',level:'red',name:'Foreign Exchange',blurb:'Changing money and finding the best price',gen:genFX,learn:{
   analogy:`An exchange rate is a price tag on money. If £1 buys 1.16 euros, you're buying euros at that price.`,
   key:`Pounds to another currency: multiply by the rate. Another currency to pounds: divide by the rate.`,
   steps:[`Find the rate for £1 in the table.`,`Pounds to foreign money: × the rate.`,`Foreign money to pounds: ÷ the rate.`,`Between two foreign currencies: change to pounds first, then into the new one.`,`Best value: change both prices into pounds, then compare.`],
   ex:{q:`Change £480 into euros at £1 = 1.16 EUR.`,lines:[`480 × 1.16`,`= 556.80 euros`]},
   traps:[`Multiplying when you should divide. Sense check: you get more euros than pounds, but fewer pounds than euros.`,`Forgetting to take off the money spent before changing the rest.`,`Adding a percentage like import duty to the wrong price.`],
   exam:`Calculator. A real-life skill that turns up in problem-solving questions. Usually 2 or 3 marks.`}},
 {id:'alg',level:'red',name:'Algebra (Brackets)',blurb:'Expanding brackets and collecting like terms',gen:genAlg,learn:{
   analogy:`Every term in the first bracket shakes hands with every term in the second. Nobody gets missed.`,
   key:`${M('3('+v('x')+' + 4) = 3'+v('x')+' + 12')}. Two brackets with 2 terms each means 4 handshakes. Then collect like terms.`,
   steps:[`Multiply the number outside by everything inside the bracket.`,`Two brackets: take each term in the first and multiply it by every term in the second.`,`Watch the signs. A minus outside changes every sign inside.`,`Collect like terms: ${v('x')}${sup(2)} with ${v('x')}${sup(2)}, ${v('x')} with ${v('x')}, numbers with numbers.`,`Write the answer with the highest power first.`],
   ex:{q:`Expand and simplify ${M('5('+v('x')+' + 3) '+MINUS+' 3(2'+v('x')+' '+MINUS+' 6)')}`,lines:[M('5'+v('x')+' + 15 '+MINUS+' 6'+v('x')+' + 18'),M('= '+MINUS+v('x')+' + 33')]},
   traps:[`${M(MINUS+'3(2'+v('x')+' '+MINUS+' 6)')} gives ${M(MINUS+'6'+v('x')+' + 18')}. Minus times minus is plus.`,`${M('('+v('x')+' + 2)'+sup(2))} isn't ${M(v('x')+sup(2)+' + 4')}. Write it as ${M('('+v('x')+' + 2)('+v('x')+' + 2)')}.`,`Missing a handshake with a 3-term bracket. There should be 6.`],
   exam:`National 5 Paper 1 (no calculator). Usually 2 or 3 marks.`}}
];

/* ---------- simple explanations ----------
   Rules: 50 words max across both parts, a 10-year-old could follow it, no jargon,
   one everyday example, the idea not the method, one symbol at most. */
const NUT={
 vec:{what:`A vector is a move with a size and a direction, like "3 steps right and 2 steps up". You write it as numbers stacked in a column.`,
      why:`Sat navs and video games use them to describe movement. Adding two vectors is just doing one move, then the next.`},
 sdt:{what:`How fast something goes, how far it travels and how long it takes are all linked. Know any two and you can find the third.`,
      why:`It's how a sat nav guesses when you'll arrive. Drive at 60 miles an hour for half an hour and you've gone 30 miles.`},
 sci:{what:`A short way to write really huge or really tiny numbers, so you don't have to write out loads of zeros.`,
      why:`The Sun is about 150,000,000 km away. Writing all those zeros is slow and easy to get wrong. Scientists and calculators use the short way.`},
 int:{what:`Integers are whole numbers, including the negative ones below zero.`,
      why:`Think of a thermometer in winter. If it's 3 below zero and gets 5 degrees warmer, it's now 2 degrees. Bank balances and golf scores work the same way.`},
 pct:{what:`A percentage means "out of 100". Here you'll see what happens when an amount keeps growing or shrinking, and work backwards to the start.`,
      why:`Savings, house prices and sales all work like this. A £50 jacket with 20% off costs £40.`},
 tol:{what:`Tolerance is how far a measurement is allowed to be from its target and still count as OK.`,
      why:`A factory can't make every bolt exactly 10 cm. If a millimetre either way is allowed, a bolt from 9.9 cm to 10.1 cm passes the check.`},
 pyth:{what:`A rule for triangles with a square corner. If you know two sides, you can work out the third without measuring it.`,
      why:`Builders use it to check corners are square. It also finds shortcuts, like walking diagonally across a football pitch instead of round the edge.`},
 circ:{what:`The circumference is the distance round a circle. The area is the space inside. An arc is part of the edge, and a sector is a slice.`,
      why:`Think of a pizza. The crust is the circumference, the whole pizza is the area, and one slice is a sector.`},
 line:{what:`A straight line on a graph has a steepness, called the gradient, and a point where it crosses the up-and-down line. Its equation tells you both.`,
      why:`Think of a hill. The steeper it is, the bigger the gradient. Ramps, roofs and taxi fares all make straight-line graphs.`},
 vol:{what:`Volume is how much space a 3D shape takes up, or how much it can hold.`,
      why:`It's how you know how much juice fits in a can or how much water fills a fish tank. Each shape has its own rule for working it out.`},
 fx:{what:`Foreign exchange means swapping pounds for another country's money. The exchange rate says how much you get for each pound.`,
      why:`On holiday in Spain you need euros. If each pound buys 1.16 euros, £100 gets you 116 euros. It also shows which country sells something cheaper.`},
 alg:{what:`Brackets group things together. Expanding means multiplying them out so no brackets are left, then tidying up.`,
      why:`It's like a café with 2 breads and 3 fillings. Every bread meets every filling, giving 6 sandwiches. Most algebra starts here.`}
};
TOPICS.forEach(t=>{t.nut=NUT[t.id];});
const PI_TIP=`Can't find the ${PI} button? On most Casio school calculators it's SHIFT then ×10ˣ. If you use 3.14 instead, the app still accepts your answer, but the ${PI} button is more accurate.`;
['circ','vol'].forEach(id=>{const t=TOPICS.find(x=>x.id===id);if(t&&t.learn){(t.learn.traps=t.learn.traps||[]).push(PI_TIP);}});

Study.registerSubject('evan-maths-s3',{
  title:'Maths',
  level:'S3',
  course:'S3 Mathematics · revision booklet',
  intro:'Work through your topics in booklet order. Get 5 right in a row to master a topic. Stuck? Read the Learn tab first, then have a go. Mistakes are how you learn this.',
  topics:TOPICS
});
})();
