import Class from '../class';
import Matreshka from '../matreshka';
import instanceMembers from './_prototype';
import matreshkaError from '../_helpers/matreshkaerror';
import initMK from '../_core/init';
import staticMembers from './_staticmembers';

instanceMembers.extends = Matreshka;

instanceMembers.constructor = function MatreshkaArray(length) {
  if (!(this instanceof MatreshkaArray)) {
    throw matreshkaError('common:call_class');
  }

  initMK(this);

  // repeat the same logic as for native Array
  if (arguments.length === 1 && typeof length === 'number') {
    if (!Number.isInteger(length) || length < 0 || length > 2 ** 32 - 1) {
      throw new RangeError('Invalid array length');
    }

    this.length = length;
  } else if (arguments.length) {
    this.recreate(arguments, {
      silent: true,
      dontRender: true
    });
  }

  // return is used to make possible to chain super() calls
  return this;
};

const MatreshkaArray = Class(instanceMembers, staticMembers);

export default MatreshkaArray;
