import bindNode from 'src/bindnode';
import bindOptionalNode from 'src/bindoptionalnode';
import bindSandbox from 'src/bindsandbox';
import unbindNode from 'src/unbindnode';
import select from 'src/select';
import selectAll from 'src/selectall';
import addListener from 'src/on/_addlistener';
import makeObject from '../../helpers/makeobject';
import createSpy from '../../helpers/createspy';

describe('Bindings', () => {
  const noDebounceFlag = {
    debounceSetValue: false,
    debounceGetValue: false
  };

  const { document } = window;

  let obj;
  let node;
  let binder;
  let initializeCall;
  let destroyCall;

  const testSimpleBind = (key = 'x') => {
    obj[key] = 'foo';
    expect(node.value).toEqual('foo');
    node.value = 'bar';
    node.ondummyevent();
    expect(obj[key]).toEqual('bar');
    expect(initializeCall).toHaveBeenCalled();
  };

  const testSimpleUnbind = () => {
    obj.x = 'foo';
    expect(node.value).toEqual('');
    node.value = 'baz';
    node.ondummyevent();
    expect(obj.x).toEqual('foo');
    expect(destroyCall).toHaveBeenCalled();
  };

  beforeEach(() => {
    obj = {};
    node = document.createElement('div');

    initializeCall = createSpy();
    destroyCall = createSpy();

    binder = {
      on(cbc) {
        this.ondummyevent = cbc;
      },
      getValue() {
        return this.value;
      },
      setValue(value) {
        this.value = value;
      },
      initialize() {
        this.value = this.value || '';
        initializeCall();
      },
      destroy() {
        destroyCall();
      }
    };
  });

  it('should handle debounceSetValueOnBind=true', () =>
    new Promise((done) => {
      obj.x = 'foo';
      bindNode(obj, 'x', node, binder, {
        debounceSetValueOnBind: true
      });
      expect(node.value).toEqual('');
      setTimeout(() => {
        expect(node.value).toEqual('foo');
        done();
      }, 50);
    }));

  it('should handle debounceGetValueOnBind=true', () =>
    new Promise((done) => {
      node.value = 'foo';
      bindNode(obj, 'x', node, binder, {
        debounceGetValueOnBind: true
      });
      expect(obj.x).toEqual(undefined);
      setTimeout(() => {
        expect(obj.x).toEqual('foo');
        done();
      }, 50);
    }));

  it('should handle debounceSetValue=true (use default value)', () =>
    new Promise((done) => {
      obj.x = 'foo';
      bindNode(obj, 'x', node, binder);
      expect(node.value).toEqual('foo');
      obj.x = 'bar';
      expect(node.value).toEqual('foo');
      setTimeout(() => {
        expect(node.value).toEqual('bar');
        done();
      }, 50);
    }));

  it('should handle debounceGetValue=true (use default value)', () =>
    new Promise((done) => {
      node.value = 'foo';
      bindNode(obj, 'x', node, binder);
      expect(obj.x).toEqual('foo');
      node.value = 'bar';
      node.ondummyevent();
      expect(obj.x).toEqual('foo');
      setTimeout(() => {
        expect(obj.x).toEqual('bar');
        done();
      }, 50);
    }));

  it('should bind and use DOM events', () => {
    const input = document.createElement('input');
    bindNode(obj, 'x', input, { on: 'input' }, noDebounceFlag);
    input.value = 'foo';
    input.dispatchEvent(new window.Event('input'));
    expect(obj.x).toEqual('foo');
  });

  it('handle option setValueOnBind=true', () => {
    node.value = 'foo';
    bindNode(obj, 'x', node, binder, { ...noDebounceFlag, getValueOnBind: false, setValueOnBind: true });
    expect(node.value).toEqual(undefined);
  });

  it('handle option getValueOnBind=true', () => {
    obj.x = 'foo';
    node.value = 'bar';
    bindNode(obj, 'x', node, binder, { ...noDebounceFlag, getValueOnBind: true });
    expect(obj.x).toEqual('bar');
  });

  it('handle option setValueOnBind=false', () => {
    obj.x = 'foo';
    bindNode(obj, 'x', node, binder, { ...noDebounceFlag, setValueOnBind: false });
    expect(node.value).toEqual('');
  });

  it('handle option getValueOnBind=false', () => {
    node.value = 'bar';
    bindNode(obj, 'x', node, binder, { ...noDebounceFlag, getValueOnBind: false });
    expect(obj.x).toEqual(undefined);
  });

  it('should bind and trigger events', () => {
    const bindCall = createSpy();
    const bindKeyCall = createSpy();
    addListener(obj, 'bind', bindCall);
    addListener(obj, 'bind:x', bindKeyCall);
    bindNode(obj, 'x', node, binder, noDebounceFlag);
    testSimpleBind();
    expect(bindCall).toHaveBeenCalled();
    expect(bindKeyCall).toHaveBeenCalled();
  });

  it('should unbind and trigger events', () => {
    const unbindCall = createSpy();
    const unbindKeyCall = createSpy();
    addListener(obj, 'unbind', unbindCall);
    addListener(obj, 'unbind:x', unbindKeyCall);
    bindNode(obj, 'x', node, binder, noDebounceFlag);
    unbindNode(obj, 'x', node);
    testSimpleUnbind();
    expect(unbindCall).toHaveBeenCalled();
    expect(unbindKeyCall).toHaveBeenCalled();
  });

  it('should bind using key-node object', () => {
    bindNode(obj, { x: node }, binder, noDebounceFlag);
    testSimpleBind();
  });

  it('should bind using key-binding object', () => {
    bindNode(obj, { x: { node, binder } }, null, noDebounceFlag);
    testSimpleBind();
  });

  it('should bind using key-bindingsarray object', () => {
    bindNode(obj, { x: [{ node, binder }] }, null, noDebounceFlag);
    testSimpleBind();
  });

  it('should bind using key-binding object and use common binder', () => {
    bindNode(obj, { x: { node } }, binder, noDebounceFlag);
    testSimpleBind();
  });

  it('should bind using key-bindingsarray object and use common binder', () => {
    bindNode(obj, { x: [{ node }] }, binder, noDebounceFlag);
    testSimpleBind();
  });

  it('should not unbind when wrong node is given', () => {
    const wrongNode = document.createElement('div');
    bindNode(obj, 'x', node, binder, noDebounceFlag);
    unbindNode(obj, 'x', wrongNode);
    testSimpleBind();
  });

  it('should not unbind when wrong key is given', () => {
    bindNode(obj, 'x', node, binder, noDebounceFlag);
    unbindNode(obj, 'y', node);
    testSimpleBind();
  });

  it('should unbind when node is not given', () => {
    bindNode(obj, 'x', node, binder, noDebounceFlag);
    unbindNode(obj, 'x');
    testSimpleUnbind();
  });

  it('should unbind all when neither key nor node is given', () => {
    bindNode(obj, 'x', node, binder, noDebounceFlag);
    unbindNode(obj);
    testSimpleUnbind();
  });

  it('should unbind using key-node object', () => {
    bindNode(obj, { x: node }, binder, noDebounceFlag);
    unbindNode(obj, { x: node });
    testSimpleUnbind();
  });

  it('should unbind using key-binding object', () => {
    bindNode(obj, { x: { node, binder } }, null, noDebounceFlag);
    unbindNode(obj, { x: { node, binder } });
    testSimpleUnbind();
  });

  it('should unbind using key-bindingsarray object', () => {
    bindNode(obj, { x: [{ node, binder }] }, null, noDebounceFlag);
    unbindNode(obj, { x: [{ node, binder }] });
    testSimpleUnbind();
  });

  it('should bind using an array of objects', () => {
    bindNode(obj, [{ key: 'x', node, binder }], noDebounceFlag);
    testSimpleBind();
  });

  it('should unbind using an array of objects', () => {
    bindNode(obj, [{ key: 'x', node, binder }], noDebounceFlag);
    unbindNode(obj, [{ key: 'x', node }]);
    testSimpleUnbind();
  });

  it('should bind a property in context object which has isMatreshka=true property', () => {
    obj = {
      isMatreshka: true,
      nodes: {},
      $nodes: {}
    };
    bindNode.call(obj, 'x', node, binder, noDebounceFlag);
    testSimpleBind();
    expect(obj.nodes.x).toEqual(node);
    expect(Array.from(obj.$nodes.x)).toEqual([node]);
  });

  it('should unbind a property in context object which has isMatreshka=true property', () => {
    obj = {
      isMatreshka: true,
      nodes: {},
      $nodes: {}
    };
    bindNode.call(obj, 'x', node, binder, noDebounceFlag);
    unbindNode.call(obj, 'x', node);
    testSimpleUnbind();
    expect(obj.nodes.x).toBeUndefined();
    expect(obj.$nodes.x).toBeUndefined();
  });

  it('should bind delegated target', () => {
    const obj = makeObject('x.y');
    bindNode(obj, 'x.y.z', node, binder, noDebounceFlag);
    obj.x.y.z = 'foo';
    expect(node.value).toEqual('foo');
    node.value = 'bar';
    node.ondummyevent();
    expect(obj.x.y.z).toEqual('bar');
  });

  it('should unbind delegated target', () => {
    const obj = makeObject('x.y');
    bindNode(obj, 'x.y.z', node, binder, noDebounceFlag);
    unbindNode(obj, 'x.y.z', node);
    obj.x.y.z = 'foo';
    expect(node.value).toEqual('');
    node.value = 'bar';
    node.ondummyevent();
    expect(obj.x.y.z).toEqual('foo');
  });

  it('cancels delegated binding when exactKey=true option is passed', () => {
    bindNode(obj, 'x.y.z', node, binder, { exactKey: true, ...noDebounceFlag });
    testSimpleBind('x.y.z');
  });

  it('should rebind delegated target', () => {
    const obj = makeObject('u.x.y.z', 'go');
    bindNode(obj, 'u.x.y.z', node, binder, noDebounceFlag);
    obj.u.x = makeObject('y.z', 'foo');
    expect(node.value).toEqual('foo');
    node.value = 'bar';
    node.ondummyevent();
    expect(obj.u.x.y.z).toEqual('bar');
  });

  it('should remove binding if delegated target is reassigned', () => {
    const obj = makeObject('u.x.y');
    bindNode(obj, 'u.x.y.z', node, binder, noDebounceFlag);
    const x = obj.u.x;

    obj.u.x = makeObject('y.z', 'foo');

    node.value = 'bar';
    node.ondummyevent();
    expect(x.y.z).not.toEqual('bar');
    expect(obj.u.x.y.z).toEqual('bar');
    x.y.z = 'baz';
    expect(node.value).toEqual('bar');
  });

  it('uses custom selectors on current target', () => {
    const obj = makeObject('x.y', 'foo');
    const childNode = node.appendChild(document.createElement('span'));

    bindNode(obj, 'sandbox', node);
    bindNode(obj, 'x.y', ':sandbox span', binder, noDebounceFlag);

    expect(childNode.value).toEqual('foo');
    childNode.value = 'bar';
    childNode.ondummyevent();
    expect(obj.x.y).toEqual('bar');
  });

  it('throws error when node is not there', () => {
    expect(() => {
      bindNode(obj, 'x');
    }).toThrow();
  });

  it('does not throw error when node is not there and optional=true is given', () => {
    expect(() => {
      bindNode(obj, 'x', undefined, undefined, { optional: true });
    }).not.toThrow();
  });

  it("doesn't throw error with bindOptionalNode method of Matreshka when node is missing", () => {
    expect(() => {
      bindOptionalNode(obj, 'x');
    }).not.toThrow();
  });

  it(
    "doesn't throw error with bindOptionalNode method of" + ' Matreshka when node is missing (an object is used)',
    () => {
      expect(() => {
        bindOptionalNode(obj, {
          x: null,
          y: undefined
        });
      }).not.toThrow();
    }
  );

  it('selects children of sandbox', () => {
    bindNode(
      obj,
      'sandbox',
      `<div>
                <div>
                    <span attr="foo"></span>
                </div>
            </div>
        `
    );

    expect(select(obj, 'span').getAttribute('attr')).toEqual('foo');

    expect(selectAll(obj, 'span')[0].getAttribute('attr')).toEqual('foo');
  });

  it('selects nodes with custom selector', () => {
    bindNode(
      obj,
      'sandbox',
      `<div>
                <div>
                    <span attr="foo"></span>
                </div>
            </div>
        `
    );

    expect(select(obj, ':sandbox span').getAttribute('attr')).toEqual('foo');

    expect(select(obj, ':bound(sandbox) span').getAttribute('attr')).toEqual('foo');

    expect(selectAll(obj, ':bound(sandbox) span')[0].getAttribute('attr')).toEqual('foo');

    expect(selectAll(obj, ':sandbox span')[0].getAttribute('attr')).toEqual('foo');

    expect(select(obj, ':sandbox table')).toEqual(null);

    expect(select(obj, ':bound(sandbox) table')).toEqual(null);

    expect(Array.from(selectAll(obj, ':bound(sandbox) table'))).toEqual([]);

    expect(Array.from(selectAll(obj, ':sandbox table'))).toEqual([]);
  });

  it('allows to bind and rebind sandbox via bindSandbox', () => {
    const obj = {
      isMatreshka: true,
      nodes: {},
      $nodes: {}
    };
    const anotherNode = document.createElement('div');

    bindSandbox.call(obj, node, noDebounceFlag);
    bindSandbox.call(obj, anotherNode, noDebounceFlag);

    expect(Array.from(selectAll(obj, ':bound(sandbox)'))).toEqual([anotherNode]);
  });

  it('bindSandbox throws an error when node is missing', () => {
    const obj = {
      isMatreshka: true,
      nodes: {},
      $nodes: {}
    };

    expect(() => {
      bindSandbox.call(obj);
    }).toThrow();
  });

  it('does not allow to bind more than two nodes to "sandbox"', () => {
    const obj = {};
    const node1 = document.createElement('div');
    const node2 = document.createElement('div');

    bindNode(obj, 'sandbox', node1);

    expect(() => {
      bindNode(obj, 'sandbox', node2);
    }).toThrow();
  });

  it(`does not allow to bind more than two nodes to "container"
        when an object has a property isMatreshkaArray=true`, () => {
    const obj = {
      isMatreshkaArray: true
    };
    const node1 = document.createElement('div');
    const node2 = document.createElement('div');

    bindNode(obj, 'container', node1);

    expect(() => {
      bindNode(obj, 'container', node2);
    }).toThrow();
  });
});
