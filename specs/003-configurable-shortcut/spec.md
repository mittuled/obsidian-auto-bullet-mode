# Feature Specification: Configurable Checkbox Shortcut

**Feature Branch**: `003-configurable-shortcut`
**Created**: 2026-03-11
**Status**: Draft
**Input**: User description: "Move the shortcut 't ' to settings so that users can change it if they want."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Configure Checkbox Shortcut Character (Priority: P1)

A user wants to change the checkbox shortcut trigger from the default "t" to a different single character (e.g., "x" or "c") that feels more intuitive to their workflow. They open the plugin settings, find the checkbox shortcut option, change it to their preferred character, and immediately use the new shortcut while typing in Live Preview.

**Why this priority**: This is the core feature request — making the hardcoded shortcut configurable so users have control over their workflow.

**Independent Test**: Can be fully tested by changing the shortcut character in settings and then typing `- [new character] [space]` on a bullet line to verify it converts to `- [ ] `.

**Acceptance Scenarios**:

1. **Given** the plugin is installed with default settings, **When** a user opens the plugin settings, **Then** they see a text field showing the current checkbox shortcut character (default: "t").
2. **Given** a user changes the shortcut character to "x" in settings, **When** they type `- x ` (dash, space, x, space) on a line, **Then** the line converts to `- [ ] `.
3. **Given** a user changes the shortcut character to "x" in settings, **When** they type `- t ` (the old default), **Then** no checkbox conversion occurs; normal text is entered.

---

### User Story 2 - Disable Checkbox Shortcut Entirely (Priority: P2)

A user finds the checkbox shortcut interferes with their typing (e.g., they frequently type words starting with "t" after bullets). They want to disable the checkbox shortcut entirely while keeping the auto-bullet feature active.

**Why this priority**: Provides an escape hatch for users who experience friction from the shortcut, increasing overall plugin adoption.

**Independent Test**: Can be fully tested by clearing the shortcut field in settings and verifying that typing `- t ` no longer triggers checkbox conversion.

**Acceptance Scenarios**:

1. **Given** the user clears the shortcut character field (sets it to empty), **When** they type `- t ` on a bullet line, **Then** no checkbox conversion occurs; the text remains as typed.
2. **Given** the shortcut is disabled, **When** the user later sets a character in the field, **Then** the shortcut starts working again immediately.

---

### Edge Cases

- What happens when a user enters more than one character in the shortcut field? Only the first character is used, and the field is trimmed to show the single character.
- What happens when a user enters a space or special character (e.g., "/", "#", ">")? Characters that conflict with existing plugin behavior (slash commands, block syntax) are rejected with a validation message.
- What happens when a user enters a number? Numbers are allowed since they don't conflict with existing behavior.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The plugin settings MUST include a configurable text field for the checkbox shortcut character, with a default value of "t".
- **FR-002**: The plugin MUST use the configured shortcut character (instead of the hardcoded "t") when detecting checkbox shortcut input.
- **FR-003**: The setting MUST accept a single alphanumeric character as a valid shortcut trigger.
- **FR-004**: The setting MUST allow an empty value to disable the checkbox shortcut entirely.
- **FR-005**: The setting MUST reject characters that conflict with existing plugin behavior: "/", "#", ">", and "`".
- **FR-006**: Changes to the shortcut character MUST take effect immediately without requiring a plugin reload.
- **FR-007**: The configured shortcut character MUST persist across Obsidian restarts.

### Key Entities

- **Shortcut Character**: A single character that triggers the checkbox conversion when typed after a bullet prefix followed by a space. Stored as part of the plugin settings.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can change the checkbox shortcut character and see it take effect within the same editing session, with zero restarts required.
- **SC-002**: The default experience remains identical for users who do not modify the setting (shortcut "t" works as before).
- **SC-003**: Users who disable the shortcut experience no unintended checkbox conversions.

## Assumptions

- The shortcut is always a single character; multi-character shortcuts are out of scope.
- The regex pattern for checkbox detection will be dynamically constructed from the setting value rather than hardcoded.
- Case sensitivity is preserved: if the user sets "T" (uppercase), only uppercase "T" triggers the shortcut.
