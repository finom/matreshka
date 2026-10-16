import defs from '../_core/defs.js';
import triggerOne from '../trigger/_triggerone.js';
import processRendering from './_processrendering/index.js';
import type { ObjectDef } from '../types.js';
import type { ArrayEventOptions, MatreshkaArrayInstance } from './types.js';

// fires events and triggers rendering logic
// `reordered`: recreate got the same items in another order, so their nodes move
export default function reportModified(
  self: MatreshkaArrayInstance,
  eventOptions: ArrayEventOptions,
  reordered = false
): void {
  const { added, removed, silent, method, dontRender } = eventOptions;
  const addedLength = added.length;
  const removedLength = removed.length;
  const modified =
    addedLength || removedLength || reordered || method === 'sort' || method === 'reverse' || method === 'copyWithin';
  const { events } = defs.get(self) as ObjectDef;
  const { renderIfPossible = true } = self;
  const asteriskAddEvtName = '_asterisk:add';
  const asteriskRemoveEvtName = '_asterisk:remove';

  // if something is added and an array has delegated "asterisk" events
  // then attatch delegated event handlers to newly added items
  if (addedLength && events[asteriskAddEvtName]) {
    triggerOne(self, asteriskAddEvtName, eventOptions);
  }

  // if something is removed and an array has delegated "asterisk" events
  // then remove delegated event handlers from removed items
  if (removedLength && events[asteriskRemoveEvtName]) {
    triggerOne(self, asteriskRemoveEvtName, eventOptions);
  }

  if (!silent) {
    // fire additional event name (like "push")
    if (events[method]) {
      triggerOne(self, method, eventOptions);
    }

    // if something is added then fire add and addone events
    if (addedLength) {
      if (events.add) {
        triggerOne(self, 'add', eventOptions);
      }

      if (events.addone) {
        for (let i = 0; i < addedLength; i++) {
          triggerOne(self, 'addone', {
            self,
            addedItem: added[i]
          });
        }
      }
    }

    // if something is removed then fire add and addone events
    if (removedLength) {
      if (events.remove) {
        triggerOne(self, 'remove', eventOptions);
      }

      if (events.removeone) {
        for (let i = 0; i < removedLength; i++) {
          triggerOne(self, 'removeone', {
            self,
            removedItem: removed[i]
          });
        }
      }
    }

    // modify event says that something is added or removed
    if (events.modify) {
      triggerOne(self, 'modify', eventOptions);
    }
  }

  // trigger rendering logic if possible
  if (modified && !dontRender && renderIfPossible) {
    processRendering({
      self,
      eventOptions
    });
  }
}
