import Matreshka from './matreshka';
import MatreshkaArray from './array';
import MatreshkaObject from './object';
// toMatreshka imports both classes, which extend Matreshka, so it joins here rather than in the class's static members
import toMatreshka from './tomatreshka';

Matreshka.Object = MatreshkaObject;
Matreshka.Array = MatreshkaArray;
Matreshka.toMatreshka = toMatreshka;

export default Matreshka;
