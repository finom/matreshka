import forEach from './_helpers/foreach.js';
import forOwn from './_helpers/forown.js';
import MatreshkaObject from './object/index.js';
import MatreshkaArray from './array/index.js';
import type { AnyObject } from './types.js';

// recursively converts objects and arrays to Matreshka.Object and Matreshka.Array instances
export default function toMatreshka(data: readonly any[] | MatreshkaArray): MatreshkaArray;
export default function toMatreshka(data: object): MatreshkaObject;
export default function toMatreshka<T>(data: T): T;
export default function toMatreshka(data: any): any {
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
    const object: AnyObject = {};

    // of a Matreshka.Object take only data keys
    forOwn(data.isMatreshkaObject ? data.toJSON(false) : data, (value, key) => {
      object[key] = toMatreshka(value);
    });

    return new MatreshkaObject(object);
  }

  // for all non-objects just return passed data
  return data;
}
