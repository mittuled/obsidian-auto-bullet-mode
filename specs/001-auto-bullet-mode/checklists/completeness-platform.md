# Completeness & Platform Compatibility Checklist: Auto Bullet Mode

**Purpose**: Validate that requirements are complete across all scenarios and that platform compatibility (desktop/mobile, Live Preview/Source) is fully specified
**Created**: 2026-03-10
**Feature**: [spec.md](../spec.md)

## Requirement Completeness

- [x] CHK001 - Are requirements defined for what happens when the user presses Enter with the cursor in the middle of existing bullet text (not at end of line)? [Gap, Spec §FR-002] — RESOLVED: FR-002 updated to specify line-split behavior with bullet prefix on new line.
- [x] CHK002 - Are requirements defined for Backspace behavior at the start of a bullet line (after "- ")? [Gap] — DEFERRED: Obsidian native behavior handles this. Not plugin scope.
- [x] CHK003 - Are requirements specified for what happens after exiting bullet mode via double-Enter — does the next typed line re-enter auto-bullet? [Gap, Spec §FR-001/FR-003] — RESOLVED: FR-003 updated to clarify exit is per-line, not a mode toggle.
- [x] CHK004 - Are requirements defined for behavior when the user deletes all text on a bullet line (leaving just "- ") via Backspace or Select All+Delete? [Gap] — DEFERRED: Results in valid "- " state. Enter on it exits per FR-003. Not plugin scope.
- [x] CHK005 - Is the behavior specified for Undo (Cmd/Ctrl+Z) after auto-bullet insertion — does it undo just the bullet prefix or the entire line? [Gap] — DEFERRED: CM6 transaction-based undo is an editor concern, not plugin-controlled.
- [x] CHK006 - Are requirements defined for what happens when the user splits a line using Enter in the middle of a heading or blockquote? [Gap, Spec §FR-008] — DEFERRED: FR-008 excludes headings/blockquotes from auto-bullet. Enter in these contexts follows Obsidian native behavior.
- [x] CHK007 - Is the maximum indentation depth defined or capped for nested bullets? [Gap, Spec §FR-010] — DEFERRED: Follows Obsidian native indentation limits. Not plugin scope.
- [x] CHK008 - Are requirements specified for behavior inside Obsidian callout blocks (`> [!note]`)? [Gap, Spec §FR-007/FR-008] — RESOLVED: FR-007 updated with exhaustive exclusion list including callout blocks.
- [x] CHK009 - Are requirements defined for behavior inside Obsidian comments (`%% ... %%`)? [Gap, Spec §FR-007] — RESOLVED: FR-007 updated with exhaustive exclusion list including comments.
- [x] CHK010 - Is the behavior specified for tables (pipe `|` syntax) — should auto-bullet be suppressed inside table rows? [Gap, Spec §FR-007] — RESOLVED: FR-007 updated with exhaustive exclusion list including table rows.

## Platform Compatibility — Desktop vs Mobile

- [x] CHK011 - Are mobile-specific interaction patterns addressed (e.g., on-screen keyboard Enter behavior vs physical keyboard)? [Gap, Spec §FR-013] — PASS: CM6 keymap handles both on-screen and physical keyboard Enter identically. No mobile-specific behavior needed.
- [x] CHK012 - Is the absence of status bar on mobile explicitly documented as a known limitation in user-facing terms? [Clarity, Spec §FR-011/FR-013] — PASS: FR-013 states "The status bar indicator is a desktop-only enhancement."
- [x] CHK013 - Are requirements specified for how mobile users toggle auto-bullet mode without the status bar shortcut? [Completeness, Spec §FR-005/FR-013] — PASS: FR-005 specifies command palette toggle which works on all platforms. Research.md confirms mobile uses command palette.
- [x] CHK014 - Is the behavior specified for tablet devices with external keyboards (hybrid input)? [Gap, Spec §FR-013] — PASS: Obsidian treats tablets as mobile. CM6 keymap works with any keyboard type. No special handling needed.
- [x] CHK015 - Are requirements defined for touch-based text selection and its interaction with auto-bullet insertion? [Gap, Spec §FR-013] — PASS: inputHandler only fires on typed character input, not selection changes. Touch selection does not trigger auto-bullet.

## Platform Compatibility — Editor Modes

