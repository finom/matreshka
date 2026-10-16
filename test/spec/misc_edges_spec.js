import Class from 'src/class';
import calc from 'src/calc';
import remove from 'src/remove';
import instantiate from 'src/instantiate';
import bindNode from 'src/bindnode';
import unbindNode from 'src/unbindnode';
import selectAll from 'src/selectall';
import parseBindings from 'src/parsebindings';
import on from 'src/on';
import off from 'src/off';
import trigger from 'src/trigger';
import MatreshkaObject from 'src/object';
import MatreshkaArray from 'src/array';
import { parseForm } from 'src/parse-form';
import { Router } from 'src/router';
import createSpy from '../helpers/createspy';

const noDebounceFlag = { debounceSetValue: false, debounceGetValue: false };

describe('Less common arguments', () => {
  it('Class wraps an ES class given as the constructor', () => {
    const C = Class({
      constructor: class {
        constructor(a) {
          this.a = a;
        }
      },
      b: 2
    });
    const inst = new C(1);

    expect(inst.a).toEqual(1);
    expect(inst.b).toEqual(2);
    expect(inst instanceof C).toBe(true);
  });

  it('remove takes an array of keys', () => {
    const obj = { a: 1, b: 2, c: 3 };

    remove(obj, ['a', 'b']);

    expect(obj).toEqual({ c: 3 });
  });

  it('instantiate takes an array of keys', () => {
    class A {
      constructor(data) {
        Object.assign(this, data);
      }
    }
    const obj = {};

    instantiate(obj, ['a', 'b'], A);
    obj.a = { x: 1 };
    obj.b = { y: 2 };

    expect(obj.a).toBeInstanceOf(A);
    expect(obj.b).toEqual(new A({ y: 2 }));
  });

  it('calc with a target-definition object and only item event options', () => {
    const obj = { a: 1, b: 2 };

    calc(obj, {
      c: {
        source: ['a', 'b'],
        handler: (a, b) => a + b,
        event: { debounceCalc: false }
      }
    });
    obj.a = 5;

    expect(obj.c).toEqual(7);
  });

  describe('Matreshka.Object', () => {
    it('removing a key that is not a data key fires no remove', () => {
      const obj = new MatreshkaObject({ a: 1 });
      const handler = createSpy();
      obj.on('remove', handler);
      obj.b = 2;
      obj.on('change:b', () => {});

      obj.remove('b');

      expect(handler).not.toHaveBeenCalled();
      expect(obj.keys()).toEqual(['a']);
    });

    it('setData with replaceData keeps the only data key it sets', () => {
      const obj = new MatreshkaObject({ a: 1 });
      const handler = createSpy();
      obj.on('remove', handler);

      obj.setData('a', 2, { replaceData: true });

      expect(obj.toJSON()).toEqual({ a: 2 });
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('off', () => {
    it('off() with no names removes a user listener of a name with "_"', () => {
      const obj = {};
      const handler = createSpy();
      const removeevent = createSpy();
      on(obj, '_foo', handler);
      on(obj, 'removeevent', removeevent);

      off(obj);
      trigger(obj, '_foo');

      expect(handler).not.toHaveBeenCalled();
      expect(removeevent).toHaveBeenCalledTimes(1);
    });

    it('off of a "_" name fires no removeevent', () => {
      const obj = {};
      const handler = createSpy();
      const removeevent = createSpy();
      on(obj, '_foo', handler);
      on(obj, 'removeevent', removeevent);

      off(obj, '_foo', handler);
      trigger(obj, '_foo');

      expect(handler).not.toHaveBeenCalled();
      expect(removeevent).not.toHaveBeenCalled();
    });

    it('off of an asterisk listener that was never added', () => {
      const item = {};
      const arr = new MatreshkaArray(1, item);
      const obj = new MatreshkaObject({ a: 1, b: item });
      const plain = { a: item };
      const handler = createSpy();
      on(item, 'foo', handler);

      off(arr, '*@foo', handler);
      off(obj, '*@foo', handler);
      off(plain, '*@foo', handler);
      trigger(item, 'foo');

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('a function used by a direct and a delegated listener stays until both are removed', () => {
      const item = {};
      const arr = new MatreshkaArray(item);
      const handler = createSpy();

      on(arr, '*@foo', handler);
      on(item, 'foo', handler);
      off(item, 'foo', handler);
      trigger(item, 'foo');
      expect(handler).toHaveBeenCalledTimes(1);

      off(arr, '*@foo', handler);
      trigger(item, 'foo');
      expect(handler).toHaveBeenCalledTimes(1);

      on(item, 'foo', handler);
      on(arr, '*@foo', handler);
      off(item, 'foo', handler);
      trigger(item, 'foo');
      expect(handler).toHaveBeenCalledTimes(2);

      off(arr, '*@foo', handler);
      trigger(item, 'foo');
      expect(handler).toHaveBeenCalledTimes(2);
    });

    it('off of an asterisk listener skips primitive items', () => {
      const item = {};
      const arr = new MatreshkaArray(1, item);
      const obj = new MatreshkaObject({ a: 1, b: item });
      const handler = createSpy();
      on(arr, '*@foo', handler);
      on(obj, '*@foo', handler);

      off(arr, '*@foo', handler);
      off(obj, '*@foo', handler);
      trigger(item, 'foo');

      expect(handler).not.toHaveBeenCalled();
    });
  });

  it(':bound(KEY) of a key whose nodes were unbound selects nothing', () => {
    const obj = {};
    const node = window.document.createElement('div');
    bindNode(obj, 'x', node);
    unbindNode(obj, 'x');

    expect(selectAll(obj, ':bound(x)')).toEqual([]);
  });

  describe('parseBindings', () => {
    it('works without event options and skips text nodes and elements with no brackets', async () => {
      const obj = {};
      // the HTML is trimmed, as in 2.x
      const nodes = parseBindings(obj, ' <b>{{x}}</b><i>plain</i><s><!-- note -->{{y}}</s>');

      obj.x = 1;
      obj.y = 2;
      // without event options the nodes update after a debounce
      await new Promise((resolve) => setTimeout(resolve, 20));

      expect(nodes.length).toEqual(3);
      expect(nodes[0].textContent).toEqual('1');
      expect(nodes[1].innerHTML).toEqual('plain');
      expect(nodes[2].textContent).toEqual('2');
    });

    it('binds a checked radio attribute with the radio binder: the property is the value', () => {
      const obj = {};
      const [node] = parseBindings(obj, '<input type="radio" value="a" checked="{{x}}">', noDebounceFlag);

      expect(node.hasAttribute('checked')).toBe(false);
      obj.x = 'a';
      expect(node.checked).toBe(true);
      obj.x = 'b';
      expect(node.checked).toBe(false);

      node.checked = true;
      node.dispatchEvent(new window.Event('click'));
      expect(obj.x).toBe('a');
    });

    it('throws for nodes that are neither a string nor an object', () => {
      expect(() => parseBindings({}, 5)).toThrow(TypeError);
    });
  });

  describe('parseForm', () => {
    it('takes an array-like of nodes and a function as the object', () => {
      const form = window.document.createElement('form');
      form.innerHTML = '<input name="a" value="1"><input value="no name">';
      const object = () => {};

      expect(parseForm(object, [form], null, noDebounceFlag)).toBe(form);
      expect(object.a).toEqual('1');
    });

    it('binds fields tied by the form attribute in document order, skipping other elements', () => {
      const root = window.document.createElement('div');
      root.innerHTML =
        '<input form="pf" name="before" value="b">' +
        '<form id="pf"><fieldset><input name="inside" value="i"></fieldset><button name="btn">x</button></form>' +
        '<input form="pf" name="after" value="a">';
      window.document.body.appendChild(root);
      const names = [];
      const object = {};

      parseForm(object, '#pf', (name) => names.push(name), noDebounceFlag);

      expect(names).toEqual(['before', 'inside', 'after']);
      expect(object).toEqual({ before: 'b', inside: 'i', after: 'a' });
      root.remove();
    });
  });

  it('Router stops the path at the first empty part', () => {
    const router = new Router(null).init();

    router.parts = ['a', '', 'b'];

    expect(router.path).toEqual('/a/');
  });
});
