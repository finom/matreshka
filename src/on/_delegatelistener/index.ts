import type { AnyObject, EventHandler, ObjectDef } from '../../types.js';
import type { DelegatedData } from '../types.js';
import addListener from '../_addlistener.js';
import defs from '../../_core/defs.js';
import arrayAddHandler from './arrayaddhandler.js';
import objectSetHandler from './objectsethandler.js';
import arrayRemoveHandler from './arrayremovehandler.js';
import objectRemoveHandler from './objectremovehandler.js';
import changeHandler from './changehandler.js';
import matchesDelegation from './_matchesdelegation.js';
import forOwn from '../../_helpers/forown.js';
import { addOwner, type Owner } from '../_owners.js';
import getProp from '../../_helpers/getprop.js';

// adds delegated event listener to an object by given path
export default function delegateListener(
  object: AnyObject,
  givenPath: string | string[] | null | undefined,
  name: string,
  callback: EventHandler,
  context?: any,
  info: Record<string, any> = {}
): void {
  // if typeof path is string and path is not empty string then split it
  // an empty string is kept: its length is 0, as for an empty array
  let path = (typeof givenPath === 'string' && givenPath !== '' ? givenPath.split('.') : givenPath) as
    | string[]
    | null
    | undefined;

  if (!path?.length) {
    // if no path then add simple listener
    addListener(object, name, callback, context, info);
  } else {
    // else do all magic
    const key = path[0];
    // who delegates through this object: the user (null) or a delegation from a parent
    const hopOwner: Owner = info.owner ?? null;
    // what the next object along the path is kept by: this delegation
    info = { ...info, owner: { object, path: path.join('.') } };
    path = path.slice(1);
    // needed for undelegation
    const pathStr = path.join('.');

    const delegatedData: DelegatedData = {
      path,
      name,
      callback,
      context,
      info,
      object
    };

    // internal events are added with { skipChecks: true }, so the same handler can serve many listeners;
    // a listener which is already delegated gets one more owner here
    const isDelegated = (...eventNames: string[]) => {
      let found = false;
      for (const eventName of eventNames) {
        for (const event of defs.get(object)?.events[eventName] ?? []) {
          if (matchesDelegation(event, { pathStr, ...delegatedData }, true)) {
            addOwner(event, hopOwner);
            found = true;
          }
        }
      }
      return found;
    };
    const owners = [hopOwner];

    if (key === '*') {
      // handling asterisk events
      if (object.isMatreshkaArray) {
        if (isDelegated('_asterisk:add', '_asterisk:remove')) {
          return;
        }

        // the event is triggered when something is added to an array
        addListener(object, '_asterisk:add', arrayAddHandler, null, {
          delegatedData,
          pathStr,
          skipChecks: true,
          owners
        });

        // the event is triggered when something is removed from an array
        addListener(object, '_asterisk:remove', arrayRemoveHandler, null, {
          delegatedData,
          pathStr,
          skipChecks: true,
          owners
        });

        // call handler manually to delegate listener for currently existing data props
        arrayAddHandler(
          {
            // a Matreshka.Array is array-like
            added: object as ArrayLike<any>
          },
          delegatedData
        );
      } else if (object.isMatreshkaObject) {
        if (isDelegated('_asterisk:set', '_asterisk:remove')) {
          return;
        }

        // a Matreshka.Object always has a definition with data keys
        const def = defs.get(object) as ObjectDef;

        // the event is triggered when data prop is changed
        addListener(object, '_asterisk:set', objectSetHandler, null, {
          delegatedData,
          pathStr,
          skipChecks: true,
          owners
        });

        // the event is triggered when data prop is removed
        addListener(object, '_asterisk:remove', objectRemoveHandler, null, {
          delegatedData,
          pathStr,
          skipChecks: true,
          owners
        });

        // delegate listener for currently existing data props
        forOwn(def.keys, (_, defKey) => {
          const item = object[defKey];
          if (item && typeof item === 'object') {
            delegateListener(item, path, name, callback, context, info);
          }
        });
      }
    } else {
      // handling non-asterisk delegated event
      const delegatedEventName = `_change:delegated:${key}`;

      if (isDelegated(delegatedEventName)) {
        return;
      }

      // the event is triggered by "set"
      addListener(object, delegatedEventName, changeHandler, null, {
        delegatedData,
        pathStr,
        skipChecks: true,
        owners
      });

      // call handler manually
      changeHandler(
        {
          value: getProp(object, key)
        },
        delegatedData
      );
    }
  }
}
