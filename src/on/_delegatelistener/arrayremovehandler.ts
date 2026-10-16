import type { DelegatedData } from '../types.js';
import undelegateListener from '../../off/_undelegatelistener.js';
import triggerOne from '../../trigger/_triggerone.js';
import forEach from '../../_helpers/foreach.js';

// the function is called when something is removed from an array
// it undelegates asterisk listener from removed items unless the array still holds them
export default function arrayRemoveHandler(
  { removed }: { removed?: ArrayLike<any> },
  { path, name, callback, context, info, object }: DelegatedData = triggerOne.latestEvent.info.delegatedData
): void {
  if (removed?.length) {
    forEach(removed, (item) => {
      if (item && typeof item === 'object' && !Array.prototype.includes.call(object, item)) {
        undelegateListener(item, path, name, callback, context, info);
      }
    });
  }
}
