/* subjects/evan-business-s3.js
   Evan, S3 Business. Topics follow his school revision list, "S3 Business Revision List, Assessment Piece 2",
   in list order, all red. Wording matches SQA National 5 Business Management (C810 75, Course Specification
   v3.0, June 2026) where the two overlap: sole traders, partnerships, private limited companies, public sector,
   third sector, objectives, stakeholders. Franchises, unlimited liability and the internal/external stakeholder
   split are on his school list but not in the current SQA spec, so they follow his school's list.

   Practise: scenario multiple choice, checked automatically. These count for mastery (5 in a row).
   Exam practice: written answers he marks himself against marking points. These never count for mastery. */
(function(){
'use strict';

/* ---------- helpers ---------- */
const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const pounds=n=>'£'+n.toLocaleString('en-GB');
const NAMES=['Aidan','Kirsty','Callum','Eilidh','Ryan','Isla','Lewis','Freya','Ross','Ailsa','Jamie','Megan','Kyle','Erin'];
const two=()=>{const a=shuffle(NAMES);return [a[0],a[1]];};
const SOLO=['hairdresser','window cleaning business','dog walking business','phone repair shop','café','plumbing business','nail bar','gardening business','mobile car valeting business','bakery'];
const TOWNS=['Irvine','Kilmarnock','Ayr','Troon','Largs','Saltcoats','Stewarton','Prestwick'];
const TRADES=['Joinery','Electrical','Roofing','Catering','Landscaping','Printing','Engineering','Bathrooms'];

/* Plain-text multiple choice. Takes the right answer, a pool of wrong ones, and the explanation. */
function mcq(prompt,correct,wrongs,hint,why){
  const ds=shuffle(wrongs.filter(w=>w!==correct)).slice(0,3);
  const opts=shuffle([correct,...ds]);
  return {kind:'mc',plain:true,options:opts,correct:opts.indexOf(correct),prompt,hint,working:why,answerText:correct};
}
/* Picks a question style at random, never the same style twice in a row. */
function rotate(list){let last=-1;return ()=>{let i;do{i=Math.floor(Math.random()*list.length);}while(list.length>1&&i===last);last=i;return list[i]();};}

/* ---------- shared facts ---------- */
const TYPES=['Sole trader','Partnership','Private limited company','Franchise','Public sector organisation','Third sector organisation'];
const PUBLIC_EX=['NHS Scotland','Police Scotland','a state secondary school','your local council','the Scottish Fire and Rescue Service','a council-run library'];
const PRIVATE_EX=['Tesco','a local hairdresser','a family-run joinery firm','a corner shop owned by one person','Barr\'s, who make Irn-Bru'];
const THIRD_EX=['Cancer Research UK','the Scottish SPCA','Children 1st','a local food bank','The Big Issue'];

/* ======================================================================
   1. Sole Trader
   ====================================================================== */
const ST_ADV=['Keeps all the profit','Makes every decision without asking anyone','Easy and cheap to set up','Can give customers a personal service'];
const ST_DIS=['Unlimited liability, so personal possessions are at risk','Long hours with no one to share the work','Hard to raise money to grow','If the owner is ill, the business may have to stop'];
const genSt=rotate([
  ()=>{const n=pick(NAMES),b=pick(SOLO);return mcq(`${n} owns a ${b} and is the only owner. ${n} makes every decision and keeps all the profit. What type of business is this?`,
    'Sole trader',TYPES,`How many owners are there?`,[`One owner who makes every decision and keeps all the profit is a sole trader.`]);},
  ()=>mcq(`Who owns a sole trader business?`,'One person',['Shareholders','Two or more partners','The government','A board of directors'],
    `"Sole" means only one.`,[`A sole trader is owned by one person. "Sole" means only one.`]),
  ()=>mcq(`In a sole trader business, who makes the decisions?`,'The owner',['A board of directors','The partners, by voting','The local council','The shareholders'],
    `Who owns it? That same person is in charge.`,[`The owner owns AND controls it, so the owner makes every decision.`]),
  ()=>{const n=pick(NAMES),b=pick(SOLO);return mcq(`${n} has just opened a ${b} as a sole trader. Which is most likely to be one of ${n}'s aims?`,
    pick(['To survive the first year','To make a profit','To be their own boss']),
    ['To pay dividends to shareholders','To spend taxpayers\' money wisely','To raise money for a charity'],
    `Think about what a brand new one-person business needs most.`,[`Sole traders usually aim to survive, make a profit and be their own boss.`,`Dividends are for shareholders, taxpayers' money is the public sector, and raising money for a cause is the third sector.`]);},
  ()=>mcq(`Which statement about sole traders is true?`,pick(['A sole trader can employ staff','A sole trader keeps all the profit','A sole trader makes all the decisions']),
    ['A sole trader can\'t employ anyone','A sole trader shares the profit with partners','A sole trader is owned by shareholders','A sole trader is run by the government'],
    `"Sole" means one owner, not one worker.`,[`A sole trader has one owner, who keeps the profit and makes the decisions.`,`They can still employ staff. "Sole" is about owning, not working.`]),
  ()=>mcq(`Which is an advantage of being a sole trader?`,pick(ST_ADV),ST_DIS.concat(['Has to share the profit with partners']),
    `Advantages are good things for the owner.`,[`Good things: keeps all the profit, makes every decision, easy to set up, personal service.`,`Unlimited liability, long hours and finding money are the downsides.`]),
  ()=>mcq(`Which is a disadvantage of being a sole trader?`,pick(ST_DIS),ST_ADV,
    `Look for the one that would worry the owner.`,[`Downsides: unlimited liability, long hours, hard to raise money, and the business may stop if the owner is ill.`])
]);

/* ======================================================================
   2. Partnership
   ====================================================================== */
const PT_ADV=['Partners share the workload','More money to start the business','Partners bring different skills and ideas','Partners can cover for each other when ill or on holiday'];
const PT_DIS=['Partners might disagree','The profit is shared between the partners','Partners usually have unlimited liability','One partner\'s bad decision affects everyone'];
const genPt=rotate([
  ()=>{const [a,b]=two(),biz=pick(['vet\'s practice','dental surgery','café','garage','beauty salon','accountancy firm']);return mcq(`${a} and ${b} own a ${biz} together. They share the decisions and split the profit. What type of business is this?`,
    'Partnership',TYPES,`Count the owners.`,[`Two or more owners who share decisions and profit is a partnership.`]);},
  ()=>mcq(`What is a Partnership Agreement for?`,'Setting out the rules, like how the profit is shared',['Registering the business as a company','Selling shares to family and friends','Getting a grant from the council'],
    `It's a written agreement between the partners.`,[`A Partnership Agreement sets out the rules: how profit is shared, how much each partner puts in, and what happens if someone leaves.`]),
  ()=>mcq(`Which would you expect to find in a Partnership Agreement?`,pick(['How the profit is split','How much money each partner puts in','What happens if a partner leaves','How disagreements are sorted out']),
    ['How much each shareholder\'s dividend is','The names of the company\'s directors','How much council tax the town pays'],
    `It's the rulebook the partners agree on.`,[`The agreement covers profit split, money put in, partners leaving and sorting out disagreements.`,`Shareholders and directors belong to companies, not partnerships.`]),
  ()=>mcq(`Which is an advantage of a partnership?`,pick(PT_ADV),PT_DIS,`What's better about having more than one owner?`,[`More owners means more money, more skills and a shared workload.`]),
  ()=>mcq(`Which is a disadvantage of a partnership?`,pick(PT_DIS),PT_ADV,`What could go wrong with more than one owner?`,[`Partners can disagree, have to share the profit, and usually have unlimited liability.`]),
  ()=>mcq(`Who controls a partnership?`,'The partners, together',['One owner on their own','A board of directors','The government'],`Who owns it?`,[`The partners own it, so they control it together.`]),
  ()=>{const [a,b]=two(),biz=pick(['café','garage','beauty salon']);return mcq(`${a} and ${b} run a ${biz} as a partnership. ${a} works 6 days a week but ${b} works 2. They split the profit 50:50 and ${a} is annoyed. What should have stopped this?`,
    'A clear Partnership Agreement',['Limited liability','Selling shares','Becoming a charity'],`Where are a partnership's rules written down?`,[`A Partnership Agreement can set out who does what and how the profit is split, so arguments like this are less likely.`]);}
]);

/* ======================================================================
   3. Private Limited Company
   ====================================================================== */
const LTD_ADV=['Limited liability for the owners','Can raise money by selling shares','Easier to borrow from a bank'];
const LTD_DIS=['More paperwork and cost to set up','The profit is shared between shareholders','Some accounts must be made public'];
const genLtd=rotate([
  ()=>mcq(`${pick(TOWNS)} ${pick(TRADES)} Ltd. What type of business is this?`,'Private limited company',TYPES,`Look at the end of the name.`,[`"Ltd" stands for limited. It's a private limited company.`]),
  ()=>mcq(`Who owns a private limited company?`,'Its shareholders',['The managing director only','The government','Its customers','Its suppliers'],
    `Owners of a company hold shares in it.`,[`Shareholders own the company. The more shares you have, the more of it you own.`]),
  ()=>mcq(`Who controls a private limited company?`,'A board of directors',['The customers','The local council','Whoever has worked there longest'],
    `They meet around a big table to make the big decisions.`,[`The board of directors makes the big decisions. A managing director runs it day to day.`]),
  ()=>mcq(`How are shares in a private limited company sold?`,'Privately, often to family and friends',['On the stock market, to anyone','Given away free to customers','Only the government can buy them'],
    `The clue's in the word "private".`,[`Shares in a private limited company are sold privately, usually to people the owners know.`,`Selling shares to anyone on the stock market is a public limited company (plc).`]),
  ()=>mcq(`What is a dividend?`,'A share of the profit paid to shareholders',['A loan from the bank','A tax paid to the government','A worker\'s weekly wage'],
    `It's how shareholders get a reward for owning shares.`,[`A dividend is the shareholders' share of the profit.`]),
  ()=>mcq(`Which is an advantage of a private limited company?`,pick(LTD_ADV),['Unlimited liability for the owners','Very quick and cheap to set up','One owner keeps all the profit'],
    `What does "limited" protect?`,[`Advantages: limited liability, more money from selling shares, easier to borrow.`]),
  ()=>mcq(`Which is a disadvantage of a private limited company?`,pick(LTD_DIS),['Owners have unlimited liability','It must be run by the government','It can\'t employ any staff'],
    `Think about setting it up, and sharing out the profit.`,[`Downsides: more paperwork and cost to set up, profit shared out to shareholders, some accounts made public.`]),
  ()=>mcq(`Which aim is most typical of a private limited company?`,pick(['To grow and increase market share','To make a profit for its shareholders']),
    ['To provide a free service paid for by taxes','To raise money for a good cause','To give all its money away'],
    `It's in the private sector.`,[`Private limited companies aim for profit, growth and market share.`,`Free services paid by taxes are the public sector. Good causes are the third sector.`])
]);

/* ======================================================================
   4. Definition of unlimited liability
   ====================================================================== */
const UL_TF=[
  ['A sole trader with unlimited liability could lose their house if the business fails.',true],
  ['Shareholders in a Ltd company could lose their house if the company fails.',false],
  ['Partners usually have unlimited liability.',true],
  ['Limited liability means owners can only lose the money they put in.',true],
  ['Unlimited liability means there\'s no limit to the profit the owner can keep.',false],
  ['"Ltd" at the end of a name means the owners have unlimited liability.',false]
];
const genUl=rotate([
  ()=>mcq(`What does unlimited liability mean?`,'Owners can lose their own possessions to pay business debts',['Owners can only lose the money they put in','The business can never go bust','The bank pays off the business\'s debts','There\'s no limit to the profit the owner keeps'],
    `Liability means being responsible for debts.`,[`Unlimited liability: the owner is personally responsible for ALL the business's debts, so they could lose their house, car or savings.`]),
  ()=>{const c=pick(['Sole trader','Partnership']);return mcq(`Which type of business usually has unlimited liability?`,c,['Private limited company','A business with Ltd in its name','A company owned by shareholders'],
    `Which businesses have no "Ltd" protection?`,[`Sole traders and partnerships usually have unlimited liability.`,`"Ltd" means limited.`]);},
  ()=>mcq(`Which type of business gives its owners limited liability?`,'Private limited company',['Sole trader','Partnership','A plumber working for themselves'],`What does "Ltd" stand for?`,[`Limited companies give their shareholders limited liability. They can only lose what they put in.`]),
  ()=>{const n=pick(NAMES),b=pick(SOLO),d=R(3,9)*5000,h=R(1,Math.floor(d/5000))*1000;return mcq(`${n}'s ${b} is a sole trader. It closes owing ${pounds(d)}, but the business only has ${pounds(h)}. What happens to the rest of the debt?`,
    `${n} has to pay it, even by selling personal possessions`,['The debt is cancelled','The government pays it','The customers have to pay it'],
    `Does a sole trader have limited or unlimited liability?`,[`A sole trader has unlimited liability.`,`${n} is personally responsible for the other ${pounds(d-h)}, even if it means selling a car or house.`]);},
  ()=>{const n=pick(NAMES),co=`${pick(TOWNS)} ${pick(TRADES)} Ltd`,d=R(4,12)*10000,s=R(2,9)*1000;return mcq(`${co} closes owing ${pounds(d)}. ${n} owns shares that cost ${pounds(s)}. What is the most ${n} can lose?`,
    `${pounds(s)}, the money ${n} put in`,[`${pounds(d)}, the whole debt`,`${n}'s house`,'Nothing at all'],
    `It's a Ltd company. What does limited liability protect?`,[`Shareholders have limited liability.`,`${n} can lose the ${pounds(s)} paid for the shares, but nothing more.`]);},
  ()=>{const [s,t]=pick(UL_TF);return {kind:'mc',plain:true,options:['True','False'],correct:t?0:1,prompt:`True or false? "${s}"`,
    hint:`Sole traders and partners: unlimited. Ltd shareholders: limited.`,working:[t?'True.':'False.',`Sole traders and partners usually have unlimited liability. Shareholders in a Ltd company have limited liability.`],answerText:t?'True':'False'};}
]);

/* ======================================================================
   5. Public Sector: finance and objectives
   ====================================================================== */
const genPub=rotate([
  ()=>mcq(`Which sector is ${pick(PUBLIC_EX)} in?`,'Public sector',['Private sector','Third sector'],`Who owns it and pays for it?`,[`It's owned and run by the government or a council, and paid for by taxes. That's the public sector.`]),
  ()=>mcq(`Which of these is in the public sector?`,pick(PUBLIC_EX),PRIVATE_EX.concat(THIRD_EX),`Look for the one run by the government or a council.`,[`Public sector organisations are run by the government or a local council, like the NHS, police and state schools.`]),
  ()=>mcq(`Where does most of the public sector's money come from?`,'Taxes',['Selling shares','Donations from the public','Royalties from franchisees'],
    `Everyone pays into it.`,[`The public sector is mainly paid for by taxes, like income tax, council tax and VAT.`]),
  ()=>mcq(`Which is a way a local council raises money?`,pick(['Council tax','Grants from the Scottish Government','Charges for services like the leisure centre']),
    ['Selling shares on the stock market','Charity shop sales','Royalties from franchisees','Dividends from shareholders'],
    `Think about bills your family pays the council, and money from the government.`,[`Councils get money from council tax, government grants, and charges for some services.`]),
  ()=>mcq(`Which is a main objective of a public sector organisation?`,pick(['To provide a good service to the public','To stay within its budget','To give value for money']),
    ['To make as much profit as possible','To pay dividends to shareholders','To beat its competitors\' prices'],
    `It's spending taxpayers' money.`,[`Public sector objectives: provide a service, stay within budget, give value for money.`,`Profit and dividends are private sector aims.`]),
  ()=>mcq(`Who controls the public sector?`,'The government or the local council',['Shareholders','The trustees of a charity','A sole trader'],`Who do we vote for?`,[`The UK or Scottish Government, or a local council, controls public sector organisations.`]),
  ()=>mcq(`A council spends less on its swimming pool so it can keep its libraries open. Which objective is it trying to meet?`,'Staying within its budget',['Making a profit','Increasing market share','Paying dividends'],
    `It's not about profit. It's about making the money stretch.`,[`It has a set amount of money, so it's cutting one thing to afford another. That's staying within budget.`])
]);

/* ======================================================================
   6. Third Sector: finance and objectives
   ====================================================================== */
const genThird=rotate([
  ()=>mcq(`Which sector is ${pick(THIRD_EX)} in?`,'Third sector',['Private sector','Public sector'],`Is it run to help a cause?`,[`Charities, voluntary groups and social enterprises are the third sector.`]),
  ()=>mcq(`Which of these is in the third sector?`,pick(THIRD_EX),PRIVATE_EX.concat(PUBLIC_EX),`Look for the charity or good cause.`,[`Third sector organisations exist to help a cause, not to make money for owners.`]),
  ()=>mcq(`Which is a way a charity raises money?`,pick(['Donations from the public','Fundraising events','Grants from the National Lottery','Selling goods in charity shops','Sponsorship from businesses']),
    ['Income tax','Selling shares to the public','Royalties from franchisees','Council tax'],
    `Think of a sponsored walk or a charity shop.`,[`Charities raise money through donations, fundraising, grants, sponsorship and selling goods.`,`Taxes pay for the public sector, not charities.`]),
  ()=>mcq(`Which is an objective of a third sector organisation?`,pick(['To help people or a cause','To raise awareness of an issue','To provide a service for people in need']),
    ['To make a profit for its owners','To pay dividends to shareholders','To beat its competitors'],
    `Why do charities exist?`,[`Third sector objectives: help a cause, raise awareness, provide a service.`]),
  ()=>mcq(`What does a social enterprise do with its profit?`,'Puts it back into helping its cause',['Pays it to shareholders','Gives it to the government','Keeps it for the owner'],
    `It's in the third sector.`,[`A social enterprise sells things like a normal business, but its profit goes back into its cause. The Big Issue is one.`]),
  ()=>{const n=pick(NAMES);return mcq(`${n} helps at a food bank every Saturday and isn't paid. What is ${n}?`,'A volunteer',['An employee','A shareholder','A franchisee'],`Is ${n} paid?`,[`Someone who works for free for a good cause is a volunteer. Lots of the third sector relies on volunteers.`]);},
  ()=>mcq(`Who controls a charity?`,'A board of trustees',['Shareholders','The local council','One owner who keeps the profit'],`They're trusted to look after the charity's money.`,[`Charities are run by trustees, who make sure the money is used for the cause.`])
]);

/* ======================================================================
   7 and 8. Stakeholders
   ====================================================================== */
const STK={
  owners:   {name:'Owners or shareholders',inn:true, interest:'Making a profit',influence:'Deciding the direction of the business'},
  managers: {name:'Managers',inn:true, interest:'Good pay, bonuses and job security',influence:'Deciding who to hire'},
  employees:{name:'Employees',inn:true, interest:'Fair pay and job security',influence:'Going on strike'},
  customers:{name:'Customers',inn:false,interest:'Good quality at a fair price',influence:'Buying from a rival instead'},
  suppliers:{name:'Suppliers',inn:false,interest:'Being paid on time',influence:'Raising their prices'},
  banks:    {name:'Banks',inn:false,interest:'Getting their loan repaid',influence:'Refusing a loan'},
  community:{name:'The local community',inn:false,interest:'Local jobs and no pollution',influence:'Starting a petition or protest'},
  government:{name:'The government',inn:false,interest:'Taxes being paid and laws followed',influence:'Changing taxes or passing new laws'}
};
const INT_IDS=['owners','managers','employees'],EXT_IDS=['customers','suppliers','banks','community','government'];
const lc=s=>s.charAt(0).toLowerCase()+s.slice(1);
const classify=()=>{const id=pick(Object.keys(STK)),s=STK[id];return {kind:'mc',plain:true,options:['Internal','External'],correct:s.inn?0:1,
  prompt:`Is this an internal or external stakeholder? <b>${s.name}</b>`,hint:`Are they inside the business, or outside it?`,
  working:[`${s.name} ${s.inn?'are inside the business':'are outside the business'}, so they're ${s.inn?'internal':'external'}.`,`Internal: owners, managers, employees. External: customers, suppliers, banks, local community, government.`],answerText:s.inn?'Internal':'External'};};
const interestQ=ids=>()=>{const id=pick(ids),s=STK[id];return mcq(`What is the main interest of <b>${lc(s.name)}</b> in a business?`,s.interest,Object.keys(STK).filter(k=>k!==id).map(k=>STK[k].interest),
  `Interest means what they WANT from the business.`,[`${s.name}: ${lc(s.interest)}.`]);};
const influenceQ=ids=>()=>{const id=pick(ids),s=STK[id];return mcq(`How could <b>${lc(s.name)}</b> influence a business?`,s.influence,Object.keys(STK).filter(k=>k!==id).map(k=>STK[k].influence),
  `Influence means what they can DO to affect it.`,[`${s.name} could influence it by ${lc(s.influence)}.`]);};
const SCN_IN=[
  ['Staff at a factory are unhappy with a pay offer and refuse to work.','Employees'],
  ['The shareholders vote to open three new branches.','Owners or shareholders'],
  ['The shop manager decides to cut Sunday opening hours.','Managers']
];
const SCN_EX=[
  ['A supplier says it will stop delivering unless bills are paid faster.','Suppliers'],
  ['Neighbours start a petition against a takeaway opening until 3am.','The local community'],
  ['The bank refuses to lend money for a new van.','Banks'],
  ['VAT goes up, so prices have to rise.','The government'],
  ['Shoppers switch to a cheaper rival down the road.','Customers']
];
const scenario=list=>()=>{const [t,a]=pick(list);return mcq(`${t} Which stakeholder is influencing the business?`,a,Object.keys(STK).map(k=>STK[k].name),`Who is actually doing something here?`,[`${a}. ${STK[Object.keys(STK).find(k=>STK[k].name===a)].inn?'They\'re inside the business, so internal.':'They\'re outside the business, so external.'}`]);};
const genIstk=rotate([classify,interestQ(INT_IDS),influenceQ(INT_IDS),scenario(SCN_IN),
  ()=>mcq(`What is a stakeholder?`,'A person or group with an interest in a business',['Anyone who owns shares','A company that supplies stock','A government inspector'],`It's wider than just owners.`,[`A stakeholder is anyone with an interest in a business, inside or outside it.`]),
  ()=>mcq(`Which of these is an internal stakeholder?`,STK[pick(INT_IDS)].name,EXT_IDS.map(k=>STK[k].name),`Internal means inside the business.`,[`Internal stakeholders: owners, managers and employees.`])]);
const genEstk=rotate([classify,interestQ(EXT_IDS),influenceQ(EXT_IDS),scenario(SCN_EX),
  ()=>mcq(`Which of these is an external stakeholder?`,STK[pick(EXT_IDS)].name,INT_IDS.map(k=>STK[k].name),`External means outside the business.`,[`External stakeholders: customers, suppliers, banks, the local community and the government.`])]);

/* ======================================================================
   9. Franchises
   ====================================================================== */
const BRANDS=['Subway','Domino\'s Pizza','McDonald\'s'];
const FR_DIS=['Has to pay royalties, even in a bad year','Must follow strict rules from the franchisor','Less freedom to make their own decisions','An expensive start-up fee'];
const FR_ADV=['A well-known brand that customers already trust','Less risk of the business failing','Training and support from the franchisor','National advertising organised by the franchisor','Easier to borrow money from a bank','Stock and equipment supplied by the franchisor'];
const genFr=rotate([
  ()=>{const n=pick(NAMES),b=pick(BRANDS),t=pick(TOWNS);return mcq(`${n} pays to open a ${b} shop in ${t}. Who is the franchisor?`,b,[n,`${n}'s customers`,'The local council'],
    `Remember employer and employee. The "-or" is the one in charge.`,[`${b} owns the brand, so ${b} is the franchisor.`,`${n} buys the right to use it, so ${n} is the franchisee.`]);},
  ()=>{const n=pick(NAMES),b=pick(BRANDS),t=pick(TOWNS);return mcq(`${n} pays to open a ${b} shop in ${t}. Who is the franchisee?`,n,[b,`${n}'s customers`,'The bank'],
    `Remember employer and employee. The "-ee" signs up to someone else's rules.`,[`${n} buys the right to run a ${b} shop, so ${n} is the franchisee.`]);},
  ()=>mcq(`What is a royalty?`,'A regular payment from the franchisee to the franchisor',['A one-off grant from the government','A share of the profit paid to shareholders','A loan from the bank'],
    `The franchisee keeps paying this for as long as they're in the franchise.`,[`A royalty is a regular payment, usually a percentage of sales, that the franchisee pays to the franchisor.`]),
  ()=>mcq(`Which is a disadvantage for someone buying a franchise?`,pick(FR_DIS),FR_ADV,`What would annoy a franchisee?`,[`Franchisee downsides: royalties, strict rules, less freedom, expensive start-up fee.`]),
  ()=>mcq(`Why does a big brand sell franchises?`,pick(['It can grow quickly using franchisees\' money','It earns royalties from every franchise']),
    ['It has to follow the franchisee\'s rules','It gets unlimited liability','It gets money from council tax'],
    `What does the franchisor get out of it?`,[`The franchisor grows quickly without spending all its own money, and earns royalties from every shop.`]),
  ()=>mcq(`Which of these is most likely to be a franchise?`,`A ${pick(BRANDS)} restaurant`,['A local library','A one-off family café','A charity shop for the Scottish SPCA'],
    `Look for a famous chain.`,[`Lots of famous chains like Subway, Domino's and McDonald's are run as franchises by local owners.`])
]);

/* ======================================================================
   10. Advantages of buying a franchise
   ====================================================================== */
const WHO=[['Earns royalties from every shop','Franchisor'],['Gets training on how to run the business','Franchisee'],['Grows the brand using other people\'s money','Franchisor'],
  ['Gets customers who already know the brand','Franchisee'],['Benefits from national adverts','Franchisee'],['Sets the rules every shop must follow','Franchisor']];
const genFrad=rotate([
  ()=>mcq(`Which is an advantage of buying a franchise?`,pick(FR_ADV),FR_DIS.concat(['Gets royalties from other shops','Can change the menu whenever they like']),
    `Think about what the person buying in gets.`,[`Advantages for the franchisee: known brand, less risk, training, national advertising, easier borrowing, supplies sorted.`]),
  ()=>{const n=pick(NAMES);return mcq(`${n} wants to open a coffee shop. Why might buying a franchise be less risky than starting from scratch?`,'The brand is already known and trusted',
    ['There\'s no start-up fee',`${n} keeps all the profit with no payments`,`${n} can sell any products ${n} likes`],
    `Why would customers walk in on day one?`,[`Customers already know and trust the brand, and the idea has been proven elsewhere. So it's less likely to fail.`]);},
  ()=>mcq(`Why might a bank be happier to lend to someone buying a franchise?`,'The business idea has already been proven',['Franchises never pay interest','The government pays franchise loans','Franchisees never have debts'],
    `What does the bank want? Its money back.`,[`The brand has worked in lots of other places, so the bank thinks the loan is more likely to be repaid.`]),
  ()=>mcq(`Who usually organises national TV adverts for a franchise brand?`,'The franchisor',['Each customer','The local council','The bank'],
    `Who owns the brand?`,[`The franchisor organises big national adverts, which helps every franchisee.`]),
  ()=>mcq(`Which of these is NOT an advantage of buying a franchise?`,pick(FR_DIS),FR_ADV,`Find the one that's a downside.`,[`That's a disadvantage for the franchisee. The others are all advantages.`]),
  ()=>{const [s,w]=pick(WHO);return {kind:'mc',plain:true,options:['Franchisor','Franchisee'],correct:w==='Franchisor'?0:1,prompt:`Who does this help? "${s}"`,
    hint:`Franchisor owns the brand. Franchisee buys in.`,working:[`${w}.`,`Exam questions on "advantages of buying a franchise" want the franchisee's side, not the franchisor's.`],answerText:w};}
]);

/* ---------- topics, in revision list order ---------- */
const TOPICS=[
 {id:'st',level:'red',name:'Ownership, control and aims of a Sole Trader',blurb:'One owner who runs everything',gen:genSt,learn:{
   analogy:`Being a sole trader is like playing a one-player game. You pick every move and keep every prize. But there's nobody to share the work, and if you lose, you lose on your own.`,
   key:`One owner. That one person controls everything and keeps all the profit. Most sole traders aim to survive, make a profit and be their own boss.`,
   steps:[`Ownership: who owns it? One person, the sole trader.`,`Control: who makes the decisions? The same person.`,`Aims: what are they trying to do? Survive, make a profit, be their own boss, keep customers happy.`,`In "describe" questions, write a full sentence for each point. One point is usually one mark.`],
   ex:{q:`Describe the ownership and control of a sole trader. (2 marks)`,lines:[`A sole trader is owned by one person. (1 mark)`,`That person controls the business and makes all the decisions. (1 mark)`]},
   traps:[`Writing "one person" and stopping. Say what that means: they own it AND make the decisions.`,`Mixing up ownership and control. Ownership is who it belongs to. Control is who makes the decisions.`,`Saying a sole trader can't have staff. They can. "Sole" means one owner, not one worker.`],
   examLabel:'In the test',exam:`Short "describe" or "state" questions, usually 1 or 2 marks. One clear point gets one mark.`},
  written:[
   {q:`Describe the ownership and control of a sole trader.`,marks:2,points:[`It's owned by one person`,`That person controls it and makes all the decisions`],model:`A sole trader is owned by one person. That person controls the business and makes all the decisions.`},
   {q:`Describe two advantages of being a sole trader.`,marks:2,points:[`Keeps all the profit`,`Makes all the decisions, so is their own boss`,`Easy and cheap to set up`,`Can give customers a personal service`],model:`The sole trader keeps all of the profit. They can also make every decision themselves without having to ask anyone.`},
   {q:`Describe two disadvantages of being a sole trader.`,marks:2,points:[`Unlimited liability, so they could lose personal possessions`,`Long hours with no one to share the work`,`Hard to raise money to grow`,`The business may stop if the owner is ill or on holiday`],model:`A sole trader has unlimited liability, so they could lose their house or car if the business fails. They often work long hours because there's nobody to share the work with.`},
   {q:`State two aims a sole trader might have.`,marks:2,points:[`To survive`,`To make a profit`,`To be their own boss`,`To provide a good service or keep customers happy`,`To grow the business`],model:`To survive. To make a profit.`}]},
 {id:'pt',level:'red',name:'Ownership, control and aims of a Partnership',blurb:'Two or more owners who share it',gen:genPt,learn:{
   analogy:`A partnership is like a band. Everyone brings a skill and shares the money from gigs. It works well, until two members disagree about where the band is going.`,
   key:`Two or more owners, called partners. They control the business together and share the profit. A Partnership Agreement sets out the rules.`,
   steps:[`Ownership: two or more partners own it.`,`Control: the partners share the decisions.`,`The Partnership Agreement says how the profit is split, how much money each partner puts in, and what happens if someone leaves.`,`Aims are like a sole trader's: survive, make a profit, maybe grow.`],
   ex:{q:`Describe the purpose of a Partnership Agreement. (2 marks)`,lines:[`It sets out how the profit will be shared between the partners. (1 mark)`,`It says what happens if a partner wants to leave or if there's a disagreement. (1 mark)`]},
   traps:[`Saying partners always split the profit equally. The agreement decides the split.`,`Forgetting that partners usually have unlimited liability, just like a sole trader.`,`Calling partners "shareholders". Shareholders own companies, not partnerships.`],
   examLabel:'In the test',exam:`Expect "describe" questions on ownership, control, the Partnership Agreement, and advantages or disadvantages.`},
  written:[
   {q:`Describe the ownership and control of a partnership.`,marks:2,points:[`It's owned by two or more partners`,`The partners share the decisions and control it together`],model:`A partnership is owned by two or more people called partners. The partners control the business together and share the decisions.`},
   {q:`Describe two things a Partnership Agreement might include.`,marks:2,points:[`How the profit is shared`,`How much money each partner puts in`,`What happens if a partner leaves`,`How disagreements are sorted out`,`What each partner's job is`],model:`How the profit will be shared between the partners. What will happen if one of the partners wants to leave.`},
   {q:`Describe one advantage and one disadvantage of a partnership.`,marks:2,points:[`An advantage, e.g. shared workload, more money, or more skills and ideas`,`A disadvantage, e.g. partners might disagree, profit is shared, or unlimited liability`],model:`An advantage is that the partners can share the workload. A disadvantage is that they might disagree about how to run the business.`},
   {q:`Explain why two people might form a partnership instead of each being a sole trader.`,marks:2,points:[`More money can be put into the business, because there are two owners`,`The workload is shared, so there's less pressure on one person`,`Each partner brings different skills and ideas`,`They can cover for each other when one is ill or on holiday`],model:`Two owners can put in more money, so the business has more to start with. They can also share the work, so neither has to do everything on their own.`}]},
 {id:'ltd',level:'red',name:'Ownership, control and aims of a Private Limited Company',blurb:'Owned by shareholders, name ends in Ltd',gen:genLtd,learn:{
   analogy:`Owning shares is like chipping in for a pizza. Put in £2 of the £10 and you own a fifth of it. If it gets dropped on the floor, you only lose your £2.`,
   key:`Owned by shareholders. Controlled by a board of directors, led by a managing director. Shares are sold privately, often to family and friends, not on the stock market. Owners have limited liability.`,
   steps:[`Ownership: shareholders own it. The more shares you have, the more of it you own.`,`Control: the board of directors makes the big decisions. A managing director runs it day to day.`,`Shares are sold privately, usually to people the owners know. Not on the stock market.`,`Aims: make a profit, grow, increase market share, survive.`,`Profit is shared out to shareholders as a dividend.`],
   ex:{q:`Describe the ownership and control of a private limited company. (2 marks)`,lines:[`It's owned by its shareholders, who have bought shares in the company. (1 mark)`,`It's controlled by a board of directors, led by a managing director. (1 mark)`]},
   traps:[`Saying anyone can buy the shares on the stock market. That's a public limited company (plc), not a Ltd.`,`Mixing up shareholders (who own it) and directors (who control it). Sometimes they're the same people, but they're different jobs.`,`Forgetting the big advantage: limited liability.`],
   examLabel:'In the test',exam:`"Describe the ownership and control" comes up a lot. Get both halves: owned by shareholders, controlled by directors.`},
  written:[
   {q:`Describe the ownership and control of a private limited company.`,marks:2,points:[`It's owned by shareholders`,`It's controlled by a board of directors or a managing director`],model:`A private limited company is owned by its shareholders. It's controlled by a board of directors, led by a managing director.`},
   {q:`Describe two advantages of a private limited company.`,marks:2,points:[`Limited liability, so owners can only lose what they put in`,`Can raise money by selling shares`,`Easier to borrow from a bank`,`Owners keep control because shares are only sold privately`],model:`The owners have limited liability, so they can only lose the money they invested. The company can raise more money by selling shares to family and friends.`},
   {q:`Describe two disadvantages of a private limited company.`,marks:2,points:[`More paperwork and cost to set it up`,`The profit is shared between all the shareholders`,`Some accounts must be made public`,`Can't sell shares on the stock market, so harder to raise very large amounts`],model:`It costs more and takes more paperwork to set up than a sole trader. The profit has to be shared out between all the shareholders.`},
   {q:`State two aims of a private limited company.`,marks:2,points:[`To make a profit`,`To grow`,`To increase market share`,`To survive`,`To keep customers satisfied`],model:`To make a profit. To grow the business.`}]},
 {id:'ul',level:'red',name:'Definition of unlimited liability',blurb:'When the owner pays the debts, whatever it takes',gen:genUl,learn:{
   analogy:`Unlimited liability is like lending a mate your bank card with no spending limit. Whatever they spend, you have to pay back, even if it takes all your savings.`,
   key:`Sole traders and partners usually have unlimited liability. Shareholders in a limited company have limited liability: they can only lose the money they put in.`,
   steps:[`Unlimited liability: owners must pay all the business's debts, even from their own money and possessions.`,`Limited liability: owners can only lose what they put into the business.`,`Who has which? Sole traders and partnerships: unlimited. Private limited companies: limited.`,`A definition question needs the idea that the owner's personal possessions are at risk.`],
   ex:{q:`What is meant by unlimited liability? (1 mark)`,lines:[`The owners are personally responsible for all the debts of the business, so they could lose their own possessions, like their house or car. (1 mark)`]},
   traps:[`Saying "the business can lose everything". The point is that the OWNER can lose their own things.`,`Saying a Ltd company has unlimited liability. "Ltd" literally stands for limited.`,`Mixing up liability (debts) with profit.`],
   examLabel:'In the test',exam:`Usually a 1-mark definition. Mention the owner's own possessions, like their house or car.`},
  written:[
   {q:`What is meant by unlimited liability?`,marks:1,points:[`Owners are personally responsible for all the business's debts, so could lose their own possessions`],model:`The owners are personally responsible for all the business's debts, so they could lose their own possessions, like their house or car, to pay them.`},
   {q:`Explain the difference between unlimited and limited liability.`,marks:2,points:[`Unlimited: owners could lose their personal possessions to pay debts`,`Limited: owners can only lose the money they put into the business`],model:`With unlimited liability, the owner could lose their own possessions to pay the business's debts. With limited liability, the owners can only lose the money they invested.`},
   {q:`Name two types of business where the owners usually have unlimited liability.`,marks:2,points:[`Sole trader`,`Partnership`],model:`Sole trader. Partnership.`},
   {q:`Explain why unlimited liability is a risk for a sole trader.`,marks:2,points:[`If the business can't pay its debts, the owner has to pay them`,`So they could lose their house, car or savings`],model:`If the business can't pay its debts, the sole trader has to pay them personally. This means they could lose their house, car or savings.`}]},
 {id:'pub',level:'red',name:'Public Sector: finance and objectives',blurb:'Run by the government, paid for by taxes',gen:genPub,learn:{
   analogy:`The public sector is like a class kitty. Everyone chips in through taxes, and the money pays for things everyone uses, like hospitals, roads and schools.`,
   key:`Owned and controlled by the government (UK or Scottish) or a local council. Paid for mainly by taxes. Aims to provide a service, not to make a profit.`,
   steps:[`Finance: mainly taxes, like income tax, council tax and VAT.`,`Finance: government grants, and charges for some services, like a council leisure centre.`,`Objectives: provide a good service to everyone, stay within budget, give value for money.`,`Examples: NHS Scotland, Police Scotland, state schools, your local council.`],
   ex:{q:`Describe two ways a local council is financed. (2 marks)`,lines:[`Council tax paid by people who live in the area. (1 mark)`,`Grants from the Scottish Government. (1 mark)`]},
   traps:[`Saying the public sector aims to make a profit. Its main aim is to provide a service.`,`Writing "taxes" twice in different words when the question wants two ways. Name different ones: council tax, government grants, charges.`,`Mixing up the public sector with a public limited company (plc). A plc is in the private sector.`],
   examLabel:'In the test',exam:`"Describe two ways" questions on finance, and "describe objectives". One mark per point.`},
  written:[
   {q:`Describe two ways the public sector is financed.`,marks:2,points:[`Taxes, like income tax, council tax or VAT`,`Grants from the government`,`Charges for some services, like a leisure centre`],model:`Through taxes, like income tax and council tax. Through grants from the Scottish Government.`},
   {q:`Describe two objectives of a public sector organisation.`,marks:2,points:[`To provide a good service to the public`,`To stay within its budget`,`To give value for money`,`To improve people's lives or meet the community's needs`],model:`To provide a good service to the public. To stay within its budget.`},
   {q:`Give two examples of public sector organisations.`,marks:2,points:[`One correct example, e.g. NHS Scotland, Police Scotland or a state school`,`A second, different correct example, e.g. a local council or the fire service`],model:`NHS Scotland. North Ayrshire Council.`},
   {q:`Explain why a public sector organisation doesn't aim to make a profit.`,marks:1,points:[`Its aim is to provide a service to everyone, paid for by taxes`],model:`Its aim is to provide a service to everyone, and it's paid for by taxes, so it doesn't need to make a profit.`}]},
 {id:'third',level:'red',name:'Third Sector: finance and objectives',blurb:'Charities, voluntary groups and social enterprises',gen:genThird,learn:{
   analogy:`A third sector organisation is like a school fundraiser. Every pound raised goes to the cause, not into someone's pocket.`,
   key:`Third sector organisations are run by trustees and helped by volunteers. Money comes from donations, fundraising, grants and selling things. Any extra money goes back into the cause.`,
   steps:[`Types: charities, voluntary organisations and social enterprises.`,`Finance: donations, fundraising events, grants (like from the National Lottery), sponsorship and selling goods in shops.`,`Objectives: help a cause or people in need, raise awareness, provide a service.`,`A social enterprise sells things like a normal business, but puts its profit back into helping people. The Big Issue is one.`],
   ex:{q:`Describe two ways a charity could raise money. (2 marks)`,lines:[`Holding fundraising events, like a sponsored walk. (1 mark)`,`Selling donated items in charity shops. (1 mark)`]},
   traps:[`Saying charities can't make any money. They can, but it goes back into the cause, not to owners.`,`Writing "donations" twice in different words. Each point needs a different way of raising money.`,`Mixing up the third sector and the public sector. The third sector isn't run by the government.`],
   examLabel:'In the test',exam:`Expect "describe two ways" on finance and "describe objectives". Use different points each time.`},
  written:[
   {q:`Describe two ways a third sector organisation is financed.`,marks:2,points:[`Donations from the public`,`Fundraising events`,`Grants, e.g. from the National Lottery`,`Selling goods, e.g. in charity shops`,`Sponsorship from businesses`],model:`Donations from members of the public. Selling donated goods in charity shops.`},
   {q:`Describe two objectives of a charity.`,marks:2,points:[`To help a cause or people in need`,`To raise awareness of an issue`,`To provide a service`,`To keep costs low so more money goes to the cause`],model:`To help people in need. To raise awareness of the cause it supports.`},
   {q:`Describe a social enterprise.`,marks:2,points:[`It sells goods or services like a business`,`It puts its profit back into a social cause`],model:`A social enterprise sells goods or services like a normal business. It uses its profit to help a social cause instead of paying owners.`},
   {q:`Explain how a third sector organisation is different from a private sector business.`,marks:2,points:[`The third sector aims to help a cause, while the private sector aims to make a profit`,`Any surplus goes back into the cause, not to owners`,`The third sector relies on donations and volunteers`],model:`A third sector organisation aims to help a cause, but a private business aims to make a profit. Any extra money a charity makes goes back into the cause, not to owners.`}]},
 {id:'istk',level:'red',name:'Internal stakeholders: interests and influences',blurb:'Owners, managers and employees',gen:genIstk,learn:{
   analogy:`Internal stakeholders are like the players and coaches in a team. They're inside the club, and what they do decides how the season goes.`,
   key:`A stakeholder is anyone with an interest in a business. Interest means what they WANT from it. Influence means what they can DO to affect it.`,
   rules:[['Owners or shareholders','Want: profit. Can: make the big decisions, vote at meetings.'],['Managers','Want: good pay, bonuses, job security. Can: make day-to-day decisions, like hiring staff.'],['Employees','Want: fair pay, good conditions, job security. Can: work harder, or go on strike.']],
   steps:[`Name the stakeholder.`,`Say their interest (what they want) or their influence (what they can do), whichever the question asks.`,`Explain it with an example. One point per mark.`],
   ex:{q:`Describe one way employees can influence a business. (1 mark)`,lines:[`Employees could go on strike, which would stop production and cost the business money. (1 mark)`]},
   traps:[`Mixing up interest and influence. Interest is what they WANT. Influence is what they can DO.`,`Calling customers internal. Customers are outside the business, so they're external.`,`Writing "they can influence it" without saying how.`],
   examLabel:'In the test',exam:`Questions name a stakeholder and ask for an interest or an influence. Read which one it wants.`},
  written:[
   {q:`Describe one interest and one influence employees have on a business.`,marks:2,points:[`Interest: fair pay, good working conditions or job security`,`Influence: how well they work, or going on strike`],model:`Employees want fair pay and job security. They could influence the business by going on strike, which would stop the work getting done.`},
   {q:`Describe one interest and one influence the owners have on a business.`,marks:2,points:[`Interest: making a profit or the business doing well`,`Influence: making the big decisions, or voting at meetings`],model:`The owners want the business to make a profit. They can influence it by deciding the direction it takes, like opening new branches.`},
   {q:`Describe one interest and one influence managers have on a business.`,marks:2,points:[`Interest: good pay, bonuses, promotion or job security`,`Influence: making decisions, like hiring staff or setting targets`],model:`Managers want good pay and bonuses. They influence the business by making day-to-day decisions, like hiring staff.`},
   {q:`Name three internal stakeholders.`,marks:3,points:[`Owners or shareholders`,`Managers`,`Employees`],model:`Owners. Managers. Employees.`}]},
 {id:'estk',level:'red',name:'External stakeholders: interests and influences',blurb:'Customers, suppliers, banks, community and government',gen:genEstk,learn:{
   analogy:`External stakeholders are like the fans, the referee and the sponsors. They're not in the team, but they can still change how the season goes.`,
   key:`Customers, suppliers, banks, the local community and the government. Each wants something from the business, and each can affect it.`,
   rules:[['Customers','Want: good quality at a fair price. Can: buy elsewhere, complain, leave reviews.'],['Suppliers','Want: paid on time, more orders. Can: raise prices, stop supplying.'],['Banks','Want: loans repaid with interest. Can: refuse a loan, raise interest.'],['Local community','Want: jobs, no pollution or noise. Can: protest, start a petition.'],['Government','Wants: taxes paid, laws followed. Can: change taxes, pass laws, give grants.']],
   steps:[`Name the stakeholder.`,`Say their interest or their influence, whichever the question asks.`,`Explain how it would affect the business.`],
   ex:{q:`Describe one way the local community could influence a business. (1 mark)`,lines:[`They could start a petition against plans to expand, which might stop the plans going ahead. (1 mark)`]},
   traps:[`Listing employees as external. They work inside the business.`,`Mixing up interest and influence. Interest is what they WANT. Influence is what they can DO.`,`Giving a vague answer like "customers can affect sales". Say how: they could buy from a rival instead.`],
   examLabel:'In the test',exam:`Usually "describe the interest of" or "describe how X could influence". One mark each.`},
  written:[
   {q:`Describe one interest and one influence customers have on a business.`,marks:2,points:[`Interest: good quality products at a fair price`,`Influence: buying from a rival, complaining or leaving bad reviews`],model:`Customers want good quality products at a fair price. If they're unhappy, they could buy from a rival instead, so the business loses sales.`},
   {q:`Describe one interest and one influence suppliers have on a business.`,marks:2,points:[`Interest: being paid on time, or getting more orders`,`Influence: raising prices, or refusing to supply`],model:`Suppliers want to be paid on time. They could influence the business by raising their prices or refusing to deliver.`},
   {q:`Describe one interest and one influence a bank has on a business.`,marks:2,points:[`Interest: getting its loan repaid with interest`,`Influence: refusing a loan, or raising the interest rate`],model:`The bank wants its loan repaid with interest. It could refuse to lend the business money, so it can't afford to grow.`},
   {q:`Describe one interest and one influence the local community has on a business.`,marks:2,points:[`Interest: local jobs, and no pollution or noise`,`Influence: protesting or starting a petition`],model:`The local community wants jobs in the area and no pollution. They could start a petition to stop the business expanding.`},
   {q:`Describe one interest and one influence the government has on a business.`,marks:2,points:[`Interest: taxes being paid and laws followed`,`Influence: changing taxes, passing new laws, or giving grants`],model:`The government wants the business to pay its taxes. It could influence the business by raising taxes, which would increase its costs.`}]},
 {id:'fr',level:'red',name:'Franchises',blurb:'Running your own branch of a famous brand',gen:genFr,learn:{
   analogy:`A franchise is like using a famous chef's recipe. You cook and sell the meals yourself, but you pay the chef for using their name and their method.`,
   key:`The franchisor owns the brand. The franchisee buys the right to use it. The franchisee pays a fee to start, then a royalty, which is a share of the money they make.`,
   steps:[`Franchisor: the business that owns the brand, like Subway.`,`Franchisee: the person who buys the right to run a branch.`,`Start-up fee: paid once to join.`,`Royalty: a regular payment to the franchisor, usually a percentage of sales.`,`The franchisee has to follow the franchisor's rules: same products, prices, uniforms and look.`],
   ex:{q:`Describe what is meant by a franchise. (2 marks)`,lines:[`A franchisee buys the right to use the franchisor's name, products and way of working. (1 mark)`,`In return, the franchisee pays a fee and a royalty to the franchisor. (1 mark)`]},
   traps:[`Mixing up franchisor and franchisee. Think of employer and employee: the "-or" is in charge, the "-ee" signs up to their rules.`,`Thinking the franchisee works for the big brand. They own their own business.`,`Forgetting the royalty. The franchisee keeps paying, not just once.`],
   examLabel:'In the test',exam:`Know the words franchisor, franchisee and royalty, and be ready to describe a franchise in 2 points.`},
  written:[
   {q:`Describe what is meant by a franchise.`,marks:2,points:[`A franchisee buys the right to use the franchisor's name, products or way of working`,`The franchisee pays a fee and royalties to the franchisor`],model:`A franchise is when a franchisee buys the right to use a franchisor's name and products. In return, the franchisee pays a start-up fee and royalties to the franchisor.`},
   {q:`Explain the difference between a franchisor and a franchisee.`,marks:2,points:[`The franchisor owns the brand and sells the right to use it`,`The franchisee buys the right to run a branch using the brand`],model:`The franchisor is the business that owns the brand, like Subway. The franchisee is the person who pays to run their own Subway shop.`},
   {q:`Describe two disadvantages for someone buying a franchise.`,marks:2,points:[`Has to pay royalties, even when business is slow`,`Must follow strict rules set by the franchisor`,`Less freedom to make their own decisions`,`The start-up fee is expensive`],model:`The franchisee has to keep paying royalties to the franchisor. They also have to follow strict rules, so they can't choose their own products or prices.`},
   {q:`Describe two advantages of franchising for the franchisor.`,marks:2,points:[`The brand grows quickly without spending all its own money`,`It earns royalties from every franchise`,`Franchisees work hard because they own their shop`,`Less risk, because franchisees pay to set up`],model:`The franchisor can grow quickly because franchisees pay to open the new shops. It also earns royalties from every franchise.`}]},
 {id:'frad',level:'red',name:'Advantages of buying a franchise',blurb:'Why someone would buy in instead of starting from scratch',gen:genFrad,learn:{
   analogy:`Buying a franchise is like joining a team that's already winning. You still have to play well, but the kit, the tactics and the fans are already there.`,
   key:`The franchisee gets a known brand, help and advertising. That means less risk than starting a business alone.`,
   rules:[['Known brand','Customers already trust it, so there are sales from day one.'],['Less risk','The idea has already worked in other places.'],['Training and support','The franchisor shows you how to run it.'],['National advertising','The franchisor organises the big adverts.'],['Easier to borrow','Banks are happier lending to a proven brand.'],['Supplies sorted','Stock and equipment come from the franchisor.']],
   steps:[`Read the question carefully. "Advantages of buying a franchise" means advantages for the franchisee.`,`Give a different advantage for each mark.`,`Add why it helps, e.g. "training, so they know how to run the business".`],
   ex:{q:`Describe two advantages of buying a franchise. (2 marks)`,lines:[`The brand is already well known, so customers will come in from the start. (1 mark)`,`The franchisor gives training and support, so the franchisee doesn't have to work everything out alone. (1 mark)`]},
   traps:[`Giving advantages for the franchisor (like earning royalties) when the question asks about buying a franchise.`,`Writing "it's popular" and "people know it" as two points. That's the same point twice.`,`Not saying why it helps. "Training" is better as "training, so they know how to run it".`],
   examLabel:'In the test',exam:`A classic "describe two advantages" question. Two different points, each with a reason.`},
  written:[
   {q:`Describe two advantages of buying a franchise.`,marks:2,points:[`The brand is well known, so customers come from the start`,`Less risk of failing, as the idea is proven`,`Training and support from the franchisor`,`National advertising organised by the franchisor`,`Easier to get a bank loan`,`Stock and equipment supplied`],model:`The brand is already well known, so customers trust it and come in from the first day. The franchisor gives training, so the franchisee knows how to run the business.`},
   {q:`Explain why buying a franchise is less risky than starting a new business.`,marks:2,points:[`The brand is already known, so there are customers from day one`,`The business idea has already been proven to work`,`The franchisor gives training and support`],model:`The brand is already known and trusted, so customers will come in straight away. The idea has already worked in other places, so it's less likely to fail.`},
   {q:`Explain why a bank might be more willing to lend to someone buying a franchise.`,marks:1,points:[`The business idea is proven, so the loan is more likely to be repaid`],model:`The franchise has already worked in other places, so the bank thinks the loan is more likely to be paid back.`},
   {q:`Describe three advantages of buying a franchise.`,marks:3,points:[`A well-known brand that customers trust`,`Less risk of failing`,`Training and support`,`National advertising`,`Easier to borrow money`,`Stock and equipment supplied`],model:`The brand is well known, so customers trust it. The franchisor provides training and support. The franchisor also organises national advertising, which brings in customers.`}]}
];

/* ---------- simple explanations ----------
   Rules: 50 words max across both parts, a 10-year-old could follow it, no jargon,
   one everyday example, the idea not the method, one symbol at most. */
const NUT={
 st:{what:`A sole trader is a business owned and run by one person. They make every decision and keep all the profit.`,
     why:`Your local window cleaner or hairdresser is probably one. It's the easiest business to start, but if it goes wrong the owner can lose their own savings.`},
 pt:{what:`A partnership is a business owned and run by two or more people, called partners. They share the decisions and the profit.`,
     why:`Lots of vets, dentists and solicitors work this way. More owners means more money and skills, but partners can fall out.`},
 ltd:{what:`A private limited company is owned by shareholders, people who have each bought a share of it. Its name ends in Ltd.`,
     why:`Many family firms and local builders are Ltd. If the company fails, the owners only lose what they put in, not their house.`},
 ul:{what:`Unlimited liability means the owner has to pay all the business's debts, with no limit, even from their own money.`,
     why:`If a sole trader's shop can't pay its bills, the owner might have to sell their own car or house. Limited liability protects owners from that.`},
 pub:{what:`The public sector is organisations owned and run by the government or your local council, like the NHS, schools and the police.`,
     why:`They're paid for mostly by taxes. Their main aim is to give everyone a good service, not to make a profit.`},
 third:{what:`The third sector is charities, voluntary groups and social enterprises. They exist to help a cause, not to make money for owners.`,
     why:`Think of a charity shop, or a fun run for Cancer Research UK. The money raised goes back into helping people.`},
 istk:{what:`A stakeholder is anyone with an interest in a business. Internal stakeholders are inside it: the owners, managers and staff.`,
     why:`In a supermarket, the staff want good pay and the owners want profit. Each group can change how the business runs.`},
 estk:{what:`External stakeholders are people outside a business who are still affected by it, like customers, suppliers, banks, neighbours and the government.`,
     why:`If a takeaway sells bad food, customers stop coming and post bad reviews. Outsiders can make or break a business.`},
 fr:{what:`A franchise is when someone buys the right to run their own branch of a famous business, using its name and products.`,
     why:`Many Subway and Domino's shops work this way. The local owner runs the shop and pays the big brand a share of the money.`},
 frad:{what:`These are the reasons someone might buy a franchise instead of starting a brand new business from scratch.`,
     why:`Opening a Domino's means people already know the name and trust the pizza. That makes it much less likely to fail than an unknown shop.`}
};
TOPICS.forEach(t=>{t.nut=NUT[t.id];});

Study.registerSubject('evan-business-s3',{
  title:'Business',
  level:'S3',
  course:'S3 Business · Assessment Piece 2 revision list',
  intro:'Work down your revision sheet in order. Get 5 right in a row to master a topic. Then try Exam practice: write answers like you would in the test, and mark them yourself. You\'ve got this.',
  topics:TOPICS
});
})();
