import type { EventOptions } from './types.js';
import defs from './_core/defs.js';
import triggerOne from './trigger/_triggerone.js';
import checkObjectType from './_helpers/checkobjecttype.js';
import is from './_helpers/is.js';
import forOwn from './_helpers/forown.js';

// a key named __proto__ is a key like any other: defined, so it never replaces the prototype
function assign(object: any, key: string, value: any): void {
  if (key === '__proto__') {
    Object.defineProperty(object, key, { value, writable: true, enumerable: true, configurable: true });
  } else {
    object[key] = value;
  }
}

// the function sets new value for a property
// since its performance is very critical we're checking events existence manually
export default function set<T extends object>(object: T, key: string, value: any, eventOptions?: EventOptions): T;
export default function set<T extends object>(object: T, data: Record<string, any>, eventOptions?: EventOptions): T;
export default function set(this: any, object: any, key: any, value?: any, eventOptions?: any): any {
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
    forOwn(key as Record<string, any>, (objVal, objKey) => set(object, objKey, objVal, value));
    return object;
  }

  eventOptions = (eventOptions || {}) as EventOptions;
  const def = defs.get(object);

  // if no object definition then make simple assignment
  if (!def) {
    assign(object, key, value);
    return object;
  }

  const { props, events } = def;
  const propDef = props[key];

  // if no property definition then make simple assignment
  if (!propDef) {
    assign(object, key, value);
    return object;
  }

  const { value: previousValue, mediator } = propDef;

  // possible flags, all of them are falsy by default
  const { skipMediator, fromMediator, force, forceHTML, silent, silentHTML, skipCalc } = eventOptions;

  let newValue: any;

  if (mediator && !is(value, previousValue) && !skipMediator && !fromMediator) {
    // the mediators set by mediate wrap the user's one and read the rest themselves
    newValue = (mediator as (value: any) => any)(value);
  } else {
    newValue = value;
  }

  // an own setter runs first, and an own getter then gives the value the events and bindings see
  const { accessor } = propDef;
  if (accessor?.set) {
    accessor.set.call(object, newValue);
    if (accessor.get) newValue = accessor.get.call(object);
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

  // a change handler may have set the key again: delegated listeners and deep bindings go to the value it holds now
  const branchEventOptions = is(propDef.value, newValue)
    ? extendedEventOptions
    : { ...extendedEventOptions, value: propDef.value };

  // trigger common delegated events logic
  if (isChanged) {
    const changeDelegatedKeyEventName = `_change:delegated:${key}`;
    if (events[changeDelegatedKeyEventName]) {
      triggerOne(object, changeDelegatedKeyEventName, branchEventOptions);
    }
  }

  // trigger tree change events logic: deep calc sources ("a.b.c") take force and skipCalc as plain ones do
  if (isChanged || force) {
    const changeTreeEventName = `_change:tree:${key}`;
    if (events[changeTreeEventName]) {
      triggerOne(object, changeTreeEventName, branchEventOptions);
    }
  }

  if (isChanged) {
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
