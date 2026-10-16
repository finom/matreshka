import splitBySpaceReg from './_splitbyspaceregexp';
import checkObjectType from '../_helpers/checkobjecttype';
import matreshkaError from '../_helpers/matreshkaerror';
import forOwn from '../_helpers/forown';
import forEach from '../_helpers/foreach';
import addListener from './_addlistener';
import delegateListener from './_delegatelistener';

// adds event listener
export default function on(object, givenNames, callback, triggerOnInit, context) {
  if (typeof this === 'object' && this.isMatreshka) {
    // when context is Matreshka instance, use this as an object and shift other args
    context = triggerOnInit;
    triggerOnInit = callback;
    callback = givenNames;
    givenNames = object;
    object = this;
  } else {
    // throw error when object type is wrong
    checkObjectType(object, 'on');
  }

  const isNamesVarArray = Array.isArray(givenNames);

  // allow to pass name-handler object
  if (givenNames && typeof givenNames === 'object' && !isNamesVarArray) {
    forOwn(givenNames, (namesObjCallback, namesObjName) =>
      on(object, namesObjName, namesObjCallback, callback, triggerOnInit)
    );
    return object;
  }

  if (typeof givenNames !== 'string' && !isNamesVarArray) {
    throw matreshkaError('on:names_type', { names: givenNames });
  }

  // split by spaces
  // TODO: Array of names passed to on method is non-documented feature
  const names = isNamesVarArray ? givenNames : givenNames.split(splitBySpaceReg);

  // flip triggerOnInit and context when triggerOnInit is not boolean
  if (typeof triggerOnInit !== 'boolean' && typeof triggerOnInit !== 'undefined') {
    [context, triggerOnInit] = [triggerOnInit, context];
  }

  forEach(names, (name) => {
    // "user" tells off() with no args which listeners to remove (it keeps the framework's own)
    const info = { user: true };
    const delegatedEventParts = name.split('@');

    if (delegatedEventParts.length > 1) {
      // if @ exists in event name then this is delegated event
      const [path, delegatedName] = delegatedEventParts;
      delegateListener(object, path, delegatedName, callback, context || object, info);
    } else {
      // if not, this is simple event
      addListener(object, name, callback, context, info);
    }
  });

  // call callback immediatelly if triggerOnInit is true
  if (triggerOnInit === true) {
    callback.call(context || object, { triggerOnInit });
  }

  return object;
}
