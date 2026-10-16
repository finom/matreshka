// Regressions of calc, mediate, set, remove, instantiate, Class, chain, toMatreshka and Matreshka.Object.
import Matreshka from 'src';
import MatreshkaObject from 'src/object';
import Class from 'src/class';
import calc from 'src/calc';
import set from 'src/set';
import on from 'src/on';
import remove from 'src/remove';
import mediate from 'src/mediate';
import toMatreshka from 'src/tomatreshka';
import defs from 'src/_core/defs';
import initMK from 'src/_core/init';

const sync = { debounceCalc: false };
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('regressions (data): Matreshka.Object', () => {
  it('OB-1 replacing a data value takes the "*@" listener off the old value', () => {
    const oldValue = new MatreshkaObject();
    const obj = new MatreshkaObject({ x: oldValue });
    const handler = vi.fn();
    obj.on('*@change:y', handler);
    obj.x = new MatreshkaObject();
    oldValue.y = 1;
    expect(handler).not.toHaveBeenCalled();
  });

  it('OB-2 remove(key, { silent: true }) also removes the key from the data keys', () => {
    const obj = new MatreshkaObject({ a: 1, b: 2 });
    obj.remove('a', { silent: true });
    expect(obj.keys()).toEqual(['b']);
    expect(obj.toJSON()).toEqual({ b: 2 });
  });

  it('OB-3 setData({}, { replaceData: true }) removes every data key', () => {
    const obj = new MatreshkaObject({ a: 1 });
    obj.setData({}, { replaceData: true });
    expect(obj.keys()).toEqual([]);
  });

  it('OB-4 names from Object.prototype are not data keys and can be added as data keys', () => {
    const obj = new MatreshkaObject();
    expect(obj.isDataKey('toString')).toBe(false);
    obj.addDataKeys('constructor');
    expect(obj.keys()).toEqual(['constructor']);
  });

  it('OB-5 addDataKeys on a key holding an object delegates existing "*@" listeners to it', () => {
    const obj = new MatreshkaObject();
    const value = new MatreshkaObject();
    obj.set('x', value);
    const handler = vi.fn();
    obj.on('*@change:y', handler);
    obj.addDataKeys('x');
    value.y = 1;
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('OB-6 removeDataKeys takes the "*@" listener off the removed value', () => {
    const value = new MatreshkaObject();
    const obj = new MatreshkaObject({ x: value });
    const handler = vi.fn();
    obj.on('*@change:y', handler);
    obj.removeDataKeys('x');
    value.y = 1;
    expect(handler).not.toHaveBeenCalled();
  });

  it('OB-7 removeDataKeys fires "remove" before "modify", like remove() does', () => {
    const obj = new MatreshkaObject({ a: 1 });
    const order = [];
    obj.on('remove', () => order.push('remove'));
    obj.on('modify', () => order.push('modify'));
    obj.removeDataKeys('a');
    expect(order).toEqual(['remove', 'modify']);
  });
});

describe('regressions (data): Matreshka.Object internals', () => {
  it('OB-8 off("change") and off("delete") keep set, modify and remove events working', () => {
    const obj = new MatreshkaObject({ a: 1 });
    const handler = vi.fn();
    obj.on('set modify remove', handler);
    obj.off('change');
    obj.off('delete');
    obj.a = 2;
    obj.remove('a');
    expect(handler).toHaveBeenCalledTimes(4);
    expect(obj.keys()).toEqual([]);
  });

  it('OB-9 setData with replaceData removes a data key named like an Object.prototype member', () => {
    const obj = new MatreshkaObject({ toString: 1, a: 2 });
    obj.setData({ a: 3 }, { replaceData: true });
    expect(obj.keys()).toEqual(['a']);
  });
});

describe('regressions (data): instantiate', () => {
  it('IN-1 assigning a Matreshka.Object instance adds only its data keys', () => {
    const parent = new Matreshka();
    parent.instantiate('x', MatreshkaObject);
    parent.x = new MatreshkaObject({ b: 2 });
    expect(parent.x.keys()).toEqual(['b']);
    expect(parent.x.toJSON()).toEqual({ b: 2 });
  });

  it('IN-2 assigning {} to an instantiated Matreshka.Object clears its data', () => {
    const parent = new Matreshka();
    parent.instantiate('x', MatreshkaObject);
    parent.x = { a: 1 };
    parent.x = {};
    expect(parent.x.keys()).toEqual([]);
  });
});

describe('regressions (data): calc', () => {
  it('CA-1 a deep source whose middle object becomes null does not throw', () => {
    const obj = { a: { b: { c: 1 } } };
    calc(obj, 'd', 'a.b.c', (c) => c, sync);
    expect(() => {
      obj.a.b = null;
    }).not.toThrow();
    expect(obj.d).toBe(undefined);
  });

  it('CA-2 calcs on different objects never share a circular-reference guard', () => {
    // the guard key is target + object id, so target "x" on object 15 equals target "x1" on object 5
    const objects = [];
    for (let i = 0; i < 300; i++) {
      const object = {};
      initMK(object);
      objects.push(object);
    }
    const id = (object) => defs.get(object).id;
    let first;
    let second;
    for (const a of objects) {
      second = objects.find((b) => `x${id(a)}` === `x1${id(b)}`);
      if (second) {
        first = a;
        break;
      }
    }

    first.source = 1;
    calc(first, 'x', 'source', (source) => source, sync);
    calc(second, 'x1', { object: first, key: 'x' }, (x) => x * 10, sync);
    first.source = 2;
    expect(first.x).toBe(2);
    expect(second.x1).toBe(20);
  });

  it("CA-3 skipMediator on a source does not skip the target's mediator", () => {
    const obj = { a: 1 };
    mediate(obj, 'b', (value) => String(value));
    calc(obj, 'b', 'a', (a) => a * 2, sync);
    set(obj, 'a', 5, { skipMediator: true });
    expect(obj.b).toBe('10');
  });

  it('CA-4 promiseCalc keeps the result of the latest calculation', async () => {
    const obj = { a: 1 };
    const delays = { 1: 0, 2: 40, 3: 0 };
    calc(obj, 'b', 'a', (a) => new Promise((resolve) => setTimeout(() => resolve(a), delays[a])), {
      promiseCalc: true,
      debounceCalc: false
    });
    obj.a = 2;
    obj.a = 3;
    await delay(80);
    expect(obj.b).toBe(3);
  });

  it('CA-5 a rejected promiseCalc surfaces the original error', async () => {
    // collect every promise the library chains on the returned one; the last of them is what goes unhandled
    const chained = [];
    class TrackedPromise extends Promise {
      // biome-ignore lint/suspicious/noThenProperty: a Promise subclass that records its chain
      then(onFulfilled, onRejected) {
        const result = super.then(onFulfilled, onRejected);
        chained.push(result);
        return result;
      }
    }
    const original = new TypeError('boom');
    const obj = { a: 1 };
    calc(obj, 'b', 'a', () => TrackedPromise.reject(original), { promiseCalc: true });
    const libraryChain = [...chained];
    const reasons = await Promise.all(libraryChain.map((promise) => promise.catch((reason) => reason)));
    expect(reasons.at(-1)).toBe(original);
  });
});

describe('regressions (data): remove', () => {
  it('RM-1 remove returns the object', () => {
    const obj = { a: 1 };
    expect(remove(obj, 'a')).toBe(obj);
    const instance = new Matreshka();
    instance.set('a', 1);
    expect(instance.remove('a')).toBe(instance);
  });

  it('RM-2 remove takes delegated listeners off the removed value', () => {
    const obj = { a: { b: { c: 1 } } };
    const handler = vi.fn();
    on(obj, 'a.b@change:c', handler);
    const removed = obj.a;
    remove(obj, 'a');
    removed.b.c = 2;
    expect(handler).not.toHaveBeenCalled();
  });
});

describe('regressions (data): remove, deep calc', () => {
  it('RM-3 a calc on "a.b" ignores changes of a removed "a"', () => {
    const obj = { a: { b: 1 } };
    calc(obj, 'd', 'a.b', (b) => b, sync);
    const removed = obj.a;
    remove(obj, 'a');
    removed.b = 5;
    expect(obj.d).toBe(1);
  });
});

describe('regressions (data): a child held by two keys', () => {
  it('R3b removeDataKeys of one key keeps the "*@" listener of a child held by another key', () => {
    const child = new MatreshkaObject({ x: 1 });
    const obj = new MatreshkaObject({ a: child, b: child });
    const handler = vi.fn();
    obj.on('*@change:x', handler);
    obj.removeDataKeys('a');
    child.x = 2;
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('R3c remove of one key keeps the "*@" listener of a child held by another key', () => {
    const child = new MatreshkaObject({ x: 1 });
    const obj = new MatreshkaObject({ a: child, b: child });
    const handler = vi.fn();
    obj.on('*@change:x', handler);
    obj.remove('a');
    child.x = 2;
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('R3d remove of one key keeps a delegated listener of a child held by another key', () => {
    const child = { x: 1 };
    const obj = { a: child, b: child };
    const handler = vi.fn();
    on(obj, 'a@change:x', handler);
    on(obj, 'b@change:x', handler);
    remove(obj, 'a');
    child.x = 2;
    expect(handler).toHaveBeenCalledTimes(1);
  });
});

describe('regressions (data): Class', () => {
  it('CL-1 a class without its own constructor is the constructor of its instances', () => {
    const A = Class({ constructor() {} });
    const B = Class({ extends: A });
    expect(new B().constructor).toBe(B);
  });

  it('CL-2 a class without its own constructor runs the parent constructor', () => {
    const B = Class({ extends: MatreshkaObject });
    expect(new B({ a: 1 }).keys()).toEqual(['a']);
  });

  it('CL-4 constructor is not enumerable on instances', () => {
    const A = Class({});
    const B = Class({ constructor() {} });
    const C = Class({ extends: A });
    for (const Constructor of [A, B, C]) {
      const keys = [];
      for (const key in new Constructor()) {
        keys.push(key);
      }
      expect(keys).not.toContain('constructor');
    }
  });

  it('CL-3 an ES class is accepted as the constructor', () => {
    expect(() => Class({ constructor: class X {} })).not.toThrow();
  });
});

describe('regressions (data): toMatreshka', () => {
  it('TM-2 a Matreshka.Object passed in gives only its data keys', () => {
    const result = toMatreshka(new MatreshkaObject({ a: 1 }));
    expect(result.keys()).toEqual(['a']);
  });

  it('TM-1 a plain object with a "length" property becomes a Matreshka.Object', () => {
    const result = toMatreshka({ title: 'Song', length: 180 });
    expect(result.isMatreshkaObject).toBe(true);
    expect(result.toJSON()).toEqual({ title: 'Song', length: 180 });
  });

  it('CL-2b a class without its own constructor can be called as a parent constructor', () => {
    const A = Class({
      constructor(value) {
        this.a = value;
      }
    });
    const B = Class({ extends: A });
    const C = Class({
      extends: B,
      constructor(value) {
        B.call(this, value);
        this.c = true;
      }
    });
    const inst = new C(1);
    expect(inst.a).toBe(1);
    expect(inst.c).toBe(true);
    expect(inst instanceof B && inst instanceof A).toBe(true);
  });
});
