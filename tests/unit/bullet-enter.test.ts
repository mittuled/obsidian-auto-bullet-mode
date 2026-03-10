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

function makeSourceModeState(doc: string, cursorPos: number): EditorState {
  const state = EditorState.create({
    doc,
    selection: { main: { head: cursorPos, from: cursorPos, to: cursorPos } },
  });
  state.field = (field: any) => {
    if (field === editorLivePreviewField) return false;
    return undefined;
  };
  return state;
}

describe("Bullet Enter Handler", () => {
  let enterRun: (view: any) => boolean;
  let dispatched: any[];

  beforeEach(() => {
    const ext = createBulletEnterHandler();
    // Extract the run function from the keymap binding
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

  it("creates new bullet line when Enter pressed on bullet line", () => {
    //                  "- hello" cursor at end (pos 7)
    const state = makeLivePreviewState("- hello", 7);
    const view = makeView(state);
    __setMockTree({
      resolveInner: () => makeNode("Document"),
    });

    const result = enterRun(view);
    expect(result).toBe(true);
    expect(dispatched.length).toBe(1);
  });

  it("removes empty bullet and creates empty line on Enter", () => {
    //                  "- " cursor at end (pos 2)
    const state = makeLivePreviewState("- ", 2);
    const view = makeView(state);
    __setMockTree({
      resolveInner: () => makeNode("Document"),
    });

    const result = enterRun(view);
    expect(result).toBe(true);
    expect(dispatched.length).toBe(1);
  });

  it("does NOT fire when not in Live Preview", () => {
    const state = makeSourceModeState("- hello", 7);
    const view = makeView(state);
    __setMockTree({
      resolveInner: () => makeNode("Document"),
    });

    const result = enterRun(view);
    expect(result).toBe(false);
  });

  it("does NOT fire inside code block", () => {
    const state = makeLivePreviewState("- hello", 7);
    const view = makeView(state);
    __setMockTree({
      resolveInner: () => makeNode("FencedCode"),
    });

    const result = enterRun(view);
    expect(result).toBe(false);
  });

  it("does NOT fire on non-bullet line", () => {
    const state = makeLivePreviewState("plain text", 10);
    const view = makeView(state);
    __setMockTree({
      resolveInner: () => makeNode("Document"),
    });

    const result = enterRun(view);
    expect(result).toBe(false);
  });

  it("handles Enter in middle of bullet text (splits line)", () => {
    //                  "- hello world" cursor at pos 7 (after "hello")
    const state = makeLivePreviewState("- hello world", 7);
    const view = makeView(state);
    __setMockTree({
      resolveInner: () => makeNode("Document"),
    });

    const result = enterRun(view);
    expect(result).toBe(true);
    expect(dispatched.length).toBe(1);
  });
});
