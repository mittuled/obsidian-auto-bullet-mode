# Feature Specification: Fix Auto-Bullet Mode Issues

**Feature Branch**: `002-fix-bullet-mode-issues`
**Created**: 2026-03-10
**Status**: Draft
**Input**: User description: "1. Using slash commands at the beginning of the line is an issue right now. 2. using 't ' should replace to '[ ] ' to make checkboxes easier to create. 3. Multi-line Code blocks are still getting '- ' when I start typing."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fix Code Block Auto-Bullet Suppression (Priority: P1)

As a user, when I am typing inside a multi-line fenced code block (``` ``` ```), the plugin MUST NOT insert "- " bullet prefixes. Currently, starting to type on an empty line inside a code block incorrectly inserts a bullet, breaking code formatting.

**Why this priority**: This is a bug that corrupts content. Code blocks are a core Markdown feature, and inserting bullets inside them makes the plugin unusable for anyone who uses code blocks regularly.

**Independent Test**: Create a fenced code block, place cursor on an empty line inside it, and type — no "- " should appear.

**Acceptance Scenarios**:

1. **Given** the cursor is on an empty line inside a fenced code block (``` ``` ```), **When** I type any character, **Then** no "- " prefix is inserted and the character appears as typed.
2. **Given** the cursor is on an empty line inside an indented code block, **When** I type any character, **Then** no "- " prefix is inserted.
3. **Given** the cursor is inside a code block and I press Enter, **When** I start typing on the new line, **Then** no "- " prefix is inserted.

---

### User Story 2 - Allow Slash Commands on Empty Lines (Priority: P2)

As a user, when I type "/" at the beginning of an empty line to invoke Obsidian's slash command menu, the plugin MUST NOT intercept the "/" character and insert a "- /" prefix. The slash command menu should appear normally.

**Why this priority**: Slash commands are a core Obsidian interaction pattern. Blocking them makes the plugin conflict with essential Obsidian functionality, forcing users to toggle the plugin off just to use slash commands.

**Independent Test**: On an empty line, type "/" — the Obsidian slash command menu should appear without a bullet prefix being added.

**Acceptance Scenarios**:

1. **Given** the cursor is on an empty line with auto-bullet enabled, **When** I type "/", **Then** the "/" character is inserted without a "- " prefix, allowing Obsidian's slash command menu to appear.
2. **Given** I have typed "/" and the slash command menu is visible, **When** I select a command, **Then** it executes normally without bullet interference.
3. **Given** I type "/" on a line that already has a bullet prefix ("- "), **When** the "/" is typed, **Then** it is inserted normally after the bullet prefix (no special handling needed — this is mid-line typing).

---

### User Story 3 - Checkbox Shortcut via "t " (Priority: P3)

As a user, when I type "t " (the letter t followed by a space) at the beginning of a bullet line, the "- t " should be replaced with "- [ ] " to quickly create a checkbox/task item. This provides a fast shortcut for creating task lists without leaving the keyboard flow.

**Why this priority**: This is a convenience feature that enhances productivity for task-heavy workflows. It's additive and doesn't fix broken behavior, so it's lower priority than the bugs.

**Independent Test**: On an empty line, type "t" (auto-bullet creates "- t"), then type space — the line should become "- [ ] " with cursor after the space.

**Acceptance Scenarios**:

1. **Given** auto-bullet mode is enabled and I start typing on an empty line, **When** I type "t" followed by a space, **Then** the line content changes from "- t " to "- [ ] " with the cursor positioned after "- [ ] ".
2. **Given** I am on an existing bullet line with text (e.g., "- test"), **When** I type normally, **Then** no checkbox replacement occurs (the shortcut only applies when "t" is the first and only character after the bullet prefix).
3. **Given** I type "t" followed by any character other than space (e.g., "te", "th"), **Then** no checkbox replacement occurs and the text continues normally as "- te", "- th".
4. **Given** I am on an indented bullet line, **When** I type "t" followed by space, **Then** the line becomes indented checkbox: e.g., "\t- [ ] ".

---

### Edge Cases

- What happens when the user types "/" inside an existing bullet line (not at the beginning)? The "/" should be inserted normally — no special handling.
- What happens when the syntax tree hasn't fully parsed the code block yet (e.g., the user just typed the opening ``` ``` ``` but not the closing one)? The plugin should still detect the code context and suppress bullets.
- What happens when the user types "T " (uppercase T)? No checkbox replacement — the shortcut is case-sensitive to lowercase "t " only.
- What happens when the user undoes after "t " triggers the checkbox shortcut? Undo should revert to "- t " state.
- What happens when the user types "t " inside a code block? No checkbox replacement (code block suppression takes priority).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The plugin MUST NOT insert bullet prefixes on empty lines inside fenced code blocks, even when the syntax tree is still being parsed (e.g., code block not yet closed).
- **FR-002**: The plugin MUST NOT insert bullet prefixes on empty lines inside indented code blocks.
- **FR-003**: The plugin MUST NOT insert a "- " prefix when the user types "/" on an empty line, allowing Obsidian's slash command menu to function normally.
- **FR-004**: The plugin MUST replace "- t " with "- [ ] " when the user types "t" followed by a space as the first characters on a new auto-bulleted line (checkbox shortcut).
- **FR-005**: The checkbox shortcut MUST preserve the current indentation level (e.g., "\t- t " becomes "\t- [ ] ").
- **FR-006**: The checkbox shortcut MUST only trigger when "t" is the sole character after the bullet prefix — typing "t" mid-word or after other characters MUST NOT trigger replacement.
- **FR-007**: The checkbox shortcut MUST be case-sensitive — only lowercase "t " triggers the replacement, not "T ".
- **FR-008**: All existing auto-bullet behaviors from the 001-auto-bullet-mode feature MUST continue to work unchanged (Enter continuation, double-Enter exit, heading/blockquote exclusion, paste protection, Live Preview guard).

## Assumptions

- The "/" character is the standard trigger for Obsidian's slash command menu. No other characters need similar exclusion treatment.
- The checkbox shortcut "t " is a reasonable and intuitive mnemonic ("t" for "task").
- The code block detection issue is likely a timing/parsing issue where the syntax tree node names are not yet resolved when the user types inside a newly created code block.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can type inside code blocks without any bullet prefix interference — 0% of keystrokes inside code blocks trigger auto-bullet insertion.
- **SC-002**: Users can invoke Obsidian's slash command menu on any empty line without first having to disable auto-bullet mode.
- **SC-003**: Users can create a checkbox item by typing "t " in under 1 second, compared to manually typing "- [ ] " (5 characters vs 2 keystrokes).
- **SC-004**: All existing auto-bullet tests (37 tests from 001-auto-bullet-mode) continue to pass without modification.
