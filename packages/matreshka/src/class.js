import forEach from './_helpers/foreach';
import forOwn from './_helpers/forown';
import assign from './_helpers/assign';

// static methods and properties of classes will be hidden under Symbol('staticNames')
const staticNamesProperty = Symbol('staticNames');
const { getOwnPropertySymbols } = Object;
const hasOwn = Object.prototype.hasOwnProperty;

function isConstructor(fn) {
  try {
    Reflect.construct(Object, [], fn);
    return true;
  } catch {
    return false;
  }
}

// `constructor() {}` in an object literal is a method, which `new` refuses, and an ES class has a read-only
// prototype; both get a wrapper
function toConstructor(fn) {
  if (isConstructor(fn)) {
    if (Object.getOwnPropertyDescriptor(fn, 'prototype')?.writable === false) {
      return function Constructor(...args) {
        return Reflect.construct(fn, args, new.target);
      };
    }

    return fn;
  }

  return function Constructor(...args) {
    const result = fn.apply(this, args);
    return result !== null && (typeof result === 'object' || typeof result === 'function') ? result : this;
  };
}

export default function Class(prototype, staticProps) {
  // extends is kept for backward compatibility
  const Parent = prototype.extends;
  let Constructor;

  if (hasOwn.call(prototype, 'constructor')) {
    Constructor = toConstructor(prototype.constructor);
  } else if (Parent) {
    // like an ES class without a constructor, call the parent constructor with the same arguments
    Constructor = function EmptyConstructor(...args) {
      // `Child.call(this)` from a subclass constructor has no `new.target`
      return new.target ? Reflect.construct(Parent, args, new.target) : Parent.apply(this, args);
    };
  } else {
    Constructor = function EmptyConstructor() {};
  }

  // inherit proto from class parent or empty object
  const proto = Object.create(Parent ? Parent.prototype : {});
  const parentStaticNames = Parent ? Parent[staticNamesProperty] : undefined;

  assign(proto, prototype);
  // non-enumerable, as in ES classes
  Object.defineProperty(proto, 'constructor', {
    value: Constructor,
    writable: true,
    configurable: true,
    enumerable: false
  });

  // allow to pass symbols as prototype properties
  forEach(getOwnPropertySymbols(prototype), (symbol) => {
    proto[symbol] = prototype[symbol];
  });

  // inherit staric properties of a parent
  if (typeof parentStaticNames === 'object') {
    const staticNames = Constructor[staticNamesProperty] || {};
    Constructor[staticNamesProperty] = staticNames;

    forOwn(parentStaticNames, (_, name) => {
      Constructor[name] = Parent[name];
      staticNames[name] = true;
    });

    // inherit static properties of a parent when their keys are symbols
    forEach(getOwnPropertySymbols(parentStaticNames), (symbol) => {
      Constructor[symbol] = Parent[symbol];
      staticNames[symbol] = true;
    });
  }

  // extend Constructor with passed static properties
  if (typeof staticProps === 'object') {
    const staticNames = Constructor[staticNamesProperty] || {};
    Constructor[staticNamesProperty] = staticNames;

    forOwn(staticProps, (value, key) => {
      Constructor[key] = value;
      staticNames[key] = true;
    });

    // extend Constructor with passed static properties if their keys are symbols
    forEach(getOwnPropertySymbols(staticProps), (symbol) => {
      Constructor[symbol] = staticProps[symbol];
      staticNames[symbol] = true;
    });
  }

  Constructor.prototype = proto;

  // if new Class({}) is called return its instance
  if (this instanceof Class) {
    return new Constructor();
  }

  return Constructor;
}
