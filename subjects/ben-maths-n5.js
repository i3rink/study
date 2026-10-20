/* subjects/ben-maths-n5.js
   Ben, SQA National 5 Mathematics. Content only: topics, simple explanations, Learn content and question generators.
   Topic names follow the SQA National 5 Mathematics Course Specification (C847 75), version 3.0, May 2023. */
(function(){
'use strict';
/* ---------- helpers ---------- */
const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a;};
const MINUS='−';
const sq=r=>`<span class="surd">√<span class="rad">${r}</span></span>`;
const fr=(t,b)=>`<span class="frac"><span class="num">${t}</span><span class="den">${b}</span></span>`;
const v=s=>`<i>${s}</i>`;
const sup=s=>`<sup>${s}</sup>`;
const M=s=>`<span class="m">${s}</span>`;
const n_=n=>n<0?MINUS+Math.abs(n):String(n);
const tidy=n=>String(Number(n.toFixed(6)));
const money=n=>'£'+n.toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});
const pounds=n=>'£'+Math.round(n).toLocaleString('en-GB');
const coef=a=>a===1?'':a;
const rad=d=>d*Math.PI/180;
const fmtB=b=>String(b).padStart(3,'0')+'°';
const NAMES=['Ali','Kirsty','Callum','Eilidh','Ryan','Isla','Lewis','Freya'];


/* ---------- 1. Rationalising ---------- */
function surdFrac(n,d,r){const g=gcd(n,d);n/=g;d/=g;const top=coef(n)+sq(r);return d===1?top:fr(top,d);}
function mcPack(correct,cands){
  const seen=new Set([correct]);const ds=[];
  for(const c of cands){if(!seen.has(c)){seen.add(c);ds.push(c);} if(ds.length===3)break;}
  const opts=shuffle([correct,...ds]);
  return {kind:'mc',options:opts,correct:opts.indexOf(correct),answerText:M(correct)};
}
function genRat(){
  const t=pick([1,1,1,2,3]);
  if(t===1){
    const b=pick([2,3,5,6,7,10,11]);
    const a=pick([b,2*b,3*b,R(2,9),R(2,9)]);
    const correct=surdFrac(a,b,b), g=gcd(a,b);
    const q=mcPack(correct,[coef(a)+sq(b), a>1?fr(sq(b),a):fr(sq(b),b*b), fr(a,b), surdFrac(a,b*b,b), coef(b)+sq(a)]);
    return Object.assign(q,{calc:false,
      prompt:`Rationalise the denominator and simplify ${M(fr(a,sq(b)))}`,
      hint:`${M(sq(b)+' × '+sq(b)+' = '+b)}. Multiply the top and the bottom by ${M(sq(b))}.`,
      working:[
        `Multiply top and bottom by ${M(sq(b))}: ${M(fr(a,sq(b))+' × '+fr(sq(b),sq(b)))}`,
        `The bottom becomes ${M(sq(b)+' × '+sq(b)+' = '+b)}, so you get ${M(fr(coef(a)+sq(b),b))}`,
        g>1?`${a} and ${b} share a factor of ${g}, so cancel: ${M(correct)}`:`Nothing cancels, so ${M(correct)} is the answer.`
      ]});
  }
  if(t===2){
    const [p,q2]=pick([[2,3],[2,5],[3,5],[3,7],[5,7],[2,7],[3,2],[5,3],[7,2],[5,2],[7,3]]);
    const correct=fr(sq(p*q2),q2);
    const q=mcPack(correct,[sq(p*q2),fr(sq(p),q2),fr(sq(p*q2),p),fr(p,q2)]);
    return Object.assign(q,{calc:false,
      prompt:`Rationalise the denominator of ${M(fr(sq(p),sq(q2)))}`,
      hint:`Multiply top and bottom by ${M(sq(q2))}. Remember ${M(sq(p)+' × '+sq(q2)+' = '+sq(p*q2))}.`,
      working:[
        `Multiply top and bottom by ${M(sq(q2))}`,
        `Top: ${M(sq(p)+' × '+sq(q2)+' = '+sq(p*q2))}. Bottom: ${M(sq(q2)+' × '+sq(q2)+' = '+q2)}`,
        `Answer: ${M(correct)}`
      ]});
  }
  const b=pick([2,3,5,7]), c=R(2,5);
  const a=pick([c*b,2*b,c*2,R(3,15)]);
  const correct=surdFrac(a,c*b,b), g=gcd(a,c*b);
  const q=mcPack(correct,[surdFrac(a,c,b),coef(a)+sq(b),surdFrac(a,c*b*b,b),fr(a,c*b)]);
  return Object.assign(q,{calc:false,
    prompt:`Rationalise the denominator and simplify ${M(fr(a,c+sq(b)))}`,
    hint:`Only the surd needs moving. Multiply top and bottom by ${M(sq(b))}, then the bottom is ${M(c+' × '+b)}.`,
    working:[
      `Multiply top and bottom by ${M(sq(b))}`,
      `Bottom: ${M(c+sq(b)+' × '+sq(b)+' = '+c+' × '+b+' = '+(c*b))}. So you get ${M(fr(coef(a)+sq(b),c*b))}`,
      g>1?`Cancel the common factor of ${g}: ${M(correct)}`:`Nothing cancels, so ${M(correct)} is the answer.`
    ]});
}

