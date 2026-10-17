import syncFields from '../_syncfields.js';
import pureOrderBy from './_pureorderby.js';
import reportModified from '../_reportmodified.js';
import type { ArrayMethodOptions, MatreshkaArrayInstance } from '../types.js';
import assign from '../../_helpers/assign.js';

// sorts by properties of items
export default function orderBy(
  this: MatreshkaArrayInstance,
  keys?: string | string[] | null,
  orders?: string | string[] | null,
  eventOptions: ArrayMethodOptions = {}
): MatreshkaArrayInstance {
  syncFields(this);
  if (this.length > 1) {
    // the same items in another order, written in place with no events of their own
    const ordered = pureOrderBy(this, keys, orders);
    for (let i = 0; i < ordered.length; i++) {
      this[i] = ordered[i];
    }

    reportModified(
      this,
      assign(
        {
          method: 'sort', // makes possible to listen "sort" event
          self: this,
          added: [],
          removed: []
        },
        eventOptions
      )
    );
  }

  return this;
}
