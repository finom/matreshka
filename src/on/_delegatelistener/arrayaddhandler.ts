import type { DelegatedData } from '../types.js';
import triggerOne from '../../trigger/_triggerone.js';
import delegateListener from './index.js';
import forEach from '../../_helpers/foreach.js';

// the function is called when something is added to an array
// it delegates asterisk listener for newly added items
export default function arrayAddHandler(
  { added }: { added: ArrayLike<any> },
  { path, name, callback, context, info }: DelegatedData = triggerOne.latestEvent.info.delegatedData
): void {
  forEach(added, (item) => {
    if (item && typeof item === 'object') {
      delegateListener(item, path, name, callback, context, info);
    }
  });
}
