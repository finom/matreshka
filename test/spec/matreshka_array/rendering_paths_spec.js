import MatreshkaArray from 'src/array';
import MatreshkaObject from 'src/object';
import createSpy from '../../helpers/createspy';

// rendering paths not covered by renderer_spec: primitive items, silent calls,
// items without a renderer, items rendered without a sandbox, moveSandbox and restore hooks
describe('Matreshka.Array rendering paths', () => {
  const texts = (arr) => [...arr.nodes.sandbox.children].map((node) => node.textContent);

  function createArray() {
    const arr = new MatreshkaArray();
    arr.bindNode('sandbox', '<div></div>');
    arr.itemRenderer = (item) => `<span>${item.x}</span>`;
    return arr;
  }

  describe('primitive items are skipped', () => {
    it('by push, unshift and splice', () => {
      const arr = createArray();

      arr.push(1, { x: 'a' }, null);
      arr.unshift('s', { x: 'b' }, undefined);
      arr.splice(1, 0, 2, { x: 'c' });

      expect(texts(arr)).toEqual(['c', 'b', 'a']);
    });

    it('by splice that inserts before primitive followers', () => {
      const arr = createArray();

      arr.push({ x: 'a' }, 1, 2, { x: 'd' });
      arr.splice(1, 0, { x: 'b' });

      expect(texts(arr)).toEqual(['a', 'b', 'd']);
    });

    it('by splice that appends at the end', () => {
      const arr = createArray();

      arr.push({ x: 'a' }, 1);
      arr.splice(2, 0, { x: 'b' });

      expect(texts(arr)).toEqual(['a', 'b']);
    });

    it('by pop, shift, pull and splice removal', () => {
      const arr = createArray();

      arr.push(1, { x: 'a' }, 2, { x: 'b' }, 3, 4);
      arr.pop();
      arr.shift();
      arr.pull(1);
      arr.splice(0, 1);

      expect(arr.length).toEqual(2);
      expect(texts(arr)).toEqual(['b']);
    });

    it('by sort, reverse, rerender and recreate', () => {
      const arr = createArray();
      const a = { x: 'a' };
      const b = { x: 'b' };

      arr.push(b, 1, a);
      arr.sort((x, y) => String(x?.x ?? x).localeCompare(String(y?.x ?? y)));
      expect(texts(arr)).toEqual(['a', 'b']);

      arr.reverse();
      expect(texts(arr)).toEqual(['b', 'a']);

      arr.rerender({ forceRerender: true });
      expect(texts(arr)).toEqual(['b', 'a']);

      arr.recreate([2, a, null, { x: 'c' }]);
      expect(texts(arr)).toEqual(['a', 'c']);
    });
  });

  describe('silent calls render without render events', () => {
    function createWatched() {
      const arr = createArray();
      const render = createSpy();
      const afterrender = createSpy();
      const item = () => {
        const obj = new MatreshkaObject({ x: 'i' });
        obj.on('render', render).on('afterrender', afterrender);
        return obj;
      };
      return { arr, render, afterrender, item };
    }

    it('push_, unshift_ and splice_', () => {
      const { arr, render, afterrender, item } = createWatched();

      arr.push_(item(), { silent: true });
      arr.unshift_(item(), { silent: true });
      arr.splice_(1, 0, item(), { silent: true });

      expect(arr.nodes.sandbox.children.length).toEqual(3);
      expect(render).not.toHaveBeenCalled();
      expect(afterrender).not.toHaveBeenCalled();
    });

    it('recreate and rerender', () => {
      const { arr, render, afterrender, item } = createWatched();

      arr.recreate([item(), item()], { silent: true });
      arr.rerender({ forceRerender: true, silent: true });

      expect(arr.nodes.sandbox.children.length).toEqual(2);
      expect(render).not.toHaveBeenCalled();
      expect(afterrender).not.toHaveBeenCalled();
    });
  });

  it('recreate renders plain objects never seen before', () => {
    const arr = createArray();

    arr.push({ x: 'old' });
    arr.recreate([{ x: 'a' }, { x: 'b' }]);

    expect(texts(arr)).toEqual(['a', 'b']);
  });

  it('leaves objects without a renderer unrendered and keeps them in place on sort', () => {
    const arr = new MatreshkaArray();
    arr.bindNode('sandbox', '<div></div>');

    const own = {
      x: 'own',
      renderer() {
        return `<b>${this.x}</b>`;
      }
    };

    arr.push({ x: 'none' }, own, { x: 'none 2' });
    expect([...arr.nodes.sandbox.children].map((n) => n.outerHTML)).toEqual(['<b>own</b>']);

    arr.reverse();
    arr.rerender();
    expect(arr.nodes.sandbox.children.length).toEqual(1);
  });

  it('calls an item renderer with the item as its context', () => {
    const arr = createArray();
    const renderer = createSpy(() => '<i></i>');
    const item = { renderer };

    arr.push(item);

    expect(renderer.mock.contexts[0]).toBe(item);
    expect(renderer).toHaveBeenCalledWith(item);
  });

  it('calls onRender and onItemRender of an item and of the array', () => {
    const arr = createArray();
    const onRender = createSpy();
    const onItemRender = createSpy();
    arr.onItemRender = onItemRender;
    const item = { x: 1, onRender };

    arr.push(item);

    expect(onRender).toHaveBeenCalledTimes(1);
    expect(onRender.mock.contexts[0]).toBe(item);
    expect(onRender.mock.calls[0][0].node.textContent).toEqual('1');
    expect(onItemRender).toHaveBeenCalledWith(item, expect.objectContaining({ self: item, parentArray: arr }));
  });

  describe('bindRenderedAsSandbox = false', () => {
    it('renders an item without binding its sandbox, also on rerender', () => {
      const arr = createArray();
      const item = new MatreshkaObject({ x: 'a' });
      item.bindRenderedAsSandbox = false;

      arr.push(item);
      expect(texts(arr)).toEqual(['a']);
      expect(item.nodes.sandbox).toBeUndefined();

      arr.rerender({ forceRerender: true });
      expect(texts(arr)).toEqual(['a']);

      arr.pop();
      arr.push(item);
      expect(texts(arr)).toEqual(['a']);
      expect(item.nodes.sandbox).toBeUndefined();
    });

    it('restore leaves the sandbox of a Model with bindRenderedAsSandbox = false', () => {
      class Model extends MatreshkaObject {
        get bindRenderedAsSandbox() {
          return false;
        }
      }
      const arr = new MatreshkaArray();
      arr.Model = Model;
      arr.bindNode('sandbox', '<div><p></p><p></p></div>');
      arr.restore();

      expect(arr.length).toEqual(2);
      expect(arr[0].nodes.sandbox).toBeUndefined();
    });
  });

  it('restore calls onRender of a Model and onItemRender of the array', () => {
    const onRender = createSpy();
    const onItemRender = createSpy();
    class Model extends MatreshkaObject {
      onRender(evt) {
        onRender(this, evt);
      }
    }
    const arr = new MatreshkaArray();
    arr.Model = Model;
    arr.onItemRender = onItemRender;
    arr.bindNode('sandbox', '<div><p></p><p></p></div>');
    arr.restore();

    expect(onRender).toHaveBeenCalledTimes(2);
    expect(onRender.mock.calls[0][0]).toBe(arr[0]);
    expect(onRender.mock.calls[1][1].node).toBe(arr.nodes.sandbox.children[1]);
    expect(onItemRender).toHaveBeenCalledTimes(2);
    expect(onItemRender.mock.calls[0][0]).toBe(arr[0]);
  });

  it('forceRerender renders again an item whose node was moved out of the container', () => {
    const arr = createArray();
    const item = { x: 'a' };
    arr.push(item);
    const outside = document.createElement('div');
    const oldNode = arr.nodes.sandbox.firstChild;
    outside.appendChild(oldNode);

    arr.rerender({ forceRerender: true });

    expect(texts(arr)).toEqual(['a']);
    expect(arr.nodes.sandbox.firstChild).not.toBe(oldNode);
    expect(outside.firstChild).toBe(oldNode);
  });

  describe('moveSandbox', () => {
    it('renders an item that has no sandbox', () => {
      const arr = createArray();
      const item = new MatreshkaObject({ x: 'a' });

      arr.push_(item, { moveSandbox: true });

      expect(texts(arr)).toEqual(['a']);
      expect(item.nodes.sandbox).toBe(arr.nodes.sandbox.firstChild);
    });

    it('renders an item whose sandbox was unbound', () => {
      const arr = createArray();
      const item = new MatreshkaObject({ x: 'a' });
      item.bindNode('sandbox', '<div>old</div>');
      item.unbindNode('sandbox');

      arr.push_(item, { moveSandbox: true });

      expect(texts(arr)).toEqual(['a']);
    });

    it('moves the sandbox past the arrays which rendered other nodes', () => {
      const first = createArray();
      const second = createArray();
      const third = createArray();
      const item = new MatreshkaObject({ x: 'a' });

      second.push(item);
      const sandbox = item.nodes.sandbox;
      // a sandbox takes one node, so the first array renders the item without binding it
      item.bindRenderedAsSandbox = false;
      first.push(item);
      item.bindRenderedAsSandbox = true;
      expect(first.nodes.sandbox.firstChild).not.toBe(sandbox);

      third.push_(item, { moveSandbox: true });

      expect(third.nodes.sandbox.firstChild).toBe(sandbox);
      // the sandbox left the second array, so removing the item there leaves third's node alone
      second.pop();
      expect(third.nodes.sandbox.firstChild).toBe(sandbox);
    });
  });

  it('fill throws on a rendered array', () => {
    const arr = createArray();
    arr.push({ x: 'a' });

    expect(() => arr.fill({ x: 'b' })).toThrow(/fill/);
  });

  it('rerender does nothing when renderIfPossible is false', () => {
    const arr = createArray();
    arr.renderIfPossible = false;
    arr.push({ x: 'a' });
    arr.rerender();

    expect(arr.nodes.sandbox.children.length).toEqual(0);
  });

  it('mediateItem converts items without rendering them when renderIfPossible is false', () => {
    const arr = createArray();
    arr.renderIfPossible = false;
    arr.push(1, 2);
    arr.mediateItem((value) => ({ x: value }));

    expect(arr[0]).toEqual({ x: 1 });
    expect(arr.nodes.sandbox.children.length).toEqual(0);
  });
});

