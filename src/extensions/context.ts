import { EditorState } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import { editorLivePreviewField } from "obsidian";

const CODE_BLOCK_NODES = new Set(["FencedCode", "CodeBlock"]);
const FRONTMATTER_NODES = new Set(["YAMLFrontMatter"]);

/**
 * Returns true if the given position is inside a code block
 * (fenced or indented) by walking up the syntax tree parent chain.
 * Falls back to text-based detection for cases where the syntax tree
 * hasn't fully parsed yet (e.g., unclosed code blocks).
 */
export function isInCodeBlock(state: EditorState, pos: number): boolean {
  // Primary: syntax tree check
  let node = syntaxTree(state).resolveInner(pos, -1);
  while (node) {
    if (CODE_BLOCK_NODES.has(node.name)) return true;
    if (!node.parent) break;
    node = node.parent;
  }

  // Fallback: text-based fenced code block detection
  // Count opening ``` fences before this position. If odd, we're inside one.
  const doc = state.doc;
  const line = doc.lineAt(pos);
  let fenceCount = 0;
  for (let i = 1; i < line.number; i++) {
    const lineText = doc.line(i).text;
    if (/^(`{3,}|~{3,})/.test(lineText.trim())) {
      fenceCount++;
    }
  }
  return fenceCount % 2 === 1;
}

/**
 * Returns true if the given position is inside YAML frontmatter
 * by walking up the syntax tree parent chain.
 */
export function isInFrontmatter(state: EditorState, pos: number): boolean {
  let node = syntaxTree(state).resolveInner(pos, -1);
  while (node) {
    if (FRONTMATTER_NODES.has(node.name)) return true;
    if (!node.parent) break;
    node = node.parent;
  }
  return false;
}

/**
 * Returns true if the editor is in Live Preview mode.
 */
export function isLivePreview(state: EditorState): boolean {
  try {
    return state.field(editorLivePreviewField) === true;
  } catch {
    return false;
  }
}
