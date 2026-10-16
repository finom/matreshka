// Regressions found by the 2026-10-16 sweep (A1–A8 in its report).
import MatreshkaObject from 'src/object';
import MatreshkaArray from 'src/array';
import Class from 'src/class';

const wait = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));

function renderedArray(itemRenderer = '<li></li>') {
  const arr = new MatreshkaArray();
  arr.bindNode('sandbox', '<ul></ul>');
  arr.itemRenderer = itemRenderer;
  return arr;
}

function cleanObjectPrototype() {
  const own = Object.getOwnPropertyNames(Object.prototype).filter((k) =>
    ['value', 'mediator', 'bindings', 'x', 'id'].includes(k)
  );
  for (const k of own) delete Object.prototype[k];
  for (const k of ['value', 'x', 'id']) delete Object.prototype.toString[k];
  for (const k of ['value', 'x', 'id']) delete Object[k];
  return own;
}

describe('sweep A findings', () => {
  afterEach(() => {
    cleanObjectPrototype();
    history.replaceState(null, '', '/');
  });

  it('A1 setData from JSON with a "__proto__" key pollutes Object.prototype', () => {
    try {
      new MatreshkaObject(JSON.parse('{"__proto__": {"x": 1}}'));
    } catch {}
    const polluted = cleanObjectPrototype();
    expect(polluted).toEqual([]);
  });

  it('A2 setData("toString", v) writes onto Object.prototype.toString and the key keeps the function', () => {
    const obj = new MatreshkaObject();
    const spy = vi.fn();
    obj.on('change:toString', spy);
    obj.setData('toString', 'x');
    const written = Object.hasOwn(Object.prototype.toString, 'value');
    const got = obj.toString;
    cleanObjectPrototype();
    expect(written).toBe(false);
    expect(got).toBe('x');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('A3 trackBy: an id named like an Object.prototype member gives a function as the item', () => {
    const arr = new MatreshkaArray();
    arr.trackBy = 'id';
    arr.recreate([{ id: 'constructor', x: 1 }]);
    const item = arr[0];
    cleanObjectPrototype();
    expect(typeof item).toBe('object');
  });

  it('A3b trackBy: an id "__proto__" writes the item data onto Object.prototype', () => {
    const arr = new MatreshkaArray();
    arr.trackBy = 'id';
    arr.recreate([JSON.parse('{"id": "__proto__", "x": 1}')]);
    const polluted = cleanObjectPrototype();
    expect(polluted).toEqual([]);
  });

  it('A4 trackBy: a Model instance as new data adds nodes/$nodes as data keys of the tracked item', () => {
    const Item = Class({ extends: MatreshkaObject });
    const arr = new MatreshkaArray();
    arr.Model = Item;
    arr.trackBy = 'id';
    arr.recreate([{ id: 1, name: 'a' }]);
    arr.recreate([new Item({ id: 1, name: 'b' })]);
    expect(arr[0].keys()).toEqual(['id', 'name']);
  });

  it('A5 splice that puts back an item it removes throws on a rendered array', () => {
    const arr = renderedArray('<li>{{v}}</li>');
    const a = { v: 'a' };
    const b = { v: 'b' };
    arr.push(a, b);
    expect(() => arr.splice(0, 2, b, a)).not.toThrow();
    expect([...arr.nodes.sandbox.children].map((n) => n.textContent)).toEqual(['b', 'a']);
  });

  it('A6 orderBy: one item without the key, or a null item, leaves the others unsorted', () => {
    const missing = new MatreshkaArray({ a: 2 }, {}, { a: 1 });
    missing.orderBy('a');
    const withNull = new MatreshkaArray({ a: 3 }, null, { a: 1 }, { a: 2 });
    withNull.orderBy('a');
    expect(missing.toJSON().map((x) => x.a)).toEqual([1, 2, undefined]);
    expect(
      withNull
        .toJSON()
        .filter(Boolean)
        .map((x) => x.a)
    ).toEqual([1, 2, 3]);
  });

  it('A7 lastIndexOf(x, undefined) differs from Array.prototype.lastIndexOf', () => {
    const arr = new MatreshkaArray(1, 2, 1, 2);
    expect(arr.lastIndexOf(2, undefined)).toBe([1, 2, 1, 2].lastIndexOf(2, undefined));
  });

  it('A8 hash router: opening #!/foo (no trailing slash) adds a history entry', async () => {
    history.replaceState(null, '', '/#!/foo');
    const before = history.length;
    vi.resetModules();
    const { initRouter } = await import('src/router');
    const obj = {};
    initRouter(obj, '/a/');
    await wait();
    expect(obj.a).toBe('foo');
    expect(history.length).toBe(before);
  });
});
