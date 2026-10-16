import initMK from '../_core/init';
import defineProp from '../_core/defineprop';
import set from '../set';

const fieldKeys = ['Model', 'itemRenderer'];

// a native class field (`Model = X`) replaces the accessor installed in the constructor
// so put the accessor back and assign the field value through it; returns the object definition
export default function syncFields(self) {
  const def = initMK(self);

  for (let i = 0; i < fieldKeys.length; i++) {
    const key = fieldKeys[i];
    const descriptor = Object.getOwnPropertyDescriptor(self, key);

    if (descriptor && 'value' in descriptor && def.props[key]) {
      const { value } = descriptor;

      delete self[key];
      delete def.props[key];
      defineProp(self, key);
      set(self, key, value);
    }
  }

  return def;
}
