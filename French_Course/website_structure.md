# Website Structure Rules

## GitHub Pages deployment structure
The generated website must be deployable directly on GitHub Pages.

Required root-level structure:
- `index.html` — course homepage
- `Week_1/`
- `Week_2/`
- `Week_3/`
- and so on

### Root index.html requirements
The root `index.html` must:
- serve as the homepage for the whole French course
- link to all available week folders
- show course title
- show short description
- show learner progress if available
- show which weeks are completed, current, or coming next

### Week folder requirements
Each `week-N/` folder must contain:
- its own `index.html`
- `vocabulary.html`
- `grammar.html`
- `reading.html`
- `listening.html`
- `writing.html`
- `quiz.html`
- `styles.css`
- `audio.js`

### Linking rules
- use relative links only
- avoid absolute local paths
- ensure GitHub Pages compatibility
- ensure navigation works both from the homepage and inside each week

## General site rules
- mobile-first for iPhone Safari
- large tap targets
- clean navigation between all pages
- progress indicator for week number
- previous / next week links
- consistent card layout
- easy reveal / hide interactions
- accessible contrast and readable spacing

## index.html inside each week
Include:
- week title
- what is new
- what is being reviewed
- learning goals
- links to all sections
- suggested study order

## vocabulary.html
Required sections:
1. new this week
2. review words from recent weeks
3. older core words returning this week
4. mini practice

Each card must include:
- French word
- article if relevant
- phonetic pronunciation guide
- hidden English translation
- show all / hide all controls
- one example sentence
- hidden English for example
- audio for word
- audio for sentence
- tags such as new / review / appears in reading / appears in writing

Add a section called “Built with words you already know”.

## grammar.html
Required sections:
1. main grammar target
2. review grammar target
3. pattern ladder
4. compare and notice
5. mini production prompts

Include:
- simple explanation
- 4-6 examples
- hidden English for examples
- expand/collapse why this works
- notes on connectors or agreement where needed
- watch-out box for common mistakes
- reminder from earlier weeks

## reading.html
Required sections:
1. warm-up review
2. main reading passage
3. audio player
4. sentence-by-sentence breakdown
5. hidden English translation
6. comprehension questions
7. words from earlier weeks used here
8. new words in this reading

Rules:
- mostly known language
- limited new vocabulary
- level-appropriate questions

## listening.html
Required sections:
1. listening warm-up
2. main listening passage or dialogue
3. audio player
4. first listen task
5. second listen task
6. dictation / gap-fill or ordering task
7. listening test
8. answer reveal

Rules:
- built from learned material
- not dramatically harder than reading
- include cumulative review

## writing.html
Required sections:
1. sentence warm-up
2. guided writing
3. controlled writing
4. writing test
5. checklist before reveal / submit
6. model answer hidden by default

Rules:
- must be based on learned material
- must combine current week + review
- include a rubric: task completion, vocabulary use, grammar control, clarity

## quiz.html
Required sections:
1. quick review quiz
2. main weekly quiz
3. reading/listening mini checks
4. cumulative review block
5. final score
6. retry button

Rules:
- immediate feedback
- explanation for answers
- clearly label current week vs review

## styles.css
Must define:
- typography
- buttons
- cards
- reveal/hide blocks
- navigation
- audio controls
- quiz states
- mobile spacing
- progress bars
- writing rubric styles
- feedback alerts

## audio.js
Must support:
- short audio player
- long audio player
- play / pause / restart
- sentence playback
- passage playback
- safe reset behavior for multiple players

## Audio implementation rule
Any page that contains audio buttons or calls functions from `audio.js` must explicitly load the script on that same page.

Required rule:
- Add `<script src="audio.js"></script>` to every week page that uses audio controls.
- Prefer placing it at the end of `<body>` so the page content loads first.
- Do not assume loading it on one page makes it available on other pages.
- Before finalizing a week, verify that every page with `Play word`, `Play sentence`, `Play passage`, `Pause`, `Restart`, or similar controls includes the script tag and that the buttons call valid functions from `audio.js`.

Final check before shipping:
- Search each week HTML file for `speakText(`, `restartSpeech(`, or `stopSpeech(`.
- If any of those appear, that file must also contain `<script src="audio.js"></script>`.
