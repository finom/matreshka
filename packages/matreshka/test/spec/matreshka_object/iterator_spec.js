import Class from 'src/class';
import MatreshkaObject from 'src/object';

describe('Matreshka.Object iterator', () => {
  const symbolIt = typeof Symbol === 'function' ? it : xit;

  symbolIt('allows to iterate an instance via for..of', () => {
    const obj = new MatreshkaObject({
      a: 'foo',
      b: 'bar',
      c: 'baz'
    });
    const values = ['foo', 'bar', 'baz'];
    let i = 0;

    for (const item of obj) {
      expect(item).toEqual(values[i]);
      i += 1;
    }
  });

  symbolIt('allows to iterate an instance of inherited class via for..of', () => {
    const Child = Class({
      extends: MatreshkaObject,
      constructor(data) {
        this.setData(data);
      }
    });
    const obj = new Child({
      a: 'foo',
      b: 'bar',
      c: 'baz'
    });
    const values = ['foo', 'bar', 'baz'];
    let i = 0;

    for (const item of obj) {
      expect(item).toEqual(values[i]);
      i += 1;
    }
  });
});
