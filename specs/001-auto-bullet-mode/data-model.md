# Data Model: Auto Bullet Mode

**Date**: 2026-03-10
**Feature**: 001-auto-bullet-mode

## Entities

### AutoBulletSettings

The plugin's persisted configuration. Stored via Obsidian's
`loadData()` / `saveData()` mechanism.

| Field             | Type    | Default | Description                                |
|-------------------|---------|---------|--------------------------------------------|
| autoBulletEnabled | boolean | true    | Whether auto-bullet mode is globally active |

**Lifecycle**: Created on first plugin load with defaults.
Updated when user toggles via command or settings tab.
Persisted across sessions automatically by Obsidian.

**Default merging**: `Object.assign({}, DEFAULT_SETTINGS, await this.loadData())`

### EditorContext (Runtime, Not Persisted)

Derived state computed on each editor interaction. Not stored.

| Property          | Type    | Description                                         |
|-------------------|---------|-----------------------------------------------------|
| isLivePreview     | boolean | Whether editor is in Live Preview mode               |
| isInCodeBlock     | boolean | Cursor is inside FencedCode or CodeBlock             |
| isInFrontmatter   | boolean | Cursor is inside YAMLFrontMatter                     |
| currentLineText   | string  | Text content of the current line                     |
| currentLineIndent | string  | Leading whitespace of the current line               |
| cursorPosition    | number  | Absolute position of cursor in document              |
| isEmptyLine       | boolean | Current line has no content (empty string)           |
| isEmptyBullet     | boolean | Current line is exactly `- ` (with optional indent)  |
| hasBulletPrefix   | boolean | Current line starts with `- ` (with optional indent) |

**Derived from**: CM6 `EditorState`, `syntaxTree()`, `editorLivePreviewField`

## State Transitions

### Auto-Bullet Mode Toggle

```
ENABLED (default) ←→ DISABLED
```

- Toggle via command palette or status bar click (desktop)
- Persisted immediately on change
- Status bar indicator updates synchronously

### Line State Machine (per keystroke)

```
EMPTY_LINE
  → user types character → INSERT "- " prefix, then character (→ BULLET_LINE)
  → user types "#"       → NO prefix, allow heading (→ HEADING_LINE)
  → user types ">"       → NO prefix, allow blockquote (→ BLOCKQUOTE_LINE)
  → user types "1"       → NO prefix if followed by ". " (→ ORDERED_LIST_LINE)

BULLET_LINE ("- text...")
  → user presses Enter   → NEW BULLET_LINE at same indent
  → user presses Tab     → INDENT bullet (Obsidian native)
  → user presses Shift+Tab → OUTDENT bullet (Obsidian native)

EMPTY_BULLET ("- " only)
  → user presses Enter   → REMOVE bullet, create EMPTY_LINE (exit list)
```

## Relationships

- `AutoBulletSettings` → read by all editor extensions to determine if auto-bullet is active
- `EditorContext` → computed fresh on each relevant editor event; not shared between editors
- Multiple editor panes each have their own independent `EditorContext`
