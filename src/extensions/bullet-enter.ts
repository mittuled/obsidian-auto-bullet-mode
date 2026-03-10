import { Prec } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { isInCodeBlock, isLivePreview } from "./context";

const BULLET_RE = /^(\s*)-\s/;

/**
 * Creates a CM6 keymap extension (at Prec.high) that handles Enter key
 * for bullet continuation and empty-bullet exit.
 */
export function createBulletEnterHandler() {
  return Prec.high(
    keymap.of([
      {
        key: "Enter",
        run(view: any): boolean {
          const state = view.state;

          // Guard: Live Preview only
          if (!isLivePreview(state)) return false;

          const head = state.selection.main.head;

          // Guard: not in code block
          if (isInCodeBlock(state, head)) return false;

          const line = state.doc.lineAt(head);
          const match = line.text.match(BULLET_RE);

          // Not on a bullet line — let default Enter handle it
          if (!match) return false;

          const indent = match[1];
          const textAfterBullet = line.text.slice(match[0].length);

          // Empty bullet case: "  - " with no text after prefix
          if (textAfterBullet.trim() === "" && head >= line.from + match[0].length - 1) {
            // Remove the bullet line content and replace with empty line
            view.dispatch({
              changes: {
                from: line.from,
                to: line.to,
                insert: "",
              },
              selection: {
                anchor: line.from,
              },
            });
            return true;
          }

          // Bullet continuation: split at cursor and create new bullet
          const textBeforeCursor = line.text.slice(0, head - line.from);
          const textAfterCursor = line.text.slice(head - line.from);

          view.dispatch({
            changes: {
              from: line.from,
              to: line.to,
              insert: textBeforeCursor + "\n" + indent + "- " + textAfterCursor,
            },
            selection: {
              anchor: line.from + textBeforeCursor.length + 1 + indent.length + 2,
            },
          });

          return true;
        },
      },
    ]),
  );
}
