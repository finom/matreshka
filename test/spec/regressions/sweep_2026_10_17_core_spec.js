import MatreshkaArray from 'src/array';
import bindNode from 'src/bindnode';
import unbindNode from 'src/unbindnode';
import parseBindings from 'src/parsebindings';
import calc from 'src/calc';
import off from 'src/off';
import on from 'src/on';
import once from 'src/once';
import onDebounce from 'src/ondebounce';
import trigger from 'src/trigger';
import remove from 'src/remove';
import set from 'src/set';
import defs from 'src/_core/defs';
import selectAll from 'src/selectall';
import { text, style } from 'src/binders';

const sync = { debounceSetValue: false, debounceGetValue: false };
const el = (h) => {
  const w = document.createElement('div');
  w.innerHTML = h;
  return w.firstElementChild;
};
const click = (node) => node.dispatchEvent(new MouseEvent('click', { bubbles: true }));

describe('core sweep 3', () => {
  it('K1: unbinding a node whose binder has no setValue keeps the other nodes of the key', () => {
    const obj = {};
    const input = el('<input>');
    const span = el('<span></span>');
    bindNode(
      obj,
      'x',
      input,
      {
        on: 'input',
        getValue() {
          return this.value;
        }
      },
      { ...sync, useExactBinder: true }
    );
    bindNode(obj, 'x', span, text(), sync);
    unbindNode(obj, 'x', input);
    obj.x = 'b';
    expect(span.textContent).toBe('b');
  });

  it('K2: a value set in a change handler: the deep binding follows the final value', () => {
    const obj = { x: { y: 'start' } };
    const node = el('<span></span>');
    bindNode(obj, 'x.y', node, text(), sync);
    on(obj, 'change:x', (e) => {
      if (!e.value.ok) obj.x = { y: 'fixed', ok: true };
    });
    obj.x = { y: 'bad' };
    expect(obj.x.y).toBe('fixed');
    expect(node.textContent).toBe('fixed');
  });

  it('K2: a value set in a change handler: the delegated listener leaves the rejected value', () => {
    const obj = { x: {} };
    const f = vi.fn();
    on(obj, 'x@evt', f);
    let rejected;
    on(obj, 'change:x', (e) => {
      if (!e.value.ok) {
        rejected = e.value;
        obj.x = { ok: true };
      }
    });
    obj.x = {};
    trigger(rejected, 'evt');
    expect(f).toHaveBeenCalledTimes(0);
  });

  it('K3: an attribute binding is released when its item node is re-rendered', async () => {
    class A extends MatreshkaArray {
      itemRenderer = '<b title="{{a}}!"></b>';
    }
    const container = document.createElement('div');
    const arr = new A();
    arr.bindNode('container', container);
    arr.push({ a: 1 });
    const item = arr[0];
    const oldNode = container.firstChild;
    arr.rerender({ forceRerender: true });
    expect(container.firstChild).not.toBe(oldNode);
    set(item, 'a', 2);
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(oldNode.getAttribute('title')).toBe('1!');
  });

  it('K3: a re-render leaves one calc per attribute template, not one per render', () => {
    class A extends MatreshkaArray {
      itemRenderer = '<b title="{{a}}!"></b>';
    }
    const arr = new A();
    arr.bindNode('container', document.createElement('div'));
    arr.push({ a: 1 });
    const item = arr[0];
    for (let i = 0; i < 3; i++) arr.rerender({ forceRerender: true });
    const { events, props } = defs.get(item);
    expect(events['_change:deps:a']).toHaveLength(1);
    expect(Object.keys(props).filter((key) => key.startsWith('hidden'))).toHaveLength(1);
  });

  it('K3: an attribute binding moves with its sandbox to another array', async () => {
    class A extends MatreshkaArray {
      itemRenderer = '<b title="{{a}}!"></b>';
    }
    const first = new A();
    const second = new A();
    first.bindNode('container', document.createElement('div'));
    second.bindNode('container', document.createElement('div'));
    first.push({ a: 1 });
    const item = first[0];
    const node = first.nodes.container.firstChild;
    first.pull(0);
    second.push_(item, { moveSandbox: true });
    expect(second.nodes.container.firstChild).toBe(node);
    set(item, 'a', 2);
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(node.getAttribute('title')).toBe('2!');
  });

  it('K4: a delegated DOM listener on document', () => {
    const obj = {};
    const btn = document.createElement('button');
    btn.className = 'btn';
    document.body.appendChild(btn);
    bindNode(obj, 'doc', document);
    const f = vi.fn();
    on(obj, 'click::doc(.btn)', f);
    const errors = [];
    const onError = (e) => {
      errors.push(e.message);
      e.preventDefault();
    };
    window.addEventListener('error', onError);
    click(btn);
    window.removeEventListener('error', onError);
    btn.remove();
    expect(errors).toEqual([]);
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('K5: once removes only its own listener', () => {
    const obj = {};
    const f = vi.fn();
    once(obj, 'x', f);
    on(obj, 'x', f, {});
    trigger(obj, 'x');
    trigger(obj, 'x');
    expect(f).toHaveBeenCalledTimes(3);
  });

  it('K6: a bound value with brackets is not parsed as a binding', () => {
    const obj = { x: '{{y}}', y: 'Y' };
    const node = el('<div>a{{x}}</div>');
    parseBindings(obj, node);
    expect(node.textContent).toBe('a{{y}}');
  });

  it('K7: a delegated selector with a space before a pseudo-class with parentheses', () => {
    const obj = {};
    const node = el('<ul><li><b></b></li><i></i></ul>');
    bindNode(obj, 'x', node);
    const f = vi.fn();
    on(obj, 'click::x(li :not(i))', f);
    click(node.querySelector('i'));
    click(node.querySelector('b'));
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('K8: unbindNode of a deep key without a node keeps the bindings made on the target directly', () => {
    const obj = { a: {} };
    const own = el('<span></span>');
    const deep = el('<span></span>');
    bindNode(obj.a, 'b', own, text(), sync);
    bindNode(obj, 'a.b', deep, text(), sync);
    unbindNode(obj, 'a.b');
    obj.a.b = 'z';
    expect(own.textContent).toBe('z');
    expect(deep.textContent).toBe('');
  });

  it('K9: off cancels a pending onDebounce call', async () => {
    const obj = {};
    const f = vi.fn();
    onDebounce(obj, 'x', f);
    trigger(obj, 'x');
    off(obj, 'x', f);
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(f).not.toHaveBeenCalled();
  });

  it('K10: remove drops the DOM listeners of the key', () => {
    const obj = {};
    const f = vi.fn();
    on(obj, 'click::x', f);
    bindNode(obj, 'x', el('<div></div>'));
    remove(obj, 'x');
    const node = el('<div></div>');
    bindNode(obj, 'x', node);
    click(node);
    expect(f).not.toHaveBeenCalled();
  });

  it('K11: unbindNode(null) removes a binding made with exactKey and a dotted key', () => {
    const obj = {};
    const node = el('<span></span>');
    bindNode(obj, 'a.b', node, text(), { ...sync, exactKey: true });
    unbindNode(obj);
    set(obj, 'a.b', 'z');
    expect(node.textContent).toBe('');
  });

  it('K12: remove of a calc target stops the calc', () => {
    const obj = { a: 1 };
    calc(obj, 'c', 'a', (a) => a * 2, { debounceCalc: false });
    remove(obj, 'c');
    obj.a = 2;
    expect('c' in obj).toBe(false);
  });

  it('K13: style binder clears a camel-cased property on undefined', () => {
    const obj = {};
    const node = el('<div></div>');
    bindNode(obj, 'c', node, style('color'), sync);
    obj.c = 'red';
    obj.c = undefined;
    expect(node.style.color).toBe('');
  });

  it('K14: delegated mouseenter', () => {
    const obj = {};
    const node = el('<div><b class="y"></b></div>');
    bindNode(obj, 'x', node);
    const f = vi.fn();
    on(obj, 'mouseenter::x(.y)', f);
    node.firstChild.dispatchEvent(new MouseEvent('mouseenter', { bubbles: false }));
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('K15: trigger and selectAll with a selector skip text and attribute nodes bound by parseBindings', () => {
    const obj = { x: 1 };
    parseBindings(obj, el('<div>{{x}}</div>'));
    expect(() => trigger(obj, 'click::x(.y)')).not.toThrow();
    expect(() => selectAll(obj, ':bound(x) b')).not.toThrow();
  });

  it('K16: a selector with @ in an attribute value', () => {
    const obj = {};
    const node = el('<div><a href="mailto:a@b.c"></a></div>');
    bindNode(obj, 'x', node);
    const f = vi.fn();
    on(obj, 'click::x([href="mailto:a@b.c"])', f);
    click(node.querySelector('a'));
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('K17: off with null names and a callback', () => {
    const obj = {};
    const f = vi.fn();
    const g = vi.fn();
    on(obj, 'x', f);
    on(obj, 'y', f);
    on(obj, 'y', g);
    expect(() => off(obj, null, f)).not.toThrow();
    trigger(obj, 'x');
    trigger(obj, 'y');
    expect(f).not.toHaveBeenCalled();
    expect(g).toHaveBeenCalledTimes(1);
  });

  it('K18: unbindNode object form with a null node', () => {
    expect(() => unbindNode({}, { x: null })).not.toThrow();
    const obj = {};
    const node = el('<span></span>');
    bindNode(obj, 'x', node, text(), sync);
    unbindNode(obj, { x: null });
    obj.x = 'after';
    expect(node.textContent).toBe('');
  });

  it('K19: a trailing space in names adds no listener with an empty name', () => {
    const obj = {};
    const added = [];
    on(obj, 'a ', () => {});
    on(obj, 'addevent', (e) => added.push(e.name));
    on(obj, 'b ', () => {});
    expect(added).not.toContain('');
  });

  it('K20: an own accessor keeps working after on(change:x)', () => {
    let store = 1;
    const obj = {
      get x() {
        return store;
      },
      set x(v) {
        store = v;
      }
    };
    on(obj, 'change:x', () => {});
    obj.x = 5;
    expect(store).toBe(5);
  });

  it('K21: a property that cannot be redefined gives an error that names it', () => {
    expect(() => calc({}, 'n', { object: [1, 2], key: 'length' })).toThrow(
      '"length" cannot be made reactive: the property is not configurable'
    );
    const frozen = Object.freeze({ x: 1 });
    expect(() => on(frozen, 'change:x', () => {})).toThrow('"x" cannot be made reactive');
  });

  it('K20: an own getter gives the value and an own setter gets each new one', () => {
    let store = 1;
    const seen = [];
    const obj = {
      get x() {
        return store;
      },
      set x(v) {
        seen.push(v);
        store = v * 10;
      }
    };
    const f = vi.fn();
    on(obj, 'change:x', f);
    set(obj, 'x', 2);
    expect(seen).toEqual([2]);
    expect(obj.x).toBe(20);
    expect(f).toHaveBeenCalledTimes(1);
    const node = el('<span></span>');
    bindNode(obj, 'x', node, text(), sync);
    expect(node.textContent).toBe('20');
    expect(f.mock.calls[0][0]).toMatchObject({ value: 20, previousValue: 1 });
    // a setter that keeps the value as it was changes nothing
    set(obj, 'x', 2);
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('K20: a getter without a setter is replaced, as before', () => {
    const obj = {
      get x() {
        return 1;
      }
    };
    const f = vi.fn();
    on(obj, 'change:x', f);
    expect(obj.x).toBe(1);
    obj.x = 2;
    expect(obj.x).toBe(2);
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('K2: after a value set in a change handler, the deep binding is there once and follows later changes', () => {
    const obj = { x: { y: 'start' } };
    const node = el('<span></span>');
    bindNode(obj, 'x.y', node, text(), sync);
    on(obj, 'change:x', (e) => {
      if (!e.value.ok) obj.x = { y: 'fixed', ok: true };
    });
    const original = obj.x;
    obj.x = { y: 'bad' };
    obj.x.y = 'later';
    expect(node.textContent).toBe('later');
    original.y = 'old';
    expect(node.textContent).toBe('later');
    unbindNode(obj, 'x.y', node);
    obj.x.y = 'gone';
    expect(node.textContent).toBe('later');
  });

  it('K3: a template with a deep key leaves no listener behind after a re-render', async () => {
    class A extends MatreshkaArray {
      itemRenderer = '<b title="{{a.b}}!"></b>';
    }
    const arr = new A();
    arr.bindNode('container', document.createElement('div'));
    arr.push({ a: { b: 1 } });
    const item = arr[0];
    const oldNode = arr.nodes.container.firstChild;
    const listeners = () => Object.values(defs.get(item.a).events).flat().length;
    const before = listeners();
    arr.rerender({ forceRerender: true });
    expect(listeners()).toBe(before);
    item.a.b = 2;
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(oldNode.getAttribute('title')).toBe('1!');
    expect(arr.nodes.container.firstChild.getAttribute('title')).toBe('2!');
  });

  it('K15: a child selector after :bound() skips text nodes bound by parseBindings', () => {
    const obj = {};
    parseBindings(obj, el('<div>{{x}}<b></b></div>'));
    expect(selectAll(obj, ':bound(x) > b')).toEqual([]);
  });

  it('K17: off with null names and a callback removes its DOM event handlers too', () => {
    const obj = {};
    const f = vi.fn();
    const g = vi.fn();
    const node = el('<div></div>');
    on(obj, 'click::x', f);
    on(obj, 'click::x', g);
    bindNode(obj, 'x', node);
    off(obj, null, f);
    click(node);
    expect(f).not.toHaveBeenCalled();
    expect(g).toHaveBeenCalledTimes(1);
  });
});
