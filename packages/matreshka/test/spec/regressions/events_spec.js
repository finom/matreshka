import MatreshkaObject from 'src/object';
import MatreshkaArray from 'src/array';
import on from 'src/on';
import off from 'src/off';
import once from 'src/once';
import trigger from 'src/trigger';
import bindNode from 'src/bindnode';
import unbindNode from 'src/unbindnode';
import mq from 'src/_dom/mq';
import defs from 'src/_core/defs';

function click(node) {
  node.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
}

function makeNode(html = '<span class="a"></span>') {
  const node = window.document.body.appendChild(window.document.createElement('div'));
  node.innerHTML = html;
  return node;
}

describe('Events regressions', () => {
  it('EV-A off(name, callback) removes a DOM event handler', () => {
    const obj = {};
    const node = makeNode();
    const handler = vi.fn();
    bindNode(obj, 'x', node);
    on(obj, 'click::x', handler);
    off(obj, 'click::x', handler);
    click(node);
    expect(handler).not.toHaveBeenCalled();
  });

  it('EV-A2 off(name, callback) on a DOM event also stops it on nodes bound later', () => {
    const obj = {};
    const handler = vi.fn();
    on(obj, 'click::x', handler);
    off(obj, 'click::x', handler);
    const node = makeNode();
    bindNode(obj, 'x', node);
    click(node);
    expect(handler).not.toHaveBeenCalled();
  });

  it('EV-B once() on a DOM event fires only once', () => {
    const obj = {};
    const node = makeNode();
    const handler = vi.fn();
    bindNode(obj, 'x', node);
    once(obj, 'click::x', handler);
    click(node);
    click(node);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('EV-C the same DOM handler added twice fires once, as for other events', () => {
    const obj = {};
    const node = makeNode();
    const handler = vi.fn();
    bindNode(obj, 'x', node);
    on(obj, 'click::x', handler);
    on(obj, 'click::x', handler);
    click(node);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('EV-D two delegated listeners on the same first key both follow a reassigned branch', () => {
    const obj = { a: { b: 1 } };
    const h1 = vi.fn();
    const h2 = vi.fn();
    on(obj, 'a@change:x', h1);
    on(obj, 'a@change:y', h2);
    obj.a = {};
    obj.a.x = 1;
    obj.a.y = 1;
    expect(h1).toHaveBeenCalledTimes(1);
    expect(h2).toHaveBeenCalledTimes(1);
  });

  it('EV-E off of one delegated listener keeps another one on the same path', () => {
    const obj = { a: {} };
    const h1 = vi.fn();
    const h2 = vi.fn();
    on(obj, 'a.b@foo', h1);
    on(obj, 'a.b@bar', h2);
    off(obj, 'a.b@foo', h1);
    obj.a = { b: {} };
    trigger(obj.a.b, 'bar');
    expect(h2).toHaveBeenCalledTimes(1);
  });

  it('EV-F asterisk on Matreshka.Object: the replaced value stops firing', () => {
    const obj = new MatreshkaObject({ a: new MatreshkaObject() });
    const oldItem = obj.a;
    const handler = vi.fn();
    on(obj, '*@foo', handler);
    obj.a = new MatreshkaObject();
    trigger(oldItem, 'foo');
    expect(handler).not.toHaveBeenCalled();
  });

  it('EV-G off() of all events keeps bindings working', () => {
    const obj = {};
    const node = window.document.createElement('span');
    bindNode(
      obj,
      'x',
      node,
      {
        setValue(value) {
          this.textContent = value;
        }
      },
      { debounceSetValue: false }
    );
    off(obj);
    obj.x = 'hello';
    expect(node.textContent).toBe('hello');
  });

  it('EV-H off() of all events keeps Matreshka.Object "set" working for new listeners', () => {
    const obj = new MatreshkaObject({ a: 1 });
    off(obj);
    const handler = vi.fn();
    on(obj, 'set', handler);
    obj.a = 2;
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('EV-I off() on a never-touched object does not throw', () => {
    expect(() => off({})).not.toThrow();
  });

  it('EV-J off() of all events fires removeevent', () => {
    const obj = {};
    on(obj, 'foo', () => {});
    const handler = vi.fn();
    on(obj, 'removeevent', handler);
    off(obj);
    expect(handler).toHaveBeenCalled();
  });

  it('EV-K off() removes only the DOM handlers of this object from a shared node', () => {
    const obj1 = {};
    const obj2 = {};
    const node = makeNode();
    const h1 = vi.fn();
    const h2 = vi.fn();
    bindNode(obj1, 'x', node);
    bindNode(obj2, 'y', node);
    on(obj1, 'click::x', h1);
    on(obj2, 'click::y', h2);
    off(obj2);
    click(node);
    expect(h1).toHaveBeenCalledTimes(1);
    expect(h2).not.toHaveBeenCalled();
  });

  it('EV-N mq parseHTML("<col>") returns a col element', () => {
    const result = mq.parseHTML('<col>');
    expect(result[0]?.tagName).toBe('COL');
  });

  it('EV-Q addevent fires for a DOM event listener', () => {
    const obj = {};
    const handler = vi.fn();
    on(obj, 'addevent:click::x', handler);
    on(obj, 'click::x', () => {});
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('EV-W once() handler that re-fires its own event runs only once', () => {
    const obj = {};
    let calls = 0;
    once(obj, 'foo', () => {
      calls += 1;
      if (calls < 5) trigger(obj, 'foo');
    });
    trigger(obj, 'foo');
    expect(calls).toBe(1);
  });

  it('EV-X off of one asterisk listener keeps another asterisk listener on a Matreshka.Array', () => {
    const arr = new MatreshkaArray();
    const h1 = vi.fn();
    const h2 = vi.fn();
    on(arr, '*@foo', h1);
    on(arr, '*@bar', h2);
    off(arr, '*@foo', h1);
    arr.push({});
    trigger(arr[0], 'bar');
    expect(h2).toHaveBeenCalledTimes(1);
  });

  it('EV-Z unbindNode of one deep binding keeps another deep binding on the same branch', () => {
    const obj = { a: { b: { c: 'c', d: 'd' } } };
    const n1 = window.document.createElement('input');
    const n2 = window.document.createElement('input');
    bindNode(obj, 'a.b.c', n1);
    bindNode(obj, 'a.b.d', n2);
    unbindNode(obj, 'a.b.c', n1);
    obj.a = { b: { c: 'c2', d: 'd2' } };
    expect(n2.value).toBe('d2');
  });

  it('EV-Z2 unbindNode of a deep binding stops it following a reassigned middle branch', () => {
    const obj = { a: { b: { c: 'c' } } };
    const input = window.document.createElement('input');
    bindNode(obj, 'a.b.c', input);
    unbindNode(obj, 'a.b.c', input);
    obj.a.b = { c: 'new' };
    expect(input.value).toBe('c');
  });

  it('EV-NS off() of one object keeps DOM handlers of another object whose id + key spell the same namespace', () => {
    const objA = {};
    on(objA, 'foo', () => {});
    const idA = defs.get(objA).id;
    // objB gets the id idA * 10 + 1, so `${idB}x` === `${idA}1x`
    let objB;
    do {
      objB = {};
      on(objB, 'foo', () => {});
    } while (defs.get(objB).id < idA * 10 + 1);
    expect(`${defs.get(objB).id}x`).toBe(`${idA}1x`);
    const node = makeNode();
    const hA = vi.fn();
    bindNode(objA, '1x', node);
    bindNode(objB, 'x', node);
    on(objA, 'click::1x', hA);
    off(objB);
    click(node);
    expect(hA).toHaveBeenCalledTimes(1);
  });

  it('EV-FO delegated focus::x(input) fires when an input inside the bound node gets focus', () => {
    const obj = {};
    const node = makeNode('<input>');
    const handler = vi.fn();
    bindNode(obj, 'x', node);
    on(obj, 'focus::x(input)', handler);
    node.querySelector('input').focus();
    expect(handler).toHaveBeenCalledTimes(1);
  });
  it('EV-A3 off(name, callback) on one DOM event keeps another DOM event with the same handler', () => {
    const obj = {};
    const node = makeNode();
    const handler = vi.fn();
    bindNode(obj, 'x', node);
    on(obj, 'click::x', handler);
    on(obj, 'keyup::x', handler);
    off(obj, 'click::x', handler);
    node.dispatchEvent(new window.KeyboardEvent('keyup', { bubbles: true }));
    click(node);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('EV-A4 off("click::x") keeps a "bind:x" listener added by the user', () => {
    const obj = {};
    const handler = vi.fn();
    on(obj, 'click::x', () => {});
    on(obj, 'bind:x', handler);
    off(obj, 'click::x');
    bindNode(obj, 'x', makeNode());
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('EV-K2 mq off with a namespace only removes a handler that is not the first on the node', () => {
    const node = makeNode();
    const h1 = vi.fn();
    const h2 = vi.fn();
    mq(node).on('click.one', h1);
    mq(node).on('click.two', h2);
    mq(node).off('.two');
    click(node);
    expect(h1).toHaveBeenCalledTimes(1);
    expect(h2).not.toHaveBeenCalled();
  });

  it('EV-Q2 "addevent:click::x" is an ordinary event, not a DOM listener', () => {
    const obj = {};
    const node = makeNode();
    const handler = vi.fn();
    bindNode(obj, 'x', node);
    on(obj, 'addevent:click::x', handler);
    click(node);
    expect(handler).not.toHaveBeenCalled();
  });

  it('EV-J2 off(name, callback) on a DOM event fires removeevent:NAME', () => {
    const obj = {};
    const handler = vi.fn();
    const callback = () => {};
    on(obj, 'click::x', callback);
    on(obj, 'removeevent:click::x', handler);
    off(obj, 'click::x', callback);
    expect(handler).toHaveBeenCalledTimes(1);
  });
  it('P1 off() with 20000 listeners on one name is linear', () => {
    const obj = {};
    for (let i = 0; i < 20000; i++) on(obj, 'change:x', () => {});
    const start = performance.now();
    off(obj);
    expect(performance.now() - start).toBeLessThan(300);
    // adding 20000 listeners takes seconds under coverage
  }, 30000);

  it('R3 *@change:x keeps working for a child still held by another data key', () => {
    const child = new MatreshkaObject({ x: 1 });
    const obj = new MatreshkaObject({ a: child, b: child });
    const handler = vi.fn();
    obj.on('*@change:x', handler);
    obj.a = new MatreshkaObject({ x: 1 });
    obj.b.x = 2;
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('R3b removeDataKeys of one key keeps the listener of a child held by another key', () => {
    const child = new MatreshkaObject({ x: 1 });
    const obj = new MatreshkaObject({ a: child, b: child });
    const handler = vi.fn();
    obj.on('*@change:x', handler);
    obj.removeDataKeys('a');
    obj.b.x = 2;
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('R3c remove(key) keeps the listener of a child held by another data key', () => {
    const child = new MatreshkaObject({ x: 1 });
    const obj = new MatreshkaObject({ a: child, b: child });
    const handler = vi.fn();
    obj.on('*@change:x', handler);
    obj.remove('a');
    obj.b.x = 2;
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('R3d removing one of two array slots holding the same item keeps its listener', () => {
    const item = { x: 1 };
    const arr = new MatreshkaArray(item, item);
    const handler = vi.fn();
    arr.on('*@change:x', handler);
    arr.shift();
    arr[0].x = 2;
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
