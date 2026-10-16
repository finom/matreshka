import MatreshkaObject from 'src/object';
import MatreshkaArray from 'src/array';
import defs from 'src/_core/defs';
import Matreshka from 'matreshka';

// regressions found by the 2026 sweep of Matreshka.Array

function renderedArray(itemRenderer = '<li></li>') {
  const arr = new MatreshkaArray();
  arr.bindNode('sandbox', '<ul></ul>');
  arr.itemRenderer = itemRenderer;
  return arr;
}

describe('Matreshka.Array regressions', () => {
  it('AR-1: splice(start) with one argument removes every item from start', () => {
    const arr = new MatreshkaArray(1, 2, 3, 4);
    const removed = arr.splice(1);

    expect(arr.toJSON()).toEqual([1]);
    expect(removed.toJSON()).toEqual([2, 3, 4]);
  });

  it('AR-1: splice_(start, eventOptions) removes every item from start', () => {
    const arr = new MatreshkaArray(1, 2, 3, 4);
    arr.splice_(2, { silent: true });

    expect(arr.toJSON()).toEqual([1, 2]);
  });

  it('AR-2: re-adding a rendered item after it was removed does not throw', () => {
    const arr = renderedArray();
    const item = new MatreshkaObject();

    arr.push(item);
    arr.pull(item);

    expect(() => arr.push(item)).not.toThrow();
    expect(arr.nodes.sandbox.children.length).toBe(1);
    expect(item.nodes.sandbox).toBe(arr.nodes.sandbox.children[0]);
  });

  it('AR-2: recreate can bring back an item removed by an earlier recreate (filtered view)', () => {
    const arr = renderedArray();
    const o1 = new MatreshkaObject();
    const o2 = new MatreshkaObject();

    arr.recreate([o1, o2]);
    arr.recreate([o1]);

    expect(() => arr.recreate([o1, o2])).not.toThrow();
    expect(arr.nodes.sandbox.children.length).toBe(2);
  });

  it('AR-2: an item removed from one rendered array can be pushed to another one', () => {
    const a = renderedArray();
    const b = renderedArray();
    const item = new MatreshkaObject();

    a.push(item);

    expect(() => b.push(a.pull(item))).not.toThrow();
    expect(b.nodes.sandbox.children.length).toBe(1);
  });

  it('AR-3: a rendered plain object stays serializable', () => {
    const arr = renderedArray('<li>{{x}}</li>');
    const item = { x: 1 };

    arr.push(item);

    expect(() => JSON.stringify(arr)).not.toThrow();
    expect(JSON.stringify(arr)).toBe('[{"x":1}]');
    expect(Object.keys(item)).toEqual(['x']);
  });

  it('AR-3: restore() without Model gives serializable items', () => {
    const arr = new MatreshkaArray();
    arr.bindNode('sandbox', '<ul><li></li><li></li></ul>');
    arr.restore();

    expect(() => JSON.stringify(arr)).not.toThrow();
  });

  it('AR-4: Model declared as a class field converts added items', () => {
    class M extends MatreshkaObject {}
    class A extends MatreshkaArray {
      Model = M;
    }
    const arr = new A();

    arr.push({ a: 1 });

    expect(arr[0]).toBeInstanceOf(M);
  });

  it('AR-4: itemRenderer declared as a class field rerenders when reassigned', () => {
    class A extends MatreshkaArray {
      itemRenderer = '<li></li>';
      constructor() {
        super().bindNode('sandbox', '<ul></ul>');
      }
    }
    const arr = new A();

    arr.push({});
    arr.itemRenderer = '<p></p>';

    expect(arr.nodes.sandbox.innerHTML).toBe('<p></p>');
  });

  it('AR-5: trackBy keeps a tracked item that moved to an index the old array did not have', () => {
    class A extends MatreshkaArray {
      get trackBy() {
        return 'id';
      }
    }
    const arr = new A();
    const one = { id: 1, name: 'one' };

    arr.recreate([one]);
    arr.recreate([{ id: 2 }, { id: 1, name: 'uno' }]);

    expect(arr[1]).toBe(one);
    expect(one.name).toBe('uno');
  });

  it('AR-6: rerendering does not keep bindings to the old item nodes', () => {
    const arr = renderedArray('<li>{{x}}</li>');
    const item = new MatreshkaObject({ x: 1 });

    arr.push(item);
    arr.itemRenderer = '<li>{{x}}!</li>';
    arr.itemRenderer = '<li>{{x}}?</li>';

    expect(defs.get(item).props.x.bindings.length).toBe(1);
  });

  it('AR-7: changing Model later keeps the DOM in sync with the converted items', () => {
    class M extends MatreshkaObject {}
    const arr = renderedArray();

    arr.push(new MatreshkaObject({ a: 1 }));
    arr.Model = M;

    expect(arr[0]).toBeInstanceOf(M);
    expect(arr[0].nodes.sandbox).toBe(arr.nodes.sandbox.children[0]);

    arr.pull(0);
    expect(arr.nodes.sandbox.children.length).toBe(0);
  });

  it('AR-7: changing Model later works for rendered plain objects', () => {
    class M extends MatreshkaObject {}
    const arr = renderedArray();

    arr.push({ a: 1 });

    expect(() => {
      arr.Model = M;
    }).not.toThrow();
  });

  it('AR-8: splice passes the real index of every added item to the item mediator', () => {
    const arr = new MatreshkaArray(1, 2, 3);
    const indexes = [];

    arr.mediateItem((value, index) => {
      indexes.push(index);
      return value;
    });
    indexes.length = 0;

    arr.splice(1, 0, 'a', 'b');
    arr.splice(-1, 0, 'c');

    expect(indexes).toEqual([1, 2, 4]);
  });

  it('AR-9: pull with a negative index does not remove the first item silently', () => {
    const arr = new MatreshkaArray('a', 'b', 'c');
    const removed = arr.pull(-1);

    expect(removed).toBe(null);
    expect(arr.toJSON()).toEqual(['a', 'b', 'c']);
    expect(Object.keys(arr)).not.toContain('-1');
  });

  it('AR-9: pull with a fractional index does not remove the last item silently', () => {
    const arr = new MatreshkaArray('a', 'b', 'c');
    arr.pull(1.5);

    expect(arr.toJSON()).toEqual(['a', 'b', 'c']);
  });

  it('AR-9: pull of an index holding undefined reports the removal', () => {
    const arr = new MatreshkaArray('a', undefined, 'c');
    let modified = 0;

    arr.on('modify', () => {
      modified += 1;
    });
    arr.pull(1);

    expect(arr.toJSON()).toEqual(['a', 'c']);
    expect(modified).toBe(1);
  });

  it('AR-10: pull returns null when nothing is removed (as documented)', () => {
    const arr = new MatreshkaArray('a');

    expect(arr.pull(5)).toBe(null);
    expect(arr.pull({})).toBe(null);
  });

  it('AR-11: fill applies the Model to the new items', () => {
    class M extends MatreshkaObject {}
    class A extends MatreshkaArray {
      get Model() {
        return M;
      }
    }
    const arr = new A({}, {});

    arr.fill({ z: 1 });

    expect(arr[0]).toBeInstanceOf(M);
  });

  it('AR-11: fill reports the replaced items as removed', () => {
    const arr = new MatreshkaArray(1, 2, 3);
    let evt;

    arr.on('modify', (e) => {
      evt = e;
    });
    arr.fill(9);

    expect(evt.removed).toEqual([1, 2, 3]);
  });

  it('AR-12: of and from on a subclass apply its Model', () => {
    class M extends MatreshkaObject {}
    class A extends MatreshkaArray {
      get Model() {
        return M;
      }
    }

    expect(A.of({})[0]).toBeInstanceOf(M);
    expect(A.from([{}])[0]).toBeInstanceOf(M);
  });

  it('AR-13: of on a subclass whose constructor adds items leaves no stale items', () => {
    class A extends MatreshkaArray {
      constructor() {
        super(1, 2, 3);
      }
    }
    const result = A.of('x');

    expect(result.length).toBe(1);
    expect(result[1]).toBe(undefined);
    expect(result[2]).toBe(undefined);
  });

  it('AR-14: copyWithin on a rendered array does not leave the DOM out of sync silently', () => {
    const arr = renderedArray('<li>{{v}}</li>');
    arr.push({ v: 1 }, { v: 2 }, { v: 3 });

    // like fill, it should throw "Not possible to render when copyWithin method is called"
    expect(() => arr.copyWithin(0, 1)).toThrow(/copyWithin/);
  });

  it('AR-15: splice inserts the node before the next rendered item when a primitive sits between', () => {
    const arr = renderedArray('<li>{{v}}</li>');
    arr.push({ v: 'a' }, 5, { v: 'c' });
    arr.splice(1, 0, { v: 'b' });

    expect(arr.nodes.sandbox.textContent).toBe('abc');
  });

  it('AR-16: removing an item whose node is not in the current container does not throw', () => {
    const arr = new MatreshkaArray();
    arr.bindNode('container', '<ul></ul>');
    arr.itemRenderer = '<li></li>';
    arr.push({}, {});
    arr.unbindNode('container');
    arr.bindNode('container', '<ol></ol>');

    expect(() => arr.pop()).not.toThrow();
  });

  it('AR-16: recreate removes the node of a removed item that is not in the current container', () => {
    const arr = new MatreshkaArray();
    arr.bindNode('container', '<ul></ul>');
    arr.itemRenderer = '<li></li>';
    arr.push({}, {});
    arr.unbindNode('container');
    arr.bindNode('container', '<ol></ol>');

    expect(() => arr.recreate([])).not.toThrow();
  });

  it('AR-17: the constructor refuses an invalid length like the native Array', () => {
    expect(() => new MatreshkaArray(-1)).toThrow(RangeError);
    expect(() => new MatreshkaArray(Number.NaN)).toThrow(RangeError);
  });
});

