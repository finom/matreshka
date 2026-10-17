import type { AnyObject, EventEntry } from '../types.js';
import type { DelegatedData } from '../on/types.js';
import defs from '../_core/defs.js';
import removeListener from './_removelistener.js';
import forEach from '../_helpers/foreach.js';
import matchesDelegation, { type Delegation } from '../on/_delegatelistener/_matchesdelegation.js';
import { dropOwner, hasOwner, type Owner } from '../on/_owners.js';
import getProp from '../_helpers/getprop.js';

// drops the owner from internal events such as _asterisk:add of given delegated listener;
// returns the delegations nobody keeps any more
function detatchDelegatedLogic({
  delegatedEventName,
  allEvents,
  delegation,
  owner,
  exact
}: {
  delegatedEventName: string;
  allEvents: Record<string, EventEntry[]>;
  delegation: Delegation;
  owner: Owner;
  exact: boolean;
}): DelegatedData[] {
  const retain: EventEntry[] = [];
  const removed: DelegatedData[] = [];
  const events = allEvents[delegatedEventName];

  if (!events) {
    return removed;
  }

  forEach(events, (event) => {
    if (!matchesDelegation(event, delegation, exact) || !hasOwner(event, owner) || !dropOwner(event, owner)) {
      retain.push(event);
    } else {
      removed.push(event.info.delegatedData);
    }
  });

  if (retain.length) {
    allEvents[delegatedEventName] = retain;
  } else {
    delete allEvents[delegatedEventName];
  }

  return removed;
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
    return;
  }

  // else do all magic
  const key = path[0];
  // the delegation removed here: the user's (null) or a parent's; a parent's removal names its own listener exactly
  const owner: Owner = info.owner ?? null;
  const exact = !!owner;
  // the owner the next objects along the path know this delegation by
  info = { ...info, owner: { object, path: path.join('.') } };
  path = path.slice(1);
  const delegation: Delegation = { pathStr: path.join('.'), name, callback, context };
  const detach = (...delegatedEventNames: string[]) => {
    const removed = new Set<DelegatedData>();
    forEach(delegatedEventNames, (delegatedEventName) =>
      forEach(detatchDelegatedLogic({ delegatedEventName, allEvents, delegation, owner, exact }), (data) =>
        removed.add(data)
      )
    );
    return [...removed];
  };
  // the next objects lose the listener only through a delegation nobody keeps
  const undelegateFrom = (removed: DelegatedData[], target: any) => {
    if (target && typeof target === 'object') {
      forEach(removed, (data) => undelegateListener(target, path, name, data.callback, data.context, info));
    }
  };

  if (key === '*') {
    // remove asterisk events
    if (object.isMatreshkaArray) {
      const removed = detach('_asterisk:add', '_asterisk:remove');
      // undelegate asterisk events for existing items
      if (removed.length) {
        forEach(object as ArrayLike<any>, (item) => undelegateFrom(removed, item));
      }
    } else if (object.isMatreshkaObject) {
      const removed = detach('_asterisk:set', '_asterisk:remove');
      if (removed.length) {
        object.each((item: any) => undelegateFrom(removed, item));
      }
    }
  } else {
    // remove non-asterisk delegated events
    undelegateFrom(detach(`_change:delegated:${key}`), getProp(object, key));
  }
}
