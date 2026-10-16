// simulates click on a node
export default function simulateClick(node) {
  node.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
}