describe('Matreshka.Array regressions found by the review', () => {
  it('R1: forceRerender of an item that is also bound to window', () => {
    const arr = new Matreshka.Array();
    arr.itemRenderer = '<li></li>';
    const item = new Matreshka.Object({ a: 1 });
    Matreshka.bindNode(item, 'w', window, {
      on: 'resize',
      getValue() {
        return 1;
      }
    });
    arr.bindNode('sandbox', document.createElement('ul'));
    arr.push(item);
    expect(() => arr.rerender({ forceRerender: true })).not.toThrow();
  });

  it('R1b: changing itemRenderer when an item is bound to window', () => {
    const arr = new Matreshka.Array();
    arr.itemRenderer = '<li></li>';
    const item = new Matreshka.Object({ a: 1 });
    Matreshka.bindNode(item, 'w', window, {
      on: 'resize',
      getValue() {
        return 1;
      }
    });
    arr.bindNode('sandbox', document.createElement('ul'));
    arr.push(item);
    expect(() => {
      arr.itemRenderer = '<p></p>';
    }).not.toThrow();
  });

  it('R2: setting Model on a rendered array keeps onItemRender bindings', () => {
    const ul = document.createElement('ul');
    const arr = new Matreshka.Array();
    let renders = 0;
    arr.itemRenderer = '<li><span class="x"></span></li>';
    arr.onItemRender = (item, { node }) => {
      renders += 1;
      Matreshka.bindNode(item, 'x', node.querySelector('.x'), Matreshka.binders.text());
    };
    arr.bindNode('sandbox', ul);
    arr.push({ x: 1 });
    expect(ul.textContent).toBe('1');
    arr.Model = Matreshka.Class({ extends: Matreshka.Object });
    expect(ul.textContent).toBe('1');
    expect(renders).toBe(2);
  });

  it('R4: forceRerender releases deep bindings of the replaced node', () => {
    const ul = document.createElement('ul');
    const arr = new Matreshka.Array();
    arr.itemRenderer = '<li><span class="v"></span></li>';
    arr.onItemRender = (item, { node }) => {
      Matreshka.bindNode(item, 'a.b', node.querySelector('.v'), Matreshka.binders.text(), {
        debounceSetValue: false
      });
    };
    arr.bindNode('sandbox', ul);
    const item = new Matreshka.Object({ a: { b: 1 } });
    arr.push(item);
    const oldSpan = ul.querySelector('.v');
    arr.rerender({ forceRerender: true });
    item.a.b = 2;
    expect(ul.querySelector('.v').textContent).toBe('2');
    expect(oldSpan.textContent).toBe('1');
  });
  it('R4b: forceRerender releases plain bindings of the replaced node', () => {
    const ul = document.createElement('ul');
    const arr = new Matreshka.Array();
    arr.itemRenderer = '<li><span class="v"></span></li>';
    arr.onItemRender = (item, { node }) => {
      Matreshka.bindNode(item, 'b', node.querySelector('.v'), Matreshka.binders.text(), {
        debounceSetValue: false
      });
    };
    arr.bindNode('sandbox', ul);
    const item = new Matreshka.Object({ b: 1 });
    arr.push(item);
    const oldSpan = ul.querySelector('.v');
    arr.rerender({ forceRerender: true });
    item.b = 2;
    expect(ul.querySelector('.v').textContent).toBe('2');
    expect(oldSpan.textContent).toBe('1');
  });

  it('R5: splice inserts before the next rendered item when the last added value repeats later', () => {
    const ul = document.createElement('ul');
    const arr = new Matreshka.Array();
    arr.itemRenderer = (item) => `<li>${item.n}</li>`;
    arr.bindNode('sandbox', ul);
    arr.push({ n: 'A' }, 'x', { n: 'B' }, 'x');
    arr.splice(1, 0, { n: 'C' }, 'x');
    expect(ul.textContent).toBe('ACB');
  });

  it('R7: removing an item hidden by the existence binder removes its placeholder', () => {
    const ul = document.createElement('ul');
    const arr = new Matreshka.Array();
    arr.itemRenderer = '<li></li>';
    arr.onItemRender = (item, { node }) => {
      Matreshka.bindNode(item, 'visible', node, Matreshka.binders.existence(), { debounceSetValue: false });
    };
    arr.bindNode('sandbox', ul);
    const item = new Matreshka.Object({ visible: true });
    arr.push(item, new Matreshka.Object({ visible: true }));
    item.visible = false;
    expect(ul.childNodes[0].nodeType).toBe(8);
    arr.shift();
    expect(ul.childNodes.length).toBe(1);
    item.visible = true;
    expect(ul.children.length).toBe(1);
  });

  it('R8: forceRerender releases an exactKey binding with a dot in its key', () => {
    const ul = document.createElement('ul');
    const arr = new Matreshka.Array();
    arr.itemRenderer = '<li><span class="v"></span></li>';
    arr.onItemRender = (item, { node }) => {
      Matreshka.bindNode(item, 'a.b', node.querySelector('.v'), Matreshka.binders.text(), {
        exactKey: true,
        debounceSetValue: false
      });
    };
    arr.bindNode('sandbox', ul);
    const item = new Matreshka.Object();
    Matreshka.set(item, 'a.b', 1);
    arr.push(item);
    const oldSpan = ul.querySelector('.v');
    arr.rerender({ forceRerender: true });
    Matreshka.set(item, 'a.b', 2);
    expect(ul.querySelector('.v').textContent).toBe('2');
    expect(oldSpan.textContent).toBe('1');
  });

  it('R7b: recreate removes the placeholder of an item hidden by the existence binder', () => {
    const ul = document.createElement('ul');
    const arr = new Matreshka.Array();
    arr.itemRenderer = '<li></li>';
    arr.onItemRender = (item, { node }) => {
      Matreshka.bindNode(item, 'visible', node, Matreshka.binders.existence(), { debounceSetValue: false });
    };
    arr.bindNode('sandbox', ul);
    const item = new Matreshka.Object({ visible: true });
    arr.push(item);
    item.visible = false;
    arr.recreate([]);
    expect(ul.childNodes.length).toBe(0);
  });
});
