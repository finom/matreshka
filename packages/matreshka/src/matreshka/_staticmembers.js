import defaultBinders from '../defaultbinders';
import lookForBinder from '../lookforbinder';
import parserBrackets from '../parserbrackets';
import Class from '../class';
import * as binders from '../binders';
import * as universalMethods from './_universalmethods';
import assign from '../_helpers/assign';
import useDOMLibrary from '../usedomlibrary';
import chain from '../chain';

export default assign(
  {
    Class,
    defaultBinders,
    lookForBinder,
    binders,
    parserBrackets,
    // the old misspelled name, kept as an alias
    parserBrackers: parserBrackets,
    useDOMLibrary,
    chain
  },
  universalMethods
);
