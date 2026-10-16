import assign from '../_helpers/assign';
import _afterInit from './_afterinit';
import mediateItem from './mediateitem';
import orderBy from './orderby';
import pull from './pull';
import recreate from './recreate';
import rerender from './rerender';
import restore from './restore';
import toJSON from './tojson';
import pseudoNativeMethods from './_pseudonativemethods';
import iterator from './iterator';

export default assign(
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
    isMatreshkaArray: true,
    [Symbol.iterator]: iterator
  },
  pseudoNativeMethods
);
