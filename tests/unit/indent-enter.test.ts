import { EditorState } from "@codemirror/state";
import { __setMockTree, MockSyntaxNode } from "@codemirror/language";
import { editorLivePreviewField } from "obsidian";
import { createBulletEnterHandler } from "../../src/extensions/bullet-enter";

function makeNode(name: string, parent: MockSyntaxNode | null = null): MockSyntaxNode {
  return { name, parent };
}

function makeLivePreviewState(doc: string, cursorPos: number): EditorState {
  const state = EditorState.create({
    doc,
    selection: { main: { head: cursorPos, from: cursorPos, to: cursorPos } },
  });
  state.field = (field: any) => {
    if (field === editorLivePreviewField) return true;
    return undefined;
  };
  return state;
}

describe("Indentation-Aware Enter", () => {
  let enterRun: (view: any) => boolean;
  let dispatched: any[];

  beforeEach(() => {
    const ext = createBulletEnterHandler();
    enterRun = ext.bindings[0].run;
    dispatched = [];
  });

  afterEach(() => {
    __setMockTree(null);
  });

  function makeView(state: EditorState) {
    return {
      state,
      dispatch: (...args: any[]) => dispatched.push(...args),
    };
  }

  it("creates indented bullet on Enter after indented bullet", () => {
    // "\t- text" with cursor at end
    const doc = "\t- text";
    const state = makeLivePreviewState(doc, doc.length);
    const view = makeView(state);
    __setMockTree({
      resolveInner: () => makeNode("Document"),
    });

    const result = enterRun(view);
    expect(result).toBe(true);
    expect(dispatched.length).toBe(1);
    // Verify the dispatch contains the indented bullet
    const changes = dispatched[0].changes;
    expect(changes.insert).toContain("\t- ");
  });

  it("creates double-indented bullet on Enter after double-indented bullet", () => {
    const doc = "\t\t- text";
    const state = makeLivePreviewState(doc, doc.length);
    const view = makeView(state);
    __setMockTree({
      resolveInner: () => makeNode("Document"),
    });

    const result = enterRun(view);
    expect(result).toBe(true);
    const changes = dispatched[0].changes;
    expect(changes.insert).toContain("\t\t- ");
  });

  it("removes empty indented bullet on Enter", () => {
    // "\t- " with cursor at end (empty indented bullet)
    const doc = "\t- ";
    const state = makeLivePreviewState(doc, doc.length);
    const view = makeView(state);
    __setMockTree({
      resolveInner: () => makeNode("Document"),
    });

    const result = enterRun(view);
    expect(result).toBe(true);
    // Should remove the bullet line
    const changes = dispatched[0].changes;
    expect(changes.insert).toBe("");
  });
});
