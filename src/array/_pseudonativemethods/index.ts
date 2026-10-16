import createPseudoNativeMethod from './createpseudonativemethod.js';
import concat from './concat.js';
import keys from './keys.js';
import values from './values.js';
import entries from './entries.js';
import type { MatreshkaArrayInstance } from '../types.js';

const splitBySpaceReg = /\s+/;
const methods: Record<string, ((this: MatreshkaArrayInstance, ...args: any[]) => any) | undefined> = {
  concat,
  keys,
  values,
  entries
};

`push pop unshift shift sort reverse splice map filter slice every some reduce reduceRight
forEach join indexOf lastIndexOf copyWithin fill includes find findIndex`
  .split(splitBySpaceReg)
  .forEach((name) => {
    methods[name] = createPseudoNativeMethod(name);
  });

'push pop unshift shift sort reverse splice copyWithin fill'.split(splitBySpaceReg).forEach((name) => {
  methods[`${name}_`] = createPseudoNativeMethod(name, true);
});

export default methods;
