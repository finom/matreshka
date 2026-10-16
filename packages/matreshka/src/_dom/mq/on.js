import data from './_data';

const splitBySpaceReg = /\s+/;
const splitByDotReg = /\.(.+)/;
const nonBubblingReg = /^(focus|blur)$/;
const randomID = `${Math.random().toString().replace('0.', 'x')}y`; // x12345y

// the function is used when a selector is given
function delegateHandler(evt, selector, handler) {
  const scopeSelector = `[${randomID}="${randomID}"] `;
  const splittedSelector = selector.split(',');

  let matching = '';

  for (let i = 0; i < splittedSelector.length; i++) {
    const sel = splittedSelector[i];
    matching += `${i === 0 ? '' : ','}${scopeSelector}${sel},${scopeSelector}${sel} *`;
  }

  this.setAttribute(randomID, randomID);

  if (evt.target.matches?.(matching)) {
    handler.call(this, evt);
  }

  this.removeAttribute(randomID);
}

// adds event listener to a set of elemnts
export default function on(namesStr, selector, handler) {
  const names = namesStr.split(splitBySpaceReg);
  let delegate;

  if (typeof selector === 'function') {
    handler = selector;
    selector = null;
  }

  if (selector) {
    delegate = function uniqueDelegateHandler(evt) {
      delegateHandler.call(this, evt, selector, handler);
    };
  }

  for (let i = 0; i < names.length; i++) {
    const [name, namespace] = names[i].split(splitByDotReg);

    for (let j = 0; j < this.length; j++) {
      const node = this[j];
      if (!node.b$) {
        data.nodeIndex += 1;
        node.b$ = data.nodeIndex;
      }
      const nodeID = node.b$;
      data.allEvents[name + nodeID] = data.allEvents[name + nodeID] || [];
      const events = data.allEvents[name + nodeID];

      let exist = false;

      for (let k = 0; k < events.length; k++) {
        const event = events[k];

        if (handler === event.handler && (!selector || selector === event.selector)) {
          exist = true;
          break;
        }
      }

      if (!exist) {
        // focus and blur don't bubble, so a delegated handler listens to them at capture phase
        const capture = !!selector && nonBubblingReg.test(name);

        events.push({
          capture,
          delegate,
          handler,
          namespace,
          selector,
          nodeID,
          name
        });

        node.addEventListener(name, delegate || handler, capture);
      }
    }
  }

  return this;
}
