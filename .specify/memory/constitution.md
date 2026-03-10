<!--
Sync Impact Report
==================
Version change: N/A → 1.0.0 (initial creation)
Modified principles: N/A (first version)
Added sections:
  - Core Principles (7 principles)
  - Technology Stack & Constraints
  - Development Workflow
  - Governance
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ compatible (no changes needed)
  - .specify/templates/spec-template.md ✅ compatible (no changes needed)
  - .specify/templates/tasks-template.md ✅ compatible (no changes needed)
  - .specify/templates/constitution-template.md ✅ source template
Follow-up TODOs: None
-->

# Obsidian Plugin Constitution

## Core Principles

### I. Plugin API Compliance

All features MUST use the official Obsidian Plugin API surface.
The plugin class MUST extend `Plugin` and implement `onload()`
and `onunload()` lifecycle methods. All external dependencies
MUST be bundled into the compiled `main.js` output. The
`manifest.json` MUST conform to the `PluginManifest` interface
with valid semver versioning. The plugin `id` field MUST NOT
contain the substring "obsidian". The folder name MUST match
the `id` field.

### II. Lifecycle & Resource Management

Every event listener MUST be registered via `registerEvent()`
to ensure automatic cleanup on plugin unload. Every interval
MUST be registered via `registerInterval()`. Ribbon icons,
commands, status bar items, setting tabs, and views MUST be
registered through the Plugin API's built-in methods (e.g.,
`addRibbonIcon()`, `addCommand()`, `addSettingTab()`). Manual
DOM manipulation MUST be cleaned up in `onunload()` if not
registered through the API. Memory leaks from unregistered
listeners are not acceptable.

### III. User Data Safety

The user's vault data MUST never be corrupted or lost. File
modifications MUST use `vault.process()` for atomic
read-modify-write operations to prevent conflicts from
concurrent changes. The plugin MUST NOT write to files outside
its designated data directory unless the user explicitly
initiates the action. Settings MUST be persisted via
`loadData()` and `saveData()` with sensible defaults merged
using `Object.assign()`. Development and testing MUST occur in
a dedicated vault, never a personal vault.

### IV. TypeScript-First

All source code MUST be written in TypeScript. The project
MUST depend on the latest `obsidian` type definitions
(`obsidian.d.ts`). Abstract file types MUST be checked with
`instanceof TFile` or `instanceof TFolder` before use. The
`any` type SHOULD be avoided; explicit types MUST be used for
all public interfaces, function parameters, and return values.

### V. Cross-Platform Compatibility

The plugin MUST declare `isDesktopOnly` accurately in
`manifest.json`. If `isDesktopOnly` is `false`, the plugin
MUST NOT use Node.js or Electron APIs without a runtime check
and graceful fallback. CSS MUST use logical properties (e.g.,
`margin-inline-start` instead of `margin-left`) to support RTL
languages. Status bar usage MUST account for mobile (not
available). Features MUST be tested on both desktop and mobile
when `isDesktopOnly` is `false`.

### VI. Test-First Development

Tests MUST be written before implementation code (Red-Green-
Refactor). Unit tests MUST cover all service logic and utility
functions. Integration tests SHOULD cover command execution
flows and settings persistence. Test files MUST live alongside
or mirror the source structure. All tests MUST pass before any
code is merged.

### VII. Simplicity & YAGNI

Start with the minimal viable implementation. Do not add
features, abstractions, or configuration beyond what is
currently required. Prefer Obsidian's built-in UI components
(Modals, Setting, ItemView) over custom implementations.
Framework integrations (React, Svelte) MUST be justified by
genuine complexity that Obsidian's native API cannot handle
simply. Every added dependency MUST be justified.

## Technology Stack & Constraints

- **Language**: TypeScript (strict mode)
- **Build Tool**: esbuild via `esbuild.config.mjs`
- **Package Manager**: npm
- **Primary Dependency**: `obsidian` (type definitions only,
  imported via `require('obsidian')` at runtime)
- **Output**: Single bundled `main.js` file
- **Required Files**: `manifest.json`, `main.js`, optional
  `styles.css`
- **Versioning**: Semantic Versioning (MAJOR.MINOR.PATCH) for
  both the plugin (`manifest.json`) and this constitution
- **Icons**: Lucide icon set (24x24 canvas, 2px stroke, rounded
  joins/caps) or custom SVG registered via `addIcon()`
- **CSS**: Obsidian CSS custom properties preferred; logical
  properties for layout; no `!important` unless overriding
  Obsidian defaults with justification

## Development Workflow

1. **Development Vault**: A dedicated Obsidian vault MUST be
   used for all development and testing. Never develop against
   a personal vault.
2. **Build Cycle**: Run `npm run dev` for continuous compilation
   during development. Place the plugin output in
   `.obsidian/plugins/<plugin-id>/` of the dev vault.
3. **Reload**: After code changes, disable and re-enable the
   plugin in Settings > Community Plugins, or use the Hot-Reload
   community plugin. Manifest changes require a full Obsidian
   restart.
4. **Branch Strategy**: Feature branches off `main`. Each
   feature branch MUST pass all tests before merge.
5. **Commit Discipline**: Commit after each logical unit of work.
   Commit messages MUST follow conventional commits format
   (e.g., `feat:`, `fix:`, `refactor:`, `docs:`).
6. **Release**: Bump version in both `manifest.json` and
   `package.json`. Tag the release commit. Ensure
   `minAppVersion` reflects the minimum Obsidian version
   actually required.

## Governance

This constitution supersedes all other development practices
for this project. Amendments require:

1. A documented rationale for the change.
2. Version bump following semantic versioning:
   - MAJOR: Principle removal or backward-incompatible
     redefinition.
   - MINOR: New principle added or existing principle
     materially expanded.
   - PATCH: Clarification, wording, or non-semantic
     refinement.
3. Update to the Sync Impact Report at the top of this file.
4. Propagation check across all `.specify/templates/` files.

All code reviews and PRs MUST verify compliance with these
principles. Deviations MUST be justified in writing and
approved before merge.

**Version**: 1.0.0 | **Ratified**: 2026-03-10 | **Last Amended**: 2026-03-10