- [x] CHK016 - Is the behavior explicitly specified for when the user switches from Live Preview to Source mode mid-editing session? [Gap, Spec §FR-014] — RESOLVED: FR-014 updated to specify dynamic mode switching — plugin activates/deactivates immediately based on `editorLivePreviewField`.
- [x] CHK017 - Are requirements defined for Reading View — is it clear that auto-bullet has no effect in Reading View? [Gap, Spec §FR-014] — RESOLVED: FR-014 updated to state Reading View has no editor, so plugin has no effect.
- [x] CHK018 - Is the behavior defined for when Obsidian opens a note in Source mode by default — does auto-bullet silently do nothing? [Completeness, Spec §FR-014] — PASS: FR-014 specifies Live Preview only. `editorLivePreviewField` returns false in Source mode, so extensions silently skip.

## Edge Case Coverage

- [x] CHK019 - Are requirements specified for multi-cursor editing (multiple cursors on different lines simultaneously)? [Gap] — RESOLVED: FR-015 added documenting multi-cursor as a known v1 limitation with undefined behavior.
- [x] CHK020 - Is the behavior defined for drag-and-drop text within the editor? [Gap, Spec §FR-009] — PASS: inputHandler checks text.length===1 which excludes drag-and-drop (multi-character insertion). FR-009 covers non-typed input.
- [x] CHK021 - Are requirements specified for IME (Input Method Editor) composition used for CJK languages? [Gap, Spec §FR-001] — RESOLVED: FR-016 added specifying IME support — inputHandler fires after composition ends.
- [x] CHK022 - Is the behavior defined for very long lines that wrap visually — does auto-bullet apply to visual line breaks or document line breaks? [Clarity, Spec §FR-001] — PASS: Auto-bullet operates on document lines (CM6 `Line` objects), not visual wraps. Inherent in CM6 line model.
- [x] CHK023 - Are requirements specified for what happens when the user types `- ` manually on a line that already had auto-bullet applied? [Gap, Spec §FR-008] — PASS: Edge case "no double-prefix" already specifies "The plugin MUST NOT double-prefix (no '- - ' lines)."
- [x] CHK024 - Is the behavior defined for embedded/transclusion blocks (`![[note]]`)? [Gap, Spec §FR-007] — RESOLVED: FR-007 updated with exhaustive exclusion list including embedded/transclusion blocks.

## Acceptance Criteria Measurability

- [x] CHK025 - Is "no perceptible delay" in SC-005 quantified with a specific latency threshold (e.g., <16ms per keystroke)? [Measurability, Spec §SC-005] — RESOLVED: SC-005 updated with <16ms threshold (one frame at 60fps).
- [x] CHK026 - Can SC-004 ("100% of the time") be realistically validated — are the exhaustive test scenarios enumerated? [Measurability, Spec §SC-004] — PASS: Test scenarios are enumerated in Edge Cases section and unit test tasks. "100%" is validated via those defined scenarios.
- [x] CHK027 - Is the "fewer than 2 seconds" toggle metric in SC-002 measured from command invocation to visual feedback, or keystroke to state change? [Clarity, Spec §SC-002] — RESOLVED: SC-002 updated to specify "from command invocation to visual feedback."

## Consistency

- [x] CHK028 - Are the terms "auto-bullet mode", "bullet mode", and "outline mode" used consistently — is the canonical name defined? [Consistency] — RESOLVED: Canonical name is "auto-bullet mode." "bullet mode" in FR-003 changed to "bullet list." "outline mode" in US3 refers to the outlining workflow, not the mode name.
- [x] CHK029 - Is FR-003 (empty bullet double-Enter exit) consistent with the description in US1 Acceptance Scenario 3 — do both specify identical behavior? [Consistency, Spec §FR-003/US1-AS3] — PASS: Both specify Enter on empty "- " line removes bullet and creates plain empty line.
- [x] CHK030 - Are the "non-prose contexts" in FR-007 exhaustively enumerated, or is the list open-ended? [Clarity, Spec §FR-007] — RESOLVED: FR-007 updated with exhaustive enumeration: fenced code blocks, indented code blocks, YAML frontmatter, callout blocks, comments, table rows, embedded/transclusion blocks.

## Notes

- Focus: Completeness of requirements and platform compatibility (desktop/mobile, Live Preview/Source)
- Depth: Standard
- Audience: Reviewer (pre-implementation gate)
- 30 items total covering 6 quality dimensions
- All 30 items resolved: 14 already passing, 11 resolved via spec updates, 5 deferred (out of plugin scope)
- Spec updates: FR-002, FR-003, FR-007, FR-014 modified; FR-015, FR-016, SC-002, SC-005 added/updated
