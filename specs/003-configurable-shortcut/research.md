# Research: Configurable Checkbox Shortcut

## How to Pass Settings to CM6 Extensions

**Decision**: Pass the shortcut character as a parameter to `createAutoBulletInputHandler()` and rebuild extensions when the setting changes.

**Rationale**: The plugin already has a pattern for rebuilding extensions (via `enableExtensions()`/`disableExtensions()` + `app.workspace.updateOptions()`). The simplest approach is to pass the shortcut character to the factory function so the regex is constructed at creation time. When the setting changes, extensions are torn down and recreated with the new value.

**Alternatives considered**:
- CM6 `Compartment` for dynamic reconfiguration without rebuilding — adds complexity for no real benefit since the setting changes rarely.
- Global/singleton state accessed by the extension at runtime — harder to test, couples extension to plugin state.

## Validation of Shortcut Character

**Decision**: Validate in the settings UI. Accept single alphanumeric characters only. Reject "/", "#", ">", "`" and whitespace. Allow empty string to disable.

**Rationale**: These characters conflict with existing auto-bullet behavior (slash commands, headings, blockquotes, code blocks). Alphanumeric characters are safe since none trigger special behavior in the input handler.

**Alternatives considered**:
- Allow any character and handle conflicts at runtime — fragile and confusing for users.
- Dropdown of pre-approved characters — too restrictive; a text field with validation is more flexible.

## Dynamic Regex Construction

**Decision**: Construct the checkbox pattern regex from the setting value using `new RegExp()` with the character escaped via a helper function.

**Rationale**: The current `CHECKBOX_PATTERN_RE = /^(\s*)-\st\s*$/` hardcodes "t". Replacing it with `new RegExp('^(\\s*)-\\s' + escapeRegex(char) + '\\s*$')` makes it dynamic. The regex is built once per extension creation (not per keystroke), so performance is identical.

**Alternatives considered**:
- String comparison instead of regex — would work but loses the existing pattern structure and indent capture group.
