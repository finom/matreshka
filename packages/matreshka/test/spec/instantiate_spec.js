import instantiate from 'src/instantiate';
import Class from 'src/class';
import MatreshkaObject from 'src/object';
import MatreshkaArray from 'src/array';

describe('instantiate', () => {
  it('allows to instantiate a property', () => {
    const obj = {
      x: { a: 42 }
    };

    class X {
      constructor(data) {
        this.a = data.a;
      }
    }

    instantiate(obj, 'x', X);

    expect(obj.x.constructor).toEqual(X);
    expect(obj.x.a).toEqual(42);
  });

  it('instantiates in context of an object which has isMatreshka=true property', () => {
    const obj = {
      isMatreshka: true,
      x: { a: 42 }
    };

    class X {
      constructor(data) {
        this.a = data.a;
      }
    }

    instantiate.call(obj, 'x', X);

    expect(obj.x.constructor).toEqual(X);
    expect(obj.x.a).toEqual(42);
  });

  it('allows to pass key-class object', () => {
    const obj = {
      x: { a: 1 },
      y: { b: 2 }
    };

    class X {
      constructor(data) {
        this.a = data.a;
      }
    }

    class Y {
      constructor(data) {
        this.b = data.b;
      }
    }

    instantiate(obj, {
      x: X,
      y: Y
    });

    expect(obj.x.constructor).toEqual(X);
    expect(obj.x.a).toEqual(1);
    expect(obj.y.constructor).toEqual(Y);
    expect(obj.y.b).toEqual(2);
  });

  it('updates simple object on assignment', () => {
    const obj = {};

    class X {}

    instantiate(obj, 'x', X);

    const x = obj.x;

    obj.x = { a: 42 };

    expect(obj.x).toEqual(x);

    expect(obj.x.a).toEqual(42);
  });

  it('updates Matreshka.Object instance on assigment', () => {
    const obj = {
      x: { a: 42 }
    };

    const X = Class({
      extends: MatreshkaObject,
      constructor(data) {
        this.setData(data);
      }
    });

    instantiate(obj, 'x', X);

    expect(obj.x.constructor).toEqual(X);
    expect(obj.x.a).toEqual(42);

    obj.x = {
      b: 1,
      c: 2
    };

    expect(obj.x.keys()).toEqual(['b', 'c']);
  });

  it('updates Matreshka.Array instance on assigment', () => {
    const obj = {
      x: [1, 2, 3, 4, 5]
    };

    const X = Class({
      extends: MatreshkaArray,
      constructor(data) {
        this.recreate(data);
      }
    });

    instantiate(obj, 'x', X);

    expect(obj.x.constructor).toEqual(X);
    expect(obj.x.toJSON(false)).toEqual([1, 2, 3, 4, 5]);

    obj.x = [6, 7, 8, 9, 0];

    expect(obj.x.toJSON(false)).toEqual([6, 7, 8, 9, 0]);
  });

  it('makes possible to customize update function', () => {
    const obj = {
      x: { a: 1 }
    };

    class X {
      constructor(data) {
        this.a = `${data.a}foo`;
      }
    }

    instantiate(obj, 'x', X, (instance, data) => {
      instance.a = `${data.a}bar`;
    });

    expect(obj.x.constructor).toEqual(X);
    expect(obj.x.a).toEqual('1foo');

    obj.x = { a: 2 };

    expect(obj.x.constructor).toEqual(X);
    expect(obj.x.a).toEqual('2bar');
  });
});
