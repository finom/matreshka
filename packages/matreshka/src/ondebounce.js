import on from './on';
import checkObjectType from './_helpers/checkobjecttype';
import debounce from './_helpers/debounce';
import forOwn from './_helpers/forown';

// adds debounced event listener
export default function onDebounce(object, names, givenCallback, givenDelay, triggerOnInit, context) {
  if (typeof this === 'object' && this.isMatreshka) {
    // when context is Matreshka instance, use this as an object and shift other args
    context = triggerOnInit;
    triggerOnInit = givenDelay;
    givenDelay = givenCallback;
    givenCallback = names;
    names = object;
    object = this;
  } else {
    // throw error when object type is wrong
    checkObjectType(object, 'onDebounce');
  }

  const isNamesVarArray = Array.isArray(names);

  // allow to pass name-handler object
  if (names && typeof names === 'object' && !isNamesVarArray) {
    forOwn(names, (namesObjCallback, namesObjName) =>
      onDebounce(object, namesObjName, namesObjCallback, givenCallback, givenDelay, triggerOnInit)
    );

    return object;
  }

  const delay = typeof givenDelay === 'number' ? givenDelay : 0;

  const callback = debounce(givenCallback, delay);

  // allow to remove event listener py passing original callback to "off"
  callback._callback = givenCallback;

  return on(object, names, callback, triggerOnInit, context);
}
