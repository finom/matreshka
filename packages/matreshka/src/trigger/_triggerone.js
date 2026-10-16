import defs from '../_core/defs';
import apply from '../_helpers/apply';

// triggers one event
export default function triggerOne(object, name, triggerArgs) {
  const def = defs.get(object);
  const events = def?.events[name];

  if (events) {
    const l = events.length;
    let i = 0;

    // allow to pass both array of args and single arg as triggerArgs
    if (Array.isArray(triggerArgs)) {
      while (i < l) {
        const event = events[i];
        triggerOne.latestEvent = event;
        const { callback, ctx } = event;
        apply(callback, ctx, triggerArgs);
        i += 1;
      }
    } else {
      while (i < l) {
        const event = events[i];
        triggerOne.latestEvent = event;
        const { callback, ctx } = event;
        callback.call(ctx, triggerArgs);
        i += 1;
      }
    }
  }
}

// latestEvent is used as required hack in somemethods
triggerOne.latestEvent = {
  info: {},
  name: null
};
