import bindNode from 'src/bindnode';
import bindOptionalNode from 'src/bindoptionalnode';
import bindSandbox from 'src/bindsandbox';
import unbindNode from 'src/unbindnode';
import select from 'src/select';
import selectAll from 'src/selectall';
import Matreshka from 'src/matreshka';
import on from 'src/on';
import createSpy from '../../helpers/createspy';

describe('Bindings, less common arguments', () => {
  const noDebounceFlag = {
    debounceSetValue: false,
    debounceGetValue: false
  };
  const { document } = window;

  function input(value = '') {
    const node = document.createElement('input');
    node.value = value;
    return node;
  }

  describe('bindNode and unbindNode take an array of keys', () => {
    it('binds and unbinds every key to the node', () => {
      const obj = {};
      const node = input('v');

      bindNode(obj, ['a', 'b'], node, null, noDebounceFlag);
      expect(obj.a).toEqual('v');
      expect(obj.b).toEqual('v');

      obj.b = 'w';
      expect(node.value).toEqual('w');

      unbindNode(obj, ['a', 'b'], node);
      obj.a = 'x';
      expect(node.value).toEqual('w');
    });

    it('bindOptionalNode with an array of keys skips a missing node', () => {
      const obj = {};

      expect(() => bindOptionalNode(obj, ['a', 'b'], '.missing')).not.toThrow();
      expect(() => bindNode(obj, ['a', 'b'], '.missing')).toThrow();
    });
  });

  describe('bindNode and unbindNode take an array of binding objects', () => {
    it('bindOptionalNode skips a missing node, bindNode throws', () => {
      const obj = {};
      const node = input('v');

      bindOptionalNode(obj, [
        { key: 'a', node },
        { key: 'b', node: '.missing' }
      ]);
      expect(obj.a).toEqual('v');
      expect(() => bindNode(obj, [{ key: 'b', node: '.missing' }])).toThrow();
    });

    it('unbindNode merges the common event options with the item ones', () => {
      const obj = {};
      const a = input();
      const b = input();
      const unbind = createSpy();
      bindNode(obj, 'a', a);
      bindNode(obj, 'b', b);
      bindNode(obj, 'c', input());
      on(obj, 'unbind', unbind);

      unbindNode(
        obj,
        [
          { key: 'a', node: a },
          { key: 'b', node: b, event: { silent: false } },
          { key: 'c', node: null }
        ],
        { silent: true }
      );

      expect(unbind).toHaveBeenCalledTimes(1);
      expect(unbind).toHaveBeenCalledWith(expect.objectContaining({ key: 'b', node: b }));

      unbindNode(obj, [{ key: 'a', node: a }]);
      expect(unbind).toHaveBeenCalledTimes(1);
    });
  });

  it('bindOptionalNode with a key-node object skips a missing node', () => {
    const obj = {};
    const node = input('v');

    bindOptionalNode(obj, { a: node, b: '.missing' }, null, noDebounceFlag);

    expect(obj.a).toEqual('v');
    expect(obj.b).toBeUndefined();
  });

  it('unbindNode keeps both bindings of a node bound twice to the key', () => {
    const obj = {};
    const shared = document.createElement('div');
    const other = document.createElement('div');
    bindNode(
      obj,
      'x',
      shared,
      {
        setValue(v) {
          this.dataset.a = v;
        }
      },
      { ...noDebounceFlag, useExactBinder: true }
    );
    bindNode(
      obj,
      'x',
      shared,
      {
        setValue(v) {
          this.dataset.b = v;
        }
      },
      { ...noDebounceFlag, useExactBinder: true }
    );
    bindNode(
      obj,
      'x',
      other,
      {
        setValue(v) {
          this.dataset.c = v;
        }
      },
      { ...noDebounceFlag, useExactBinder: true }
    );

    unbindNode(obj, 'x', other);
    obj.x = 1;

    expect({ ...shared.dataset }).toEqual({ a: '1', b: '1' });
    expect(other.dataset.c).toBeUndefined();
  });

  it('unbindNode of a dotted key on an object without deep bindings does nothing', () => {
    const obj = { a: { b: 1 } };

    expect(unbindNode(obj, 'a.b')).toBe(obj);
    expect(obj.a.b).toEqual(1);
  });

  describe('deep bindings follow a branch that loses a level', () => {
    it('when the new branch has no middle object', () => {
      const obj = { a: { b: { c: 'x' } } };
      const node = input();
      bindNode(obj, 'a.b.c', node, null, noDebounceFlag);
      expect(node.value).toEqual('x');

      obj.a = { b: null };
      expect(node.value).toEqual('x');

      obj.a = { b: { c: 'y' } };
      expect(node.value).toEqual('y');
    });

    it('when the previous branch had no middle object', () => {
      const obj = { a: {} };
      const node = input();
      bindNode(obj, 'a.b.c', node, null, noDebounceFlag);

      obj.a = { b: { c: 'y' } };
      expect(node.value).toEqual('y');

      obj.a.b.c = 'z';
      expect(node.value).toEqual('z');
    });
  });

  it('a getValue binder may call preventDefault and stopPropagation of the DOM event', () => {
    const obj = {};
    const parent = document.createElement('div');
    const node = document.createElement('a');
    parent.appendChild(node);
    const parentHandler = createSpy();
    parent.addEventListener('click', parentHandler);
    let defaultPrevented;

    bindNode(
      obj,
      'x',
      node,
      {
        on: 'click',
        getValue({ preventDefault, stopPropagation, domEvent }) {
          if (domEvent.type) {
            preventDefault();
            stopPropagation();
            defaultPrevented = domEvent.defaultPrevented;
          }
          return 'clicked';
        }
      },
      noDebounceFlag
    );

    node.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));

    expect(defaultPrevented).toBe(true);
    expect(parentHandler).not.toHaveBeenCalled();
  });

  describe('selectors', () => {
    it('a selector list keeps commas inside quotes, escapes and parentheses', () => {
      const obj = {};
      const sandbox = document.createElement('div');
      sandbox.innerHTML = '<i data-a="x,&quot;y"></i><b></b><s></s><u class="k"></u>';
      bindNode(obj, 'sandbox', sandbox);

      const nodes = selectAll(obj, ':sandbox [data-a="x,\\"y"], :sandbox b, :sandbox :is(s, u)');

      expect(nodes.map((n) => n.tagName)).toEqual(['I', 'B', 'S', 'U']);
      expect(selectAll(obj, ":sandbox [data-a='x,\"y']").length).toEqual(1);
    });

    it(':bound(KEY) > selector selects children only', () => {
      const obj = {};
      const node = document.createElement('div');
      node.innerHTML = '<span id="child"><span id="grandchild"></span></span>';
      bindNode(obj, 'x', node, null, { useExactBinder: true });

      expect(selectAll(obj, ':bound(x) > span').map((n) => n.id)).toEqual(['child']);
      expect(select(obj, ':bound(x) span span').id).toEqual('grandchild');
    });

    it('select and selectAll return nothing without a sandbox or a match', () => {
      const obj = {};

      expect(select({}, 'span')).toBe(null);
      expect(selectAll({}, 'span')).toEqual([]);

      bindNode(obj, 'x', document.createElement('div'), null, { useExactBinder: true });
      expect(select(obj, 'span')).toBe(null);
      expect(selectAll(obj, 'span')).toEqual([]);

      bindNode(obj, 'sandbox', document.createElement('div'));
      expect(select(obj, 'span')).toBe(null);

      unbindNode(obj, 'sandbox');
      expect(select(obj, 'span')).toBe(null);
      expect(selectAll(obj, 'span')).toEqual([]);
    });

    it('select and selectAll are methods of a Matreshka instance', () => {
      const mk = new Matreshka();
      mk.bindNode('sandbox', '<div><b></b><b></b></div>');

      expect(mk.select('b')).toBe(mk.nodes.sandbox.firstChild);
      expect(mk.selectAll('b').length).toEqual(2);
      expect(mk.select(':sandbox b')).toBe(mk.nodes.sandbox.firstChild);
    });
  });

  it('bindSandbox as a function rebinds the sandbox', () => {
    const obj = {};
    const first = document.createElement('div');
    const second = document.createElement('div');

    bindSandbox(obj, first);
    bindSandbox(obj, second);

    expect(select(obj, ':sandbox')).toBe(second);
  });
});
