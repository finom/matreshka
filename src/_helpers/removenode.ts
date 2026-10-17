// Node#remove, which IE 11 lacks
export default function removeNode(node: Node | null | undefined): void {
  node?.parentNode?.removeChild(node);
}
