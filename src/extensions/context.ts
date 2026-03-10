import { EditorState } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import { editorLivePreviewField } from "obsidian";

const CODE_BLOCK_NODES = new Set(["FencedCode", "CodeBlock"]);
const FRONTMATTER_NODES = new Set(["YAMLFrontMatter"]);

/**
 * Returns true if the given position is inside a code block
 * (fenced or indented) by walking up the syntax tree parent chain.
 */
export function isInCodeBlock(state: EditorState, pos: number): boolean {
  let node = syntaxTree(state).resolveInner(pos, -1);
  while (node) {
    if (CODE_BLOCK_NODES.has(node.name)) return true;
    if (!node.parent) break;
    node = node.parent;
  }
  return false;
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