/* ---------- 2. Changing the subject ---------- */
function genSub(){
  const T=[
    ()=>{const a=R(2,9),b=R(1,12),plus=Math.random()<.5;
      const op=plus?'+':MINUS, inv=plus?MINUS:'+';
      return {f:`${v('y')} = ${a}${v('x')} ${op} ${b}`,t:'x',
        c:fr(`${v('y')} ${inv} ${b}`,a),
        d:[fr(`${v('y')} ${op} ${b}`,a),`${fr(v('y'),a)} ${inv} ${b}`,`${a}(${v('y')} ${inv} ${b})`],
        w:[`${plus?'Subtract':'Add'} ${b} ${plus?'from':'to'} both sides: ${M(`${v('y')} ${inv} ${b} = ${a}${v('x')}`)}`,`Divide the whole of both sides by ${a}`]};},
    ()=>({f:`${v('P')} = 2(${v('l')} + ${v('w')})`,t:'l',c:`${fr(v('P'),2)} ${MINUS} ${v('w')}`,
      d:[fr(`${v('P')} ${MINUS} ${v('w')}`,2),`${fr(v('P'),2)} + ${v('w')}`,`${v('P')} ${MINUS} 2${v('w')}`],
      w:[`Divide both sides by 2: ${M(`${fr(v('P'),2)} = ${v('l')} + ${v('w')}`)}`,`Subtract ${M(v('w'))} from both sides`]}),
    ()=>({f:`${v('A')} = π${v('r')}${sup(2)}`,t:'r',c:sq(fr(v('A'),'π')),
      d:[fr(v('A'),'2π'),fr(sq(v('A')),'π')+'&#8203;'+'',fr(v('A'),'π'),sq(v('A')+'π')],
      w:[`Divide both sides by π: ${M(`${fr(v('A'),'π')} = ${v('r')}${sup(2)}`)}`,`Square root both sides. The root covers the whole fraction.`]}),
    ()=>({f:`${v('v')} = ${v('u')} + ${v('a')}${v('t')}`,t:'t',c:fr(`${v('v')} ${MINUS} ${v('u')}`,v('a')),
      d:[fr(`${v('v')} + ${v('u')}`,v('a')),`${fr(v('v'),v('a'))} ${MINUS} ${v('u')}`,`${v('a')}(${v('v')} ${MINUS} ${v('u')})`],
      w:[`Subtract ${M(v('u'))}: ${M(`${v('v')} ${MINUS} ${v('u')} = ${v('a')}${v('t')}`)}`,`Divide both sides by ${M(v('a'))}`]}),
    ()=>({f:`${v('E')} = ${fr(1,2)}${v('m')}${v('v')}${sup(2)}`,t:'v',c:sq(fr('2'+v('E'),v('m'))),
      d:[sq(fr(v('E'),'2'+v('m'))),fr('2'+v('E'),v('m')),sq('2'+v('E')+v('m'))],
      w:[`Multiply both sides by 2: ${M(`2${v('E')} = ${v('m')}${v('v')}${sup(2)}`)}`,`Divide by ${M(v('m'))}: ${M(`${fr('2'+v('E'),v('m'))} = ${v('v')}${sup(2)}`)}`,`Square root both sides`]}),
    ()=>({f:`${v('s')} = ${fr(v('d'),v('t'))}`,t:'t',c:fr(v('d'),v('s')),
      d:[v('d')+v('s'),fr(v('s'),v('d')),`${v('d')} ${MINUS} ${v('s')}`],
      w:[`Multiply both sides by ${M(v('t'))}: ${M(`${v('s')}${v('t')} = ${v('d')}`)}`,`Divide both sides by ${M(v('s'))}`]}),
    ()=>{const a=R(2,9),b=R(2,6);
      return {f:`${v('y')} = ${fr(`${v('x')} + ${a}`,b)}`,t:'x',c:`${b}${v('y')} ${MINUS} ${a}`,
        d:[`${b}(${v('y')} ${MINUS} ${a})`,`${fr(v('y'),b)} ${MINUS} ${a}`,`${b}${v('y')} + ${a}`],
        w:[`Multiply both sides by ${b}: ${M(`${b}${v('y')} = ${v('x')} + ${a}`)}`,`Subtract ${a} from both sides`]};},
    ()=>{const k=R(2,6);
      return {f:`${v('Q')} = ${k}${sq(v('h'))}`,t:'h',c:`(${fr(v('Q'),k)})${sup(2)}`,
        d:[fr(v('Q')+sup(2),k),sq(fr(v('Q'),k)),`(${v('Q')} ${MINUS} ${k})${sup(2)}`],
        w:[`Divide both sides by ${k}: ${M(`${fr(v('Q'),k)} = ${sq(v('h'))}`)}`,`Square both sides to undo the square root`]};},
    ()=>{const a=R(2,5),c=R(1,9);
      return {f:`${v('y')} = ${a}${v('x')}${sup(2)} + ${c}`,t:'x',c:sq(fr(`${v('y')} ${MINUS} ${c}`,a)),
        d:[sq(fr(`${v('y')} + ${c}`,a)),fr(`${v('y')} ${MINUS} ${c}`,2*a),`${sq(fr(v('y'),a))} ${MINUS} ${c}`],
        w:[`Subtract ${c}: ${M(`${v('y')} ${MINUS} ${c} = ${a}${v('x')}${sup(2)}`)}`,`Divide by ${a}`,`Square root both sides`]};}
  ];
  const t=pick(T)();
  const lead=v(t.t)+' = ';
  const opts=shuffle([lead+t.c,...t.d.map(x=>lead+x)]);
  const correct=lead+t.c;
  return {kind:'mc',options:opts,correct:opts.indexOf(correct),calc:false,
    prompt:`Make ${M(v(t.t))} the subject of ${M(t.f)}`,
    hint:`Work out what's been done to ${M(v(t.t))}, then undo it in reverse order.`,
    working:[...t.w,`So ${M(correct)}`],answerText:M(correct)};
}

/* ---------- 3. Appreciation ---------- */
function genApp(){
  const t=pick([1,1,2,3,4]);
  if(t===1||t===4){
    const dep=t===4;
    const V=dep?R(12,30)*1000:R(24,56)*5000;
    const r=dep?pick([8,10,12,15,18,20]):pick([2,2.5,3,3.5,4,4.5,5,6]);
    const n=R(2,dep?4:5), m=dep?1-r/100:1+r/100, ms=tidy(m);
    const ex=V*Math.pow(m,n), ans=Math.round(ex);
    return {kind:'num',pre:'£',answer:ans,tol:1,calc:true,
      prompt:dep?`A car is bought for ${pounds(V)}. It depreciates by ${r}% per annum. What is it worth after ${n} years? Give your answer to the nearest pound.`
               :`A house is valued at ${pounds(V)}. Its value appreciates by ${r}% per annum. What will it be worth after ${n} years? Give your answer to the nearest pound.`,
      hint:dep?`Going down by ${r}% leaves ${100-r}%, so the multiplier is ${ms}.`:`Going up by ${r}% gives a multiplier of ${ms}.`,
      working:[`${dep?'Down':'Up'} ${r}% each year, so the multiplier is ${ms}`,`${pounds(V)} × ${ms}${sup(n)}`,`= ${money(ex)}`,`= ${pounds(ans)} to the nearest pound`],
      answerText:pounds(ans)};
  }
  if(t===2){
    const P=R(20,160)*50, r=pick([1.5,2,2.5,3,3.5,4]), n=R(2,4), m=1+r/100, ms=tidy(m), who=pick(NAMES);
    const ex=P*Math.pow(m,n), ans=Math.round(ex*100)/100;
    return {kind:'num',pre:'£',answer:ans,tol:0.011,calc:true,
      prompt:`${who} puts ${pounds(P)} into a savings account paying ${r}% compound interest per annum. How much will be in the account after ${n} years? Give your answer to the nearest penny.`,
      hint:`Compound interest works exactly like appreciation. Multiplier ${ms}, power ${n}.`,
      working:[`Multiplier is ${ms}`,`${pounds(P)} × ${ms}${sup(n)} = ${money(ans)}`],answerText:money(ans)};
  }
  const V=R(4,30)*500, r1=pick([4,5,6,8,10]), r2=pick([2,2.5,3,3.5]), k=R(2,3);
  const m1=1+r1/100, m2=1+r2/100, ex=V*m1*Math.pow(m2,k), ans=Math.round(ex);
  return {kind:'num',pre:'£',answer:ans,tol:1,calc:true,
    prompt:`A painting is worth ${pounds(V)}. Its value rises by ${r1}% in the first year, then by ${r2}% in each of the next ${k} years. What is it worth at the end? Give your answer to the nearest pound.`,
    hint:`Two different multipliers. Use ${tidy(m1)} once, then ${tidy(m2)} ${k} times.`,
    working:[`First year multiplier: ${tidy(m1)}. After that: ${tidy(m2)}`,`${pounds(V)} × ${tidy(m1)} × ${tidy(m2)}${sup(k)}`,`= ${money(ex)}`,`= ${pounds(ans)} to the nearest pound`],
    answerText:pounds(ans)};
}

