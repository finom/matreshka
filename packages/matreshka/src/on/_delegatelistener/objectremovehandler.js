import undelegateListener from '../../off/_undelegatelistener';
import triggerOne from '../../trigger/_triggerone';
import isHeldByDataKey from './_isheldbydatakey';

// the function is called when data property is removed from Matreshka.Object
// it undelegates asterisk listener from removed object unless another data key still holds it
export default function objectRemoveHandler(
  { key, value: item },
  { path, name, callback, context, info, object } = triggerOne.latestEvent.info.delegatedData
) {
  if (item && typeof item === 'object' && !isHeldByDataKey(object, item, key)) {
    undelegateListener(item, path, name, callback, context, info);
  }
}
