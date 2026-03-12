# Tasks: Fix Plugin Review Bot Issues

**Input**: Design documents from `/specs/004-fix-review-bot-issues/`

## Phase 1: Fix Type Safety Issues

- [x] T001 [P] Replace `any` type for `view` parameter in src/extensions/auto-bullet.ts:25 with `EditorView`
- [x] T002 [P] Replace `any` type for `view` parameter in src/extensions/bullet-enter.ts:16 with `EditorView`
- [x] T003 [P] Replace `any` type for `app` parameter in src/settings.ts:27 with `App`

## Phase 2: Fix Promise Handling

- [x] T004 Add `void` operator to `saveSettings()` calls in non-async callbacks in src/main.ts (lines 23 and 36)

## Phase 3: Fix Command ID and Name

- [x] T005 Change command ID from "toggle-auto-bullet-mode" to "toggle" in src/main.ts
- [x] T006 Change command name from "Toggle Auto Bullet Mode" to "Toggle mode" in src/main.ts

## Phase 4: Fix UI Text and Patterns

- [x] T007 Use sentence case for setting names and descriptions in src/settings.ts
- [x] T008 Replace `createEl("h2")` with `new Setting(containerEl).setName(...).setHeading()` in src/settings.ts

## Phase 5: Polish

- [x] T009 Run full test suite and verify all tests pass
- [x] T010 Build and deploy to dev vault for smoke test
