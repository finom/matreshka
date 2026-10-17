import assign from '../_helpers/assign.js';
import _afterInit from './_afterinit.js';
import mediateItem from './mediateitem.js';
import orderBy from './orderby/index.js';
import pull from './pull.js';
import recreate from './recreate/index.js';
import rerender from './rerender.js';
import restore from './restore.js';
import toJSON from './tojson.js';
import pseudoNativeMethods from './_pseudonativemethods/index.js';
import iterator from './iterator.js';
import type { AnyObject } from '../types.js';
import addSymbolMembers from '../_helpers/addsymbolmembers.js';

// the instance members Class builds Matreshka.Array from; index.ts adds extends and constructor
const instanceMembers: AnyObject = assign(
  {
    _afterInit,
    mediateItem,
    orderBy,
    pull,
    recreate,
    rerender,
    restore,
    toJSON,
    length: 0,
    isMatreshkaArray: true
  },
  pseudoNativeMethods
);

addSymbolMembers(instanceMembers, iterator, true);

export default instanceMembers;
