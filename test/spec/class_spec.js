import Class from 'src/class';

describe('Class function', () => {
  const symbolIt = typeof Symbol === 'function' ? it : xit;

  it('allows to inherit', () => {
    const A = Class({ a: true });
    const B = Class({ b: true, extends: A });
    const C = Class({ c: true, extends: B });
    const inst = new C();

    expect(inst instanceof A).toBeTruthy();
    expect(inst instanceof B).toBeTruthy();
    expect(inst instanceof C).toBeTruthy();

    expect(inst.a).toBeTruthy();
    expect(inst.b).toBeTruthy();
    expect(inst.c).toBeTruthy();
  });

  symbolIt('allows to inherit symbols', () => {
    const a = Symbol('a');
    const b = Symbol('b');
    const c = Symbol('c');

    const A = Class({ [a]: true });
    const B = Class({ [b]: true, extends: A });
    const C = Class({ [c]: true, extends: B });
    const inst = new C();

    expect(inst[a]).toBeTruthy();
    expect(inst[a]).toBeTruthy();
    expect(inst[c]).toBeTruthy();
  });

  it('allows to pass static props', () => {
    const A = Class({}, { staticProp: true });
    expect(A.staticProp).toBeTruthy();
  });

  it('allows to inherit static props', () => {
    const A = Class({}, { staticProp: true });
    const B = Class({ extends: A });
    expect(B.staticProp).toBeTruthy();
  });

  symbolIt('allows to pass symbols as static props', () => {
    const staticProp = Symbol('staticProp');
    const A = Class({}, { [staticProp]: true });
    expect(A[staticProp]).toBeTruthy();
  });

  symbolIt('allows to inherit symbols as static props', () => {
    const staticProp = Symbol('staticProp');
    const A = Class({}, { [staticProp]: true });
    const B = Class({ extends: A });
    expect(B[staticProp]).toBeTruthy();
  });

  it('if new Class({}) is called return its instance', () => {
    const inst = new Class({ a: true });
    expect(inst.a).toEqual(true);
    expect(inst instanceof Class).toBeFalsy();
  });

  it('accepts a constructor written as a method', () => {
    const A = Class({
      constructor(value) {
        this.value = value;
      }
    });
    const inst = new A(42);
    expect(inst.value).toEqual(42);
    expect(inst instanceof A).toBeTruthy();
    expect(inst.constructor).toBe(A);
  });

  it('keeps an object returned by a constructor written as a method', () => {
    const returned = { returned: true };
    const A = Class({
      constructor() {
        return returned;
      }
    });
    expect(new A()).toBe(returned);
  });

  it('calls a parent constructor written as a method', () => {
    const A = Class({
      constructor() {
        this.a = true;
      }
    });
    const B = Class({
      extends: A,
      constructor() {
        A.call(this);
        this.b = true;
      }
    });
    const inst = new B();
    expect(inst.a && inst.b).toBeTruthy();
    expect(inst instanceof A).toBeTruthy();
  });
});
