import MatreshkaObject from 'src/object';
import MatreshkaArray from 'src/array';
import { parseForm } from 'src/parse-form';

const wait = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));
const nd = { debounceGetValue: false, debounceSetValue: false };

describe('sweep 3 (data)', () => {
  it('D1 setData of the value a key already holds delegates "*@" listeners to it', () => {
    const obj = new MatreshkaObject();
    const sub = new MatreshkaObject({ x: 1 });
    obj.a = sub;
    const handler = vi.fn();
    obj.on('*@change:x', handler);
    obj.setData('a', sub);
    sub.x = 2;
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('D1 setData of the value a key already holds fires set and modify', () => {
    const obj = new MatreshkaObject();
    obj.a = 1;
    const handler = vi.fn();
    obj.on('modify', handler);
    obj.setData('a', 1);
    expect(obj.keys()).toEqual(['a']);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('D2 recreate takes an array-like on a non-empty array', () => {
    const arr = MatreshkaArray.of(1, 2);
    arr.recreate({ length: 2, 0: 'a', 1: 'b' });
    expect(arr.toJSON()).toEqual(['a', 'b']);
  });

  it('D3 parseForm binds a file input of an object that has a value', () => {
    const obj = { f: 'a.png' };
    expect(() => parseForm(obj, '<form><input type="file" name="f"></form>', null, nd)).not.toThrow();
  });

  it('D4 hash router keeps 0 as a route value', async () => {
    location.hash = '#!/x/y/';
    await wait();
    vi.resetModules();
    const { initRouter } = await import('src/router');
    const obj = {};
    initRouter(obj, '/a/b/');
    obj.b = 0;
    await wait();
    expect(location.hash).toBe('#!/x/0/');
    expect(obj.b).toBe(0);
    history.replaceState(null, '', '/');
  });

  it('D5 setData with replaceData and silent fires no remove or modify', () => {
    const obj = new MatreshkaObject({ a: 1, b: 2 });
    const handler = vi.fn();
    obj.on('remove modify', handler);
    obj.setData({ a: 3 }, { replaceData: true, silent: true });
    expect(obj.keys()).toEqual(['a']);
    expect(handler).not.toHaveBeenCalled();
  });

  it('D6 new Matreshka.Object(instance) and setData(instance) take only its data keys', () => {
    const source = new MatreshkaObject({ a: 1 });
    expect(new MatreshkaObject(source).keys()).toEqual(['a']);
    expect(new MatreshkaObject().setData(source).keys()).toEqual(['a']);
  });

  it('D7 copyWithin takes "*@" listeners off the overwritten item', () => {
    const a = new MatreshkaObject({ x: 1 });
    const b = new MatreshkaObject({ x: 1 });
    const arr = MatreshkaArray.of(a, b);
    const handler = vi.fn();
    arr.on('*@change:x', handler);
    arr.copyWithin(0, 1);
    a.x = 2;
    expect(handler).not.toHaveBeenCalled();
  });

  it('D8 recreate reports a dropped duplicate as removed', () => {
    const arr = MatreshkaArray.of(1, 1, 2);
    const handler = vi.fn();
    arr.on('removeone', handler);
    arr.recreate([1, 2]);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('D9 radio binder checks the radio for a number value, as select does', () => {
    const obj = {};
    const form = parseForm(
      obj,
      '<form><input type="radio" name="r" value="1"><input type="radio" name="r" value="2"></form>',
      null,
      nd
    );
    obj.r = 2;
    expect(form.elements[1].checked).toBe(true);
  });

  it('D10 sort with a comparator that is not a function throws like the native one', () => {
    expect(() => MatreshkaArray.of(3, 1, 2).sort('x')).toThrow(TypeError);
  });

  it('D11 fill over an empty range fires no modify', () => {
    const arr = MatreshkaArray.of(1, 2, 3);
    const handler = vi.fn();
    arr.on('modify', handler);
    arr.fill(0, 5);
    expect(handler).not.toHaveBeenCalled();
  });

  it('D12 push_(), unshift_() and splice_() with no arguments do not throw RangeError', () => {
    const arr = MatreshkaArray.of(1);
    expect(arr.push_()).toBe(1);
    expect(arr.unshift_()).toBe(1);
    expect(arr.splice_().length).toBe(0);
  });

  it('D13 iterators of Matreshka.Array and Matreshka.Object are iterable', () => {
    const arrIt = MatreshkaArray.of(1, 2)[Symbol.iterator]();
    const objIt = new MatreshkaObject({ a: 1 })[Symbol.iterator]();
    expect(Array.from(arrIt)).toEqual([1, 2]);
    expect(Array.from(objIt)).toEqual([1]);
  });

  it('D14 ES2022+ Array methods exist', () => {
    const arr = MatreshkaArray.of(1, 2, 3);
    expect(arr.at(-1)).toBe(3);
    expect(arr.findLast((x) => x < 3)).toBe(2);
    expect(arr.findLastIndex((x) => x < 3)).toBe(1);
  });

  it('D14 the copying methods return a new Matreshka.Array and leave the array as it was', () => {
    const arr = MatreshkaArray.of(3, 1, 2);
    const copies = [
      [arr.toSorted(), [1, 2, 3]],
      [arr.toReversed(), [2, 1, 3]],
      [arr.toSpliced(1, 1, 9), [3, 9, 2]],
      [arr.with(0, 0), [0, 1, 2]],
      [MatreshkaArray.of([1], [2, [3]]).flat(), [1, 2, [3]]],
      [arr.flatMap((x) => [x, x]), [3, 3, 1, 1, 2, 2]]
    ];
    for (const [copy, items] of copies) {
      expect(copy).toBeInstanceOf(MatreshkaArray);
      expect([...copy]).toEqual(items);
    }
    expect([...arr]).toEqual([3, 1, 2]);
  });

  it('D15 a native concat spreads a Matreshka.Array', () => {
    expect([0].concat(MatreshkaArray.of(1, 2))).toEqual([0, 1, 2]);
  });
});
