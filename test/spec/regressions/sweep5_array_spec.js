// Regressions found by sweep 5, area: Matreshka.Array (AR-n in its report).
// Every test here fails on fec0a1c.
import MatreshkaArray from 'src/array';
import Class from 'src/class';
import MatreshkaObject from 'src/object';

function renderedArray() {
  const arr = new MatreshkaArray();
  arr.bindNode('sandbox', '<ul></ul>');
  arr.itemRenderer = '<li></li>';
  return arr;
}

function reboundArray() {
  const arr = new MatreshkaArray();
  arr.bindNode('container', '<ul></ul>');
  arr.itemRenderer = '<li></li>';
  arr.push(new MatreshkaObject(), new MatreshkaObject());
  arr.unbindNode('container');
  arr.bindNode('container', '<ol></ol>');
  return arr;
}

describe('sweep 5: Matreshka.Array', () => {
  it('AR-1 splice after the container is rebound puts the new node into the current container', () => {
    const arr = reboundArray();
    expect(() => arr.splice(0, 0, new MatreshkaObject())).not.toThrow();
    expect(arr.length).toBe(3);
    expect([...arr.nodes.container.children]).toEqual([arr[0].nodes.sandbox]);
  });

  it('AR-1 splice after the container is rebound moves a kept item into the current container', () => {
    const arr = reboundArray();
    const first = arr[0];

    expect(() => arr.splice(0, 1, first)).not.toThrow();
    expect([...arr.nodes.container.children]).toEqual([first.nodes.sandbox]);
  });

  it('AR-2 restore with a Model made of Matreshka.Array gives every item an empty collection', () => {
    const Inner = Class({ extends: MatreshkaArray });
    const arr = new MatreshkaArray();
    arr.Model = Inner;
    arr.bindNode('sandbox', '<ul><li></li><li></li></ul>');
    arr.restore();

    expect(arr.length).toBe(2);
    expect(arr[0]).toBeInstanceOf(Inner);
    expect(arr.toJSON()).toEqual([[], []]);
  });

  it('AR-3 push and unshift of an item rendered already throw and leave the array as it was', () => {
    const arr = renderedArray();
    const x = {};
    arr.push(x);
    const modify = vi.fn();
    arr.on('modify', modify);

    expect(() => arr.push({}, x)).toThrow(/inserted twice/);
    expect(() => arr.unshift({}, x)).toThrow(/inserted twice/);
    expect(arr.length).toBe(1);
    expect(arr.nodes.sandbox.children.length).toBe(1);
    expect(modify).not.toHaveBeenCalled();
    // where nothing renders, the item may be added again
    arr.push_(x, { dontRender: true });
    arr.renderIfPossible = false;
    arr.unshift(x);
    expect(arr.length).toBe(3);
    const unbound = new MatreshkaArray();
    unbound.itemRenderer = '<li></li>';
    unbound.push(x, x);
    expect(unbound.length).toBe(2);
  });

  it('AR-3 the same new item twice in one call throws before the array changes', () => {
    const arr = renderedArray();
    const x = {};

    expect(() => arr.push(x, x)).toThrow(/inserted twice/);
    expect(arr.length).toBe(0);
    expect(arr.nodes.sandbox.children.length).toBe(0);
    // with no renderer nothing renders, so nothing throws
    const plain = new MatreshkaArray();
    plain.bindNode('sandbox', '<ul></ul>');
    plain.push(x, x);
    expect(plain.length).toBe(2);
  });

  it('AR-3 splice adding an item rendered elsewhere in the array throws and changes nothing', () => {
    const arr = renderedArray();
    const a = new MatreshkaObject();
    const b = new MatreshkaObject();
    arr.push(a, b);

    expect(() => arr.splice(0, 1, b)).toThrow(/inserted twice/);
    expect(() => arr.splice(0, 0, {}, a)).toThrow(/inserted twice/);
    expect(arr[0] === a && arr[1] === b && arr.length === 2).toBe(true);
    // an item the same splice removes is kept and moves
    arr.splice(0, 2, b, a);
    expect([...arr.nodes.sandbox.children]).toEqual([b.nodes.sandbox, a.nodes.sandbox]);
    arr.splice(1, Number.NaN, {});
    arr.splice(0, -1, {});
    expect(arr.length).toBe(4);
  });

  it('AR-3 fill and copyWithin on a rendered array throw before they change it', () => {
    const arr = renderedArray();
    const a = {};
    const b = {};
    arr.push(a, b);

    expect(() => arr.fill(a)).toThrow(/fill/);
    expect(() => arr.copyWithin(0, 1)).toThrow(/copyWithin/);
    expect(arr[0] === a && arr[1] === b).toBe(true);
    // an empty range changes nothing and throws nothing, as before
    expect(arr.fill(a, 2)).toBe(arr);
    arr.fill_(a, { dontRender: true });
    arr.copyWithin_(0, 1, { dontRender: true });
    expect(arr[1] === a).toBe(true);
  });

  it('AR-4 flat spreads a nested Matreshka.Array at every level, as it does an array', () => {
    const arr = MatreshkaArray.of(MatreshkaArray.of(1, 2), 3, [MatreshkaArray.of(4)]);

    expect(arr.flat()).toBeInstanceOf(MatreshkaArray);
    expect(arr.flat().toJSON(false)).toEqual([1, 2, 3, arr[2][0]]);
    expect(arr.flat(2).toJSON()).toEqual([1, 2, 3, 4]);
    expect(arr.flat(Number.POSITIVE_INFINITY).toJSON()).toEqual([1, 2, 3, 4]);
    expect(arr.flat(0).toJSON(false)).toEqual([arr[0], 3, arr[2]]);
    expect(MatreshkaArray.of(MatreshkaArray.of(MatreshkaArray.of(5))).flat(1.5)[0]).toBeInstanceOf(MatreshkaArray);
    // a hole is skipped, as by the native method
    const holes = new MatreshkaArray(2);
    holes[1] = MatreshkaArray.of(6);
    expect(holes.flat().toJSON()).toEqual([6]);
  });

  it('AR-4 flatMap spreads a Matreshka.Array returned by the callback', () => {
    const arr = MatreshkaArray.of(1, 2);
    const context = {};
    const calls = [];
    const result = arr.flatMap(function callback(x, index, self) {
      calls.push([this, index, self]);
      return x === 1 ? MatreshkaArray.of(x, x) : [x];
    }, context);

    expect(result.toJSON()).toEqual([1, 1, 2]);
    expect(calls).toEqual([
      [context, 0, arr],
      [context, 1, arr]
    ]);
    expect(() => new MatreshkaArray().flatMap(null)).toThrow(TypeError);
  });
});
