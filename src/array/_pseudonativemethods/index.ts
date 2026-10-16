import createPseudoNativeMethod, { changingMethodNames, methodNames } from './createpseudonativemethod.js';
import concat from './concat.js';
import keys from './keys.js';
import values from './values.js';
import entries from './entries.js';
import type { MatreshkaArrayInstance } from '../types.js';

const methods: Record<string, (this: MatreshkaArrayInstance, ...args: any[]) => any> = {
  concat,
  keys,
  values,
  entries
};

for (const name of methodNames) {
  methods[name] = createPseudoNativeMethod(name);
}

for (const name of changingMethodNames) {
  methods[`${name}_`] = createPseudoNativeMethod(name, true);
}

export default methods;