/* ---------- 4. Bearings ---------- */
function ptOn(cx,cy,r,b){return [cx+r*Math.sin(rad(b)),cy-r*Math.cos(rad(b))];}
function northLine(x,y,len){
  return `<line x1="${x}" y1="${y}" x2="${x}" y2="${y-len}" class="nl"/><path d="M${x-4} ${y-len+7} L${x} ${y-len} L${x+4} ${y-len+7}" class="nl" fill="none"/><text x="${x}" y="${y-len-6}" class="nt">N</text>`;
}
function svgRays(rays,centre){
  const W=260,H=240,cx=130,cy=120;
  let s=`<svg viewBox="0 0 ${W} ${H}" class="diag" role="img" aria-label="Sketch of the bearings">`+northLine(cx,cy,72);
  rays.forEach(r=>{
    const [x,y]=ptOn(cx,cy,88,r.b),[lx,ly]=ptOn(cx,cy,104,r.b);
    if(r.arc){const [ax,ay]=ptOn(cx,cy,26,r.b);s+=`<path d="M${cx} ${cy-26} A26 26 0 ${r.b>180?1:0} 1 ${ax.toFixed(1)} ${ay.toFixed(1)}" class="arc"/>`;}
    s+=`<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" class="ray"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5" class="dot"/><text x="${lx.toFixed(1)}" y="${(ly+5).toFixed(1)}" class="lb">${r.label}</text>`;
  });
  return s+`<circle cx="${cx}" cy="${cy}" r="3.5" class="dot"/><text x="${cx-14}" y="${cy+18}" class="lb">${centre}</text><text x="6" y="${H-6}" class="cap">Not to scale</text></svg>`;
}
function svgTrip(x,y,d1,d2,dash){
  const W=280,H=250,pad=34,top=52;
  const A=[0,0],B=[d1*Math.sin(rad(x)),-d1*Math.cos(rad(x))],C=[B[0]+d2*Math.sin(rad(y)),B[1]-d2*Math.cos(rad(y))];
  const P=[A,B,C],xs=P.map(p=>p[0]),ys=P.map(p=>p[1]);
  const minx=Math.min(...xs),maxx=Math.max(...xs),miny=Math.min(...ys),maxy=Math.max(...ys);
  const w=Math.max(maxx-minx,1),h=Math.max(maxy-miny,1);
  const sc=Math.min((W-2*pad)/w,(H-top-pad)/h);
  const ox=pad+((W-2*pad)-w*sc)/2, oy=top+((H-top-pad)-h*sc)/2;
  const mp=p=>[ox+(p[0]-minx)*sc,oy+(p[1]-miny)*sc];
  const [a,b,c]=P.map(mp);
  const gx=(a[0]+b[0]+c[0])/3,gy=(a[1]+b[1]+c[1])/3;
  const lab=(p,t)=>{let dx=p[0]-gx,dy=p[1]-gy;const L=Math.hypot(dx,dy)||1;return `<text x="${(p[0]+dx/L*16).toFixed(1)}" y="${(p[1]+dy/L*16+5).toFixed(1)}" class="lb">${t}</text>`;};
  const f=n=>n.toFixed(1);
  let s=`<svg viewBox="0 0 ${W} ${H}" class="diag" role="img" aria-label="Sketch of the journey from A to B to C">`;
  s+=northLine(f(a[0]),a[1],36)+northLine(f(b[0]),b[1],36);
  s+=`<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" class="ray"/><line x1="${f(b[0])}" y1="${f(b[1])}" x2="${f(c[0])}" y2="${f(c[1])}" class="ray"/>`;
  if(dash) s+=`<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(c[0])}" y2="${f(c[1])}" class="dash"/>`;
  [a,b,c].forEach(p=>s+=`<circle cx="${f(p[0])}" cy="${f(p[1])}" r="3.5" class="dot"/>`);
  s+=lab(a,'A')+lab(b,'B')+lab(c,'C');
  return s+`<text x="6" y="${H-6}" class="cap">Not to scale</text></svg>`;
}
function tripAngles(){
  let x,y,back,d,ang,tries=0;
  do{x=R(20,160);y=R(0,359);back=(x+180)%360;d=Math.abs(y-back);ang=d>180?360-d:d;tries++;}while((ang<35||ang>145)&&tries<500);
  return {x,y,back,d,ang};
}
function genBear(){
  const t=pick([1,1,2,3,3,4]);
  if(t===1){
    let b;do{b=R(1,359);}while(b===180);
    const back=(b+180)%360||360;
    return {kind:'num',post:'°',answer:back,tol:0,calc:false,im:'decimal',
      prompt:`The bearing of B from A is ${fmtB(b)}. What is the bearing of A from B?`,
      diagram:svgRays([{b,label:'B',arc:true}],'A'),
      hint:`Stand at B and look back at A. You're facing the exact opposite way, which is 180° round.`,
      working:[b<180?`${fmtB(b)} is less than 180°, so add 180: ${b} + 180 = ${back}`:`${fmtB(b)} is more than 180°, so subtract 180: ${b} ${MINUS} 180 = ${back}`,`Bearing of A from B is ${fmtB(back)}`],
      answerText:fmtB(back)};
  }
  if(t===2){
    const b1=R(10,170),b2=Math.min(b1+R(30,150),350);
    return {kind:'num',post:'°',answer:b2-b1,tol:0,calc:false,im:'decimal',
      prompt:`From a lighthouse L, boat P is on a bearing of ${fmtB(b1)} and boat Q is on a bearing of ${fmtB(b2)}. Calculate the size of angle PLQ.`,
      diagram:svgRays([{b:b1,label:'P'},{b:b2,label:'Q'}],'L'),
      hint:`Both bearings are measured from the same North line, so the angle between them is the difference.`,
      working:[`Both are measured clockwise from North at L`,`Angle PLQ = ${b2} ${MINUS} ${b1} = ${b2-b1}°`],answerText:(b2-b1)+'°'};
  }
  const {x,y,back,d,ang}=tripAngles();
  const angLines=[`Draw a North line at B`,`The bearing of A from B is the back bearing: ${x} + 180 = ${back}°`,
    d>180?`Gap between ${fmtB(back)} and ${fmtB(y)} is ${d}°, which is the outside. Inside is 360 ${MINUS} ${d} = ${ang}°`:`Gap between ${fmtB(back)} and ${fmtB(y)} is ${Math.max(y,back)} ${MINUS} ${Math.min(y,back)} = ${ang}°`,
    `So angle ABC = ${ang}°`];
  if(t===3){
    return {kind:'num',post:'°',answer:ang,tol:0,calc:false,im:'decimal',
      prompt:`A ship sails from A to B on a bearing of ${fmtB(x)}. It then turns and sails from B to C on a bearing of ${fmtB(y)}. Calculate the size of angle ABC.`,
      diagram:svgTrip(x,y,50,42,false),
      hint:`Stand at B. Work out the bearing back to A first, then find the gap to the bearing of C.`,
      working:angLines,answerText:ang+'°'};
  }
  const d1=R(20,80),d2=R(20,80);
  const val=d1*d1+d2*d2-2*d1*d2*Math.cos(rad(ang)), ac=Math.round(Math.sqrt(val)*10)/10;
  return {kind:'num',post:'km',answer:ac,tol:0.1,calc:true,
    prompt:`A ship sails ${d1} km from A to B on a bearing of ${fmtB(x)}. It then sails ${d2} km from B to C on a bearing of ${fmtB(y)}. Calculate the distance AC. Give your answer to 1 decimal place.`,
    diagram:svgTrip(x,y,d1,d2,true),
    hint:`Find angle ABC first using the North line at B. Then you've got two sides and the angle between them, so it's the cosine rule.`,
    working:[...angLines,`Cosine rule: AC${sup(2)} = ${d1}${sup(2)} + ${d2}${sup(2)} ${MINUS} 2 × ${d1} × ${d2} × cos ${ang}°`,`AC${sup(2)} = ${val.toFixed(2)}`,`AC = √${val.toFixed(2)} = ${ac} km`],
    answerText:ac+' km'};
}

