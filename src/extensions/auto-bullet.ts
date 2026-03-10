import { EditorView } from "@codemirror/view";
import { isInCodeBlock, isInFrontmatter, isLivePreview } from "./context";

const BULLET_RE = /^(\s*)-\s/;
const BLOCK_SYNTAX_RE = /^(#{1,6}\s|>\s|\d+\.\s)/;
const CHECKBOX_PATTERN_RE = /^(\s*)-\st\s*$/;

/**
 * Creates a CM6 inputHandler extension that auto-inserts "- " prefix
 * when the user types a single character on an empty line in Live Preview.
 * Matches indentation of the previous bullet line if one exists.
 * Also handles "t " → "[ ] " checkbox shortcut.
 */
export function createAutoBulletInputHandler() {
  return EditorView.inputHandler.of(
    (view: any, from: number, to: number, text: string): boolean => {
      // Only respond to single-character typed input (excludes paste)
      if (text.length !== 1) return false;

      const state = view.state;

      // Guard: Live Preview only
      if (!isLivePreview(state)) return false;

      // Guard: not in code block or frontmatter
      if (isInCodeBlock(state, from) || isInFrontmatter(state, from)) {
        return false;
      }

      const line = state.doc.lineAt(from);

      // Checkbox shortcut: "- t" + space → "- [ ] "
      if (text === " " && CHECKBOX_PATTERN_RE.test(line.text)) {
        const match = line.text.match(/^(\s*)-\s/);
        const indent = match ? match[1] : "";
        const newText = indent + "- [ ] ";
        view.dispatch({
          changes: {
            from: line.from,
            to: line.to,
            insert: newText,
          },
          selection: {
            anchor: line.from + newText.length,
          },
        });
        return true;
      }

      // Only trigger auto-bullet on empty lines
      if (line.text.trim() !== "") return false;

      // Exclude "/" for Obsidian slash commands
      if (text === "/") return false;

      // Check if this character starts a block-level syntax
      if (BLOCK_SYNTAX_RE.test(text + " ")) return false;
      if (text === "#" || text === ">" || text === "`") return false;

      // Detect indentation from previous bullet line
      let indent = "";
      if (line.number > 1) {
        const prevLine = state.doc.line(line.number - 1);
        const match = prevLine.text.match(BULLET_RE);
        if (match) {
          indent = match[1];
        }
      }

      const prefix = indent + "- ";

      // Insert prefix followed by the typed character
      view.dispatch({
        changes: {
          from: line.from,
          to: from,
          insert: prefix + text,
        },
        selection: {
          anchor: line.from + prefix.length + text.length,
        },
      });

      return true;
    },
  );
}
