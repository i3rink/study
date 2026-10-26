/* plans/ben-prelims-2026.js
   Ben's study plan for his December 2026 prelims. Data only. The engine is core/plan.js.

   How a night works:
   - Weeknights only. No weekend sessions.
   - Football nights (set per child in subjects/registry.js) are 45 minutes. Other nights are 90.
   - "Training cancelled" turns a football night into 90 minutes.
   - A night with two subjects splits its time equally between them.
   - Friday is off if every Monday to Thursday minute was done. Friday is always on in an exam week
     (any week with an exam in it, or with an exam the Monday after).

   `subject` is the storage name. It must match the registry `subject` once that subject gets a content file,
   so the plan picks up tracked time automatically. Until then the subject uses the self-reported focus timer.

   nights: 1 Monday ... 5 Friday. A nested list alternates week by week, starting with the first. */
Study.registerPlan({
  child: 'ben',
  id: 'prelims-2026',
  title: 'Prelims, December 2026',
  start: '2026-10-26',
  end: '2026-12-17',
  short: 45,
  long: 90,
  subjects: {
    english:  {name: 'English',             subject: 'english-n5'},
    maths:    {name: 'Maths',               subject: 'maths-n5'},
    biology:  {name: 'Biology',             subject: 'biology-n5'},
    business: {name: 'Business Management', subject: 'business-n5'},
    cookery:  {name: 'Practical Cookery',   subject: 'cookery-n5'},
    spanish:  {name: 'Spanish',             subject: 'spanish-n5'}
  },
  exams: [
    {date: '2026-12-03', s: 'english',  name: 'English',                              time: '9.00 to 10.00'},
    {date: '2026-12-07', s: 'maths',    name: 'Maths, Paper 1 and Paper 2',           time: '9.00 to 10.00 and 10.30 to 11.40'},
    {date: '2026-12-08', s: 'biology',  name: 'Biology',                              time: '9.00 to 11.00'},
    {date: '2026-12-11', s: 'business', name: 'Business Management',                  time: '9.00 to 10.30'},
    {date: '2026-12-14', s: 'cookery',  name: 'Practical Cookery',                    time: '9.00 to 10.00'},
    {date: '2026-12-15', s: 'spanish',  name: 'Spanish Listening',                    time: '9.00 to 9.30'},
    {date: '2026-12-17', s: 'spanish',  name: 'Spanish Reading and Directed Writing', time: '1.10 to 2.40'}
  ],
  phases: [
    {from: '2026-10-26', to: '2026-11-15', label: 'Fix the weak topics',
     nights: {1: ['maths'], 2: ['english'], 3: ['biology'], 4: [['business', 'cookery']], 5: ['spanish', 'maths']}},
    {from: '2026-11-16', to: '2026-11-29', label: 'Exam-style practice',
     nights: {1: ['maths'], 2: ['english'], 3: ['biology'], 4: [['business', 'cookery']], 5: ['spanish', 'english']}},
    {from: '2026-11-30', to: '2026-12-17', label: 'Exam run', nights: {}}
  ],
  days: {
    '2026-11-30': {s: ['english']},
    '2026-12-01': {s: ['english']},
    '2026-12-02': {s: ['english'], note: 'Last look before tomorrow'},
    '2026-12-03': {s: ['maths']},
    '2026-12-04': {s: ['maths'], note: 'Last night before the Maths exam'},
    '2026-12-07': {s: ['biology'], note: 'Last night before the Biology exam'},
    '2026-12-08': {s: ['business']},
    '2026-12-09': {s: ['business']},
    '2026-12-10': {s: ['business']},
    '2026-12-11': {s: ['cookery'], note: 'Last night before the Cookery exam'},
    '2026-12-14': {s: ['spanish'], note: 'Listening'},
    '2026-12-15': {s: ['spanish'], note: 'Reading and directed writing'},
    '2026-12-16': {s: ['spanish'], note: 'Reading and directed writing'}
  }
});
