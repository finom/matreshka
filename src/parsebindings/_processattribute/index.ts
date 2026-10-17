import type { AnyObject, Binder } from '../../types.js';
import type { BindNodeOptions } from '../../bindnode/types.js';
import getBindingKey from './_getbindingkey.js';
import bindKey from '../../bindnode/_bindkey.js';
import lookForBinder from '../../lookforbinder.js';
import defs from '../../_core/defs.js';
import assign from '../../_helpers/assign.js';

// a binder for instance of Attr
const attributeBinder: Binder = {
  setValue(this: Attr, value: any) {
    this.value = value === null || value === undefined ? '' : value;
  }
};

// adds binding for an attribute
// its logic is much harder than for text node
// check out imported modules for more info
interface AttributeData {
  node: Element;
  attribute: Attr;
  object: AnyObject;
  eventOptions: BindNodeOptions;
}

export default function processAttribute({ node, attribute, object, eventOptions }: AttributeData): void {
  const { name, value } = attribute;
  // undefined for an element without "type"
  const { type } = node as HTMLInputElement;
  // get a key which will be actually bound to an attribute
  // getBindingKey analyzes given value, creates computable property and returns its key
  const key = getBindingKey({
    object,
    text: value
  });
  const probablyValueInput = name === 'value' && type !== 'checkbox' && type !== 'radio';
  const probablyCheckableInput = name === 'checked' && (type === 'checkbox' || type === 'radio');

  let defaultBinder: Binder | undefined;

  if (probablyValueInput || probablyCheckableInput) {
    defaultBinder = lookForBinder(node);
  }

  // a template other than "{{x}}" is a hidden calc of its own, removed with its binding
  const removeCalc = defs.get(object)?.props[key]?.removeCalc;
  const ownBinder = (binder: Binder): Binder =>
    removeCalc
      ? assign({}, binder, {
          destroy(this: any, bindingOptions: any) {
            binder.destroy?.call(this, bindingOptions);
            removeCalc();
          }
        })
      : binder;

  // a submit or reset button's binder sets nothing: its value attribute is its label, bound as an attribute
  if (defaultBinder?.setValue) {
    // if deault binder is found then this is default HTML5 form element
    // remove the attribute and use found binder
    node.removeAttribute(name);
    bindKey(object, key, node, ownBinder(defaultBinder), eventOptions);
  } else {
    // simply bind an attribute
    bindKey(object, key, attribute, ownBinder(attributeBinder), eventOptions);
  }
}