/* ---------- 5. Expanding brackets ---------- */
function termS(c,p,first){
  const a=Math.abs(c), body=(a===1&&p>0?'':a)+(p>0?v('x'):'')+(p>1?sup(p):'');
  if(first) return (c<0?MINUS:'')+body;
  return (c<0?` ${MINUS} `:' + ')+body;
}
const brk=T=>'('+T.map((t,i)=>termS(t[0],t[1],i===0)).join('')+')';
const wrapT=(c,p)=>c<0?'('+termS(c,p,true)+')':termS(c,p,true);
function poly(co){const deg=co.length-1;let out='';co.forEach((c,i)=>{if(c===0)return;out+=termS(c,deg-i,out==='');});return out||'0';}
function genExp(){
  const nz=()=>{let n=0;while(!n)n=R(-9,9);return n;};
  const t=pick([1,1,2,3,4,4]);
  let A,B;
  if(t===1){A=[[1,1],[nz(),0]];B=[[1,1],[nz(),0]];}
  if(t===2){A=[[R(2,5),1],[nz(),0]];B=[[R(2,4),1],[nz(),0]];}
  if(t===3){A=[[1,1],[nz(),0]];B=A;}
  if(t===4){A=[[1,1],[nz(),0]];B=[[1,2],[nz(),1],[nz(),0]];}
  const prods=[];A.forEach(a=>B.forEach(b=>prods.push([a,b,[a[0]*b[0],a[1]+b[1]]])));
  const deg=Math.max(...prods.map(p=>p[2][1]));
  const co=Array(deg+1).fill(0);prods.forEach(p=>co[deg-p[2][1]]+=p[2][0]);
  const parts=[],fields=[];let k=0;
  co.forEach((c,i)=>{const p=deg-i,xs=p>0?v('x')+(p>1?sup(p):''):'';
    if(i===0&&c===1)parts.push(xs);else{parts.push(`{${k}}`+xs);fields.push({answer:c,tol:0});k++;}});
  const shown=t===3?brk(A)+sup(2):brk(A)+brk(B);
  const w=[];
  if(t===3)w.push(`Write it out twice: ${M(brk(A)+brk(A))}`);
  w.push(`${prods.length} handshakes:`+'<br>'+prods.map(p=>M(`${wrapT(...p[0])} × ${wrapT(...p[1])} = ${termS(p[2][0],p[2][1],true)}`)).join('<br>'));
  w.push(`Collect like terms: ${M(poly(co))}`);
  return {kind:'fields',fields,template:parts.join(' + '),calc:false,
    prompt:`Expand and simplify ${M(shown)}`,
    note:`Type negative numbers with a minus sign, like -6. Type 0 if a term cancels out.`,
    hint:`Every term in the first bracket multiplies every term in the second. That's ${prods.length} multiplications, then collect like terms.`,
    working:w,answerText:M(poly(co))};
}

