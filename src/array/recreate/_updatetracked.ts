import updateObject from './_updateobject.js';
import type { MatreshkaArrayInstance } from '../types.js';

// the function gets called to update new items passed to recreate method when trackBy is present
// TODO: Throw an error when two or more items of one array has the same value of trackBy
export default function updateTracked({
  givenNewItems,
  arr,
  trackBy
}: {
  givenNewItems: ArrayLike<any>;
  arr: MatreshkaArrayInstance;
  trackBy: string;
}): any[] {
  const newLength = givenNewItems.length;
  const oldLength = arr.length;
  const newItems: any[] = Array(newLength);

  if (trackBy === '$index') {
    // simply update items with the same index
    for (let i = 0; i < newLength; i++) {
      const item = arr[i];
      const newItem = givenNewItems[i];

      if (item && typeof item === 'object' && newItem && typeof newItem === 'object') {
        newItems[i] = updateObject(item, newItem);
      } else {
        newItems[i] = newItem;
      }
    }
  } else {
    // a Map, so an id named `constructor` or `__proto__` is an id like any other; ids compare as strings, as keys did
    const trackMap = new Map<string, any>();

    // fill trackMap object where keys are values of trackBy and values are corresponding items
    for (let i = 0; i < oldLength; i++) {
      const item = arr[i];

      if (item && typeof item === 'object') {
        if (trackBy in item) {
          trackMap.set(String(item[trackBy]), item);
        }
      }
    }

    for (let i = 0; i < newLength; i++) {
      const newItem = givenNewItems[i];

      if (newItem && typeof newItem === 'object') {
        const tracked = trackMap.get(String(newItem[trackBy]));
        if (tracked) {
          // if an item exists at trackMap then update it
          newItems[i] = updateObject(tracked, newItem);
        } else {
          // if not then use new value as is
          newItems[i] = newItem;
        }
      } else {
        // newItem is not an object
        newItems[i] = newItem;
      }
    }
  }

  return newItems;
}
