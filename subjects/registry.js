/* subjects/registry.js
   Which subjects belong to which child.
   To add a subject: drop its content file in subjects/ and add one line to `subjects` below.
   File names follow [child]-[subject]-[level].js, e.g. ben-maths-n5.js, evan-biology-cfe4.js.
   `subject` is the storage name. Never change it once the subject is live, or that subject's progress and log will start again. */
window.STUDY_REGISTRY = {
  children: [
    { id: 'ben',  name: 'Ben',  stage: 'S4 · National 5' },
    { id: 'evan', name: 'Evan', stage: 'S3' }
  ],
  subjects: [
    { child: 'ben', subject: 'maths-n5', file: 'subjects/ben-maths-n5.js', name: 'Maths', level: 'National 5' }
  ]
};
