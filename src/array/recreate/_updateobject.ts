import forOwn from '../../_helpers/forown.js';
import type { AnyObject } from '../../types.js';

// updates one single object by new data
// for Matreshka.Array instance call recreate method
// for Matreshka.Object instance call setData method
// for other objects just extend them by properties of data parameter
export default function updateObject(instance: AnyObject, data: any): AnyObject {
  if (instance.isMatreshkaArray) {
    instance.recreate(data);
  } else if (instance.isMatreshkaObject) {
    // QUESTION: Is it OK to just extend but not replace instance data?
    // an instance as data gives its data keys only, not its own `nodes` and `$nodes`
    instance.setData(data?.isMatreshkaObject ? Object.fromEntries(data.entries()) : data);
  } else {
    forOwn(data, (value, key) => {
      instance[key] = value;
    });
  }

  return instance;
}