/* ---------- 6. Percentages backwards ---------- */
function genPct(){
  const t=pick([1,2,3,4]);
  if(t===1){
    const O=R(15,480),F=O*1.2,item=pick(['games console','pair of trainers','bike','laptop','jacket','set of headphones']);
    return {kind:'num',pre:'£',answer:O,tol:0.011,calc:true,
      prompt:`A ${item} costs ${money(F)} including VAT at 20%. What was the price before VAT was added?`,
      hint:`The price with VAT is 120% of the original. Don't take 20% off ${money(F)}.`,
      working:[`Including VAT means the price is 120% of the original`,`120% as a multiplier is 1.2`,`Original = ${money(F)} ÷ 1.2 = ${money(O)}`,`Check: ${money(O)} × 1.2 = ${money(F)}`],answerText:money(O)};
  }
  if(t===2){
    const x=pick([10,15,20,25,30,35,40]),O=R(3,40)*20,Y=O*(100-x)/100,item=pick(['sofa','TV','fridge','bed','washing machine']);
    const ms=tidy((100-x)/100);
    return {kind:'num',pre:'£',answer:O,tol:0.011,calc:true,
      prompt:`In a sale, everything is reduced by ${x}%. A ${item} now costs ${money(Y)}. What was the original price?`,
      hint:`After ${x}% off, you're paying ${100-x}% of the original.`,
      working:[`After ${x}% off you pay ${100-x}%`,`${100-x}% as a multiplier is ${ms}`,`Original = ${money(Y)} ÷ ${ms} = ${money(O)}`,`Check: ${money(O)} × ${ms} = ${money(Y)}`],answerText:money(O)};
  }
  if(t===3){
    const O=R(180,450)*100,r=pick([2,2.5,3,3.5,4,5]),S=O*(1+r/100),who=pick(NAMES),ms=tidy(1+r/100);
    return {kind:'num',pre:'£',answer:O,tol:0.011,calc:true,
      prompt:`After a ${r}% pay rise, ${who} earns ${money(S)} a year. What did ${who} earn before the rise?`,
      hint:`The new salary is ${100+r}% of the old one.`,
      working:[`New salary is ${100+r}% of the old one`,`Multiplier is ${ms}`,`Old salary = ${money(S)} ÷ ${ms} = ${money(O)}`],answerText:money(O)};
  }
  const O=R(15,60)*2500,r=pick([2,3,4,5]),n=R(2,4),m=1+r/100,Z=Math.round(O*Math.pow(m,n)),mn=Math.pow(m,n),ex=Z/mn;
  return {kind:'num',pre:'£',answer:Math.round(ex),tol:1.5,calc:true,
    prompt:`A flat has appreciated by ${r}% each year for ${n} years. It's now worth ${pounds(Z)}. What was it worth ${n} years ago? Give your answer to the nearest pound.`,
    hint:`Going forwards would be × ${tidy(m)}${sup(n)}. So go backwards by dividing.`,
    working:[`Multiplier each year is ${tidy(m)}`,`Over ${n} years that's ${tidy(m)}${sup(n)} = ${tidy(mn)}`,`Original = ${pounds(Z)} ÷ ${tidy(mn)} = ${money(ex)}`,`= ${pounds(ex)} to the nearest pound`],answerText:pounds(ex)};
}

/* ---------- 7. Scientific notation ---------- */
function grp(s){const [i,d]=s.split('.');const g=i.replace(/\B(?=(\d{3})+(?!\d))/g,' ');return d?g+'.'+d:g;}
function sciParts(){
  const d=''+R(1,9)+R(0,9)+R(1,9);
  let e;do{e=R(-6,9);}while(e===0);
  const mant=Number(d[0]+'.'+d.slice(1));
  let str;
  if(e>=2) str=d+'0'.repeat(e-2);
  else if(e===1) str=d.slice(0,2)+'.'+d[2];
  else str='0.'+'0'.repeat(-e-1)+d;
  return {mant,e,str};
}
const sciTpl=`{0} × 10<span class="pow">{1}</span>`;
const sciShow=(a,e)=>M(`${a} × 10${sup(n_(e))}`);
function genSci(){
  const t=pick([1,1,2,3,4]);
  if(t===1){
    const {mant,e,str}=sciParts();
    return {kind:'fields',fields:[{answer:mant,tol:1e-6},{answer:e,tol:0}],template:sciTpl,calc:false,
      prompt:`Write ${M(grp(str))} in scientific notation.`,
      note:`First box: the number between 1 and 10. Second box: the power. Use a minus sign for negative powers.`,
      hint:`Put the decimal point after the first non-zero digit. ${e>0?'Big number, so the power is positive.':'Smaller than 1, so the power is negative.'}`,
      working:[`Put the point after the first non-zero digit: ${mant}`,`To get from ${mant} back to ${grp(str)}, the point moves ${Math.abs(e)} place${Math.abs(e)>1?'s':''} to the ${e>0?'right':'left'}`,`${e>0?'Big number, positive power':'Small number, negative power'}: ${sciShow(mant,e)}`],
      answerText:sciShow(mant,e)};
  }
  if(t===2){
    const {mant,e,str}=sciParts();
    return {kind:'num',answer:Number(str),rel:true,calc:false,im:'decimal',
      prompt:`Write ${sciShow(mant,e)} as an ordinary number.`,
      hint:`The power tells you how many places to move the point. ${e>0?'Positive, so move right and the number gets bigger.':'Negative, so move left and the number gets smaller.'}`,
      working:[`Power is ${n_(e)}, so move the point ${Math.abs(e)} place${Math.abs(e)>1?'s':''} to the ${e>0?'right':'left'}`,`Fill any gaps with zeros: ${grp(str)}`],answerText:grp(str)};
  }
  if(t===3){
    const a=R(2,9),b=R(2,9),p=R(-5,8),q=R(-5,8);let c=a*b,e=p+q;const big=c>=10;if(big){c=c/10;e+=1;}
    return {kind:'fields',fields:[{answer:c,tol:1e-6},{answer:e,tol:0}],template:sciTpl,calc:false,
      prompt:`Calculate ${M(`(${a} × 10${sup(n_(p))}) × (${b} × 10${sup(n_(q))})`)}. Give your answer in scientific notation.`,
      note:`Use a minus sign for negative powers.`,
      hint:`Multiply the front numbers. Add the powers. Then check the front number is less than 10.`,
      working:[`Front numbers: ${a} × ${b} = ${a*b}`,`Powers: ${n_(p)} + ${q<0?'('+n_(q)+')':q} = ${n_(p+q)}`,big?`${a*b} isn't less than 10, so write it as ${c} × 10${sup(1)} and add 1 to the power: ${sciShow(c,e)}`:`So the answer is ${sciShow(c,e)}`],
      answerText:sciShow(c,e)};
  }
  let b,c,a;do{b=pick([2,3,4,5]);c=pick([1.2,1.5,2,2.5,3,1.6,1.8,2.2]);a=Number((b*c).toFixed(2));}while(a>=10);
  const p=R(-3,9),q=R(-4,6),e=p-q;
  return {kind:'fields',fields:[{answer:c,tol:1e-6},{answer:e,tol:0}],template:sciTpl,calc:false,
    prompt:`Calculate ${M(`(${a} × 10${sup(n_(p))}) ÷ (${b} × 10${sup(n_(q))})`)}. Give your answer in scientific notation.`,
    note:`Use a minus sign for negative powers.`,
    hint:`Divide the front numbers. Subtract the powers. Careful with minus a minus.`,
    working:[`Front numbers: ${a} ÷ ${b} = ${c}`,`Powers: ${n_(p)} ${MINUS} ${q<0?'('+n_(q)+')':q} = ${n_(e)}`,`So the answer is ${sciShow(c,e)}`],answerText:sciShow(c,e)};
}

