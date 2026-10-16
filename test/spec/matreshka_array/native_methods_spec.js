import MatreshkaArray from 'src/array';
import createSpy from '../../helpers/createspy';

describe('Matreshka.Array native methods', () => {
  it('supports filter method', () => {
    const arr = new MatreshkaArray();
    arr.push(1, 2, 3, 4, 5);
    const result = arr.filter((item) => item > 3);

    expect(result.toJSON(false)).toEqual([4, 5]);
  });

  it('supports map method', () => {
    const arr = new MatreshkaArray();
    arr.push(1, 2, 3);
    const result = arr.map((item) => item * 2);

    expect(result.toJSON(false)).toEqual([2, 4, 6]);
  });

  it('supports every method', () => {
    const arr = new MatreshkaArray();
    arr.push(1, 2, 3);
    expect(arr.every((item) => item < 4)).toBe(true);
    expect(arr.every((item) => item > 4)).toBe(false);
  });

  it('supports some method', () => {
    const arr = new MatreshkaArray();
    arr.push(1, 2, 3);
    expect(arr.some((item) => item === 2)).toBe(true);
    expect(arr.some((item) => item === 4)).toBe(false);
  });

  it('supports join method', () => {
    const arr = new MatreshkaArray();
    arr.push(1, 2, 3);
    expect(arr.join(' ')).toEqual('1 2 3');
  });

  it('supports indexOf method', () => {
    const arr = new MatreshkaArray();
    arr.push(1, 2, 3, 3, 4, 5);
    expect(arr.indexOf(3)).toEqual(2);
    expect(arr.indexOf(6)).toEqual(-1);
  });

  it('supports lastIndexOf method', () => {
    const arr = new MatreshkaArray();
    arr.push(1, 2, 3, 3, 4, 5);
    expect(arr.lastIndexOf(3)).toEqual(3);
    expect(arr.lastIndexOf(6)).toEqual(-1);
  });

  it('supports slice method', () => {
    const arr = new MatreshkaArray();
    arr.push(1, 2, 3);
    expect(arr.slice(1).toJSON(false)).toEqual([2, 3]);
  });

  it('supports forEach method', () => {
    const arr = new MatreshkaArray(1, 2, 3);
    const callback = createSpy();

    arr.push(1, 2, 3);

    arr.forEach(callback);

    expect(callback).toHaveBeenCalledTimes(arr.length);
  });

  it('supports reduce method', () => {
    const arr = new MatreshkaArray(0, 1, 2, 3, 4);
    const result = arr.reduce((previousValue, currentValue) => previousValue + currentValue, 5);

    expect(result).toEqual(15);
  });

  it('supports reduceRight method', () => {
    const arr = new MatreshkaArray(0, 1, 2, 3, 4);
    const result = arr.reduceRight((previousValue, currentValue) => previousValue + currentValue, 5);

    expect(result).toEqual(15);
  });

  it('supports concat method', () => {
    const arr = new MatreshkaArray(1, 2, 3);

    expect(arr.concat([4, 5, 6]).toJSON(false)).toEqual([1, 2, 3, 4, 5, 6]);

    expect(arr.concat(new MatreshkaArray(4, 5, 6)).toJSON(false)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('supports keys method', () => {
    const arr = new MatreshkaArray('foo', 'bar', 'baz');

    expect(arr.keys()).toEqual([0, 1, 2]);
  });

  it('supports values method', () => {
    const arr = new MatreshkaArray('foo', 'bar', 'baz');

    expect(arr.values()).toEqual(arr.toJSON(false));
  });

  it('supports entries method', () => {
    const arr = new MatreshkaArray('foo', 'bar', 'baz');

    expect(arr.entries()).toEqual([
      [0, 'foo'],
      [1, 'bar'],
      [2, 'baz']
    ]);
  });

  it('supports includes method', () => {
    const arr = new MatreshkaArray('foo', 'bar', 'baz');

    expect(arr.includes('bar')).toEqual(true);

    expect(arr.includes('qux')).toEqual(false);
  });

  it('supports find method', () => {
    const arr = new MatreshkaArray('foo', 'bar', 'baz');

    expect(arr.find((item) => item[item.length - 1] === 'r')).toEqual('bar');
  });

  it('supports findIndex method', () => {
    const arr = new MatreshkaArray('foo', 'bar', 'baz');

    expect(arr.findIndex((item) => item[item.length - 1] === 'r')).toEqual(1);
  });
});
