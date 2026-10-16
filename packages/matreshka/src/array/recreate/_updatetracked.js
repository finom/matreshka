import updateObject from './_updateobject';

// the function gets called to update new items passed to recreate method when trackBy is present
// TODO: Throw an error when two or more items of one array has the same value of trackBy
export default function updateTracked({ givenNewItems, arr, trackBy }) {
  const newLength = givenNewItems.length;
  const oldLength = arr.length;
  const newItems = Array(newLength);

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
    const trackMap = {};

    // fill trackMap object where keys are values of trackBy and values are corresponding items
    for (let i = 0; i < oldLength; i++) {
      const item = arr[i];

      if (item && typeof item === 'object') {
        if (trackBy in item) {
          trackMap[item[trackBy]] = item;
        }
      }
    }

    for (let i = 0; i < newLength; i++) {
      const newItem = givenNewItems[i];

      if (newItem && typeof newItem === 'object') {
        if (newItem[trackBy] in trackMap) {
          // if an item exists at trackMap then update it
          newItems[i] = updateObject(trackMap[newItem[trackBy]], newItem);
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
