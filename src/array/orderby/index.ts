import syncFields from '../_syncfields.js';
import cheapRecreate from '../_cheaprecreate.js';
import pureOrderBy from './_pureorderby.js';
import reportModified from '../_reportmodified.js';
import type { ArrayMethodOptions, MatreshkaArrayInstance } from '../types.js';

// sorts by properties of items
export default function orderBy(
  this: MatreshkaArrayInstance,
  keys?: string | string[] | null,
  orders?: string | string[] | null,
  eventOptions: ArrayMethodOptions = {}
): MatreshkaArrayInstance {
  syncFields(this);
  if (this.length > 1) {
    cheapRecreate(this, pureOrderBy(this, keys, orders));

    reportModified(this, {
      method: 'sort', // makes possible to listen "sort" event
      self: this,
      added: [],
      removed: [],
      ...eventOptions
    });
  }

  return this;
}
