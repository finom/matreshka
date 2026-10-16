// Paths no other test reached.
import MatreshkaArray from 'src/array';
import MatreshkaObject from 'src/object';
import Bundled from 'src/bundle';
import Matreshka from 'src/index';
import { Router } from 'src/router';
import { parseForm } from 'src/parse-form';
import bindNode from 'src/bindnode';
import unbindNode from 'src/unbindnode';
import parseBindings from 'src/parsebindings';
import on from 'src/on';
import off from 'src/off';
import trigger from 'src/trigger';
import { text } from 'src/binders';

const sync = { debounceSetValue: false, debounceGetValue: false };
const el = (html) => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  return wrapper.firstChild;
};
const click = (node) => node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
const wait = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));

class List extends MatreshkaArray {
  itemRenderer = '<b></b>';
  constructor() {
    super().bindNode('container', document.createElement('div'));
  }
}

describe('paths', () => {
  it('the script-tag bundle is Matreshka with the router and the form parser on it', () => {
    expect(Bundled).toBe(Matreshka);
    expect(Bundled.Router).toBe(Router);
    expect(Bundled.parseForm).toBe(parseForm);
    expect(typeof Bundled.initRouter).toBe('function');
  });

  it('recreate with one object twice throws', () => {
    const item = {};
    expect(() => new List().recreate([item, item])).toThrow('one rendered object was inserted twice');
  });

  it('a splice that puts back the last item keeps its node at the end', () => {
    const list = new List();
    const a = {};
    const b = {};
    list.push(a, b);
    const nodes = [...list.nodes.container.children];
    expect(nodes).toHaveLength(2);
    list.splice(1, 1, b);
    expect([...list.nodes.container.children]).toStrictEqual(nodes);
  });

  it('a splice that puts back an item in the middle keeps its node in place', () => {
    const list = new List();
    const items = [{}, {}, {}];
    list.push(...items);
    const nodes = [...list.nodes.container.children];
    expect(nodes).toHaveLength(3);
    list.splice(1, 1, items[1]);
    expect([...list.nodes.container.children]).toStrictEqual(nodes);
  });

  it('parseBindings skips a node that is not an element', () => {
    const obj = {};
    const node = el('<b>{{x}}</b>');
    parseBindings(obj, [document.createComment('{{y}}'), node], sync);
    obj.x = 'x';
    expect(node.textContent).toBe('x');
    expect('y' in obj).toBe(false);
  });

  it('the router keeps a part that is not valid percent-encoding as it is', async () => {
    location.hash = '#!/%E0%A4%A/';
    await wait();
    const obj = {};
    new Router('hash').subscribe(obj, 'a');
    expect(obj.a).toBe('%E0%A4%A');
    history.replaceState(null, '', '/');
  });

  it('unbindNode of a deep key with no deep binding leaves the object as it is', () => {
    const obj = { a: { b: 1 } };
    const node = el('<span></span>');
    bindNode(obj, 'x', node, text(), sync);
    expect(() => unbindNode(obj, 'a.b', node)).not.toThrow();
    obj.x = 'kept';
    expect(node.textContent).toBe('kept');
  });

  it('the same delegated listener added twice is called once', () => {
    const obj = { a: {} };
    const f = vi.fn();
    on(obj, 'a@x', f);
    on(obj, 'a@x', f);
    trigger(obj.a, 'x');
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('off of a DOM event still works after an internal event list is removed', () => {
    const obj = {};
    const f = vi.fn();
    const node = el('<div></div>');
    on(obj, 'click::x', f);
    bindNode(obj, 'x', node);
    off(obj, '_unbind:x');
    expect(() => off(obj, 'click::x')).not.toThrow();
    click(node);
    expect(f).not.toHaveBeenCalled();
  });

  it('a setter without a getter gets each new value, and the property reads the value set', () => {
    const seen = [];
    const obj = {
      set x(value) {
        seen.push(value);
      }
    };
    on(obj, 'change:x', () => {});
    obj.x = 1;
    expect(seen).toEqual([1]);
    expect(obj.x).toBe(1);
  });

  it('a renderer that finds no node throws without the wrapping hint', () => {
    class Empty extends MatreshkaArray {
      itemRenderer = () => document.querySelectorAll('.missing');
      constructor() {
        super().bindNode('container', document.createElement('div'));
      }
    }
    expect(() => new Empty().push({})).toThrow(/renderer returned 0 nodes instead of one\. $/);
  });

  it('a renderer function may return a DOM node', () => {
    class FromNode extends MatreshkaArray {
      itemRenderer = () => el('<i>{{a}}</i>');
      constructor() {
        super().bindNode('container', document.createElement('div'));
      }
    }
    const list = new FromNode();
    list.push({ a: 1 }, { a: 2 });
    expect(list.nodes.container.textContent).toBe('12');
  });

  it('restore with silent fires no render events', () => {
    const container = el('<div><b></b><b></b></div>');
    const list = new MatreshkaArray().bindNode('container', container);
    const rendered = vi.fn();
    list.on('*@render', rendered);
    list.restore(null, { silent: true });
    expect(list.length).toBe(2);
    expect(rendered).not.toHaveBeenCalled();
  });

  it('an array without a renderer changes without rendering', () => {
    const list = new MatreshkaArray().bindNode('container', document.createElement('div'));
    const tracked = new MatreshkaObject({ a: 1 });
    list.push(tracked, {});
    list.unshift({});
    list.splice(1, 0, {});
    list.pop();
    list.recreate([{}]);
    expect(list.length).toBe(1);
    expect(list.nodes.container.childNodes.length).toBe(0);
  });

  it('a re-render keeps a deep binding to a node outside the item node', async () => {
    class A extends MatreshkaArray {
      itemRenderer = '<b></b>';
      constructor() {
        super().bindNode('container', document.createElement('div'));
      }
    }
    const list = new A();
    list.push({ a: { b: 1 } });
    const outside = el('<span></span>');
    bindNode(list[0], 'a.b', outside, text(), sync);
    list.rerender({ forceRerender: true });
    list[0].a.b = 2;
    expect(outside.textContent).toBe('2');
  });

  it('orderBy puts null after the values and an item without the key last', () => {
    const list = MatreshkaArray.of({ a: 2 }, {}, { a: null }, { a: 1 });
    list.orderBy('a');
    expect(list.map((item) => item.a).toJSON(false)).toEqual([1, 2, null, undefined]);
  });

  it('setData with silent makes a held value a data key with no set or modify', () => {
    const obj = new MatreshkaObject();
    obj.x = 1;
    const fired = vi.fn();
    obj.on('set modify', fired);
    obj.setData('x', 1, { silent: true });
    expect(obj.keys()).toEqual(['x']);
    expect(fired).not.toHaveBeenCalled();
  });

  it('off of a listener that was never delegated changes nothing', () => {
    const obj = { a: {} };
    const f = vi.fn();
    on(obj, 'x', f);
    off(obj, 'a@x', f);
    off(obj, '*@x', f);
    trigger(obj, 'x');
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('the same direct listener added twice is called once', () => {
    const obj = {};
    const f = vi.fn();
    on(obj, 'x', f);
    on(obj, 'x', f);
    trigger(obj, 'x');
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('a removeevent handler that removes the listeners itself during off() leaves none', () => {
    const obj = {};
    const f = vi.fn();
    on(obj, 'x', f);
    on(obj, 'removeevent:x', () => off(obj, 'x'));
    off(obj);
    trigger(obj, 'x');
    expect(f).not.toHaveBeenCalled();
  });

  it('a removeevent:x handler that calls off(x) runs once', () => {
    const obj = {};
    const handler = vi.fn(() => off(obj, 'x'));
    on(obj, 'x', () => {});
    on(obj, 'removeevent:x', handler);
    expect(() => off(obj, 'x')).not.toThrow();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('a listener that a removeevent handler adds to the same name stays', () => {
    const obj = {};
    const added = vi.fn();
    on(obj, 'x', () => {});
    on(obj, 'removeevent:x', () => on(obj, 'x', added));
    off(obj, 'x');
    trigger(obj, 'x');
    expect(added).toHaveBeenCalledTimes(1);
  });

  it('off with a callback on an object without listeners does nothing', () => {
    expect(() => off({}, null, () => {})).not.toThrow();
  });

  it('a listener added by a removeevent handler during off() stays', () => {
    const obj = {};
    const added = vi.fn();
    on(obj, 'x', () => {});
    on(obj, 'removeevent:x', () => on(obj, 'x', added));
    off(obj);
    trigger(obj, 'x');
    expect(added).toHaveBeenCalledTimes(1);
  });

  it('the same listener on an internal name is added once', () => {
    const obj = {};
    const f = vi.fn();
    on(obj, '_x', f);
    on(obj, '_x', f);
    trigger(obj, '_x');
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('spaces around and between trigger names trigger each name once', () => {
    const obj = {};
    const f = vi.fn();
    const g = vi.fn();
    on(obj, 'x', f);
    on(obj, 'y', g);
    trigger(obj, ' x  y ');
    expect(f).toHaveBeenCalledTimes(1);
    expect(g).toHaveBeenCalledTimes(1);
  });

  it('unbindNode of a deep key without a node and without deep bindings does nothing', () => {
    const obj = { a: { b: 1 } };
    bindNode(obj, 'x', el('<span></span>'));
    expect(() => unbindNode(obj, 'a.b')).not.toThrow();
  });

  it('the hash router writes an empty path in place when the hash spells it differently', async () => {
    location.hash = '#!//';
    await wait();
    const obj = {};
    const before = history.length;
    new Router('hash').subscribe(obj, 'a');
    obj.a = 'x';
    obj.a = null;
    await wait();
    expect(location.hash).toBe('');
    expect(history.length).toBe(before);
    history.replaceState(null, '', '/');
  });
});
