# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A locally-run children's storybook generator. A Flask server runs on `localhost:5100`, the user fills a web form, and the app uses a local Ollama LLM (`gemma3:12b`) to generate an age-appropriate story, screens it for safety, assembles it into a self-contained HTML storybook, and saves it to `~/.storybook_generator/`. No cloud services, no internet required after model download.

## Setup & Running

```bash
source .venv/bin/activate
python -m pip install -e .          # install/update dependencies
storybook                           # run at http://127.0.0.1:5100
```

For image generation (optional, heavy dependencies):
```bash
python -m pip install -e ".[images]"
```

Dev tools (ruff, mypy):
```bash
python -m pip install -e ".[dev]"
ruff check src/
mypy src/
```

Ollama must be installed separately from https://ollama.com and the `gemma3:12b` model pulled before first use.

## Architecture

The pipeline runs in this sequence on every story generation request (`POST /api/story/generate`):

1. **`safety_checker.screen_input()`** — LLM call to classify user inputs before any story is generated
2. **`story_generator.generate_story()`** — LLM call that produces a JSON array of `StoryPage` objects
3. **`safety_checker.screen_generated_story()`** — LLM call to check the generated text before saving
4. **`html_assembler.assemble_html()`** — Injects pages into the fixed `STORYBOOK_TEMPLATE` string (no templating engine; plain `str.replace`)
5. **`library.Story.save_to_library()`** — Writes `~/.storybook_generator/<uuid>/index.html` and updates `stories.json`

Real-time progress during generation is delivered via SSE (`GET /api/progress`) using a global `queue.Queue`. The UI polls this endpoint while the synchronous generation runs on the request thread.

**Key constraint:** The HTML template in `html_assembler.py` is fixed and versioned (`data-template-version="1.0"`). Changes to it affect all future stories uniformly. Incrementing the version requires handling backward compatibility with old saved stories.

## Module Responsibilities

- `app.py` — Flask routes; orchestrates the pipeline; owns the SSE progress queue
- `story_generator.py` — Builds the LLM prompt from `StoryRequest`, calls `ollama.generate()`, extracts JSON array from response
- `safety_checker.py` — Two separate LLM classification prompts (input screening and post-generation check); both call `gemma3:12b`
- `html_assembler.py` — Contains the entire HTML/CSS/JS storybook template as a string constant; `assemble_html()` injects content
- `library.py` — Filesystem I/O; `LIBRARY_DIR = ~/.storybook_generator`; `stories.json` is the index; story dirs are named by UUID
- `ollama_manager.py` — Spawns/terminates `ollama serve` as a subprocess; checks liveness at `http://localhost:11434`

## Age Tiering

The `_get_age_tier()` function in `story_generator.py` maps age to `(tier_name, min_pages, max_pages, max_sentences_per_page)`:

- Ages ≤ 4: 6–8 pages, 3 sentences/page
- Ages 5–7: 10–12 pages, 5 sentences/page
- Ages ≥ 8: 12–16 pages, 8 sentences/page

The age tier name is also stored in the library index and in `Story.age_tier`.

## PRD

`src/storybook_generator/project_requirement.md` is the governing product requirements document. Read it before adding features or changing behavior — it defines what is in scope, content safety rules, UX constraints, and the quality bar. Non-goals (no editing, no cloud, no voice, no print, English-only) are explicitly listed there.
