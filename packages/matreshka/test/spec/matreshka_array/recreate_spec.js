import MatreshkaArray from 'src/array';

describe('Matreshka.Array recreate method (including trackBy feature)', () => {
  it('recreates an array via recreate method', () => {
    const arr = new MatreshkaArray();
    const object1 = {};
    const object2 = {};
    const object3 = {};

    arr.recreate([object1, object2, object3]);

    expect(arr.length).toEqual(3);
    expect(arr[0] === object1).toBe(true);
    expect(arr[1] === object2).toBe(true);
    expect(arr[2] === object3).toBe(true);
  });

  it('emptifies an array via recreate method', () => {
    const arr = new MatreshkaArray();
    const object1 = {};
    const object2 = {};
    const object3 = {};

    arr.recreate([object1, object2, object3]);

    expect(arr.length).toEqual(3);
    arr.recreate();

    expect(arr.length).toEqual(0);
    expect(arr[0] === undefined).toBe(true);
    expect(arr[1] === undefined).toBe(true);
    expect(arr[2] === undefined).toBe(true);
  });

  it('tracks by _id', () => {
    const arr = new MatreshkaArray();
    const object0 = { _id: 0, a: 0 };
    const object1 = { _id: 1, a: 1 };
    const object2 = { _id: 2, a: 2 };
    const object3 = { _id: 0, a: 3 };
    const object4 = { _id: 1, a: 4 };
    const object5 = { _id: 3, a: 5 };

    arr.trackBy = '_id';

    arr.recreate([object0, object1, object2]);

    expect(arr[0] === object0).toBe(true);
    expect(arr[1] === object1).toBe(true);
    expect(arr[2] === object2).toBe(true);

    arr.recreate([object4, object5, object3]);

    expect(arr[0] === object1).toBe(true);
    expect(arr[1] === object5).toBe(true);
    expect(arr[2] === object0).toBe(true);

    expect(arr[0].a).toEqual(4);
    expect(arr[1].a).toEqual(5);
    expect(arr[2].a).toEqual(3);
  });

  it('tracks by $index', () => {
    const arr = new MatreshkaArray();
    const object0 = { a: 0 };
    const object1 = { a: 1 };
    const object2 = { a: 2 };
    const object3 = { a: 3 };
    const object4 = { a: 4 };
    const object5 = { a: 5 };
    const object6 = { a: 6 };

    arr.trackBy = '$index';

    arr.recreate([object0, object1, object2]);

    expect(arr[0] === object0).toBe(true);
    expect(arr[1] === object1).toBe(true);
    expect(arr[2] === object2).toBe(true);

    arr.recreate([object3, object4, object5, object6]);

    expect(arr[0] === object0).toBe(true);
    expect(arr[1] === object1).toBe(true);
    expect(arr[2] === object2).toBe(true);
    expect(arr[3] === object6).toBe(true);

    expect(arr[0].a).toEqual(3);
    expect(arr[1].a).toEqual(4);
    expect(arr[2].a).toEqual(5);
    expect(arr[3].a).toEqual(6);
  });
});
