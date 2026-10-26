# Study Companion

One study app for Ben and Evan. Opens with "Who's studying today?", shows each boy only his own subjects, and logs real effort for the Parent view.

Live at `https://i3rink.github.io/study/` once GitHub Pages is on.

Version: **1.2.0** (set in `core/engine.js` as `APP_VERSION`, shown in the footer, and used in the commit message).

## Files

| File | What it does |
|---|---|
| `index.html` | Opening screen, child picker, subject lists, Parent view, timer bar with "Not you? Switch" |
| `core/engine.js` | Storage, active-use timer, mastery, logging, tests, topic priorities, parent PIN |
| `core/topic.js` | Topic screen for every subject: simple explanation, Learn, Practise, Hint, Show me how |
| `core/tests.js` | My tests: log a test, see the evidence, reflect, plan, suggest a red list |
| `core/game.js` | XP and levels, study streak, Question of the day, Boss rounds, badges |
| `core/plan.js` | Study plans: tonight's target, Friday rule, Training cancelled, focus timer, plan screens, Parent view plan section |
| `core/styles.css` | Shared look |
| `subjects/registry.js` | Which subjects belong to which child |
| `subjects/ben-maths-n5.js` | Ben, SQA National 5 Mathematics content |
| `subjects/evan-maths-s3.js` | Evan, S3 Mathematics matched to his revision booklet (National 5 standard), 12 topics in booklet order |
| `subjects/evan-business-s3.js` | Evan, S3 Business, Assessment Piece 2 revision list, 10 topics in list order |
| `plans/ben-prelims-2026.js` | Ben's December 2026 prelim plan: exam dates and what to study each weeknight |

## Adding a subject

1. Add the content file, e.g. `subjects/evan-biology-cfe4.js`. It calls `Study.registerSubject('evan-biology-cfe4', {...})` with `title`, `level`, `course`, `intro` and `topics`.
2. Add one line to `subjects/registry.js`:
   `{ child: 'evan', subject: 'biology-cfe4', file: 'subjects/evan-biology-cfe4.js', name: 'Biology', level: 'Fourth level' }`
3. Nothing else changes.

Each topic needs `id`, `name`, `blurb`, `level` ('red' or 'amber', the parent's default order), `nut` (`what` and `why`, 50 words max between them), `learn` (analogy, key, steps, ex, traps, exam) and `gen()` returning a question.

Question kinds the core supports: `mc` (add `plain: true` for ordinary text options), `num` (add `alt` for other answers that also count, like using 3.14 for π), `fields`.

Written answers: a topic can add `written: [{q, marks, points, model}]`. That adds an Exam practice tab. He writes an answer, then ticks the marking points he made. Self-marked answers never count towards mastery, streaks or % right, earn a flat 3 XP, and his actual answers show in the Parent view.

A wrong answer that's right except for the sign gets a "Right number, wrong sign" message.

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
| Written answer, self-marked (Exam practice) | 3, or 0 for "I don't know" |

- Levels: level 2 at 100 XP, 3 at 300, 4 at 600, 5 at 1000, and so on.
- Streak: a day counts with 10+ questions at 60%+, across all the child's subjects. One missed day per week (Monday to Sunday) is forgiven.
- Badges: First steps, Clean sheet, Comeback, Kept my word, Target hit, Seven days, Boss beaten.
- Only tracked work earns XP. The focus timer never does.

## Study plans

One plan file per child in `plans/`, plus one line in the `plans` list in `subjects/registry.js`.

- Weeknights only. Football nights (the `football` list on each child in the registry, 0 Sunday to 6 Saturday) are 45 minutes. Other nights are 90.
- "Training cancelled" makes a football night 90 minutes. The pupil presses it. The Parent view lists every press.
- A night with two subjects splits its time equally.
- Friday is off once every Monday to Thursday minute is done, counting time on each night's planned subject. Friday is always on in an exam week (an exam that week, or the Monday after).
- Subjects with a content file use tracked time. Subjects without one use the focus timer.
- A plan subject's `subject` must match its registry `subject` once its content file is added, so tracked time is picked up automatically.

### Focus timer (self-reported)

- Counts down from tonight's target. Pauses if the page is hidden or he leaves the screen.
- "Still working?" every 15 minutes. No tap within 2 minutes takes those 2 minutes back and pauses.
- Stop keeps the time done. Under a minute isn't logged. Every session needs a one-line note.
- Shown in the Parent view as self-reported, apart from tracked time. Never earns XP or counts towards streaks.

## Storage

Every key is `studyapp:<child>:<subject>:<part>`, with parts `progress`, `log`, `tests`, `plan`, `written`. Game data covers all of a child's subjects, so it's `studyapp:<child>:all:game`. Training cancelled presses are `studyapp:<child>:all:plan`. Focus timer sessions are `studyapp:<child>:<subject>:focus`. Don't name a subject `all`. The parent PIN is `studyapp:parent:settings`.

- Clearing browser data resets progress and the log. The "tracking since" date in the Parent view shows when that happened.
- Progress is per device and per browser.
- Never rename a `subject` in the registry once it's live, or its data starts again.

## Releasing

1. Bump `APP_VERSION` in `core/engine.js`.
2. Bump the `?v=` numbers in `index.html` to match (this stops phones using old cached files).
3. Commit with the version first, e.g. `v1.0.1: fix bearings hint`.
