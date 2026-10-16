import MatreshkaArray from 'src/array';

describe('Matreshka.Array orderBy method', () => {
  // tests partially taken from lodash
  const objects = [
    { a: 'x', b: 3 },
    { a: 'y', b: 4 },
    { a: 'x', b: 1 },
    { a: 'y', b: 2 }
  ];

  it('should sort by a single property by a specified order', () => {
    const arr = new MatreshkaArray(...objects);

    expect(arr.orderBy('a', 'desc').toJSON(false)).toEqual([objects[1], objects[3], objects[0], objects[2]]);
  });

  it('should sort by multiple properties by specified orders', () => {
    const arr = new MatreshkaArray(...objects);

    expect(arr.orderBy(['a', 'b'], ['desc', 'asc']).toJSON(false)).toEqual([
      objects[3],
      objects[1],
      objects[2],
      objects[0]
    ]);
  });

  it('should sort by a property in ascending order when its order is not specified', () => {
    const arr = new MatreshkaArray(...objects);
    const falsey = ['', 0, false, NaN, null, undefined];

    expect(arr.orderBy(['a', 'b']).toJSON(false)).toEqual([objects[2], objects[0], objects[3], objects[1]]);

    falsey.forEach((order, index) => {
      const arr = new MatreshkaArray(...objects);

      expect(arr.orderBy(['a', 'b'], index ? ['desc', order] : ['desc']).toJSON(false)).toEqual([
        objects[3],
        objects[1],
        objects[2],
        objects[0]
      ]);
    });
  });
});
