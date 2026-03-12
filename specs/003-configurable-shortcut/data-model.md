# Data Model: Configurable Checkbox Shortcut

## Entities

### AutoBulletSettings (modified)

Extends the existing settings interface with a new field.

| Field | Type | Default | Validation | Description |
| ----- | ---- | ------- | ---------- | ----------- |
| autoBulletEnabled | boolean | true | N/A | Existing field — whether auto-bullet mode is active |
| checkboxShortcut | string | "t" | Single alphanumeric char or empty string; rejects "/", "#", ">", "`", whitespace | Character that triggers checkbox conversion when typed after `- ` prefix |

### Validation Rules

- `checkboxShortcut` MUST be 0 or 1 characters after trimming
- If length > 1, truncate to first character
- Allowed characters: `[a-zA-Z0-9]`
- Rejected characters: `/`, `#`, `>`, `` ` ``, space, tab
- Empty string is valid (disables the shortcut)

### State Transitions

```
Setting value → Extension behavior:
  "t" (default)  → checkbox triggered by "- t " pattern
  "x"            → checkbox triggered by "- x " pattern
  ""  (empty)    → checkbox shortcut disabled entirely
```

No complex state machine — the setting maps directly to extension behavior at creation time.
