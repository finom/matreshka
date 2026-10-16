import syncFields from '../_syncfields';
import cheapRecreate from '../_cheaprecreate';
import pureOrderBy from './_pureorderby';
import reportModified from '../_reportmodified';

// sorts by properties of items
export default function orderBy(keys, orders, eventOptions = {}) {
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
