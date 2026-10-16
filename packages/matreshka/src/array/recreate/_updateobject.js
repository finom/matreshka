import forOwn from '../../_helpers/forown';

// updates one single object by new data
// for Matreshka.Array instance call recreate method
// for Matreshka.Object instance call setData method
// for other objects just extend them by properties of data parameter
export default function updateObject(instance, data) {
  if (instance.isMatreshkaArray) {
    instance.recreate(data);
  } else if (instance.isMatreshkaObject) {
    // QUESTION: Is it OK to just extend but not replace instance data?
    instance.setData(data);
  } else {
    forOwn(data, (value, key) => {
      instance[key] = value;
    });
  }

  return instance;
}
