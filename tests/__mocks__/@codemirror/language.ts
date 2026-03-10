// Mock @codemirror/language for testing

export interface MockSyntaxNode {
  name: string;
  parent: MockSyntaxNode | null;
}

let mockTree: { resolveInner: (pos: number, side?: number) => MockSyntaxNode } | null = null;

export function __setMockTree(tree: typeof mockTree) {
  mockTree = tree;
}

export function syntaxTree(_state: any) {
  if (mockTree) return mockTree;
  return {
    resolveInner: (_pos: number, _side?: number): MockSyntaxNode => ({
      name: "Document",
      parent: null,
    }),
  };
}
