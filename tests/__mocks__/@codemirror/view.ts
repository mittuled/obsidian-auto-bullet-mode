// Mock @codemirror/view for testing

export const EditorView = {
  inputHandler: {
    of: (handler: any) => ({ handler, type: "inputHandler" }),
  },
};

export const keymap = {
  of: (bindings: any[]) => ({ bindings, type: "keymap" }),
};

export type ViewUpdate = any;
