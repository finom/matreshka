import undelegateListener from '../../off/_undelegatelistener';
import delegateListener from './index';
import triggerOne from '../../trigger/_triggerone';

// the function is called when some part of a path is changed
// it delegates event listener for new branch of an object and undelegates it for old one
// used for non-asterisk events
export default function changeHandler(
  { previousValue, value },
  { path, name, callback, context, info } = triggerOne.latestEvent.info.delegatedData
) {
  if (value && typeof value === 'object') {
    delegateListener(value, path, name, callback, context, info);
  }

  if (previousValue && typeof previousValue === 'object') {
    undelegateListener(previousValue, path, name, callback, context, info);
  }
}
