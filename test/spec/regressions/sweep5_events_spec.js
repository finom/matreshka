import MatreshkaArray from 'src/array';
import on from 'src/on';
import off from 'src/off';
import once from 'src/once';
import onDebounce from 'src/ondebounce';
import trigger from 'src/trigger';
import bindNode from 'src/bindnode';
import defs from 'src/_core/defs';

const wait = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));
const click = (node) => node.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
const makeNode = () => window.document.body.appendChild(window.document.createElement('div'));

describe('sweep 5 (events)', () => {
  it('EV-1a off of one delegated path keeps the DOM listener another path to the same object holds', () => {
    const shared = {};
    const obj = { a: shared, b: shared };
    const node = makeNode();
    bindNode(shared, 'x', node);
    const f = vi.fn();
    on(obj, 'a@click::x', f);
    on(obj, 'b@click::x', f);
    off(obj, 'a@click::x', f);
    click(node);
    expect(f).toHaveBeenCalledTimes(1);
    off(obj, 'b@click::x', f);
    click(node);
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('EV-1b replacing one branch keeps the DOM listener the other path holds', () => {
    const shared = {};
    const obj = { a: shared, b: shared };
    const node = makeNode();
    bindNode(shared, 'x', node);
    const f = vi.fn();
    on(obj, 'a@click::x', f);
    on(obj, 'b@click::x', f);
    obj.a = {};
    click(node);
    expect(f).toHaveBeenCalledTimes(1);
  });

  it("EV-1c a child's own DOM listener stays when a parent's identical delegation goes", () => {
    const child = {};
    const ctx = {};
    const obj = { a: child };
    const node = makeNode();
    bindNode(child, 'x', node);
    const f = vi.fn();
    on(child, 'click::x', f, ctx);
    on(obj, 'a@click::x', f, ctx);
    off(obj, 'a@click::x', f);
    click(node);
    expect(f).toHaveBeenCalledTimes(1);
    off(child, 'click::x', f);
    click(node);
    expect(f).toHaveBeenCalledTimes(1);
  });

  it("EV-1d off(child, 'click::x') keeps the parent's delegation, as off(child, 'x') does", () => {
    const obj = { a: {} };
    const f = vi.fn();
    const node = makeNode();
    bindNode(obj.a, 'x', node);
    on(obj, 'a@click::x', f);
    off(obj.a, 'click::x');
    click(node);
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('EV-1e a delegated DOM listener next to another one on the same key keeps and drops only its own entries', () => {
    const child = {};
    const obj = { a: child };
    const node = makeNode();
    bindNode(child, 'x', node);
    const ctx = {};
    const f = vi.fn();
    const g = vi.fn();
    on(child, 'click::x', g);
    on(child, 'click::x', f, ctx);
    on(obj, 'a@click::x', f, ctx);
    off(obj, 'a@click::x', f);
    click(node);
    expect(f).toHaveBeenCalledTimes(1);
    off(child, 'click::x', f);
    click(node);
    expect(f).toHaveBeenCalledTimes(1);
    expect(g).toHaveBeenCalledTimes(2);
    expect(defs.get(child).events['_bind:x']).toHaveLength(1);
    expect(defs.get(child).events['_unbind:x']).toHaveLength(1);
  });

  it('EV-2 on/off of a DOM event leaves no internal entries', () => {
    const obj = {};
    const f = () => {};
    for (let i = 0; i < 3; i++) {
      on(obj, 'click::x', f);
      off(obj, 'click::x', f);
    }
    expect(defs.get(obj).events['_bind:x']).toBeUndefined();
    expect(defs.get(obj).events['_unbind:x']).toBeUndefined();
  });

  it('EV-3a removing one array item keeps the pending debounced call from another item', async () => {
    const arr = new MatreshkaArray({ x: 0 }, { x: 0 });
    const f = vi.fn();
    onDebounce(arr, '*@change:x', f, 5);
    arr[0].x = 1;
    arr.pop();
    await wait();
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('EV-3b replacing the branch right after a change keeps the pending debounced call', async () => {
    const obj = { a: { x: 0 } };
    const f = vi.fn();
    onDebounce(obj, 'a@change:x', f, 5);
    obj.a.x = 1;
    obj.a = { x: 5 };
    await wait();
    expect(f).toHaveBeenCalledTimes(1);
  });

  it("EV-3c the user's off of a delegated debounced listener still cancels its pending call", async () => {
    const obj = { a: { x: 0 } };
    const f = vi.fn();
    onDebounce(obj, 'a@change:x', f, 5);
    obj.a.x = 1;
    off(obj, 'a@change:x', f);
    await wait();
    expect(f).not.toHaveBeenCalled();
  });

  it("EV-3d the user's off of one delegated name keeps the pending call of another name on the same debounce", async () => {
    const obj = { a: { x: 0 }, b: { x: 0 } };
    const f = vi.fn();
    onDebounce(obj, 'a@change:x b@change:x', f, 5);
    obj.b.x = 1;
    off(obj, 'a@change:x', f);
    await wait();
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('EV-4a off(name, callback) cancels a pending DOM onDebounce call', async () => {
    const obj = {};
    const node = makeNode();
    bindNode(obj, 'x', node);
    const f = vi.fn();
    onDebounce(obj, 'click::x', f, 5);
    click(node);
    off(obj, 'click::x', f);
    await wait();
    expect(f).not.toHaveBeenCalled();
  });

  it('EV-4b off() with no arguments cancels a pending DOM onDebounce call', async () => {
    const obj = {};
    const node = makeNode();
    bindNode(obj, 'x', node);
    const f = vi.fn();
    onDebounce(obj, 'click::x', f, 5);
    click(node);
    off(obj);
    await wait();
    expect(f).not.toHaveBeenCalled();
  });

  it('EV-4c off of the DOM name keeps the pending call of a plain name on the same debounce', async () => {
    const obj = {};
    const node = makeNode();
    bindNode(obj, 'x', node);
    const f = vi.fn();
    onDebounce(obj, 'click::x y', f, 5);
    trigger(obj, 'y');
    off(obj, 'click::x', f);
    await wait();
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('EV-5a once fires once when an earlier change handler changes the value again', () => {
    const obj = { x: 0 };
    const f = vi.fn();
    on(obj, 'change:x', () => {
      if (obj.x === 1) obj.x = 2;
    });
    once(obj, 'change:x', f);
    obj.x = 1;
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('EV-5b once fires once when an earlier handler triggers the event again', () => {
    const obj = {};
    const f = vi.fn();
    let depth = 0;
    on(obj, 'x', () => {
      if (!depth++) trigger(obj, 'x');
    });
    once(obj, 'x', f);
    trigger(obj, 'x');
    expect(f).toHaveBeenCalledTimes(1);
  });
});
