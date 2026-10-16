import on from './on';
import checkObjectType from './_helpers/checkobjecttype';
import forOwn from './_helpers/forown';
import off from './off';
import apply from './_helpers/apply';

// adds event listener which will be removed immediately after its first call
export default function once(object, names, givenCallback, context) {
  if (typeof this === 'object' && this.isMatreshka) {
    // when context is Matreshka instance, use this as an object and shift other args
    context = givenCallback;
    givenCallback = names;
    names = object;
    object = this;
  } else {
    // throw error when object type is wrong
    checkObjectType(object, 'once');
  }

  const isNamesVarArray = Array.isArray(names);

  // allow to pass name-handler object
  if (names && typeof names === 'object' && !isNamesVarArray) {
    forOwn(names, (namesObjCallback, namesObjName) => once(object, namesObjName, namesObjCallback, givenCallback));
    return object;
  }

  const callback = function onceCallback() {
    // remove event listener before its call, so the handler can fire its own event again
    off(object, names, onceCallback, context);
    apply(givenCallback, this, arguments);
  };

  // allow to remove event listener py passing original callback to "off"
  callback._callback = givenCallback;

  return on(object, names, callback, context);
}
