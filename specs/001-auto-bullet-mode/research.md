# Research: Auto Bullet Mode

**Date**: 2026-03-10
**Feature**: 001-auto-bullet-mode

## Decision 1: Editor Extension Mechanism

**Decision**: Use `Plugin.registerEditorExtension()` with a CM6 `keymap` extension at `Prec.high` priority to intercept the Enter key.

**Rationale**: `registerEditorExtension()` is the canonical Obsidian API for injecting CM6 extensions. It handles injection into all open editors and automatic cleanup on plugin unload. Using `Prec.high` ensures our Enter handler fires before Obsidian's default list continuation behavior.

**Alternatives considered**:
- `EditorView.inputHandler`: Fires on all DOM text changes including IME. More complex to manage, and the keymap approach is cleaner for a single key (Enter).
- `transactionFilter`: Too broad — intercepts all transactions, requiring paste/undo discrimination. Keymap is inherently safe from paste events.

## Decision 2: Auto-Insert on Empty Lines

**Decision**: Use a CM6 `EditorView.updateListener` or `ViewPlugin` to detect when the user starts typing on an empty line and insert the `- ` prefix. Combined with the Enter keymap for bullet continuation.

**Rationale**: The Enter keymap handles continuation from existing bullet lines. For the "start typing on an empty line" case (FR-001), we need to detect character input on empty lines and prepend `- `. An `inputHandler` extension is ideal here since it fires on typed characters and we can check if the line was previously empty.

**Alternatives considered**:
- `transactionFilter`: Would work but fires on all transactions (including programmatic ones, undo/redo). `inputHandler` is specifically for user-initiated text input.

## Decision 3: Context Detection (Code Blocks, Frontmatter)

**Decision**: Use `syntaxTree(state).resolveInner(pos, -1)` and walk up the parent chain, checking for `FencedCode`, `CodeBlock`, and `YAMLFrontMatter` node names.

**Rationale**: This is the standard CM6 approach. Obsidian's Lezer markdown grammar includes `FencedCode` and `CodeBlock` from `@lezer/markdown`, and `YAMLFrontMatter` from `lezer-markdown-obsidian`. Walking the parent chain is efficient and reliable.

**Alternatives considered**:
- `tokenClassNodeProp` with HyperMD token names (`HyperMD-codeblock`): Works but less clean — token class strings are Obsidian-internal and could change.
- `getFrontMatterInfo()`: Obsidian public API, but requires full document string conversion; syntax tree approach is more efficient.

## Decision 4: Live Preview Mode Guard

**Decision**: Use `editorLivePreviewField` StateField exported from `'obsidian'` to check if the editor is in Live Preview mode. Bail out of all auto-bullet logic when `false`.

**Rationale**: This is the exact field used by major plugins (dataview, latex-suite). It returns `true` for Live Preview and `false` for Source mode. It's accessible directly from `EditorState` inside CM6 extensions.

**Alternatives considered**:
- `MarkdownView.getMode()`: Returns `"source"` for both Source and Live Preview modes — cannot distinguish them.

## Decision 5: Paste Protection

**Decision**: Use `keymap.of` for Enter key handling (inherently keyboard-only) and `inputHandler` for empty-line auto-bullet (check `text.length === 1` to exclude paste).

**Rationale**: Keymap extensions only fire on physical key events, so paste is inherently excluded. For `inputHandler`, a single typed character always has `text.length === 1`, while pasted content has `text.length > 1`. This provides clean discrimination without needing `isUserEvent()` checks.

**Alternatives considered**:
- `isUserEvent('input.paste')`: Would work in a `transactionFilter` but is unnecessary given the simpler checks available in our chosen mechanisms.

## Decision 6: Block-Level Syntax Detection

**Decision**: After auto-inserting `- ` on an empty line, use a post-input check: if the line now starts with `# `, `> `, `1. `, or another block-level marker (user typed these characters after the bullet was inserted), remove the `- ` prefix.

**Rationale**: The user may type `#` intending a heading. Since we insert `- ` first, we need to detect when the user's intent conflicts and undo the bullet. Checking the resulting line content after each character is simple and handles all block-level syntax cases.

**Alternatives considered**:
- Delaying bullet insertion until after the first character: Would break the "always-on" feel — the user would see a plain line momentarily before the bullet appears.

## Decision 7: Settings Persistence

**Decision**: Use `loadData()` / `saveData()` with `Object.assign()` for defaults, per constitution Principle III.

**Rationale**: Standard Obsidian pattern. Single setting: `{ autoBulletEnabled: boolean }` defaulting to `true`.

## Decision 8: Status Bar Indicator

**Decision**: Use `addStatusBarItem()` to display a clickable indicator showing auto-bullet mode state. Guard with platform check (status bar is desktop-only).

**Rationale**: Simple, standard API. Clickable status bar item doubles as a toggle control on desktop. On mobile, users toggle via command palette only.

## Key API Patterns Reference

### Obsidian Exports Used
- `Plugin` (base class)
- `editorLivePreviewField` (StateField)
- `PluginSettingTab`, `Setting` (for settings UI)
- `addCommand()`, `addStatusBarItem()`

### CM6 Imports Used
- `@codemirror/state`: `Prec`, `EditorState`, `EditorSelection`
- `@codemirror/view`: `keymap`, `EditorView`
- `@codemirror/language`: `syntaxTree`

### Syntax Tree Node Names
- `FencedCode` — fenced code blocks
- `CodeBlock` — indented code blocks
- `YAMLFrontMatter` — frontmatter
- `BulletList` / `ListItem` — existing list structure
- `ATXHeading1`–`ATXHeading6` — headings
