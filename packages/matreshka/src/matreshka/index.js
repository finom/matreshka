import Class from '../class';
import staticMembers from './_staticmembers';
import instanceMembers from './_prototype';
import initMK from '../_core/init';
import matreshkaError from '../_helpers/matreshkaerror';

instanceMembers.constructor = function Matreshka() {
  if (!(this instanceof Matreshka)) {
    throw matreshkaError('common:call_class');
  }

  initMK(this);
};

const Matreshka = Class(instanceMembers, staticMembers);

export default Matreshka;
