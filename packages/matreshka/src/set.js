import defs from './_core/defs';
import triggerOne from './trigger/_triggerone';
import checkObjectType from './_helpers/checkobjecttype';
import is from './_helpers/is';
import forOwn from './_helpers/forown';

// the function sets new value for a property
// since its performance is very critical we're checking events existence manually
export default function set(object, key, value, eventOptions) {
  if (typeof this === 'object' && this.isMatreshka) {
    // when context is Matreshka instance, use this as an object and shift other args
    eventOptions = value;
    value = key;
    key = object;
    object = this;
  } else {
    // throw error when object type is wrong
    checkObjectType(object, 'set');
  }

  // if no key or falsy key is given
  if (!key) {
    return object;
  }

  // allow to use key-value object as another method variation
  if (typeof key === 'object') {
    forOwn(key, (objVal, objKey) => set(object, objKey, objVal, value));
    return object;
  }

  eventOptions = eventOptions || {};
  const def = defs.get(object);

  // if no object definition then make simple assignment
  if (!def) {
    object[key] = value;
    return object;
  }

  const { props, events } = def;
  const propDef = props[key];

  // if no property definition then make simple assignment
  if (!propDef) {
    object[key] = value;
    return object;
  }

  const { value: previousValue, mediator } = propDef;

  // possible flags, all of them are falsy by default
  const { skipMediator, fromMediator, force, forceHTML, silent, silentHTML, skipCalc } = eventOptions;

  let newValue;

  if (mediator && !is(value, previousValue) && !skipMediator && !fromMediator) {
    newValue = mediator(value);
  } else {
    newValue = value;
  }

  const isChanged = !is(newValue, previousValue);

  // add to eventOptions object some useful properties
  // we override default eventOptions because some of the properties need to have actual values,
  // not inherited ones (eg when calc is used)
  const extendedEventOptions = {
    ...eventOptions,
    value: newValue,
    self: object,
    previousValue,
    key,
    isChanged
  };

  const triggerChange = (isChanged || force) && !silent;

  // trigger beforechange:KEY and beforechange events
  if (triggerChange) {
    const beforechangeStr = 'beforechange';
    const beforechangeEventName = `${beforechangeStr}:${key}`;

    if (events[beforechangeEventName]) {
      triggerOne(object, beforechangeEventName, extendedEventOptions);
    }

    if (events[beforechangeStr]) {
      triggerOne(object, beforechangeStr, extendedEventOptions);
    }
  }

  propDef.value = newValue;

  // triger bindings
  if (!silentHTML && (isChanged || forceHTML)) {
    const changeBindingsEventName = `_change:bindings:${key}`;
    if (events[changeBindingsEventName]) {
      triggerOne(object, changeBindingsEventName, extendedEventOptions);
    }
  }

  // trigger change:KEY and change events
  if (triggerChange) {
    const changeStr = 'change';
    const changeEventName = `${changeStr}:${key}`;
    if (events[changeEventName]) {
      triggerOne(object, changeEventName, extendedEventOptions);
    }

    // internal twin of "change" (used by Matreshka.Object), which off() cannot remove
    if (events._change) {
      triggerOne(object, '_change', extendedEventOptions);
    }

    if (events[changeStr]) {
      triggerOne(object, changeStr, extendedEventOptions);
    }
  }

  // trigger dependencies made by calc method
  if ((isChanged || force) && !skipCalc) {
    const changeDepsEventName = `_change:deps:${key}`;
    if (events[changeDepsEventName]) {
      triggerOne(object, changeDepsEventName, extendedEventOptions);
    }
  }

  if (isChanged) {
    // trigger common delegated events logic
    const changeDelegatedKeyEventName = `_change:delegated:${key}`;
    if (events[changeDelegatedKeyEventName]) {
      triggerOne(object, changeDelegatedKeyEventName, extendedEventOptions);
    }

    // trigger tree change events logic
    const changeTreeEventName = `_change:tree:${key}`;
    if (events[changeTreeEventName]) {
      triggerOne(object, changeTreeEventName, extendedEventOptions);
    }

    // trigger other internal change events
    const changeCommonEventName = `_change:common:${key}`;
    if (events[changeCommonEventName]) {
      triggerOne(object, changeCommonEventName, extendedEventOptions);
    }

    // trigger delegated logic for asterisk events (*.*.*@foo)
    // TODO: Confusing events names ("_change:delegated", "_change:common:KEY" etc)
    const changeDelegatedEventName = '_change:delegated';
    if (events[changeDelegatedEventName]) {
      triggerOne(object, changeDelegatedEventName, extendedEventOptions);
    }
  }

  return object;
}
