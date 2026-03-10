# Feature Specification: Auto Bullet Mode

**Feature Branch**: `001-auto-bullet-mode`
**Created**: 2026-03-10
**Status**: Draft
**Input**: User description: "Create an Obsidian plugin that automatically keeps using bullets and outline mode. Essentially, I should not need to do a '- ' to start bullets. They should be on by default."

## Clarifications

### Session 2026-03-10

- Q: Should the plugin support Obsidian mobile in addition to desktop? → A: Yes, support both desktop and mobile (`isDesktopOnly: false`). Status bar indicator is desktop only.
- Q: Should the plugin work in both Live Preview and Source editing modes? → A: Live Preview only. Source mode is out of scope for v1.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Auto-Bullet on Every New Line (Priority: P1)

As a user, when I open a note and start typing, every new line I create automatically begins with a bullet marker ("- "). I never have to manually type "- " to start a bullet point. When I press Enter, the next line already has a bullet prefix ready for me to type. This is the core "always-on" bullet experience.

**Why this priority**: This is the fundamental value proposition of the plugin. Without this, the plugin has no purpose. It directly eliminates the repetitive action the user wants to avoid.

**Independent Test**: Open any markdown note, place the cursor on an empty line, and start typing. The text should automatically become a bullet. Press Enter and the new line should also be a bullet.

**Acceptance Scenarios**:

1. **Given** the plugin is enabled and I open a note, **When** I place my cursor on an empty line and start typing, **Then** the line is automatically prefixed with "- " before my text.
2. **Given** I am on a bullet line, **When** I press Enter, **Then** a new bullet line ("- ") is created and my cursor is placed after the prefix.
3. **Given** I am on a bullet line, **When** I press Enter on an empty bullet (a line that is just "- "), **Then** the empty bullet is removed and I get a plain empty line (standard Obsidian behavior for ending a list).
4. **Given** the plugin is enabled, **When** I open an existing note that has plain text lines (no bullets), **Then** the existing content is NOT modified. Auto-bullet only applies to new lines I create.

---

### User Story 2 - Toggle Auto-Bullet Mode (Priority: P2)

As a user, I can toggle auto-bullet mode on and off via a command palette command. When disabled, Obsidian behaves normally. A visual indicator shows whether auto-bullet mode is active.

**Why this priority**: Users will sometimes need to write headings, code blocks, or free-form prose. A quick toggle is essential for usability, but the plugin should default to "on."

**Independent Test**: Use the command palette to toggle auto-bullet mode off, verify typing no longer auto-inserts bullets, then toggle it back on and verify it resumes.

**Acceptance Scenarios**:

1. **Given** auto-bullet mode is active, **When** I run the "Toggle Auto Bullet Mode" command, **Then** auto-bullet mode is disabled and the status indicator updates.
2. **Given** auto-bullet mode is disabled, **When** I run the toggle command, **Then** auto-bullet mode is re-enabled and the status indicator updates.
3. **Given** auto-bullet mode is disabled, **When** I type on a new line, **Then** no bullet prefix is inserted (standard Obsidian behavior).
4. **Given** auto-bullet mode is active, **When** I view the status bar (desktop), **Then** I see an indicator showing that auto-bullet mode is on.

---

### User Story 3 - Outline Indentation Support (Priority: P3)

As a user working in outline mode, I can use Tab and Shift+Tab to indent and outdent bullets, creating a nested hierarchical outline. The plugin preserves Obsidian's native indentation behavior and ensures new child bullets are automatically created at the correct indent level.

**Why this priority**: Outlining is the natural extension of auto-bullet. Once every line is a bullet, users will want to organize them hierarchically. Obsidian already supports Tab/Shift-Tab indentation for lists natively, so this builds on existing behavior.

**Independent Test**: With auto-bullet mode on, type a bullet, press Tab, then press Enter. The new line should appear at the same indented level with a bullet prefix.

**Acceptance Scenarios**:

1. **Given** I am on a bullet line, **When** I press Tab, **Then** the bullet is indented one level deeper (standard Obsidian behavior preserved).
2. **Given** I am on an indented bullet, **When** I press Enter, **Then** a new bullet is created at the same indentation level.
3. **Given** I am on an indented bullet, **When** I press Shift+Tab, **Then** the bullet is outdented one level (standard Obsidian behavior preserved).

---

### Edge Cases

