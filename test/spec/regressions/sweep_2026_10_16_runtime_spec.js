// Regressions found by the 2026-10-16 sweep (P6, P5 and the core audit's C1–C9).
import Matreshka from 'src/matreshka';
import MatreshkaArray from 'src/array';
import MatreshkaObject from 'src/object';
import bindNode from 'src/bindnode';
import calc from 'src/calc';
import Class from 'src/class';
import instantiate from 'src/instantiate';
import off from 'src/off';
import on from 'src/on';
import remove from 'src/remove';
import set from 'src/set';
import unbindNode from 'src/unbindnode';
import { text } from 'src/binders';

const el = (html) => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  return wrapper.firstElementChild;
};
const click = (node) => node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
const sync = { debounceSetValue: false, debounceGetValue: false };

describe('2026-10-16 sweep', () => {
  it('P6: remove fires delete and delete:KEY for a property Matreshka does not track yet', () => {
    const object = { k: 1 };
    const onKey = vi.fn();
    const onAny = vi.fn();
    on(object, { 'delete:k': onKey, delete: onAny });
    remove(object, 'k');
    expect('k' in object).toBe(false);
    expect(onKey).toHaveBeenCalledTimes(1);
    expect(onKey.mock.calls[0][0]).toMatchObject({ key: 'k', value: 1 });
    expect(onAny).toHaveBeenCalledTimes(1);

    const instance = new Matreshka();
    instance.k = 2;
    const handler = vi.fn();
    instance.on('delete:k', handler);
    instance.remove('k');
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('P6: remove stays quiet for a missing key and with silent', () => {
    const object = { k: 1 };
    const handler = vi.fn();
    on(object, 'delete', handler);
    remove(object, 'missing');
    remove(object, 'k', { silent: true });
    expect(handler).not.toHaveBeenCalled();
  });

  it('P5: calc computes at once and recomputes a task later, or at once with debounceCalc: false (as the skill says)', async () => {
    const object = { a: 1 };
    calc(object, 't', 'a', (a) => a * 10);
    expect(object.t).toBe(10);
    object.a = 2;
    expect(object.t).toBe(10);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(object.t).toBe(20);

    const now = { a: 1 };
    calc(now, 't', 'a', (a) => a * 10, { debounceCalc: false });
    now.a = 2;
    expect(now.t).toBe(20);
  });

  // C1
  it('C1: click::x reaches a node bound with silent: true', () => {
    const obj = {};
    const node = el('<button></button>');
    const handler = vi.fn();
    on(obj, 'click::x', handler);
    bindNode(obj, 'x', node, null, { silent: true });
    click(node);
    expect(handler).toHaveBeenCalledTimes(1);
  });
  it('C1: click::x stops after unbindNode with silent: true', () => {
    const obj = {};
    const node = el('<button></button>');
    const handler = vi.fn();
    bindNode(obj, 'x', node);
    on(obj, 'click::x', handler);
    unbindNode(obj, 'x', node, { silent: true });
    click(node);
    expect(handler).toHaveBeenCalledTimes(0);
  });
  it('C1: an item rendered by push_ with silent gets its DOM events', () => {
    const handler = vi.fn();
    const Item = Class({
      extends: MatreshkaObject,
      constructor(data) {
        MatreshkaObject.call(this, data);
        this.on('click::(.btn)', handler);
      }
    });
    const container = el('<div></div>');
    const arr = new MatreshkaArray();
    arr.Model = Item;
    arr.itemRenderer = '<div><button class="btn"></button></div>';
    arr.bindNode('container', container);
    arr.push_({ a: 1 }, { silent: true });
    click(container.querySelector('.btn'));
    expect(handler).toHaveBeenCalledTimes(1);
  });
  it('C2: sync calc diamond recalculates the end with both new values', () => {
    const o = { debounceCalc: false };
    const obj = { a: 1 };
    calc(obj, 'b', 'a', (a) => a * 10, o);
    calc(obj, 'c', 'b', (b) => b + 1, o);
    calc(obj, 'd', 'b', (b) => b + 2, o);
    calc(obj, 'e', ['c', 'd'], (c, d) => c + d, o);
    obj.a = 2;
    expect(obj.e).toBe(43);
  });
  it('C3: a.b@change:c survives a copy of a that keeps the same b', () => {
    const b = { c: 1 };
    const obj = { a: { b } };
    const h = vi.fn();
    on(obj, 'a.b@change:c', h);
    obj.a = { ...obj.a };
    b.c = 2;
    expect(h).toHaveBeenCalledTimes(1);
  });
  it('C3: deep binding a.b.c survives the same copy', () => {
    const leaf = { c: 1 };
    const obj = { a: { b: leaf } };
    const node = el('<span></span>');
    bindNode(obj, 'a.b.c', node, text(), sync);
    obj.a = { ...obj.a };
    leaf.c = 2;
    expect(node.textContent).toBe('2');
  });
  it('C3: deep calc source a.b.c survives the same copy', () => {
    const leaf = { c: 1 };
    const obj = { a: { b: leaf } };
    calc(obj, 't', 'a.b.c', (c) => c, { debounceCalc: false });
    obj.a = { ...obj.a };
    leaf.c = 2;
    expect(obj.t).toBe(2);
  });
  it('C3: after a new a with a new b, only the new leaf moves a deep calc, binding and listener', () => {
    const oldLeaf = { c: 1 };
    const obj = { a: { b: oldLeaf } };
    const node = el('<span></span>');
    const h = vi.fn();
    calc(obj, 't', 'a.b.c', (c) => c, { debounceCalc: false });
    bindNode(obj, 'a.b.c', node, text(), sync);
    on(obj, 'a.b@change:c', h);
    const newLeaf = { c: 5 };
    obj.a = { b: newLeaf };
    expect([obj.t, node.textContent]).toEqual([5, '5']);
    oldLeaf.c = 7;
    expect([obj.t, node.textContent, h.mock.calls.length]).toEqual([5, '5', 0]);
    newLeaf.c = 9;
    expect([obj.t, node.textContent, h.mock.calls.length]).toEqual([9, '9', 1]);
    obj.a.b = { c: 11 };
    newLeaf.c = 12;
    expect([obj.t, node.textContent, h.mock.calls.length]).toEqual([11, '11', 1]);
  });
  it('C3: off and unbindNode still remove a deep listener and binding after the copy', () => {
    const leaf = { c: 1 };
    const obj = { a: { b: leaf } };
    const node = el('<span></span>');
    const h = vi.fn();
    bindNode(obj, 'a.b.c', node, text(), sync);
    on(obj, 'a.b@change:c', h);
    obj.a = { ...obj.a };
    off(obj, 'a.b@change:c');
    unbindNode(obj, 'a.b.c', node);
    leaf.c = 2;
    expect([node.textContent, h.mock.calls.length]).toEqual(['1', 0]);
  });
  it('C4: skipCalc on a deep source skips the calculation', () => {
    const obj = { a: { b: 1 } };
    calc(obj, 't', 'a.b', (b) => b * 10, { debounceCalc: false });
    set(obj.a, 'b', 2, { skipCalc: true });
    expect(obj.t).toBe(10);
  });
  it('C4: force on a deep source recalculates, as on a plain one', () => {
    const obj = { a: { b: 1 } };
    const h = vi.fn((b) => b);
    calc(obj, 't', 'a.b', h, { debounceCalc: false });
    set(obj.a, 'b', 1, { force: true });
    expect(h).toHaveBeenCalledTimes(2);
  });
  it('C4: force on a branch with the same object keeps a deep binding and recalculates', () => {
    const leaf = { c: 1 };
    const obj = { a: { b: leaf } };
    const node = el('<span></span>');
    const h = vi.fn((c) => c);
    bindNode(obj, 'a.b.c', node, text(), sync);
    calc(obj, 't', 'a.b.c', h, { debounceCalc: false });
    set(obj.a, 'b', leaf, { force: true });
    leaf.c = 2;
    expect([node.textContent, obj.t, h.mock.calls.length]).toEqual(['2', 2, 3]);
  });
  it('C5: delegated DOM selector with a comma inside :is()', () => {
    const obj = {};
    const node = el('<div><b class="a"></b></div>');
    bindNode(obj, 'x', node);
    const h = vi.fn();
    on(obj, 'click::x(:is(.a, .b))', h);
    click(node.firstChild);
    expect(h).toHaveBeenCalledTimes(1);
  });
  it('C5: delegated DOM selector with a comma in an attribute value', () => {
    const obj = {};
    const node = el('<div><b data-k="1,2"></b></div>');
    bindNode(obj, 'x', node);
    const h = vi.fn();
    on(obj, 'click::x([data-k="1,2"])', h);
    expect(() => click(node.firstChild)).not.toThrow();
    expect(h).toHaveBeenCalledTimes(1);
  });
  it('C5: escaped quotes and commas in a delegated selector stay in their part', () => {
    const obj = {};
    const node = el('<div><b title=\'a",b\'></b><i class="p,q"></i></div>');
    bindNode(obj, 'x', node);
    const h = vi.fn();
    on(obj, 'click::x([title="a\\",b"], .p\\,q)', h);
    click(node.querySelector('b'));
    click(node.querySelector('i'));
    expect(h).toHaveBeenCalledTimes(2);
  });

  it('C5: a top-level selector list still matches each part, only inside the bound node', () => {
    const obj = {};
    const outer = el('<div class="a"><div><b class="b"></b><i class="c"></i><u class="d"></u></div></div>');
    const node = outer.firstChild;
    bindNode(obj, 'x', node);
    const h = vi.fn();
    on(obj, 'click::x(.b, [title="x,y"], .a .d, .c)', h);
    click(node.querySelector('.b'));
    click(node.querySelector('.c'));
    click(node.querySelector('.d'));
    expect(h).toHaveBeenCalledTimes(2);
  });
  it('C6: remove(a) drops the deep binding a.b', () => {
    const a = { b: 1 };
    const obj = { a };
    const node = el('<span></span>');
    bindNode(obj, 'a.b', node, text(), sync);
    remove(obj, 'a');
    a.b = 2;
    expect(node.textContent).toBe('1');
  });
  it('C6: remove(a) keeps a deep binding under another key and the binding on a.b of a new a stays off', () => {
    const obj = { a: { b: 1 }, ab: { b: 1 } };
    const node = el('<span></span>');
    const other = el('<span></span>');
    bindNode(obj, 'a.b', node, text(), sync);
    bindNode(obj, 'ab.b', other, text(), sync);
    remove(obj, 'a');
    obj.a = { b: 3 };
    obj.ab.b = 4;
    expect([node.textContent, other.textContent]).toEqual(['1', '4']);
  });
  it('C7: a getter in a Class prototype stays a getter', () => {
    const C = Class({
      a: 1,
      get double() {
        return this.a * 2;
      }
    });
    const c = new C();
    c.a = 5;
    expect(c.double).toBe(10);
  });
  it('C7: a getter that reads instance state does not run at Class()', () => {
    expect(() =>
      Class({
        get count() {
          return this.items.length;
        }
      })
    ).not.toThrow();
  });
  it('C7: a setter in a Class prototype works', () => {
    const C = Class({
      set v(x) {
        this._v = x * 2;
      }
    });
    const c = new C();
    c.v = 2;
    expect(c._v).toBe(4);
  });
  it('C8: instances of Class list no "extends" in for...in', () => {
    const P = Class({ a() {} });
    const C = Class({ extends: P, b() {} });
    const keys = [];
    for (const k in new C()) keys.push(k);
    expect(keys).not.toContain('extends');
  });
  it('C9: null assigned to an instantiated Matreshka.Array clears it, as {} does for Matreshka.Object', () => {
    const obj = { x: [1] };
    instantiate(obj, 'x', MatreshkaArray);
    expect(() => {
      obj.x = null;
    }).not.toThrow();
    expect([obj.x instanceof MatreshkaArray, obj.x.length]).toEqual([true, 0]);
    const arr = new MatreshkaArray(1, 2);
    arr.recreate(null);
    expect(arr.length).toBe(0);
  });
});
