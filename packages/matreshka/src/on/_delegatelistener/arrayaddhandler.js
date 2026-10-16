import triggerOne from '../../trigger/_triggerone';
import delegateListener from './index';
import forEach from '../../_helpers/foreach';

// the function is called when something is added to an array
// it delegates asterisk listener for newly added items
export default function arrayAddHandler(
  { added },
  { path, name, callback, context, info } = triggerOne.latestEvent.info.delegatedData
) {
  forEach(added, (item) => {
    if (item && typeof item === 'object') {
      delegateListener(item, path, name, callback, context, info);
    }
  });
}
