import { EditorState } from "@codemirror/state";
import {
  __setMockTree,
  MockSyntaxNode,
} from "@codemirror/language";
import { editorLivePreviewField } from "obsidian";
import {
  isInCodeBlock,
  isInFrontmatter,
  isLivePreview,
} from "../../src/extensions/context";

function makeNode(name: string, parent: MockSyntaxNode | null = null): MockSyntaxNode {
  return { name, parent };
}

describe("Context Detection", () => {
  afterEach(() => {
    __setMockTree(null);
  });

  describe("isInCodeBlock", () => {
    it("returns true when cursor is inside a FencedCode node", () => {
      const node = makeNode("FencedCode");
      __setMockTree({ resolveInner: () => node });
      const state = EditorState.create({ doc: "```\ncode\n```" });
      expect(isInCodeBlock(state, 5)).toBe(true);
    });

    it("returns true when cursor is inside a CodeBlock node", () => {
      const node = makeNode("CodeBlock");
      __setMockTree({ resolveInner: () => node });
      const state = EditorState.create({ doc: "    indented code" });
      expect(isInCodeBlock(state, 5)).toBe(true);
    });

    it("returns true when parent chain contains FencedCode", () => {
      const parent = makeNode("FencedCode");
      const node = makeNode("CodeText", parent);
      __setMockTree({ resolveInner: () => node });
      const state = EditorState.create({ doc: "```\ncode\n```" });
      expect(isInCodeBlock(state, 5)).toBe(true);
    });

    it("returns false when cursor is in normal text", () => {
      const node = makeNode("Document");
      __setMockTree({ resolveInner: () => node });
      const state = EditorState.create({ doc: "normal text" });
      expect(isInCodeBlock(state, 3)).toBe(false);
    });

    it("returns true via text fallback when syntax tree misses fenced code block", () => {
      // Syntax tree says Document (not parsed yet), but text shows we're inside ```
      const node = makeNode("Document");
      __setMockTree({ resolveInner: () => node });
      const state = EditorState.create({ doc: "```\n\n```" });
      // Position 4 is on line 2 (empty line inside code block)
      expect(isInCodeBlock(state, 4)).toBe(true);
    });

    it("returns false via text fallback when outside fenced code block", () => {
      const node = makeNode("Document");
      __setMockTree({ resolveInner: () => node });
      const state = EditorState.create({ doc: "```\ncode\n```\nnormal text" });
      // Position is on line 4 (after closing fence)
      expect(isInCodeBlock(state, 18)).toBe(false);
    });

    it("returns true via text fallback with tilde fences", () => {
      const node = makeNode("Document");
      __setMockTree({ resolveInner: () => node });
      const state = EditorState.create({ doc: "~~~\n\n~~~" });
      expect(isInCodeBlock(state, 4)).toBe(true);
    });
  });

  describe("isInFrontmatter", () => {
    it("returns true when cursor is inside YAMLFrontMatter node", () => {
      const node = makeNode("YAMLFrontMatter");
      __setMockTree({ resolveInner: () => node });
      const state = EditorState.create({ doc: "---\ntitle: test\n---" });
      expect(isInFrontmatter(state, 5)).toBe(true);
    });

    it("returns true when parent chain contains YAMLFrontMatter", () => {
      const parent = makeNode("YAMLFrontMatter");
      const node = makeNode("YAMLContent", parent);
      __setMockTree({ resolveInner: () => node });
      const state = EditorState.create({ doc: "---\ntitle: test\n---" });
      expect(isInFrontmatter(state, 5)).toBe(true);
    });

    it("returns false when cursor is in normal text", () => {
      const node = makeNode("Document");
      __setMockTree({ resolveInner: () => node });
      const state = EditorState.create({ doc: "normal text" });
      expect(isInFrontmatter(state, 3)).toBe(false);
    });
  });

  describe("isLivePreview", () => {
    it("returns true when editorLivePreviewField is true", () => {
      const state = EditorState.create();
      // Patch the field method to return true for the livePreview field
      state.field = (field: any) => {
        if (field === editorLivePreviewField) return true;
        return undefined;
      };
      expect(isLivePreview(state)).toBe(true);
    });

    it("returns false when editorLivePreviewField is false", () => {
      const state = EditorState.create();
      state.field = (field: any) => {
        if (field === editorLivePreviewField) return false;
        return undefined;
      };
      expect(isLivePreview(state)).toBe(false);
    });

    it("returns false when field is not available", () => {
      const state = EditorState.create();
      state.field = () => undefined;
      expect(isLivePreview(state)).toBe(false);
    });
  });
});
