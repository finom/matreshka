import type { DelegatedData } from '../types.js';
import undelegateListener from '../../off/_undelegatelistener.js';
import delegateListener from './index.js';
import triggerOne from '../../trigger/_triggerone.js';

// the function is called when some part of a path is changed
// it delegates event listener for new branch of an object and undelegates it for old one
// used for non-asterisk events
export default function changeHandler(
  { previousValue, value }: { previousValue?: any; value?: any },
  { path, name, callback, context, info }: DelegatedData = triggerOne.latestEvent.info.delegatedData
): void {
  if (value && typeof value === 'object') {
    delegateListener(value, path, name, callback, context, info);
  }

  if (previousValue && typeof previousValue === 'object') {
    undelegateListener(previousValue, path, name, callback, context, info);
  }
}
