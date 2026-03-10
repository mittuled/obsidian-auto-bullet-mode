# Tasks: Auto Bullet Mode

**Input**: Design documents from `/specs/001-auto-bullet-mode/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Included per constitution Principle VI (Test-First Development).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, build tooling, and Obsidian plugin scaffold

- [x] T001 Initialize npm project with `obsidian`, `typescript`, `@types/node`, `esbuild` dependencies in package.json
- [x] T002 [P] Create tsconfig.json with strict mode, ES2018 target, CommonJS module resolution, and `obsidian` type imports
- [x] T003 [P] Create esbuild.config.mjs with external `obsidian` module, CommonJS format, single `main.js` output, and dev watch mode
- [x] T004 [P] Create manifest.json with id `auto-bullet-mode`, name `Auto Bullet Mode`, version `1.0.0`, minAppVersion, `isDesktopOnly: false`
- [x] T005 Create directory structure: `src/`, `src/extensions/`, `tests/unit/`

**Checkpoint**: Project builds with `npm run build` producing an empty `main.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core modules that ALL user stories depend on — settings, context detection, and plugin skeleton

**CRITICAL**: No user story work can begin until this phase is complete

> **NOTE: Write tests FIRST (TDD per constitution Principle VI), then implement**

- [x] T006 [P] Write unit tests for settings defaults in tests/unit/settings.test.ts: test `Object.assign({}, DEFAULT_SETTINGS, null)` produces defaults, test merging partial saved data preserves missing fields
- [x] T007 [P] Write unit tests for context detection in tests/unit/context.test.ts: test `isInCodeBlock` returns true inside FencedCode/CodeBlock nodes, `isInFrontmatter` returns true inside YAMLFrontMatter, `isLivePreview` reads `editorLivePreviewField`
- [x] T008 Create AutoBulletSettings interface and DEFAULT_SETTINGS constant (`{ autoBulletEnabled: true }`) in src/settings.ts (depends on T006 failing first)
- [x] T009 Implement context detection helpers in src/extensions/context.ts: `isInCodeBlock(state, pos)`, `isInFrontmatter(state, pos)`, `isLivePreview(state)` using `syntaxTree().resolveInner()` and `editorLivePreviewField` (depends on T007 failing first)
- [x] T010 Create plugin skeleton in src/main.ts: extend `Plugin`, implement `onload()` with `loadData()`/settings merge, implement `onunload()`, create mutable extension array with `registerEditorExtension()`

**Checkpoint**: Foundation ready — plugin loads in Obsidian with no behavior, settings load/save works, context helpers tested

---

## Phase 3: User Story 1 - Auto-Bullet on Every New Line (Priority: P1) MVP

**Goal**: Every new line automatically starts with a bullet prefix `- ` when the user types in Live Preview mode. Enter continues bullets. Double-Enter on empty bullet exits.

**Independent Test**: Open a note, type on an empty line — see `- ` appear. Press Enter — new bullet. Press Enter on empty bullet — exits to plain line.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T011 [P] [US1] Write unit tests for auto-bullet inputHandler in tests/unit/auto-bullet.test.ts: test single character on empty line triggers `- ` prefix insertion, test paste (text.length > 1) does NOT trigger insertion, test no insertion when `isInCodeBlock` is true, test no insertion when `isInFrontmatter` is true, test no insertion when `isLivePreview` is false, test no insertion when line already has `- ` prefix
- [x] T012 [P] [US1] Write unit tests for bullet-enter keymap in tests/unit/bullet-enter.test.ts: test Enter on bullet line creates new `- ` line, test Enter on empty bullet `- ` removes bullet and creates empty line, test Enter does not fire when not in Live Preview, test Enter does not fire inside code block
- [x] T013 [P] [US1] Write unit test for no-modify-on-open in tests/unit/auto-bullet.test.ts: test that opening a note with plain text lines does NOT trigger any editor transactions or bullet insertions (FR-004)

### Implementation for User Story 1

- [x] T014 [US1] Implement auto-bullet inputHandler extension in src/extensions/auto-bullet.ts: use `EditorView.inputHandler.of()` to detect single-character input on empty lines, guard with `isLivePreview()`, `isInCodeBlock()`, `isInFrontmatter()`, insert `- ` prefix via `view.dispatch()`, handle block-level syntax override (remove `- ` if user types `#`, `>`, or number prefix)
- [x] T015 [US1] Implement bullet-enter keymap extension in src/extensions/bullet-enter.ts: use `Prec.high(keymap.of([{ key: 'Enter', run }]))`, detect current line bullet prefix with regex `^\s*[-]\s` (only `- ` supported per spec assumptions), insert `\n` + matching indent + `- `, handle empty bullet case (remove `- ` line, insert plain newline)
- [x] T016 [US1] Wire auto-bullet and bullet-enter extensions into src/main.ts: push both extensions into the mutable extension array, call `this.app.workspace.updateOptions()`, guard with `autoBulletEnabled` setting check

**Checkpoint**: User Story 1 fully functional — auto-bullet and Enter continuation work in Live Preview, excluded in code blocks/frontmatter/Source mode

---

## Phase 4: User Story 2 - Toggle Auto-Bullet Mode (Priority: P2)

