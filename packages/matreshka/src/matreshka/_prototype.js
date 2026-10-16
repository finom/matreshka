import * as universalMethods from './_universalmethods';
import assign from '../_helpers/assign';
import _afterInit from './_afterinit';

export default assign(
  {
    _afterInit,
    isMatreshka: true,
    $: universalMethods.selectAll
  },
  universalMethods
);
