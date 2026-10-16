import defaultBinders from '../defaultbinders.js';
import lookForBinder from '../lookforbinder.js';
import parserBrackets from '../parserbrackets.js';
import Class from '../class.js';
import binders from '../binders/index.js';
import * as universalMethods from './_universalmethods.js';
import assign from '../_helpers/assign.js';
import chain from '../chain.js';

export default assign(
  {
    Class,
    defaultBinders,
    lookForBinder,
    binders,
    parserBrackets,
    chain
  },
  universalMethods
);
