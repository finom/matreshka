import MatreshkaObject from 'src/object';
import MatreshkaArray from 'src/array';
import on from 'src/on';
import off from 'src/off';
import trigger from 'src/trigger';
import set from 'src/set';
import bindNode from 'src/bindnode';
import unbindNode from 'src/unbindnode';
import simulateClick from '../../helpers/simulateclick';
import createSpy from '../../helpers/createspy';

describe('Events, less common paths', () => {
  describe('off() with no names removes delegated listeners', () => {
    it('of a path', () => {
      const obj = { a: { b: {} } };
      const handler = createSpy();
      on(obj, 'a.b@foo', handler);

      off(obj);
      trigger(obj.a.b, 'foo');

      expect(handler).not.toHaveBeenCalled();
    });

    it('of a path whose target is now a primitive', () => {
      const obj = { a: {} };
      const handler = createSpy();
      on(obj, 'a@foo', handler);
      const target = obj.a;
      obj.a = 5;

      expect(() => off(obj)).not.toThrow();
      trigger(target, 'foo');
      expect(handler).not.toHaveBeenCalled();
    });

    it('of every item of a Matreshka.Array', () => {
      const item = {};
      const arr = new MatreshkaArray(item, 1);
      const handler = createSpy();
      on(arr, '*@foo', handler);

      off(arr);
      trigger(item, 'foo');
      arr.push({});

      expect(handler).not.toHaveBeenCalled();
    });

    it('of every data value of a Matreshka.Object', () => {
      const obj = new MatreshkaObject({ a: {}, b: 2 });
      const { a } = obj;
      const handler = createSpy();
      on(obj, '*@foo', handler);

      off(obj);
      trigger(a, 'foo');

      expect(handler).not.toHaveBeenCalled();
    });
  });

  it('off() with no names removes a DOM listener of a key with no bound nodes', () => {
    const obj = {};
    const handler = createSpy();
    const removeevent = createSpy();
    on(obj, 'click::x', handler);
    on(obj, 'removeevent', removeevent);

    off(obj);

    const node = window.document.createElement('div');
    bindNode(obj, 'x', node);
    simulateClick(node);

    expect(handler).not.toHaveBeenCalled();
    expect(removeevent).toHaveBeenCalledWith(expect.objectContaining({ name: 'click::x' }));
  });

  it('off takes an array of names', () => {
    const obj = {};
    const handler = createSpy();
    on(obj, ['a', 'b'], handler);

    off(obj, ['a', 'b']);
    trigger(obj, 'a b');

    expect(handler).not.toHaveBeenCalled();
  });

  it('off does nothing on an object with no events', () => {
    const obj = {};

    expect(off(obj, 'foo')).toBe(obj);
    expect(off(obj, 'click::x')).toBe(obj);
    expect(off(obj, 'a.b@foo')).toBe(obj);
  });

  it('off of a DOM listener with another context keeps it', () => {
    const obj = {};
    const node = window.document.createElement('div');
    const handler = createSpy();
    const context = {};
    bindNode(obj, 'x', node);
    on(obj, 'click::x', handler, context);

    off(obj, 'click::x', handler, {});
    simulateClick(node);
    expect(handler).toHaveBeenCalledTimes(1);

    off(obj, 'click::x', handler, context);
    simulateClick(node);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('a DOM listener stops when its node is unbound', () => {
    const obj = {};
    const node = window.document.createElement('div');
    const handler = createSpy();
    bindNode(obj, 'x', node);
    on(obj, 'click::x', handler);

    unbindNode(obj, 'x', node);
    simulateClick(node);

    expect(handler).not.toHaveBeenCalled();
  });

  it('a DOM listener gets preventDefault and stopPropagation', () => {
    const obj = {};
    const parent = window.document.createElement('div');
    const node = window.document.createElement('a');
    parent.appendChild(node);
    const parentHandler = createSpy();
    parent.addEventListener('click', parentHandler);
    let domEvent;
    bindNode(obj, 'x', node);
    on(obj, 'click::x', (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      domEvent = evt.domEvent;
    });

    simulateClick(node);

    expect(domEvent.defaultPrevented).toBe(true);
    expect(parentHandler).not.toHaveBeenCalled();
  });

  it('on with triggerOnInit and no context calls the handler with the object as context', () => {
    const obj = {};
    const handler = createSpy();

    on(obj, 'foo', handler, true);

    expect(handler.mock.contexts[0]).toBe(obj);
    expect(handler).toHaveBeenCalledWith({ triggerOnInit: true });
  });

  describe('asterisk delegation', () => {
    it('adds the same listener to a Matreshka.Array once and skips primitive items', () => {
      const item = {};
      const arr = new MatreshkaArray(1, item);
      const handler = createSpy();

      on(arr, '*@foo', handler);
      on(arr, '*@foo', handler);
      arr.push(2);
      trigger(item, 'foo');

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('adds the same listener to a Matreshka.Object once and skips primitive values', () => {
      const obj = new MatreshkaObject({ a: {}, b: 1 });
      const handler = createSpy();

      on(obj, '*@foo', handler);
      on(obj, '*@foo', handler);
      obj.setData('c', 'text');
      trigger(obj.a, 'foo');

      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('does nothing on a plain object', () => {
      const obj = { a: {} };
      const handler = createSpy();

      on(obj, '*@foo', handler);
      trigger(obj.a, 'foo');

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('trigger', () => {
    it('does nothing on an object with no events', () => {
      const obj = {};

      expect(trigger(obj, 'foo')).toBe(obj);
    });

    it('a DOM event of a key that is unknown or has no bound nodes does nothing', () => {
      const obj = {};
      on(obj, 'change:x', () => {});

      expect(() => trigger(obj, 'click::y')).not.toThrow();
      expect(() => trigger(obj, 'click::x')).not.toThrow();
    });
  });

  describe('set', () => {
    it('with a falsy key does nothing', () => {
      const obj = {};

      expect(set(obj, '', 1)).toBe(obj);
      expect(obj).toEqual({});
    });

    it('fires beforechange:KEY, beforechange, change:KEY and change in order', () => {
      const obj = {};
      const order = [];
      on(obj, 'beforechange:x', () => order.push('beforechange:x'));
      on(obj, 'beforechange', () => order.push('beforechange'));
      on(obj, 'change:x', () => order.push('change:x'));
      on(obj, 'change', () => order.push('change'));

      set(obj, 'x', 1);

      expect(order).toEqual(['beforechange:x', 'beforechange', 'change:x', 'change']);
    });

    it('fires only the common events when there is no KEY listener', () => {
      const obj = {};
      const before = createSpy();
      const change = createSpy();
      const noop = () => {};
      // a KEY listener defines the property; removing it leaves the definition
      on(obj, 'change:x', noop);
      off(obj, 'change:x', noop);
      on(obj, 'beforechange', before);
      on(obj, 'change', change);

      set(obj, 'x', 1);

      expect(before).toHaveBeenCalledTimes(1);
      expect(change).toHaveBeenCalledWith(expect.objectContaining({ key: 'x', value: 1 }));
    });
  });

  describe('Matreshka.Object data keys', () => {
    it('addDataKeys of an existing key fires nothing', () => {
      const obj = new MatreshkaObject({ a: 1 });
      const handler = createSpy();
      obj.on('set', handler);

      obj.addDataKeys('a');

      expect(handler).not.toHaveBeenCalled();
    });

    it('setData with a falsy key does nothing', () => {
      const obj = new MatreshkaObject();

      expect(obj.setData('', 1)).toBe(obj);
      expect(obj.keys()).toEqual([]);
    });

    it('keyOf returns null for a value no data key holds', () => {
      const obj = new MatreshkaObject({ a: 1 });

      expect(obj.keyOf(2)).toBe(null);
    });
  });
});
