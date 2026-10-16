import MatreshkaArray from 'src/array';

describe('Matreshka.Array toJSON method', () => {
  it('is converted to JSON', () => {
    const arr = new MatreshkaArray(1, 2, new MatreshkaArray(3, 4));

    expect(arr.toJSON()).toEqual([1, 2, [3, 4]]);
  });

  it('is converted to JSON with recursive=false parameter', () => {
    const arr = new MatreshkaArray(1, 2, new MatreshkaArray(3, 4));

    expect(arr.toJSON(false)).toEqual([1, 2, arr[2]]);
  });
});
