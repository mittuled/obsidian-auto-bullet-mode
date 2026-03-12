# Tasks: Configurable Checkbox Shortcut

**Input**: Design documents from `/specs/003-configurable-shortcut/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Included per Constitution Principle VI (Test-First Development).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No project initialization needed — existing project structure is already set up. Skip to foundational work.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extend the settings interface and add the shortcut parameter to the extension factory — both are required before any user story work.

- [x] T001 Add `checkboxShortcut` field to `AutoBulletSettings` interface and `DEFAULT_SETTINGS` in src/settings.ts
- [x] T002 Update `createAutoBulletInputHandler()` signature to accept `checkboxShortcut: string` parameter and build `CHECKBOX_PATTERN_RE` dynamically using `new RegExp()` in src/extensions/auto-bullet.ts
- [x] T003 Update `enableExtensions()` in src/main.ts to pass `this.settings.checkboxShortcut` to `createAutoBulletInputHandler()`

**Checkpoint**: Foundation ready — extension accepts dynamic shortcut character, default "t" behavior preserved

---

## Phase 3: User Story 1 - Configure Checkbox Shortcut Character (Priority: P1) 🎯 MVP

**Goal**: Users can change the checkbox shortcut character in settings and it takes effect immediately.

**Independent Test**: Change shortcut to "x" in settings, type `- x ` → converts to `- [ ] `. Type `- t ` → no conversion.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T004 [P] [US1] Add unit tests for dynamic checkbox pattern in tests/unit/auto-bullet.test.ts: test that passing "x" triggers on `- x ` and does not trigger on `- t `; test default "t" still works; test case sensitivity ("T" vs "t")
- [x] T005 [P] [US1] Add unit tests for `checkboxShortcut` setting validation in tests/unit/settings.test.ts: test default value is "t"; test valid alphanumeric chars accepted; test conflicting chars ("/", "#", ">", "`") rejected; test multi-char input truncated to first char

### Implementation for User Story 1

- [x] T006 [US1] Add settings UI control for checkbox shortcut in src/settings.ts: text field with label "Checkbox shortcut character", description explaining usage, validation on change (reject conflicting chars, truncate to first char)
- [x] T007 [US1] Wire setting change to extension rebuild in src/main.ts: when `checkboxShortcut` changes in settings tab, call `disableExtensions()` then `enableExtensions()` to rebuild with new value

**Checkpoint**: User Story 1 fully functional — users can configure the shortcut character and it works immediately

---

## Phase 4: User Story 2 - Disable Checkbox Shortcut Entirely (Priority: P2)

**Goal**: Users can clear the shortcut field to disable checkbox conversion while keeping auto-bullet active.

**Independent Test**: Clear the shortcut field, type `- t ` → no conversion occurs. Set it back to "t" → conversion works again.

### Tests for User Story 2 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T008 [US2] Add unit tests for empty shortcut behavior in tests/unit/auto-bullet.test.ts: test that passing empty string disables checkbox conversion entirely; test that auto-bullet still works when checkbox shortcut is disabled

### Implementation for User Story 2

- [x] T009 [US2] Handle empty `checkboxShortcut` in src/extensions/auto-bullet.ts: skip checkbox pattern matching when shortcut is empty string (guard clause before regex test)
- [x] T010 [US2] Ensure settings UI allows clearing the field in src/settings.ts: empty value is accepted without validation error

**Checkpoint**: Both user stories independently functional — configure or disable shortcut

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across both stories

- [x] T011 Run full test suite (`npm test && npm run lint`) and verify all tests pass
- [x] T012 Manual smoke test in Obsidian dev vault: verify default "t", custom char, empty (disabled), and restart persistence

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 2)**: No dependencies — can start immediately
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion (T001–T003)
- **User Story 2 (Phase 4)**: Depends on Phase 2 completion (T001–T003); can run in parallel with US1
- **Polish (Phase 5)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational — no dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational — independent of US1 (operates on the same files but different code paths)

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Implementation tasks are sequential within each story
- Story complete before moving to Polish phase

### Parallel Opportunities

- T004 and T005 can run in parallel (different test files)
- US1 and US2 can be worked on in parallel after Phase 2

---

## Parallel Example: User Story 1

```bash
# Launch tests in parallel:
Task: "Unit tests for dynamic checkbox pattern in tests/unit/auto-bullet.test.ts"
Task: "Unit tests for checkboxShortcut validation in tests/unit/settings.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (T001–T003)
2. Complete Phase 3: User Story 1 (T004–T007)
3. **STOP and VALIDATE**: Test configurable shortcut independently
4. Deploy/demo if ready

### Incremental Delivery

1. Foundational → Settings interface + extension parameter ready
2. Add User Story 1 → Configurable shortcut works → MVP!
3. Add User Story 2 → Disable shortcut entirely
4. Polish → Full test suite, smoke test

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
