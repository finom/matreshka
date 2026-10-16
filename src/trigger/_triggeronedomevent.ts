// triggers given DOM event on given node
export default function triggerOneDOMEvent({
  node,
  eventName,
  triggerArgs
}: {
  node: Node;
  eventName: string;
  triggerArgs: any[];
}): void {
  const event: Event & { matreshkaTriggerArgs?: any[] } = new window.Event(eventName, {
    bubbles: true,
    cancelable: true
  });

  // matreshkaTriggerArgs will be used in a handler created by addDOMListener
  event.matreshkaTriggerArgs = triggerArgs;

  node.dispatchEvent(event);
}
