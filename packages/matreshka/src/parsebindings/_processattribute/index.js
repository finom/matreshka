import getBindingKey from './_getbindingkey';
import bindNode from '../../bindnode';
import lookForBinder from '../../lookforbinder';

// a binder for instance of Attr
const attributeBinder = {
  setValue(value) {
    this.value = value === null || value === undefined ? '' : value;
  }
};

// adds binding for an attribute
// its logic is much harder than for text node
// check out imported modules for more info
export default function processAttribute({ node, attribute, object, eventOptions }) {
  const { name, value } = attribute;
  const { type } = node;
  // get a key which will be actually bound to an attribute
  // getBindingKey analyzes given value, creates computable property and returns its key
  const key = getBindingKey({
    object,
    text: value
  });
  const probablyValueInput = name === 'value' && type !== 'checkbox' && type !== 'radio';
  const probablyCheckableInput = name === 'checked' && (type === 'checkbox' || type === 'radio');

  let defaultBinder;

  if (probablyValueInput || probablyCheckableInput) {
    defaultBinder = lookForBinder(node);
  }

  if (defaultBinder) {
    // if deault binder is found then this is default HTML5 form element
    // remove the attribute and use found binder
    node.removeAttribute(name);
    bindNode(object, key, node, defaultBinder, eventOptions);
  } else {
    // simply bind an attribute
    bindNode(object, key, attribute, attributeBinder, eventOptions);
  }
}
