import type { ObjectDef } from '../../types.js';
import type { DelegatedData } from '../types.js';
import triggerOne from '../../trigger/_triggerone.js';
import delegateListener from './index.js';
import undelegateListener from '../../off/_undelegatelistener.js';
import defs from '../../_core/defs.js';
import isHeldByDataKey from './_isheldbydatakey.js';

// the function is called when data property is changed in Matreshka.Object
// it delegates asterisk listener for new value and undelegates it from the previous one
export default function objectSetHandler(
  { key, previousValue }: { key?: string; previousValue?: any },
  { path, name, callback, context, info, object }: DelegatedData = triggerOne.latestEvent.info.delegatedData
): void {
  if (key) {
    const item = object[key];

    // delegation is deduplicated, so a value still held by another data key keeps its listener
    if (previousValue && typeof previousValue === 'object' && !isHeldByDataKey(object, previousValue)) {
      undelegateListener(previousValue, path, name, callback, context, info);
    }

    if (item && typeof item === 'object') {
      // a Matreshka.Object always has a definition with data keys
      const def = defs.get(object) as ObjectDef;
      if (key in def.keys) {
        delegateListener(item, path, name, callback, context, info);
      }
    }
  }
}
