import Class from '../class';
import Matreshka from '../matreshka';
import instanceMembers from './_prototype';
import matreshkaError from '../_helpers/matreshkaerror';
import initMK from '../_core/init';

instanceMembers.extends = Matreshka;

instanceMembers.constructor = function MatreshkaObject(data) {
  if (!(this instanceof MatreshkaObject)) {
    throw matreshkaError('common:call_class');
  }

  initMK(this);

  // return is used to make possible to chain super() calls
  return typeof data !== 'undefined' ? this.setData(data) : this;
};

const MatreshkaObject = Class(instanceMembers);

export default MatreshkaObject;
