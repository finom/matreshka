import type { DelegatedData } from '../types.js';
import triggerOne from '../../trigger/_triggerone.js';
import delegateListener from './index.js';
import undelegateListener from '../../off/_undelegatelistener.js';
import isHeldByDataKey from './_isheldbydatakey.js';
import getProp from '../../_helpers/getprop.js';

// the function is called when a data property of a Matreshka.Object is set (the key is a data key by then)
// it delegates asterisk listener for new value and undelegates it from the previous one
export default function objectSetHandler(
  { key, previousValue }: { key: string; previousValue?: any },
  { path, name, callback, context, info, object }: DelegatedData = triggerOne.latestEvent.info.delegatedData
): void {
  const item = getProp(object, key);

  // delegation is deduplicated, so a value still held by another data key keeps its listener
  if (previousValue && typeof previousValue === 'object' && !isHeldByDataKey(object, previousValue)) {
    undelegateListener(previousValue, path, name, callback, context, info);
  }

  if (item && typeof item === 'object') {
    delegateListener(item, path, name, callback, context, info);
  }
}