- What happens when the cursor is inside a code block (fenced with triple backticks)? Auto-bullet MUST NOT activate inside code blocks.
- What happens when the cursor is inside frontmatter (YAML between `---` delimiters)? Auto-bullet MUST NOT activate inside frontmatter.
- What happens when the user types a heading (`#`)? If the user starts a line with `#`, the bullet prefix MUST be removed/not applied so headings work normally.
- What happens when the user pastes multi-line text? Pasted text MUST NOT be auto-modified with bullet prefixes. Only newly typed lines get bullets.
- What happens with numbered lists (`1.`)? If the user manually types a number prefix, auto-bullet MUST yield to the user's intent and not add a "- " prefix.
- What happens on lines that already have a bullet prefix? The plugin MUST NOT double-prefix (no "- - " lines).
- What happens in Source editing mode? Auto-bullet MUST NOT activate in Source mode; it only operates in Live Preview.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The plugin MUST automatically insert a bullet prefix ("- ") when the user begins typing on a new empty line while auto-bullet mode is enabled.
- **FR-002**: The plugin MUST create a new bullet line when the user presses Enter on an existing bullet line. If the cursor is in the middle of the line, the text after the cursor MUST be moved to the new bullet line (standard line-split behavior with bullet prefix on the new line).
- **FR-003**: The plugin MUST remove an empty bullet and exit the current bullet list when the user presses Enter on a line containing only "- " (matching standard Obsidian list behavior). After exiting, the next character typed on an empty line MUST re-enter auto-bullet mode (insert "- " prefix) — the exit is per-line, not a mode toggle.
- **FR-004**: The plugin MUST NOT modify existing note content when a note is opened. Auto-bullet applies only to new lines the user actively creates.
- **FR-005**: The plugin MUST provide a toggle command accessible via the command palette to enable/disable auto-bullet mode.
- **FR-006**: The plugin MUST persist the user's toggle preference across sessions.
- **FR-007**: The plugin MUST NOT insert bullet prefixes inside non-prose contexts. The exhaustive list of excluded contexts is: fenced code blocks (`` ``` ``), indented code blocks, YAML frontmatter (`---`), callout blocks (`> [!type]`), comments (`%% ... %%`), table rows (pipe `|` syntax), and embedded/transclusion blocks (`![[note]]`).
- **FR-008**: The plugin MUST NOT insert bullet prefixes when the user starts a line with a heading marker (`#`), numbered list marker (`1.`), blockquote (`>`), or other Markdown block-level syntax.
- **FR-009**: The plugin MUST NOT modify pasted content. Only user-typed new lines receive bullet prefixes.
- **FR-010**: The plugin MUST preserve existing indentation levels when creating new bullet lines after indented bullets.
- **FR-011**: The plugin MUST display a visual indicator (status bar on desktop) showing whether auto-bullet mode is currently active.
- **FR-012**: The plugin MUST default to auto-bullet mode being enabled on first install.
- **FR-013**: The plugin MUST work on both desktop and mobile Obsidian (`isDesktopOnly: false`). The status bar indicator is a desktop-only enhancement.
- **FR-014**: The plugin MUST operate in Live Preview editing mode only. In Source mode, the plugin MUST silently do nothing (extensions check `editorLivePreviewField` dynamically). Reading View has no editor, so the plugin has no effect. When the user switches between Live Preview and Source mode mid-session, the plugin MUST respond immediately — activating or deactivating based on the new mode.
- **FR-015**: Multi-cursor editing is a known limitation for v1. The plugin's auto-bullet behavior with multiple simultaneous cursors is undefined and not guaranteed.
- **FR-016**: IME (Input Method Editor) composition for CJK languages MUST be supported. The `inputHandler` fires after composition ends, so auto-bullet insertion occurs after the composed character is committed.

### Key Entities

- **Plugin Settings**: Stores the user's preference for whether auto-bullet mode is globally enabled or disabled. Persisted across sessions.
- **Editor Context**: The current state of the editor cursor, including line content, indentation level, and whether the cursor is inside a special block (code, frontmatter).

## Assumptions

- The bullet prefix format is `- ` (hyphen + space), matching Obsidian's default unordered list syntax.
- Auto-bullet mode is a global toggle, not per-note. This keeps the UX simple for v1.
- The plugin works with Obsidian's current editor (CodeMirror-based) in Live Preview mode. Source mode and the legacy editor are out of scope.
- Indentation uses Obsidian's configured tab size (typically Tab or spaces as per user settings).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create bulleted notes without ever manually typing "- " — 100% of new lines in auto-bullet mode start with a bullet prefix automatically.
- **SC-002**: Toggling auto-bullet mode on/off takes fewer than 2 seconds from command invocation to visual feedback (status bar update on desktop, behavior change on next keystroke).
- **SC-003**: The plugin does not alter any existing note content upon opening — zero unintended modifications to stored notes.
- **SC-004**: Special contexts (code blocks, frontmatter, headings) are correctly detected and excluded from auto-bullet behavior 100% of the time.
- **SC-005**: The plugin adds no perceptible delay to typing. Keystroke-to-character latency MUST remain under 16ms (one frame at 60fps), indistinguishable from vanilla Obsidian.
