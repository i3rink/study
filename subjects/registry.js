/* subjects/registry.js
   Which subjects and study plans belong to which child.
   To add a subject: drop its content file in subjects/ and add one line to `subjects` below.
   File names follow [child]-[subject]-[level].js, e.g. ben-maths-n5.js, evan-biology-cfe4.js.
   `subject` is the storage name. Never change it once the subject is live, or that subject's progress and log will start again.
   `football` lists football nights as day numbers (0 Sunday, 1 Monday ... 6 Saturday). Those nights are short in a study plan.
   To add a study plan: drop its file in plans/ and add one line to `plans` below. */
window.STUDY_REGISTRY = {
  children: [
    { id: 'ben',  name: 'Ben',  stage: 'S4 · National 5', football: [2, 4] },
    { id: 'evan', name: 'Evan', stage: 'S3',              football: [1, 3] }
  ],
  subjects: [
    { child: 'ben',  subject: 'maths-n5', file: 'subjects/ben-maths-n5.js',  name: 'Maths', level: 'National 5' },
    { child: 'evan', subject: 'maths-s3', file: 'subjects/evan-maths-s3.js', name: 'Maths', level: 'S3' },
    { child: 'evan', subject: 'business-s3', file: 'subjects/evan-business-s3.js', name: 'Business', level: 'S3' }
  ],
  plans: [
    { child: 'ben', file: 'plans/ben-prelims-2026.js' }
  ]
};
