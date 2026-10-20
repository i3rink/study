# Study Companion

One study app for Ben and Evan. Opens with "Who's studying today?", shows each boy only his own subjects, and logs real effort for the Parent view.

Live at `https://i3rink.github.io/study/` once GitHub Pages is on.

Version: **1.0.0** (set in `core/engine.js` as `APP_VERSION`, shown in the footer, and used in the commit message).

## Files

| File | What it does |
|---|---|
| `index.html` | Opening screen, child picker, subject lists, Parent view, timer bar with "Not you? Switch" |
| `core/engine.js` | Storage, active-use timer, mastery, logging, tests, topic priorities, parent PIN |
| `core/topic.js` | Topic screen for every subject: simple explanation, Learn, Practise, Hint, Show me how |
| `core/tests.js` | My tests: log a test, see the evidence, reflect, plan, suggest a red list |
| `core/styles.css` | Shared look |
| `subjects/registry.js` | Which subjects belong to which child |
| `subjects/ben-maths-n5.js` | Ben, SQA National 5 Mathematics content |

## Adding a subject

1. Add the content file, e.g. `subjects/evan-biology-cfe4.js`. It calls `Study.registerSubject('evan-biology-cfe4', {...})` with `title`, `level`, `course`, `intro` and `topics`.
2. Add one line to `subjects/registry.js`:
   `{ child: 'evan', subject: 'biology-cfe4', file: 'subjects/evan-biology-cfe4.js', name: 'Biology', level: 'Fourth level' }`
3. Nothing else changes.

Each topic needs `id`, `name`, `blurb`, `level` ('red' or 'amber', the parent's default order), `nut` (`what` and `why`, 50 words max between them), `learn` (analogy, key, steps, ex, traps, exam) and `gen()` returning a question.

Question kinds the core supports today: `mc`, `num`, `fields`. Written answers with self-marking (English, history, modern studies) need a core change first.

## Storage

Every key is `studyapp:<child>:<subject>:<part>`, with parts `progress`, `log`, `tests`, `plan`. The parent PIN is `studyapp:parent:settings`.

- Clearing browser data resets progress and the log. The "tracking since" date in the Parent view shows when that happened.
- Progress is per device and per browser.
- Never rename a `subject` in the registry once it's live, or its data starts again.

## Releasing

1. Bump `APP_VERSION` in `core/engine.js`.
2. Bump the `?v=` numbers in `index.html` to match (this stops phones using old cached files).
3. Commit with the version first, e.g. `v1.0.1: fix bearings hint`.