/* ---------- 8. Indices ---------- */
const xp=e=>M(v('x')+sup(e));
function genInd(){
  const t=pick([1,2,3,4,5,6,6,7]);
  const pw=`<span class="pow">{0}</span>`;
  if(t===1){const a=R(2,9),b=R(2,9);
    return {kind:'fields',fields:[{answer:a+b,tol:0}],template:M(v('x'))+pw,calc:false,prompt:`Simplify ${M(v('x')+sup(a)+' × '+v('x')+sup(b))}`,
      hint:`Multiplying the same letter? Add the powers.`,working:[`Multiplying, so add the powers: ${a} + ${b} = ${a+b}`,`Answer: ${xp(a+b)}`],answerText:xp(a+b)};}
  if(t===2){const a=R(4,12),b=R(2,9);
    return {kind:'fields',fields:[{answer:a-b,tol:0}],template:M(v('x'))+pw,calc:false,prompt:`Simplify ${M(v('x')+sup(a)+' ÷ '+v('x')+sup(b))}`,
      note:`Use a minus sign if the power is negative.`,hint:`Dividing the same letter? Subtract the powers.`,working:[`Dividing, so subtract the powers: ${a} ${MINUS} ${b} = ${n_(a-b)}`,`Answer: ${xp(n_(a-b))}`],answerText:xp(n_(a-b))};}
  if(t===3){const a=R(2,6),b=R(2,5);
    return {kind:'fields',fields:[{answer:a*b,tol:0}],template:M(v('x'))+pw,calc:false,prompt:`Simplify ${M('('+v('x')+sup(a)+')'+sup(b))}`,
      hint:`A power of a power? Multiply them.`,working:[`Power of a power, so multiply: ${a} × ${b} = ${a*b}`,`Answer: ${xp(a*b)}`],answerText:xp(a*b)};}
  if(t===4){const c1=R(2,7),c2=R(2,6),a=R(2,8),b=R(2,8);
    return {kind:'fields',fields:[{answer:c1*c2,tol:0},{answer:a+b,tol:0}],template:`{0}${M(v('x'))}<span class="pow">{1}</span>`,calc:false,
      prompt:`Simplify ${M(c1+v('x')+sup(a)+' × '+c2+v('x')+sup(b))}`,
      hint:`Numbers and powers get treated differently. Multiply the numbers. Add the powers.`,
      working:[`Multiply the numbers: ${c1} × ${c2} = ${c1*c2}`,`Add the powers: ${a} + ${b} = ${a+b}`,`Answer: ${M(c1*c2+v('x')+sup(a+b))}`],answerText:M(c1*c2+v('x')+sup(a+b))};}
  if(t===5){const [base,n]=pick([[2,2],[2,3],[2,4],[3,2],[3,3],[4,2],[5,2],[10,2],[10,3],[2,5]]);const den=Math.pow(base,n);
    return {kind:'num',answer:1/den,tol:1e-9,calc:false,im:'text',prompt:`Evaluate ${M(base+sup(MINUS+n))}. You can type a fraction like 1/8.`,
      hint:`A negative power means "one over". It doesn't make the answer negative.`,
      working:[`${M(base+sup(MINUS+n)+' = '+fr(1,base+sup(n)))}`,`${M(base+sup(n))} = ${den}, so the answer is ${M(fr(1,den))}`],answerText:M(fr(1,den))};}
  if(t===6){const [base,num,dn,ans]=pick([[8,2,3,4],[27,2,3,9],[16,3,4,8],[25,3,2,125],[64,2,3,16],[9,3,2,27],[32,2,5,4],[4,5,2,32],[81,3,4,27],[100,3,2,1000],[125,2,3,25],[16,1,4,2],[49,1,2,7],[1000,2,3,100],[4,3,2,8]]);
    const root=Math.round(Math.pow(base,1/dn)),nm={2:'square',3:'cube',4:'fourth',5:'fifth'}[dn];
    return {kind:'num',answer:ans,tol:0,calc:false,im:'text',prompt:`Evaluate ${M(base+sup(num+'/'+dn))}`,
      hint:`Bottom of the fraction is the root. Top is the power. Do the root first to keep the numbers small.`,
      working:[`Bottom is ${dn}, so take the ${nm} root of ${base}: ${root}`,num===1?`Top is 1, so that's it: ${ans}`:`Top is ${num}, so ${root}${sup(num)} = ${ans}`],answerText:String(ans)};}
  let p,q;do{p=R(1,9);q=R(1,9);}while((p+q)%2!==0||p%2===0||q%2===0);
  return {kind:'fields',fields:[{answer:(p+q)/2,tol:0}],template:M(v('x'))+pw,calc:false,
    prompt:`Simplify ${M(v('x')+sup(p+'/2')+' × '+v('x')+sup(q+'/2'))}`,
    hint:`Same rule as always. Multiplying, so add the powers. Fractions with the same bottom just add on top.`,
    working:[`Add the powers: ${p}/2 + ${q}/2 = ${p+q}/2 = ${(p+q)/2}`,`Answer: ${xp((p+q)/2)}`],answerText:xp((p+q)/2)};
}