**Goal**: User can toggle auto-bullet mode on/off via command palette. Status bar shows current state on desktop.

**Independent Test**: Run "Toggle Auto Bullet Mode" from command palette, verify bullets stop auto-inserting. Toggle again, verify they resume. Check status bar indicator updates.

### Tests for User Story 2

- [x] T017 [P] [US2] Write unit tests for toggle behavior in tests/unit/toggle.test.ts: test toggling `autoBulletEnabled` to false removes extensions from array, test toggling back to true re-adds extensions, test `saveData()` is called on toggle
- [x] T018 [P] [US2] Write unit tests for status bar in tests/unit/status-bar.test.ts: test status bar text updates when mode is enabled vs disabled, test status bar click handler toggles mode

### Implementation for User Story 2

- [x] T019 [US2] Implement status bar manager in src/status-bar.ts: create `StatusBarManager` class, `addStatusBarItem()` in constructor with platform guard (desktop only), `update(enabled: boolean)` method to set text/icon, click handler to toggle mode
- [x] T020 [US2] Register toggle command in src/main.ts via `addCommand()`: id `toggle-auto-bullet-mode`, name `Toggle Auto Bullet Mode`, callback flips `autoBulletEnabled`, calls `saveData()`, updates extension array (push/clear), calls `workspace.updateOptions()`, updates status bar
- [x] T021 [US2] Implement PluginSettingTab in src/settings.ts: extend `PluginSettingTab`, add toggle control for `autoBulletEnabled`, call `saveData()` and update extensions on change
- [x] T022 [US2] Initialize status bar and settings tab in src/main.ts `onload()`: instantiate `StatusBarManager`, call `addSettingTab()`, set initial status bar state from loaded settings

**Checkpoint**: Toggle works via command palette and settings tab. Status bar reflects state on desktop. Extensions dynamically added/removed.

---

## Phase 5: User Story 3 - Outline Indentation Support (Priority: P3)

**Goal**: New bullets after indented bullets preserve the indentation level. Tab/Shift-Tab indentation relies on Obsidian's native behavior (no custom implementation needed).

**Independent Test**: Type a bullet, press Tab to indent, press Enter — new bullet appears at same indent level.

### Tests for User Story 3

- [x] T023 [P] [US3] Write unit tests for indentation-aware Enter in tests/unit/indent-enter.test.ts: test Enter on indented bullet `\t- text` creates `\t- ` on new line, test Enter on double-indented bullet `\t\t- text` creates `\t\t- ` on new line, test Enter on empty indented bullet `\t- ` removes bullet and outdents

### Implementation for User Story 3

- [x] T024 [US3] Update bullet-enter keymap in src/extensions/bullet-enter.ts to capture leading whitespace from current line regex match group and include it in the new bullet prefix (`\n${indent}- `)
- [x] T025 [US3] Update auto-bullet inputHandler in src/extensions/auto-bullet.ts to detect indented context: if previous line is an indented bullet, auto-insert at matching indent level

**Checkpoint**: Indented bullet continuation works. Tab/Shift-Tab use Obsidian native behavior. Nested outlines function correctly.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Styles, documentation, final validation

- [x] T026 [P] Create styles.css with status bar indicator styles using CSS logical properties and Obsidian CSS custom properties
- [x] T027 [P] Run quickstart.md validation: verify all setup steps, verify all test exclusions (code blocks, frontmatter, headings, paste, Source mode)
- [x] T028 Verify all tests pass with `npm test`
- [x] T029 Manual smoke test on Obsidian mobile (if available) to confirm auto-bullet works without status bar

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - US2 depends on US1 (toggle removes/adds the same extensions US1 creates)
  - US3 depends on US1 (extends the bullet-enter keymap from US1)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 being complete (needs extensions to toggle)
- **User Story 3 (P3)**: Depends on US1 being complete (extends bullet-enter.ts)

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Context helpers before extensions
- Extensions before main.ts wiring
- Story complete before moving to next priority

### Parallel Opportunities

- T002, T003, T004 can run in parallel (Setup phase)
- T006, T007 can run in parallel (Foundational tests), then T008, T009 in parallel (Foundational implementation)
- T011, T012, T013 can run in parallel (US1 tests)
- T017, T018 can run in parallel (US2 tests)
- T026, T027 can run in parallel (Polish phase)

---

## Parallel Example: User Story 1

```bash
# Launch US1 tests in parallel (write first, must fail):
Task: "Write unit tests for auto-bullet inputHandler in tests/unit/auto-bullet.test.ts"
Task: "Write unit tests for bullet-enter keymap in tests/unit/bullet-enter.test.ts"

# Then implement sequentially:
Task: "Implement auto-bullet inputHandler in src/extensions/auto-bullet.ts"
Task: "Implement bullet-enter keymap in src/extensions/bullet-enter.ts"
Task: "Wire extensions into src/main.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test auto-bullet and Enter continuation independently
5. Deploy to dev vault for testing

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → MVP!
3. Add User Story 2 → Test toggle and status bar → Enhanced UX
4. Add User Story 3 → Test indentation → Full outliner experience
5. Polish → Styles, docs, final validation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD per constitution)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
