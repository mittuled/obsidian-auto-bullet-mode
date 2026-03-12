# Implementation Plan: Configurable Checkbox Shortcut

**Branch**: `003-configurable-shortcut` | **Date**: 2026-03-11 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-configurable-shortcut/spec.md`

## Summary

Make the hardcoded checkbox shortcut character ("t") configurable via the plugin settings tab. Users can set any single alphanumeric character or clear the field to disable the shortcut entirely. The `createAutoBulletInputHandler` extension currently uses a hardcoded regex (`CHECKBOX_PATTERN_RE`) and literal "t" matching; this will be replaced with a dynamic pattern constructed from the stored setting value. The setting is passed to the extension factory at creation time, and extensions are rebuilt when the setting changes.

## Technical Context

**Language/Version**: TypeScript (strict mode)
**Primary Dependencies**: `obsidian` (type definitions), `@codemirror/state`, `@codemirror/view`, `@codemirror/language`
**Storage**: Obsidian `loadData()`/`saveData()` (JSON file in plugin data directory)
**Testing**: Jest with manual mocks for `obsidian`, `@codemirror/*`
**Target Platform**: Obsidian desktop + mobile (cross-platform)
**Project Type**: Obsidian community plugin
**Performance Goals**: N/A — negligible overhead (single character comparison)
**Constraints**: Must not break existing auto-bullet behavior; extensions are rebuilt on setting change
**Scale/Scope**: Single setting field, ~3 files modified, ~1 new test file section

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
| --------- | ------ | ----- |
| I. Plugin API Compliance | PASS | Uses `addSettingTab()`, `saveData()`/`loadData()`, standard `Setting` component |
| II. Lifecycle & Resource Management | PASS | Extensions rebuilt via existing `enableExtensions()`/`disableExtensions()` pattern; no new listeners |
| III. User Data Safety | PASS | Settings persisted via `saveData()` with `Object.assign()` defaults; no vault file access |
| IV. TypeScript-First | PASS | All code in TypeScript with explicit types |
| V. Cross-Platform Compatibility | PASS | Settings tab works on both desktop and mobile; no platform-specific code |
| VI. Test-First Development | PASS | Tests for validation logic and dynamic pattern behavior will be written first |
| VII. Simplicity & YAGNI | PASS | Minimal change: one new setting field, one factory parameter, regex constructed from setting |

## Project Structure

### Documentation (this feature)

```text
specs/003-configurable-shortcut/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── main.ts              # MODIFY: pass checkboxShortcut setting to extension factory; rebuild on change
├── settings.ts          # MODIFY: add checkboxShortcut field + validation + UI control
└── extensions/
    └── auto-bullet.ts   # MODIFY: accept shortcut char parameter; build regex dynamically

tests/
└── unit/
    ├── auto-bullet.test.ts  # MODIFY: add tests for configurable shortcut character
    └── settings.test.ts     # MODIFY: add tests for validation and default value
```

**Structure Decision**: Existing single-project structure. No new files needed — all changes are modifications to existing files.
