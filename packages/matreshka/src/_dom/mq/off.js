import data from './_data';

const splitBySpaceReg = /\s+/;
const splitByDotReg = /\.(.+)/;

// removes event handler from a set of elements
export default function off(namesStr, selector, handler) {
  if (typeof selector === 'function') {
    handler = selector;
    selector = null;
  }

  const names = namesStr.split(splitBySpaceReg);

  for (let i = 0; i < names.length; i++) {
    const [name, namespace] = names[i].split(splitByDotReg);

    for (let j = 0; j < this.length; j++) {
      const node = this[j];

      if (!name && namespace) {
        for (let k = 0, keys = Object.keys(data.allEvents); k < keys.length; k++) {
          const events = data.allEvents[keys[k]];

          for (let l = 0; l < events.length; l++) {
            const event = events[l];
            if (event.namespace === namespace && event.nodeID === node.b$) {
              node.removeEventListener(event.name, event.delegate || event.handler, event.capture);
              events.splice(l, 1);
              l -= 1;
            }
          }
        }

        continue;
      }

      const events = data.allEvents[name + node.b$];
      if (events) {
        for (let k = 0; k < events.length; k++) {
          const event = events[k];
          if (
            (!handler || handler === event.handler || handler === event.delegate) &&
            (!namespace || namespace === event.namespace) &&
            (!selector || selector === event.selector)
          ) {
            node.removeEventListener(name, event.delegate || event.handler, event.capture);
            events.splice(k, 1);
            k -= 1;
          }
        }
      } else if (!namespace && !selector) {
        node.removeEventListener(name, handler);
      }
    }
  }

  return this;
}
