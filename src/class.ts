import forEach from './_helpers/foreach.js';
import forOwn from './_helpers/forown.js';
import assign from './_helpers/assign.js';

// static methods and properties of classes will be hidden under Symbol('staticNames')
const staticNamesProperty = Symbol('staticNames');
const { getOwnPropertySymbols } = Object;
const hasOwn = Object.prototype.hasOwnProperty;

type AnyConstructor = new (...args: any[]) => any;

// what Class takes: the prototype members, an optional constructor and an optional parent under "extends"
export interface ClassPrototype {
  extends?: AnyConstructor;
  [member: PropertyKey]: any;
}

// the prototype members without the special keys
type OwnMembers<P> = Omit<P, 'constructor' | 'extends'>;

type ParentInstance<P> = P extends { extends: new (...args: any[]) => infer I } ? I : unknown;

// the arguments of the own constructor, else of the parent's
type ClassArguments<P> = P extends { constructor: (...args: infer A) => any }
  ? A
  : P extends { extends: new (...args: infer A) => any }
    ? A
    : any[];

// an instance: the own members over the parent's
export type ClassInstance<P> =
  unknown extends ParentInstance<P> ? OwnMembers<P> : Omit<ParentInstance<P>, keyof OwnMembers<P>> & OwnMembers<P>;

// the static members of a parent made by Class are copied too; they are not in the type
export type ClassConstructor<P, S = unknown> = {
  new (...args: ClassArguments<P>): ClassInstance<P>;
  prototype: ClassInstance<P>;
} & (unknown extends S ? unknown : S);

export interface ClassFunction {
  <P extends ClassPrototype, S extends object = never>(
    prototype: P,
    staticProps?: S
  ): ClassConstructor<P, [S] extends [never] ? unknown : S>;
  // new Class({}) returns an instance
  new <P extends ClassPrototype>(prototype: P, staticProps?: object): ClassInstance<P>;
}

function isConstructor(fn: any): boolean {
  try {
    Reflect.construct(Object, [], fn);
    return true;
  } catch {
    return false;
  }
}

// `constructor() {}` in an object literal is a method, which `new` refuses, and an ES class has a read-only
// prototype; both get a wrapper
function toConstructor(fn: (...args: any[]) => any): AnyConstructor {
  if (isConstructor(fn)) {
    if (Object.getOwnPropertyDescriptor(fn, 'prototype')?.writable === false) {
      return function Constructor(...args: any[]) {
        return Reflect.construct(fn, args, new.target);
      } as unknown as AnyConstructor;
    }

    return fn as unknown as AnyConstructor;
  }

  return function Constructor(this: any, ...args: any[]) {
    const result = fn.apply(this, args);
    return result !== null && (typeof result === 'object' || typeof result === 'function') ? result : this;
  } as unknown as AnyConstructor;
}

// builds a class from a prototype object (with an optional constructor and "extends") and static members
const Class = function Class(this: any, prototype: ClassPrototype, staticProps?: Record<PropertyKey, any>) {
  // extends is kept for backward compatibility
  // its statics are read by name
  const Parent: any = prototype.extends;
  let Constructor: AnyConstructor & Record<PropertyKey, any>;

  if (hasOwn.call(prototype, 'constructor')) {
    Constructor = toConstructor(prototype.constructor as (...args: any[]) => any);
  } else if (Parent) {
    // like an ES class without a constructor, call the parent constructor with the same arguments
    Constructor = function EmptyConstructor(this: any, ...args: any[]) {
      // `Child.call(this)` from a subclass constructor has no `new.target`
      return new.target ? Reflect.construct(Parent, args, new.target) : Parent.apply(this, args);
    } as unknown as AnyConstructor;
  } else {
    Constructor = function EmptyConstructor() {} as unknown as AnyConstructor;
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
    const staticNames: Record<PropertyKey, true> = Constructor[staticNamesProperty] || {};
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
    const staticNames: Record<PropertyKey, true> = Constructor[staticNamesProperty] || {};
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
} as unknown as ClassFunction;

export default Class;
