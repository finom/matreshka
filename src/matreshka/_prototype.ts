import * as universalMethods from './_universalmethods.js';
import assign from '../_helpers/assign.js';
import _afterInit from './_afterinit.js';
import type { AnyObject } from '../types.js';

// the members Class() puts on the prototype; constructor joins in ./index.js
const instanceMembers: AnyObject = assign(
  {
    _afterInit,
    isMatreshka: true,
    $: universalMethods.selectAll
  },
  universalMethods
);

export default instanceMembers;
