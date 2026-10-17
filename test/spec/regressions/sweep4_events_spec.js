import Matreshka from 'src/matreshka';
import MatreshkaArray from 'src/array';
import on from 'src/on';
import once from 'src/once';
import onDebounce from 'src/ondebounce';
import off from 'src/off';
import trigger from 'src/trigger';
import remove from 'src/remove';
import calc from 'src/calc';
import bindNode from 'src/bindnode';
import MatreshkaObject from 'src/object';

const wait = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));
const noopBinder = { on: null, getValue: null, setValue: null, initialize: null };

describe('sweep 4 (events and data)', () => {
  it('EV-1a on() after once() with the same function stays after the once fires', () => {
    const obj = {};
    const f = vi.fn();
    once(obj, 'x', f);
    on(obj, 'x', f);
    trigger(obj, 'x');
    trigger(obj, 'x');
    expect(f).toHaveBeenCalledTimes(3);
  });

  it('EV-1b on() after onDebounce() with the same function is called synchronously', () => {
    const obj = {};
    const f = vi.fn();
    onDebounce(obj, 'x', f);
    on(obj, 'x', f);
    trigger(obj, 'x');
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('EV-1c delegated on() after delegated once() with the same function stays', () => {
    const obj = { a: {} };
    const f = vi.fn();
    once(obj, 'a@x', f);
    on(obj, 'a@x', f);
    trigger(obj.a, 'x');
    trigger(obj.a, 'x');
    expect(f).toHaveBeenCalledTimes(3);
  });

  it('EV-1d DOM on() after DOM once() with the same function stays', () => {
    const obj = {};
    const node = document.createElement('div');
    bindNode(obj, 'x', node, noopBinder);
    const f = vi.fn();
    once(obj, 'click::x', f);
    on(obj, 'click::x', f);
    node.click();
    node.click();
    expect(f).toHaveBeenCalledTimes(3);
  });

  it('EV-2a off() of one delegated path keeps another path to the same object', () => {
    const shared = {};
    const obj = { a: shared, b: shared };
    const f = vi.fn();
    on(obj, 'a@x', f);
    on(obj, 'b@x', f);
    off(obj, 'a@x', f);
    trigger(shared, 'x');
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('EV-2b "selected@" and "items.*@" with one handler: moving the selection keeps the items listener', () => {
    const obj = new Matreshka();
    obj.items = MatreshkaArray.of({ t: 1 }, { t: 2 });
    const f = vi.fn();
    obj.on('items.*@change:t', f);
    obj.selected = obj.items[0];
    obj.on('selected@change:t', f);
    obj.selected = obj.items[1];
    obj.items[0].t = 'z';
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('EV-2c calc with two deep sources through one object keeps the second after the first moves', () => {
    const item = { name: 'a' };
    const obj = { selected: item, hovered: item };
    calc(obj, 'label', ['selected.name', 'hovered.name'], (s, h) => `${s}/${h}`, { debounceCalc: false });
    obj.selected = { name: 'b' };
    item.name = 'z';
    expect(obj.label).toBe('b/z');
  });

  it('EV-3 remove(a) takes "a@x" off the value that "b" also holds', () => {
    const shared = {};
    const obj = { a: shared, b: shared };
    const f = vi.fn();
    const g = vi.fn();
    on(obj, 'a@x', f);
    on(obj, 'b@x', g);
    remove(obj, 'a');
    trigger(shared, 'x');
    expect(f).not.toHaveBeenCalled();
    expect(g).toHaveBeenCalledTimes(1);
  });

  it('EV-4 off(root, "c@x", f) keeps the same delegated listener of another root on a shared child', () => {
    const child = {};
    const root1 = { c: child };
    const root2 = { c: child };
    const f = vi.fn();
    on(root1, 'c@x', f);
    on(root2, 'c@x', f);
    off(root1, 'c@x', f);
    trigger(child, 'x');
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('EV-5 after off() on a child, on() on the parent delegates to it again', () => {
    const child = {};
    const root = { c: child };
    const f = vi.fn();
    on(root, 'c@x', f);
    off(child);
    on(root, 'c@x', f);
    trigger(child, 'x');
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('EV-6 off(null, callback) removes the callback from delegated events too', () => {
    const obj = { a: {} };
    const f = vi.fn();
    on(obj, 'a@x', f);
    off(obj, null, f);
    trigger(obj.a, 'x');
    expect(f).not.toHaveBeenCalled();
  });

  it('EV-6 off(null, callback) takes the callback off every own delegation and leaves the rest', () => {
    const f = vi.fn();
    const g = vi.fn();
    const ctx = {};
    const obj = { a: { b: {} }, c: {} };
    on(obj, 'a.b@x', f);
    on(obj, 'c@x', f, ctx);
    on(obj, 'c@x', f);
    on(obj, 'c@x', g);
    calc(obj, 'label', 'a.b.name', (name) => name, { debounceCalc: false });
    const parent = { obj };
    on(parent, 'obj.c@y', f);
    const arr = MatreshkaArray.of({});
    on(arr, '*@x', f);
    const mo = new MatreshkaObject({ k: {} });
    on(mo, '*@x', f);

    off(obj, null, f, ctx);
    trigger(obj.c, 'x');
    expect(f).toHaveBeenCalledTimes(1);

    off(obj, null, f);
    off(arr, null, f);
    off(mo, null, f);
    f.mockClear();
    g.mockClear();
    trigger(obj.a.b, 'x');
    trigger(obj.c, 'x');
    trigger(arr[0], 'x');
    trigger(mo.k, 'x');
    expect(f).not.toHaveBeenCalled();
    expect(g).toHaveBeenCalledTimes(1);
    // calc's own listeners and a parent's delegation stay
    obj.a.b.name = 'n';
    expect(obj.label).toBe('n');
    trigger(obj.c, 'y');
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('EV-7 off() of one name of an onDebounce on two names keeps the pending call of the other', async () => {
    const obj = {};
    const f = vi.fn();
    onDebounce(obj, 'a b', f);
    trigger(obj, 'b');
    off(obj, 'a', f);
    await wait();
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('EV-8 a class accessor keeps running after the property becomes reactive', () => {
    class Foo extends Matreshka {
      set x(v) {
        this._x = v * 2;
      }
      get x() {
        return this._x;
      }
    }
    const obj = new Foo();
    obj.x = 1;
    obj.on('change:x', () => {});
    obj.x = 2;
    expect(obj._x).toBe(4);
    expect(obj.x).toBe(4);
  });
});
