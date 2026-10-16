import forEach from './_helpers/foreach';
import forOwn from './_helpers/forown';
import MatreshkaObject from './object';
import MatreshkaArray from './array';

// recursively converts objects and arrays to Matreshka.Object and Matreshka.Array instances
export default function toMatreshka(data) {
  // convert only objects
  if (data && typeof data === 'object') {
    if (Array.isArray(data) || data.isMatreshkaArray) {
      // arrays become Matreshka.Array instances
      const arrayItems = Array(data.length);

      forEach(data, (item, index) => {
        arrayItems[index] = toMatreshka(item);
      });

      return new MatreshkaArray().recreate(arrayItems);
    }

    // other objects become Matreshka.Object instances
    const object = {};

    // of a Matreshka.Object take only data keys
    forOwn(data.isMatreshkaObject ? data.toJSON(false) : data, (value, key) => {
      object[key] = toMatreshka(value);
    });

    return new MatreshkaObject(object);
  }

  // for all non-objects just return passed data
  return data;
}