describe('Matreshka.Array pseudo-native methods, edge arguments', () => {
  it('push and unshift with no items return the length and fire nothing', () => {
    const arr = new MatreshkaArray(1, 2);
    const handler = createSpy();
    arr.on('modify', handler);

    expect(arr.push()).toEqual(2);
    expect(arr.unshift_({})).toEqual(2);
    expect(handler).not.toHaveBeenCalled();
  });

  it('pop and shift on an empty array return undefined and fire nothing', () => {
    const arr = new MatreshkaArray();
    const handler = createSpy();
    arr.on('modify', handler);

    expect(arr.pop()).toBeUndefined();
    expect(arr.shift_({})).toBeUndefined();
    expect(handler).not.toHaveBeenCalled();
  });

  it('sort, reverse and orderBy of fewer than two items fire nothing', () => {
    const arr = new MatreshkaArray({ a: 1 });
    const handler = createSpy();
    arr.on('sort reverse', handler);

    arr.sort();
    arr.reverse_({});
    arr.orderBy('a');

    expect(handler).not.toHaveBeenCalled();
  });

  it('the _ methods ignore an options argument that is not an object', () => {
    const arr = new MatreshkaArray();
    const handler = createSpy();
    arr.on('modify', handler);

    arr.push_(3, 1, null);
    arr.unshift_(0, 'x');
    arr.splice_(1, 0, 2, 0);
    arr.sort_(undefined, 5);
    arr.reverse_(false);
    arr.shift_(null);
    arr.pop_(7);
    arr.fill_(9, 1, 2, null);
    arr.copyWithin_(0, 1, 2, null);

    expect(arr.toJSON()).toEqual([9, 9]);
    expect(handler).toHaveBeenCalledTimes(9);
  });

  it('indexOf, lastIndexOf and includes take fromIndex', () => {
    const arr = new MatreshkaArray('a', 'b', 'a');

    expect(arr.indexOf('a', 1)).toEqual(2);
    expect(arr.lastIndexOf('a', 1)).toEqual(0);
    expect(arr.includes('b', 2)).toBe(false);
  });

  it('orderBy without keys keeps the order but fires sort', () => {
    const arr = new MatreshkaArray({ a: 2 }, { a: 1 });
    const handler = createSpy();
    arr.on('sort', handler);

    arr.orderBy(null);

    expect(arr.toJSON()).toEqual([{ a: 2 }, { a: 1 }]);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('orderBy keeps falsy items where the comparator leaves them', () => {
    const arr = new MatreshkaArray({ a: 2 }, null, { a: 1 });

    arr.orderBy('a');

    expect(arr.length).toEqual(3);
    expect(arr.toJSON()).toContain(null);
  });
});

describe('Matreshka.Array recreate with trackBy', () => {
  it('updates a nested Matreshka.Array item by recreating it', () => {
    const inner = new MatreshkaArray(1, 2);
    const arr = new MatreshkaArray(inner);
    arr.trackBy = '$index';

    arr.recreate([[3, 4, 5]]);

    expect(arr[0]).toBe(inner);
    expect(inner.toJSON()).toEqual([3, 4, 5]);
  });

  it('skips old items without the key and keeps new primitive items', () => {
    const tracked = { id: 1, v: 'old' };
    const arr = new MatreshkaArray({ v: 'no id' }, tracked, 5);
    arr.trackBy = 'id';

    arr.recreate([{ id: 1, v: 'new' }, 7, { id: 2 }]);

    expect(arr[0]).toBe(tracked);
    expect(tracked.v).toEqual('new');
    expect(arr[1]).toEqual(7);
    expect(arr[2]).toEqual({ id: 2 });
  });
});
