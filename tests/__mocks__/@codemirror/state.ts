// Mock @codemirror/state for testing

export class EditorState {
  doc: any;
  selection: any;
  private fields: Map<any, any>;

  constructor(doc: any, selection: any, fields?: Map<any, any>) {
    this.doc = doc;
    this.selection = selection;
    this.fields = fields || new Map();
  }

  field(field: any, required?: boolean): any {
    if (this.fields.has(field)) {
      return this.fields.get(field);
    }
    if (required === false) return undefined;
    return undefined;
  }

  static create(config: { doc?: string; selection?: any; extensions?: any[] } = {}): EditorState {
    const lines = (config.doc || "").split("\n");
    const doc = {
      toString: () => config.doc || "",
      length: (config.doc || "").length,
      lineAt(pos: number) {
        let offset = 0;
        for (let i = 0; i < lines.length; i++) {
          const lineEnd = offset + lines[i].length;
          if (pos <= lineEnd || i === lines.length - 1) {
            return {
              from: offset,
              to: lineEnd,
              number: i + 1,
              text: lines[i],
            };
          }
          offset = lineEnd + 1; // +1 for newline
        }
        return { from: 0, to: 0, number: 1, text: "" };
      },
      line(n: number) {
        let offset = 0;
        for (let i = 0; i < n - 1 && i < lines.length; i++) {
          offset += lines[i].length + 1;
        }
        const text = lines[n - 1] || "";
        return {
          from: offset,
          to: offset + text.length,
          number: n,
          text,
        };
      },
      lines: lines.length,
    };

    const state = new EditorState(
      doc,
      config.selection || { main: { head: 0, from: 0, to: 0 } },
    );
    return state;
  }
}

export const Prec = {
  high: (ext: any) => ext,
  highest: (ext: any) => ext,
  low: (ext: any) => ext,
  lowest: (ext: any) => ext,
};

export class EditorSelection {
  static cursor(pos: number) {
    return { main: { head: pos, from: pos, to: pos } };
  }
}

export type Extension = any;
export type StateField<T> = any;
export type Transaction = any;
