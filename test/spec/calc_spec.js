import calc from 'src/calc';
import addListener from 'src/on/_addlistener';
import makeObject from '../helpers/makeobject';
import createSpy from '../helpers/createspy';

const noDebounceFlag = { debounceCalc: false };
const delay = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

describe('calc', () => {
  it('adds simple dependency', () => {
    const obj = {
      a: 1,
      b: 2
    };

    calc(obj, 'c', ['a', 'b'], (a, b) => a + b, noDebounceFlag);
    expect(obj.c).toEqual(3);
    obj.a = 3;
    expect(obj.c).toEqual(5);
    obj.b = 3;
    expect(obj.c).toEqual(6);
  });

  it('adds simple dependency in context of an object which includes' + ' isMatreshka=true property', () => {
    const obj = {
      isMatreshka: true,
      a: 1,
      b: 2
    };

    calc.call(obj, 'c', ['a', 'b'], (a, b) => a + b, noDebounceFlag);
    expect(obj.c).toEqual(3);
    obj.a = 3;
    expect(obj.c).toEqual(5);
    obj.b = 3;
    expect(obj.c).toEqual(6);
  });

  it('adds dependency from another object', () => {
    const obj = {
      a: 1,
      b: 2
    };
    const obj2 = {
      c: 4,
      d: 8
    };

    calc(
      obj,
      'e',
      [
        {
          object: obj,
          key: ['a', 'b']
        },
        {
          object: obj2,
          key: ['c', 'd']
        }
      ],
      (a, b, c, d) => a + b + c + d,
      noDebounceFlag
    );

    expect(obj.e).toEqual(15);
  });

  it('allows to pass an object of calcs', () => {
    const obj = {
      a: 1,
      b: 2,
      g: 16
    };
    const obj2 = {
      c: 4,
      d: 8
    };

    calc(
      obj,
      {
        e: {
          source: [
            'a',
            'b',
            {
              object: obj2,
              key: ['c', 'd']
            }
          ],
          handler: (a, b, c, d) => a + b + c + d
        },
        f: {
          source: 'g'
        },
        g: {
          source: 'f'
        }
      },
      noDebounceFlag
    );

    expect(obj.e).toEqual(15);
    expect(obj.f).toEqual(16);
    expect(obj.g).toEqual(16);
  });

  it('does not set on init via setOnInit=false', () => {
    const obj = {
      a: 1,
      b: 2,
      c: 0
    };

    calc(obj, 'c', ['a', 'b'], (a, b) => a + b, {
      setOnInit: false,
      debounceCalc: false
    });

    expect(obj.c).toEqual(0);
  });

  it('protects from cyclical links', () => {
    const obj = {
      a: 1,
      b: 2,
      c: 3
    };

    calc(obj, 'a', ['b', 'c'], (x, y) => x + y, noDebounceFlag);
    calc(obj, 'b', ['a', 'c'], (x, y) => x + y, noDebounceFlag);
    calc(obj, 'c', ['a', 'b'], (x, y) => x + y, noDebounceFlag);

    expect(obj.a).toEqual(27);
  });

  it('throws error when target is not a string', () => {
    expect(() => calc({}, 5, 'a')).toThrow(/target key must have type "string"/);
    expect(() => calc({}, null, 'a')).toThrow(/target key must have type "string"/);
  });

  it('throws error when source is not an object', () => {
    expect(() => calc({}, 'a', 5)).toThrow(/source must have type "object"/);
    expect(() => calc({}, 'a', null)).toThrow(/source must have type "object"/);
  });

  it('throws error when source key is not a string', () => {
    expect(() => calc({}, 'a', { object: {}, key: 5 })).toThrow(/source key must have type "string"/);
  });

  it('throws error when source object is not an object', () => {
    expect(() => calc({}, 'a', { object: null, key: 'b' })).toThrow(/source object must have type "object"/);
    expect(() => calc({}, 'a', { object: 'x', key: 'b' })).toThrow(/source object must have type "object"/);
  });

  it('allows delegated dependencies', () => {
    const obj = makeObject('a.b.c', 1);

    calc(obj, 'd', 'a.b.c', (c) => c, noDebounceFlag);
    expect(obj.d).toEqual(1);
    obj.a.b.c = 2;
    expect(obj.d).toEqual(2);

    const b = obj.a.b;
    obj.a.b = { c: 3 };
    b.c = 'nope';
    expect(obj.d).toEqual(3);

    const a = obj.a;
    obj.a = { b: { c: 4 } };
    a.b = { c: 'nope' };
    expect(obj.d).toEqual(4);
  });

  it('allows delegated dependencies from another object', () => {
    const obj = makeObject('a', 1);
    const obj2 = makeObject('b.c.d', 2);

    calc(
      obj,
      'd',
      {
        object: obj2,
        key: 'b.c.d'
      },
      (c) => c * 2
    );

    expect(obj.d).toEqual(4);
  });

  it('allows to cancel delegated dependencies by exactKey=true option', () => {
    const obj = {
      'a.b.c': 1,
      'd.e.f': 2
    };

    calc(obj, 'c', ['a.b.c', 'd.e.f'], (abc, def) => abc + def, {
      debounceCalc: false,
      exactKey: true
    });

    expect(obj.c).toEqual(3);
    obj['a.b.c'] = 3;
    expect(obj.c).toEqual(5);
    obj['d.e.f'] = 3;
    expect(obj.c).toEqual(6);
  });

  it('uses event options', () => {
    const obj = {};
    const handler = createSpy((evt) => expect(evt.foo).toEqual('bar'));
    calc(obj, 'c', ['a', 'b'], (a, b) => a + b, {
      foo: 'bar',
      debounceCalc: false
    });

    addListener(obj, 'change:c', handler);

    obj.a = 2;
    obj.b = 3;

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('uses silent=true from event options', () => {
    const obj = {};
    const handler = createSpy();

    addListener(obj, 'change:c', handler);

    calc(obj, 'c', ['a', 'b'], (a, b) => a + b, { silent: true });

    obj.a = 2;
    obj.b = 3;

    expect(handler).not.toHaveBeenCalled();
  });

  it('allows to debounce handler via debounceCalc=true (use default value)', () =>
    new Promise((done) => {
      const obj = {
        a: 1,
        b: 2
      };
      const handler = createSpy(() => {
        expect(obj.c).toEqual(firstCall ? 3 : 5);
      });

      addListener(obj, 'change:c', handler);

      // we'e going to handle the first call separately because debounceCalcOnInit is always true
      let firstCall = true;
      calc(obj, 'c', ['a', 'b'], (a, b) => a + b);
      firstCall = false;

      obj.a = 0;
      obj.a = 1;
      obj.a = 2;
      obj.b = 0;
      obj.b = 1;
      obj.b = 2;
      obj.b = 3;

      setTimeout(() => {
        expect(handler).toHaveBeenCalledTimes(2);
        done();
      }, 400);
    }));

  it('allows to debounce handler on init via debounceCalcOnInit=true', () =>
    new Promise((done) => {
      const obj = {
        a: 1,
        b: 2
      };
      const handler = createSpy(() => {
        expect(obj.c).toEqual(3);
        done();
      });

      addListener(obj, 'change:c', handler);

      calc(obj, 'c', ['a', 'b'], (a, b) => a + b, {
        debounceCalcOnInit: true
      });

      expect(obj.c).toEqual(undefined);

      expect(handler).not.toHaveBeenCalled();
    }));

  it('allows to use promises via promiseCalc', async () => {
    const obj = {
      a: 1,
      b: 2
    };

    calc(obj, 'c', ['a', 'b'], (a, b) => new Promise((resolve) => setTimeout(() => resolve(a + b), 10)), {
      promiseCalc: true
    });

    expect(obj.c).toEqual(undefined);
    obj.a = 3;
    await delay(50);
    expect(obj.c).toEqual(5);
    obj.b = 3;
    await delay(50);
    expect(obj.c).toEqual(6);
  });

  it('allows to use non-promises when promiseCalc=true', async () => {
    const obj = {
      a: 1,
      b: 2
    };

    calc(obj, 'c', ['a', 'b'], (a, b) => a + b, {
      promiseCalc: true
    });

    expect(obj.c).toEqual(undefined);
    obj.a = 3;
    await delay(50);
    expect(obj.c).toEqual(5);
    obj.b = 3;
    await delay(50);
    expect(obj.c).toEqual(6);
  });
});
