# Study Companion

One study app for Ben and Evan. Opens with "Who's studying today?", shows each boy only his own subjects, and logs real effort for the Parent view.

Live at `https://i3rink.github.io/study/` once GitHub Pages is on.

Version: **1.1.0** (set in `core/engine.js` as `APP_VERSION`, shown in the footer, and used in the commit message).

## Files

| File | What it does |
|---|---|
| `index.html` | Opening screen, child picker, subject lists, Parent view, timer bar with "Not you? Switch" |
| `core/engine.js` | Storage, active-use timer, mastery, logging, tests, topic priorities, parent PIN |
| `core/topic.js` | Topic screen for every subject: simple explanation, Learn, Practise, Hint, Show me how |
| `core/tests.js` | My tests: log a test, see the evidence, reflect, plan, suggest a red list |
| `core/game.js` | XP and levels, study streak, Question of the day, Boss rounds, badges |
| `core/styles.css` | Shared look |
| `subjects/registry.js` | Which subjects belong to which child |
| `subjects/ben-maths-n5.js` | Ben, SQA National 5 Mathematics content |
| `subjects/evan-maths-s3.js` | Evan, S3 Mathematics matched to his revision booklet (National 5 standard), 12 topics in booklet order |

## Adding a subject

1. Add the content file, e.g. `subjects/evan-biology-cfe4.js`. It calls `Study.registerSubject('evan-biology-cfe4', {...})` with `title`, `level`, `course`, `intro` and `topics`.
2. Add one line to `subjects/registry.js`:
   `{ child: 'evan', subject: 'biology-cfe4', file: 'subjects/evan-biology-cfe4.js', name: 'Biology', level: 'Fourth level' }`
3. Nothing else changes.

Each topic needs `id`, `name`, `blurb`, `level` ('red' or 'amber', the parent's default order), `nut` (`what` and `why`, 50 words max between them), `learn` (analogy, key, steps, ex, traps, exam) and `gen()` returning a question.

Question kinds the core supports today: `mc`, `num`, `fields`. Written answers with self-marking (English, history, modern studies) need a core change first.

## Game rules

| Action | XP |
|---|---|
| Correct, no hint | 10 |
| Correct with a hint | 5 |
| Show me how, or wrong | 0 |
| Correct on a topic already mastered | 2 |
| Mastering a topic | +50 |
| Re-mastering a topic a test re-opened | +75 |
| Question of the day (once a day, from a mastered topic) | 20, or 10 with a hint |
| Boss round (8 questions, first 2 rounds a day per subject) | 15 a question, +50 for a new best |

- Levels: level 2 at 100 XP, 3 at 300, 4 at 600, 5 at 1000, and so on.
- Streak: a day counts with 10+ questions at 60%+, across all the child's subjects. One missed day per week (Monday to Sunday) is forgiven.
- Badges: First steps, Clean sheet, Comeback, Kept my word, Target hit, Seven days, Boss beaten.
- XP is stored per day, ready for a PlayStation time rule later. Nothing converts it yet.

## Storage

Every key is `studyapp:<child>:<subject>:<part>`, with parts `progress`, `log`, `tests`, `plan`. Game data covers all of a child's subjects, so it's `studyapp:<child>:all:game`. Don't name a subject `all`. The parent PIN is `studyapp:parent:settings`.

- Clearing browser data resets progress and the log. The "tracking since" date in the Parent view shows when that happened.
- Progress is per device and per browser.
- Never rename a `subject` in the registry once it's live, or its data starts again.

## Releasing

1. Bump `APP_VERSION` in `core/engine.js`.
2. Bump the `?v=` numbers in `index.html` to match (this stops phones using old cached files).
3. Commit with the version first, e.g. `v1.0.1: fix bearings hint`.
