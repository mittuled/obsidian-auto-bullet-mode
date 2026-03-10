import { EditorState } from "@codemirror/state";
import { __setMockTree, MockSyntaxNode } from "@codemirror/language";
import { editorLivePreviewField } from "obsidian";
import { createAutoBulletInputHandler } from "../../src/extensions/auto-bullet";

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

describe("Auto-Bullet InputHandler", () => {
  let handler: (
    view: any,
    from: number,
    to: number,
    text: string,
  ) => boolean;
  let dispatched: any[];

  beforeEach(() => {
    const ext = createAutoBulletInputHandler();
    handler = ext.handler;
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

  it("inserts '- ' prefix when single character typed on empty line", () => {
    const state = makeLivePreviewState("", 0);
    const view = makeView(state);
    __setMockTree({
      resolveInner: () => makeNode("Document"),
    });

    const result = handler(view, 0, 0, "a");
    expect(result).toBe(true);
    expect(dispatched.length).toBe(1);
  });

  it("does NOT trigger on paste (text.length > 1)", () => {
    const state = makeLivePreviewState("", 0);
    const view = makeView(state);
    __setMockTree({
      resolveInner: () => makeNode("Document"),
    });

    const result = handler(view, 0, 0, "pasted text");
    expect(result).toBe(false);
  });

  it("does NOT trigger when isInCodeBlock is true", () => {
    const state = makeLivePreviewState("", 0);
    const view = makeView(state);
    __setMockTree({
      resolveInner: () => makeNode("FencedCode"),
    });

    const result = handler(view, 0, 0, "a");
    expect(result).toBe(false);
  });

  it("does NOT trigger when isInFrontmatter is true", () => {
    const state = makeLivePreviewState("", 0);
    const view = makeView(state);
    __setMockTree({
      resolveInner: () => makeNode("YAMLFrontMatter"),
    });

    const result = handler(view, 0, 0, "a");
    expect(result).toBe(false);
  });

  it("does NOT trigger when isLivePreview is false", () => {
    const state = makeSourceModeState("", 0);
    const view = makeView(state);
    __setMockTree({
      resolveInner: () => makeNode("Document"),
    });

    const result = handler(view, 0, 0, "a");
    expect(result).toBe(false);
  });

  it("does NOT trigger when line already has '- ' prefix", () => {
    const state = makeLivePreviewState("- existing text", 2);
    const view = makeView(state);
    __setMockTree({
      resolveInner: () => makeNode("Document"),
    });

    const result = handler(view, 2, 2, "a");
    expect(result).toBe(false);
  });

  // FR-004: No modification on open
  it("does NOT trigger editor transactions when note is opened (no user input)", () => {
    // This test verifies the inputHandler design: it only fires on user input.
    // Opening a note doesn't trigger inputHandler, so no transactions should occur.
    // We verify by confirming the handler only responds to single-char typed input.
    const state = makeLivePreviewState("plain text line\nanother line", 0);
    const view = makeView(state);
    __setMockTree({
      resolveInner: () => makeNode("Document"),
    });

    // Non-empty line — handler should not trigger
    const result = handler(view, 0, 0, "");
    expect(result).toBe(false);
    expect(dispatched.length).toBe(0);
  });
});
