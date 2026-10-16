import triggerOne from '../../trigger/_triggerone';
import delegateListener from './index';
import undelegateListener from '../../off/_undelegatelistener';
import defs from '../../_core/defs';
import isHeldByDataKey from './_isheldbydatakey';

// the function is called when data property is changed in Matreshka.Object
// it delegates asterisk listener for new value and undelegates it from the previous one
export default function objectSetHandler(
  { key, previousValue },
  { path, name, callback, context, info, object } = triggerOne.latestEvent.info.delegatedData
) {
  if (key) {
    const item = object[key];

    // delegation is deduplicated, so a value still held by another data key keeps its listener
    if (previousValue && typeof previousValue === 'object' && !isHeldByDataKey(object, previousValue)) {
      undelegateListener(previousValue, path, name, callback, context, info);
    }

    if (item && typeof item === 'object') {
      const def = defs.get(object);
      if (key in def.keys) {
        delegateListener(item, path, name, callback, context, info);
      }
    }
  }
}
