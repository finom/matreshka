// returns a function which is called when property value is changed
export default function createObjectHandler({ node, propDef, binder, bindingOptions }) {
  return function objectHandler(eventOptions = {}) {
    const { value } = propDef;
    const { onChangeValue, changedNode, binder: evtBinder } = eventOptions;
    const { setValue } = binder;
    // dirty hack for https://github.com/finom/matreshka/issues/19
    const dirtyHackValue = typeof onChangeValue === 'string' && typeof value === 'number' ? `${value}` : value;

    // don't call setValue if a property is changed via getValue of the same binder
    if (changedNode === node && onChangeValue === dirtyHackValue && evtBinder === binder) {
      return;
    }

    setValue.call(node, value, {
      value,
      ...bindingOptions
    });
  };
}
