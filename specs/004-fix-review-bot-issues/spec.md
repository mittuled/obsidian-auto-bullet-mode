# Feature Specification: Fix Plugin Review Bot Issues

**Feature Branch**: `004-fix-review-bot-issues`
**Created**: 2026-03-12
**Status**: Draft
**Input**: User description: "Fix Obsidian community plugin review bot issues: replace any types with proper types, add void operator for unhandled promises, fix command ID and name to not include plugin name, use sentence case for UI text, and use setHeading instead of createEl h2."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Pass Automated Plugin Review (Priority: P1)

A plugin developer submits their Obsidian plugin for community review. The automated review bot scans the source code and flags issues that must be resolved before the plugin can be approved. The developer fixes all flagged issues so the bot reports zero required errors on the next scan.

**Why this priority**: This is the only story — the plugin cannot be published to the community plugin directory until all required review bot issues are resolved.

**Independent Test**: Can be fully tested by verifying the bot reports no required errors after pushing the fixes to the plugin repository.

**Acceptance Scenarios**:

1. **Given** the plugin source code has untyped parameters, **When** the review bot scans the code, **Then** no "Unexpected any" errors are reported.
2. **Given** the plugin has fire-and-forget promise calls, **When** the review bot scans the code, **Then** no "Promises must be awaited" errors are reported.
3. **Given** the plugin registers a command, **When** the review bot checks the command ID, **Then** no "command ID should not include the plugin ID" error is reported.
4. **Given** the plugin registers a command, **When** the review bot checks the command name, **Then** no "command name should not include the plugin name" error is reported.
5. **Given** the plugin settings tab displays text, **When** the review bot checks UI text, **Then** no "Use sentence case" errors are reported.
6. **Given** the plugin settings tab has a heading, **When** the review bot checks the heading implementation, **Then** no "Use setHeading instead of createEl" errors are reported.

---

### Edge Cases

- What happens if fixing the command ID breaks saved user hotkeys? Obsidian maps hotkeys by command ID, so existing users who had hotkeys assigned to the old ID will need to reassign them. This is acceptable since the plugin has not been published yet.
- What happens if sentence case changes alter the meaning of UI labels? Labels must remain clear and descriptive while following sentence case conventions.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: All function parameters MUST use specific types instead of `any`.
- **FR-002**: All promise-returning calls in non-async contexts MUST be explicitly handled using the `void` operator.
- **FR-003**: The command ID MUST NOT contain the plugin ID or plugin name.
- **FR-004**: The command name MUST NOT contain the plugin name, since the plugin name is already shown alongside the command name in the UI.
- **FR-005**: All user-facing UI text (setting names, descriptions, headings) MUST use sentence case.
- **FR-006**: Settings tab headings MUST use the `Setting.setHeading()` pattern instead of direct DOM element creation.
- **FR-007**: All existing plugin functionality MUST continue to work identically after these changes — no behavioral regressions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The automated review bot reports zero required errors on the next scan of the plugin repository.
- **SC-002**: All existing tests continue to pass with no modifications needed (or minimal test updates to match renamed identifiers).
- **SC-003**: The plugin builds successfully and functions identically in Obsidian after all fixes.

## Assumptions

- The plugin has not been published yet, so breaking changes to command IDs do not affect existing users.
- The review bot's rules align with the Obsidian community plugin guidelines and the official ESLint plugin.
- Sentence case means capitalizing only the first word and proper nouns (e.g., "Enable auto bullet mode" not "Enable Auto Bullet Mode").
