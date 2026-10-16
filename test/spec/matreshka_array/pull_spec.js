import MatreshkaArray from 'src/array';

describe('Matreshka.Array pull method', () => {
  it('pulls', () => {
    const arr = new MatreshkaArray();
    arr.push('a', 'b', 'c');
    const removed = arr.pull(1);

    expect(removed).toEqual('b');

    expect(arr.toJSON(false)).toEqual(['a', 'c']);
  });

  it('pulls by given value', () => {
    const arr = new MatreshkaArray();
    const object1 = {};
    const object2 = {};
    const object3 = {};

    arr.push(object1, object2, object3);

    const removed = arr.pull(object2);

    expect(removed === object2).toBe(true);

    expect(arr.toJSON(false)).toEqual([object1, object3]);
  });

  it('throws an error if wrong type is passed to pull method', () => {
    const arr = new MatreshkaArray();

    arr.push('a', 'b', 'c');

    expect(() => arr.pull('foo')).toThrow();
  });
});