/* ---------- topics (default priority order from the parent) ---------- */
const TOPICS=[
 {id:'rat',level:'red',name:'Rationalising the denominator',blurb:'Getting the surd off the bottom of a fraction',gen:genRat,learn:{
   analogy:`A surd on the bottom of a fraction is like muddy boots on the carpet. The maths isn't wrong, it's just not allowed to stay there. You move it to the top, where it's fine.`,
   key:`${M(sq(v('a'))+' × '+sq(v('a'))+' = '+v('a'))}. That's the whole trick. A surd times itself gives a whole number. So ${M(sq(5)+' × '+sq(5)+' = 5')}.`,
   steps:[`Look at the surd on the bottom.`,`Multiply the top AND the bottom by that surd. You're really multiplying by 1, so the value doesn't change.`,`The bottom becomes a whole number.`,`Cancel down if the top and bottom share a factor.`],
   ex:{q:`Rationalise ${M(fr(6,sq(3)))}`,lines:[M(fr(6,sq(3))+' × '+fr(sq(3),sq(3))),M('= '+fr('6'+sq(3),3)),M('= 2'+sq(3))]},
   traps:[`Only multiplying the bottom. That changes the value of the fraction.`,`Thinking ${M(sq(3)+' × '+sq(3))} is 9. It's 3.`,`Not cancelling at the end. ${M(fr('6'+sq(3),3))} isn't finished.`],
   exam:`Paper 1 (non-calculator). Usually 2 marks.`}},
 {id:'sub',level:'red',name:'Changing the subject of a formula',blurb:'Rearranging a formula to get a different letter on its own',gen:genSub,learn:{
   analogy:`Your letter is a present wrapped in layers. To get it out, you unwrap in reverse. The last layer that went on is the first one to come off.`,
   key:`Opposites undo each other. Add and subtract. Multiply and divide. Square and square root.`,
   steps:[`Find the letter you want.`,`Work out what's been done to it, in order. In ${M(v('v')+' = '+v('u')+' + '+v('a')+v('t'))}, ${M(v('t'))} was multiplied by ${M(v('a'))}, then ${M(v('u'))} was added.`,`Undo those steps in reverse order with the opposite operation.`,`Whatever you do, do it to the whole of both sides.`,`Finish with the new letter on its own on the left.`],
   ex:{q:`Make ${M(v('t'))} the subject of ${M(v('v')+' = '+v('u')+' + '+v('a')+v('t'))}`,lines:[`Subtract ${M(v('u'))}: ${M(v('v')+' '+MINUS+' '+v('u')+' = '+v('a')+v('t'))}`,`Divide by ${M(v('a'))}: ${M(v('t')+' = '+fr(v('v')+' '+MINUS+' '+v('u'),v('a')))}`]},
   traps:[`Dividing only part of a side. If you divide by ${M(v('a'))}, the whole of ${M(v('v')+' '+MINUS+' '+v('u'))} goes over ${M(v('a'))}.`,`Undoing in the wrong order. Deal with anything added or taken away before you divide.`,`When you undo a square, the square root covers everything on that side.`],
   exam:`Paper 1 or 2. Usually 2 or 3 marks.`}},
 {id:'app',level:'red',name:'Appreciation and depreciation',blurb:'Values going up or down by a percentage every year',gen:genApp,learn:{
   analogy:`A snowball rolling downhill. Each year it grows by a percentage of how big it already is, so the growth gets bigger every year.`,
   key:`Use a multiplier. Up 3% means × 1.03. Up 2.5% means × 1.025. Down 15% means × 0.85.`,
   steps:[`Turn the percentage into a multiplier.`,`Raise it to the power of the number of years.`,`Multiply by the starting value.`,`Round only at the very end, the way the question tells you.`],
   ex:{q:`A house worth £180,000 appreciates by 3% per annum. What is it worth after 4 years?`,lines:[`Multiplier = 1.03`,`£180,000 × 1.03${sup(4)}`,`= £202,591.59`,`= £202,592 to the nearest pound`]},
   traps:[`Doing 3% × 4 = 12%. That gives £201,600, which is wrong. Each year's 3% is on the new, bigger value.`,`Rounding each year as you go. Keep the full number on your calculator.`,`Mixing up appreciation (going up) with depreciation (going down).`],
   exam:`Paper 2 (calculator). Usually 3 marks. "Per annum" just means per year.`}},
 {id:'bear',level:'red',name:'Bearings with trigonometry',blurb:'Directions measured clockwise from North, used in triangle questions',gen:genBear,learn:{
   analogy:`A bearing is a clock hand that always starts pointing North and only ever turns clockwise. The bearing is how far it's turned.`,
   key:`Three rules. Measure from North. Turn clockwise. Always three figures, so 70° is written 070°.`,
   steps:[`Draw a North line at the point you're measuring FROM.`,`"Bearing of B from A" means stand at A and look at B.`,`For a back bearing, add 180°. If that takes you past 360°, subtract 180° instead.`,`In triangle questions, draw North lines at every point. They're parallel, so alternate angles are equal and co-interior angles add to 180°.`,`Once you have an angle inside the triangle, use the sine rule or cosine rule.`],
   ex:{q:`The bearing of B from A is 060°. Find the bearing of A from B.`,lines:[`060 + 180 = 240`,`Bearing of A from B is 240°`]},
   traps:[`Measuring from the wrong point. Read "from" carefully.`,`Writing 60° instead of 060°.`,`Measuring anticlockwise.`],
   exam:`Usually Paper 2, alongside the sine and cosine rules. Often 4 or 5 marks across the parts.`}},
 {id:'exp',level:'amber',name:'Expanding brackets',blurb:'Multiplying out pairs of brackets, including the 3-term kind',gen:genExp,learn:{
   analogy:`Every term in the first bracket has to shake hands with every term in the second. Nobody gets missed.`,
   key:`2 terms × 2 terms = 4 handshakes. 2 terms × 3 terms = 6 handshakes. Then collect like terms.`,
   steps:[`Take the first term in the first bracket. Multiply it by every term in the second bracket.`,`Do the same with the next term.`,`Collect like terms (all the ${M(v('x')+sup(2))} together, all the ${M(v('x'))} together).`,`Write it in order, highest power first.`],
   ex:{q:`Expand ${M('('+v('x')+' + 3)('+v('x')+' '+MINUS+' 5)')}`,lines:[M(v('x')+sup(2)+' '+MINUS+' 5'+v('x')+' + 3'+v('x')+' '+MINUS+' 15'),M('= '+v('x')+sup(2)+' '+MINUS+' 2'+v('x')+' '+MINUS+' 15')]},
   traps:[`Signs. Negative × negative = positive.`,`${M('('+v('x')+' + 4)'+sup(2))} is not ${M(v('x')+sup(2)+' + 16')}. Write it as ${M('('+v('x')+' + 4)('+v('x')+' + 4)')} to get ${M(v('x')+sup(2)+' + 8'+v('x')+' + 16')}.`,`Missing a handshake with a 3-term bracket. Count them. There should be 6.`],
   exam:`Paper 1 (non-calculator). The 3-term version comes up a lot. Usually 3 marks.`}},
 {id:'pct',level:'amber',name:'Reverse percentages',blurb:'Finding the original amount after an increase or decrease',gen:genPct,learn:{
   analogy:`Rewinding a video. If the price was multiplied by 1.2 to get here, divide by 1.2 to get back.`,
   key:`The new amount isn't 100%. After a 20% rise it's 120%. After a 15% cut it's 85%.`,
   steps:[`Work out what percentage the new amount is of the original.`,`Turn that into a multiplier (120% = 1.2, 85% = 0.85).`,`Divide the new amount by the multiplier.`,`Check by going forwards again.`],
   ex:{q:`A jacket costs £78 after a 35% reduction. What was the original price?`,lines:[`After 35% off, you pay 65%`,`Multiplier = 0.65`,`78 ÷ 0.65 = £120`,`Check: 120 × 0.65 = 78`]},
   traps:[`The big one. Don't take the percentage of the new price. £96 including VAT isn't £96 ${MINUS} 20% = £76.80. It's 96 ÷ 1.2 = £80.`,`Multiplying when you should divide. Going back in time means divide.`],
   exam:`Paper 2 (calculator). Usually 3 marks. VAT and sale prices are favourites.`}},
 {id:'sci',level:'amber',name:'Calculations using scientific notation',blurb:'Writing huge and tiny numbers as a × 10ⁿ',gen:genSci,learn:{
   analogy:`Shorthand for numbers too big or too small to write out comfortably. The power of 10 tells you how many places the decimal point jumps.`,
   key:`${M(v('a')+' × 10'+sup(v('n')))}, where ${M(v('a'))} is at least 1 and less than 10. Big numbers get a positive power. Numbers smaller than 1 get a negative power.`,
   steps:[`Put the decimal point after the first non-zero digit.`,`Count how many places the point has moved.`,`Big number? Positive power. Smaller than 1? Negative power.`,`Multiplying: multiply the front numbers, add the powers.`,`Dividing: divide the front numbers, subtract the powers.`,`If the front number ends up 10 or more, fix it and add 1 to the power.`],
   ex:{q:`Calculate ${M('(4 × 10'+sup(3)+') × (5 × 10'+sup(6)+')')}`,lines:[`4 × 5 = 20 and 3 + 6 = 9`,M('20 × 10'+sup(9)),M('= 2 × 10'+sup(10))]},
   traps:[`Leaving ${M('20 × 10'+sup(9))} as the answer. The front number has to be under 10.`,`Getting the sign of the power the wrong way round. 0.0045 is ${M('4.5 × 10'+sup(MINUS+'3'))}.`,`On a calculator, use the ×10ˣ (EXP) button. Typing × 10 ^ can go wrong when dividing.`],
   exam:`Both papers. 1 to 3 marks. Often hidden inside a question about planets, cells or bacteria.`}},
 {id:'ind',level:'amber',name:'Laws of indices',blurb:'The rules for powers, including negative and fractional ones',gen:genInd,learn:{
   analogy:`The power is a counter. ${M(v('x')+sup(5))} just means five ${M(v('x'))}'s multiplied together. Most of the rules are just counting.`,
   rules:[[M(v('x')+sup(v('a'))+' × '+v('x')+sup(v('b'))+' = '+v('x')+sup(v('a')+'+'+v('b'))),'Multiply, add the powers'],[M(v('x')+sup(v('a'))+' ÷ '+v('x')+sup(v('b'))+' = '+v('x')+sup(v('a')+MINUS+v('b'))),'Divide, subtract the powers'],[M('('+v('x')+sup(v('a'))+')'+sup(v('b'))+' = '+v('x')+sup(v('ab'))),'Power of a power, multiply'],[M(v('x')+sup(0)+' = 1'),'Anything to the power 0 is 1'],[M(v('x')+sup(MINUS+v('n'))+' = '+fr(1,v('x')+sup(v('n')))),'Negative power means one over'],[M(v('x')+sup(v('m')+'/'+v('n'))),'Bottom is the root, top is the power']],
   ex:{q:`Evaluate ${M('8'+sup('2/3'))}`,lines:[`Bottom is 3, so cube root of 8 = 2`,`Top is 2, so 2${sup(2)} = 4`]},
   traps:[`${M('3'+v('x')+sup(2)+' × 4'+v('x')+sup(5))}. Multiply the numbers (12), add the powers (7). Answer ${M('12'+v('x')+sup(7))}.`,`${M(v('x')+sup(0))} is 1, not 0.`,`A negative power doesn't make the answer negative. ${M('2'+sup(MINUS+'3')+' = '+fr(1,8))}.`],
   exam:`Paper 1 (non-calculator). Usually 2 or 3 marks.`}}
];

