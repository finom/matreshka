import addListener from '../_addlistener';
import defs from '../../_core/defs';
import arrayAddHandler from './arrayaddhandler';
import objectSetHandler from './objectsethandler';
import arrayRemoveHandler from './arrayremovehandler';
import objectRemoveHandler from './objectremovehandler';
import changeHandler from './changehandler';
import matchesDelegation from './_matchesdelegation';
import forOwn from '../../_helpers/forown';

// adds delegated event listener to an object by given path
export default function delegateListener(object, givenPath, name, callback, context, info = {}) {
  // if typeof path is string and path is not empty string then split it
  let path = typeof givenPath === 'string' && givenPath !== '' ? givenPath.split('.') : givenPath;

  if (!path?.length) {
    // if no path then add simple listener
    addListener(object, name, callback, context, info);
  } else {
    // else do all magic
    const key = path[0];
    path = path.slice(1);
    // needed for undelegation
    const pathStr = path.join('.');

    const delegatedData = {
      path,
      name,
      callback,
      context,
      info,
      object
    };

    // internal events are added with { skipChecks: true }, so the same handler can serve many listeners;
    // a listener which is already delegated is skipped here
    const isDelegated = (eventName) => {
      const events = defs.get(object)?.events[eventName];
      return !!events?.some((event) => matchesDelegation(event, { pathStr, ...delegatedData }, true));
    };

    if (key === '*') {
      // handling asterisk events
      if (object.isMatreshkaArray) {
        if (isDelegated('_asterisk:add')) {
          return;
        }

        // the event is triggered when something is added to an array
        addListener(object, '_asterisk:add', arrayAddHandler, null, {
          delegatedData,
          pathStr,
          skipChecks: true
        });

        // the event is triggered when something is removed from an array
        addListener(object, '_asterisk:remove', arrayRemoveHandler, null, {
          delegatedData,
          pathStr,
          skipChecks: true
        });

        // call handler manually to delegate listener for currently existing data props
        arrayAddHandler(
          {
            added: object
          },
          delegatedData
        );
      } else if (object.isMatreshkaObject) {
        if (isDelegated('_asterisk:set')) {
          return;
        }

        const def = defs.get(object);

        // the event is triggered when data prop is changed
        addListener(object, '_asterisk:set', objectSetHandler, null, {
          delegatedData,
          pathStr,
          skipChecks: true
        });

        // the event is triggered when data prop is removed
        addListener(object, '_asterisk:remove', objectRemoveHandler, null, {
          delegatedData,
          pathStr,
          skipChecks: true
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
        skipChecks: true
      });

      // call handler manually
      changeHandler(
        {
          value: object[key]
        },
        delegatedData
      );
    }
  }
}
