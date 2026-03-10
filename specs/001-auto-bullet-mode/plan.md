# Implementation Plan: Auto Bullet Mode

**Branch**: `001-auto-bullet-mode` | **Date**: 2026-03-10 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-auto-bullet-mode/spec.md`

## Summary

An Obsidian plugin that automatically inserts bullet prefixes (`- `) on new lines, creating an "always-on" outliner experience in Live Preview mode. Uses CM6 editor extensions: a `keymap` for Enter key bullet continuation and an `inputHandler` for empty-line auto-bullet insertion. Toggle via command palette with status bar indicator on desktop.

## Technical Context

**Language/Version**: TypeScript (strict mode)
**Primary Dependencies**: `obsidian` (type definitions), `@codemirror/state`, `@codemirror/view`, `@codemirror/language`
**Storage**: Obsidian `loadData()` / `saveData()` for settings
**Testing**: Jest with mock CM6 EditorState for unit tests
**Target Platform**: Obsidian desktop + mobile (`isDesktopOnly: false`)
**Project Type**: Obsidian community plugin
**Performance Goals**: Zero perceptible typing latency
**Constraints**: Live Preview mode only; Source mode out of scope
**Scale/Scope**: Single-user local plugin, minimal settings

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Plugin API Compliance | PASS | Extends `Plugin`, uses `registerEditorExtension()`, `addCommand()`, `addStatusBarItem()`. Manifest follows `PluginManifest` interface. |
| II. Lifecycle & Resource Management | PASS | All extensions registered via `registerEditorExtension()` (auto-cleanup). Status bar via `addStatusBarItem()`. Commands via `addCommand()`. |
| III. User Data Safety | PASS | Plugin never modifies vault files. Only modifies editor buffer via CM6 transactions. Settings via `loadData()`/`saveData()` with `Object.assign()` defaults. |
| IV. TypeScript-First | PASS | All source in TypeScript strict mode. Explicit types for all interfaces. No `any` usage. |
| V. Cross-Platform Compatibility | PASS | `isDesktopOnly: false`. Status bar guarded (desktop only). No Node.js/Electron APIs used. CSS uses logical properties. |
| VI. Test-First Development | PASS | Unit tests for all modules (context, settings, auto-bullet, bullet-enter, toggle, status-bar, indentation). Tests written before implementation in all phases. |
| VII. Simplicity & YAGNI | PASS | No React/Svelte. No custom UI beyond status bar. Single boolean setting. Minimal dependencies. |

## Project Structure

### Documentation (this feature)

```text
specs/001-auto-bullet-mode/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── main.ts              # Plugin class: onload/onunload, extension registration
├── settings.ts          # AutoBulletSettings interface, defaults, PluginSettingTab
├── extensions/
│   ├── auto-bullet.ts   # CM6 inputHandler: auto-insert "- " on empty lines
│   ├── bullet-enter.ts  # CM6 keymap: Enter key bullet continuation
│   └── context.ts       # Helpers: isInCodeBlock(), isInFrontmatter(), isLivePreview()
└── status-bar.ts        # Status bar indicator management

tests/
└── unit/
    ├── context.test.ts      # Context detection tests
    ├── settings.test.ts     # Settings defaults and merging tests
    ├── auto-bullet.test.ts  # Auto-bullet inputHandler tests + FR-004 no-modify-on-open
    ├── bullet-enter.test.ts # Bullet Enter keymap tests
    ├── toggle.test.ts       # Toggle behavior tests
    ├── status-bar.test.ts   # Status bar indicator tests
    └── indent-enter.test.ts # Indentation-aware Enter tests

manifest.json            # Plugin metadata
package.json             # Dependencies and scripts
tsconfig.json            # TypeScript compiler options
esbuild.config.mjs       # Build configuration
styles.css               # Minimal styles (status bar indicator)
```

**Structure Decision**: Single project structure. The plugin is a self-contained Obsidian plugin with no backend, no separate frontend, and no external API. Source code in `src/`, tests in `tests/`.

## Complexity Tracking

> No constitution violations. No complexity justifications needed.
