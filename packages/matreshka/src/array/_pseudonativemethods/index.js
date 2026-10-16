import createPseudoNativeMethod from './createpseudonativemethod';
import concat from './concat';
import keys from './keys';
import values from './values';
import entries from './entries';

const splitBySpaceReg = /\s+/;
const methods = {
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
