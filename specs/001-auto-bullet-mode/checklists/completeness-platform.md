# Completeness & Platform Compatibility Checklist: Auto Bullet Mode

**Purpose**: Validate that requirements are complete across all scenarios and that platform compatibility (desktop/mobile, Live Preview/Source) is fully specified
**Created**: 2026-03-10
**Feature**: [spec.md](../spec.md)

## Requirement Completeness

- [ ] CHK001 - Are requirements defined for what happens when the user presses Enter with the cursor in the middle of existing bullet text (not at end of line)? [Gap, Spec §FR-002]
- [ ] CHK002 - Are requirements defined for Backspace behavior at the start of a bullet line (after "- ")? [Gap]
- [ ] CHK003 - Are requirements specified for what happens after exiting bullet mode via double-Enter — does the next typed line re-enter auto-bullet? [Gap, Spec §FR-001/FR-003]
- [ ] CHK004 - Are requirements defined for behavior when the user deletes all text on a bullet line (leaving just "- ") via Backspace or Select All+Delete? [Gap]
- [ ] CHK005 - Is the behavior specified for Undo (Cmd/Ctrl+Z) after auto-bullet insertion — does it undo just the bullet prefix or the entire line? [Gap]
- [ ] CHK006 - Are requirements defined for what happens when the user splits a line using Enter in the middle of a heading or blockquote? [Gap, Spec §FR-008]
- [ ] CHK007 - Is the maximum indentation depth defined or capped for nested bullets? [Gap, Spec §FR-010]
- [ ] CHK008 - Are requirements specified for behavior inside Obsidian callout blocks (`> [!note]`)? [Gap, Spec §FR-007/FR-008]
- [ ] CHK009 - Are requirements defined for behavior inside Obsidian comments (`%% ... %%`)? [Gap, Spec §FR-007]
- [ ] CHK010 - Is the behavior specified for tables (pipe `|` syntax) — should auto-bullet be suppressed inside table rows? [Gap, Spec §FR-007]

## Platform Compatibility — Desktop vs Mobile

- [ ] CHK011 - Are mobile-specific interaction patterns addressed (e.g., on-screen keyboard Enter behavior vs physical keyboard)? [Gap, Spec §FR-013]
- [ ] CHK012 - Is the absence of status bar on mobile explicitly documented as a known limitation in user-facing terms? [Clarity, Spec §FR-011/FR-013]
- [ ] CHK013 - Are requirements specified for how mobile users toggle auto-bullet mode without the status bar shortcut? [Completeness, Spec §FR-005/FR-013]
- [ ] CHK014 - Is the behavior specified for tablet devices with external keyboards (hybrid input)? [Gap, Spec §FR-013]
- [ ] CHK015 - Are requirements defined for touch-based text selection and its interaction with auto-bullet insertion? [Gap, Spec §FR-013]

## Platform Compatibility — Editor Modes

- [ ] CHK016 - Is the behavior explicitly specified for when the user switches from Live Preview to Source mode mid-editing session? [Gap, Spec §FR-014]
- [ ] CHK017 - Are requirements defined for Reading View — is it clear that auto-bullet has no effect in Reading View? [Gap, Spec §FR-014]
- [ ] CHK018 - Is the behavior defined for when Obsidian opens a note in Source mode by default — does auto-bullet silently do nothing? [Completeness, Spec §FR-014]

## Edge Case Coverage

- [ ] CHK019 - Are requirements specified for multi-cursor editing (multiple cursors on different lines simultaneously)? [Gap]
- [ ] CHK020 - Is the behavior defined for drag-and-drop text within the editor? [Gap, Spec §FR-009]
- [ ] CHK021 - Are requirements specified for IME (Input Method Editor) composition used for CJK languages? [Gap, Spec §FR-001]
- [ ] CHK022 - Is the behavior defined for very long lines that wrap visually — does auto-bullet apply to visual line breaks or document line breaks? [Clarity, Spec §FR-001]
- [ ] CHK023 - Are requirements specified for what happens when the user types `- ` manually on a line that already had auto-bullet applied? [Gap, Spec §FR-008]
- [ ] CHK024 - Is the behavior defined for embedded/transclusion blocks (`![[note]]`)? [Gap, Spec §FR-007]

## Acceptance Criteria Measurability

- [ ] CHK025 - Is "no perceptible delay" in SC-005 quantified with a specific latency threshold (e.g., <16ms per keystroke)? [Measurability, Spec §SC-005]
- [ ] CHK026 - Can SC-004 ("100% of the time") be realistically validated — are the exhaustive test scenarios enumerated? [Measurability, Spec §SC-004]
- [ ] CHK027 - Is the "fewer than 2 seconds" toggle metric in SC-002 measured from command invocation to visual feedback, or keystroke to state change? [Clarity, Spec §SC-002]

## Consistency

- [ ] CHK028 - Are the terms "auto-bullet mode", "bullet mode", and "outline mode" used consistently — is the canonical name defined? [Consistency]
- [ ] CHK029 - Is FR-003 (empty bullet double-Enter exit) consistent with the description in US1 Acceptance Scenario 3 — do both specify identical behavior? [Consistency, Spec §FR-003/US1-AS3]
- [ ] CHK030 - Are the "non-prose contexts" in FR-007 exhaustively enumerated, or is the list open-ended? [Clarity, Spec §FR-007]

## Notes

- Focus: Completeness of requirements and platform compatibility (desktop/mobile, Live Preview/Source)
- Depth: Standard
- Audience: Reviewer (pre-implementation gate)
- 30 items total covering 6 quality dimensions
- Items marked [Gap] indicate requirements that may need to be added to the spec
- Items marked [Clarity] indicate existing requirements that need sharper definition
