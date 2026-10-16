import type { AnyObject, EventEntry } from '../types.js';
import defs from '../_core/defs.js';
import removeListener from './_removelistener.js';
import forEach from '../_helpers/foreach.js';
import matchesDelegation, { type Delegation } from '../on/_delegatelistener/_matchesdelegation.js';

// the function removes internally used events such as _asterisk:add which belong to given delegated listener
function detatchDelegatedLogic({
  delegatedEventName,
  allEvents,
  delegation
}: {
  delegatedEventName: string;
  allEvents: Record<string, EventEntry[]>;
  delegation: Delegation;
}): void {
  const retain: EventEntry[] = [];
  const events = allEvents[delegatedEventName];

  forEach(events, (event) => {
    if (!matchesDelegation(event, delegation)) {
      retain.push(event);
    }
  });

  if (retain.length) {
    allEvents[delegatedEventName] = retain;
  } else {
    delete allEvents[delegatedEventName];
  }
}

// removes delegated event listener from an object by given path
export default function undelegateListener(
  object: AnyObject,
  givenPath: string | string[] | null | undefined,
  name: string,
  callback?: EventEntry['callback'] | null,
  context?: any,
  info: Record<string, any> = {}
): void {
  const def = defs.get(object);

  // if no definition do nothing
  if (!def) {
    return;
  }

  const { events: allEvents } = def;

  // an empty string is kept: its length is 0, as for an empty array
  let path = (typeof givenPath === 'string' && givenPath !== '' ? givenPath.split('.') : givenPath) as
    | string[]
    | null
    | undefined;

  if (!path?.length) {
    // if no path then remove listener
    removeListener(object, name, callback, context, info);
  } else {
    // else do all magic
    const key = path[0];
    path = path.slice(1);
    // only the listeners the delegation added are removed at the end of the path
    info = { ...info, delegated: true };
    const delegation: Delegation = { pathStr: path.join('.'), name, callback, context };

    if (key === '*') {
      // remove asterisk events
      if (object.isMatreshkaArray) {
        const delegatedAddEvtName = '_asterisk:add';
        if (allEvents[delegatedAddEvtName]) {
          detatchDelegatedLogic({
            delegatedEventName: delegatedAddEvtName,
            allEvents,
            delegation
          });
        }

        const delegatedRemoveEvtName = '_asterisk:remove';
        if (allEvents[delegatedRemoveEvtName]) {
          detatchDelegatedLogic({
            delegatedEventName: delegatedRemoveEvtName,
            allEvents,
            delegation
          });
        }

        // undelegate asterisk events for existing items
        if (object.length) {
          forEach(object as ArrayLike<any>, (item) => {
            if (item && typeof item === 'object') {
              undelegateListener(item, path, name, callback, context, info);
            }
          });
        }
      } else if (object.isMatreshkaObject) {
        const delegatedSetEvtName = '_asterisk:set';
        if (allEvents[delegatedSetEvtName]) {
          detatchDelegatedLogic({
            delegatedEventName: delegatedSetEvtName,
            allEvents,
            delegation
          });
        }

        const delegatedRemoveEvtName = '_asterisk:remove';
        if (allEvents[delegatedRemoveEvtName]) {
          detatchDelegatedLogic({
            delegatedEventName: delegatedRemoveEvtName,
            allEvents,
            delegation
          });
        }

        object.each((item: any) => {
          if (item && typeof item === 'object') {
            undelegateListener(item, path, name, callback, context, info);
          }
        });
      }
    } else {
      // remove non-asterisk delegated events

      const delegatedChangeEvtName = `_change:delegated:${key}`;
      if (allEvents[delegatedChangeEvtName]) {
        detatchDelegatedLogic({
          delegatedEventName: delegatedChangeEvtName,
          allEvents,
          delegation
        });
      }

      if (object[key] && typeof object[key] === 'object') {
        undelegateListener(object[key], path, name, callback, context, info);
      }
    }
  }
}
