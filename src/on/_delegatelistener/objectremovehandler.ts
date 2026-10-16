import type { DelegatedData } from '../types.js';
import undelegateListener from '../../off/_undelegatelistener.js';
import triggerOne from '../../trigger/_triggerone.js';
import isHeldByDataKey from './_isheldbydatakey.js';

// the function is called when data property is removed from Matreshka.Object
// it undelegates asterisk listener from removed object unless another data key still holds it
export default function objectRemoveHandler(
  { key, value: item }: { key: string; value?: any },
  { path, name, callback, context, info, object }: DelegatedData = triggerOne.latestEvent.info.delegatedData
): void {
  if (item && typeof item === 'object' && !isHeldByDataKey(object, item, key)) {
    undelegateListener(item, path, name, callback, context, info);
  }
}
