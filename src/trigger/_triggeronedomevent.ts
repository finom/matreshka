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
  // createEvent, as IE 11 has no Event constructor
  const event: Event & { matreshkaTriggerArgs?: any[] } = window.document.createEvent('Event');
  event.initEvent(eventName, true, true);

  // matreshkaTriggerArgs will be used in a handler created by addDOMListener
  event.matreshkaTriggerArgs = triggerArgs;

  node.dispatchEvent(event);
}