/* ---------- simple explanations ----------
   Rules: 50 words max across both parts, a 10-year-old could follow it, no jargon,
   one everyday example, the idea not the method, one symbol at most. */
const NUT={
 rat:{what:`A surd is a square root that never works out exactly, like the square root of 2. Rationalising means getting the surd off the bottom of a fraction.`,
      why:`It's like saying half a pizza, not two quarters. Same amount, tidier answer. Exams expect the tidy version.`},
 sub:{what:`A formula is a recipe for working one thing out. Changing the subject means turning it round so it works out a different thing instead.`,
      why:`If you know how far a trip was and how fast you went, you can find how long it took. Same formula, turned round.`},
 app:{what:`Appreciation is when something's value goes up by the same percentage every year. Depreciation is the same idea, going down.`,
      why:`Savings in a bank grow this way. A new car loses value this way. Each year's change is on the new amount, not the starting one.`},
 bear:{what:`A bearing is a direction given as an angle. You always start facing North and turn clockwise, the way a clock's hands move.`,
      why:`Ships, planes and mountain rescue teams use bearings to say exactly which way to go. In the exam, they set up triangle questions.`},
 exp:{what:`Brackets group things together. Expanding means multiplying them out so no brackets are left.`,
      why:`It's like a café with 2 breads and 3 fillings. Every bread meets every filling, giving 6 sandwiches. Brackets work the same way, and most algebra starts here.`},
 pct:{what:`Working backwards to find what something cost before a percentage was added or taken off.`,
      why:`A jacket costs £60 in a 25% off sale. What was it before? Not £75. It was £80. That trap catches loads of people in exams.`},
 sci:{what:`A short way to write really huge or really tiny numbers, so you don't have to write out loads of zeros.`,
      why:`The Sun is about 150,000,000 km away. Writing all those zeros is slow and easy to get wrong. Scientists and calculators use the short way.`},
 ind:{what:`A power is a small raised number saying how many times to multiply a number by itself.`,
      why:`Fold paper in half five times and you get 32 layers. That's two to the power five. The laws of indices are shortcuts for combining powers.`}
};
TOPICS.forEach(t=>{t.nut=NUT[t.id];});

Study.registerSubject('ben-maths-n5',{
  title:'Maths',
  level:'National 5',
  course:'SQA National 5 Mathematics',
  intro:'Work through the red topics first, in order. Get 5 right in a row to master a topic. Master all the reds and the amber topics unlock.',
  topics:TOPICS
});
})();
