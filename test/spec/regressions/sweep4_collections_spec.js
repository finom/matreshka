// Regressions found by sweep 4, area: Matreshka.Object and Matreshka.Array (COL-n in its report).
// Every test here fails on bf7a12b and encodes the documented behavior.
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import Matreshka from 'matreshka';
import MatreshkaObject from 'src/object';
import MatreshkaArray from 'src/array';

const docs = (file) => readFileSync(resolve(import.meta.dirname, '../../../docs/content/en/api', file), 'utf8');

function renderedArray(itemRenderer = '<li></li>') {
  const arr = new MatreshkaArray();
  arr.bindNode('sandbox', '<ul></ul>');
  arr.itemRenderer = itemRenderer;
  return arr;
}

const texts = (node) => [...node.children].map((child) => child.textContent);

describe('sweep 4: Matreshka.Object and Matreshka.Array', () => {
  it('COL-1 a Model inherited from Matreshka.Array gets the item data, not [data, parentArray, index]', () => {
    class Inner extends MatreshkaArray {}
    class Outer extends MatreshkaArray {
      get Model() {
        return Inner;
      }
    }
    const outer = new Outer();
    outer.push([1, 2]);

    expect(outer[0]).toBeInstanceOf(Inner);
    // the inner array holds the outer one, so outer.toJSON() overflows the stack
    expect(Array.from(outer[0])).toEqual([1, 2]);
  });

  it('COL-1 a collection of collections converts to JSON; a Model with its own constructor still works', () => {
    class Inner extends MatreshkaArray {}
    class Outer extends MatreshkaArray {
      get Model() {
        return Inner;
      }
    }
    const outer = new Outer();
    outer.push([1, 2], 3);
    expect(outer.toJSON()).toEqual([[1, 2], [3]]);

    class OwnInner extends MatreshkaArray {
      constructor(data) {
        super();
        this.recreate(data);
      }
    }
    class OwnOuter extends MatreshkaArray {
      get Model() {
        return OwnInner;
      }
    }
    const own = new OwnOuter();
    own.push([4, 5]);
    expect(own.toJSON()).toEqual([[4, 5]]);
  });

  it('COL-1 a Model made of Matreshka.Array takes a single value as its only item, and null as none', () => {
    class Inner extends MatreshkaArray {}
    class Outer extends MatreshkaArray {
      get Model() {
        return Inner;
      }
    }
    const outer = new Outer();
    outer.push(5, null);
    expect(outer.toJSON()).toEqual([[5], []]);
  });

  it('COL-7 restore of a detached sandbox itself', () => {
    const arr = new MatreshkaArray();
    arr.bindNode('sandbox', document.createElement('div'));
    arr.restore(':sandbox');
    expect(arr.length).toBe(1);
    arr.itemRenderer = '<li></li>';
    expect(arr.length).toBe(1);
  });

  it('COL-2 an item pushed from an "add" handler is rendered after the item that fired it', () => {
    const arr = renderedArray('<li>{{v}}</li>');
    arr.on('add', (evt) => {
      if (evt.added[0].v === 'a') arr.push({ v: 'b' });
    });
    arr.push({ v: 'a' });

    expect(Array.from(arr, (item) => item.v)).toEqual(['a', 'b']);
    expect(texts(arr.nodes.sandbox)).toEqual(['a', 'b']);
  });

  it('COL-2 unshift and orderBy from an "add" handler keep the DOM in the array order', () => {
    const arr = renderedArray('<li>{{v}}</li>');
    arr.on('add', (evt) => {
      if (evt.added[0].v === 'b') arr.unshift({ v: 'a' });
    });
    arr.push({ v: 'b' });
    expect(texts(arr.nodes.sandbox)).toEqual(Array.from(arr, (item) => item.v));

    const sorted = renderedArray('<li>{{v}}</li>');
    sorted.push({ v: 'c' }, { v: 'a' });
    sorted.on('add', () => sorted.orderBy('v'));
    sorted.push({ v: 'b' });
    expect(Array.from(sorted, (item) => item.v)).toEqual(['a', 'b', 'c']);
    expect(texts(sorted.nodes.sandbox)).toEqual(['a', 'b', 'c']);
  });

  it('COL-3 Matreshka.Array.from and silent recreate keep *@ listeners in step with the items', () => {
    const handler = vi.fn();
    class MyArray extends MatreshkaArray {
      constructor() {
        super();
        this.on('*@foo', handler);
      }
    }
    const added = new MatreshkaObject();
    MyArray.from([added]);
    added.trigger('foo');
    expect(handler).toHaveBeenCalledTimes(1);

    const removed = new MatreshkaObject();
    const arr = new MatreshkaArray(removed, new MatreshkaObject());
    const other = vi.fn();
    arr.on('*@foo', other);
    arr.recreate([], { silent: true, dontRender: true });
    removed.trigger('foo');
    expect(other).not.toHaveBeenCalled();
  });

  it('COL-5 push_ with silent: true fires no change:length', () => {
    const arr = new MatreshkaArray();
    const handler = vi.fn();
    arr.on('change:length', handler);
    arr.push_(1, { silent: true });
    expect(handler).not.toHaveBeenCalled();
  });

  it('COL-6 addone and removeone get the event options passed to METHOD_', () => {
    const arr = new MatreshkaArray();
    const addone = vi.fn();
    const removeone = vi.fn();
    arr.on('addone', (evt) => addone(evt.flag));
    arr.on('removeone', (evt) => removeone(evt.flag));
    arr.push_(1, { flag: 42 });
    arr.pop_({ flag: 43 });
    expect(addone).toHaveBeenCalledWith(42);
    expect(removeone).toHaveBeenCalledWith(43);
  });

  it('COL-7 restore keeps the restored nodes when the array has an item mediator', () => {
    const ul = document.createElement('ul');
    ul.innerHTML = '<li>One</li><li>Two</li>';
    const arr = new MatreshkaArray();
    arr.mediateItem((item) => new MatreshkaObject(item));
    arr.itemRenderer = '<li></li>';
    arr.bindNode('sandbox', ul);
    arr.restore();
    arr.rerender();
    expect(ul.children.length).toBe(2);
  });

  it('COL-7 (guard) a forced rerender after restore replaces the restored nodes', () => {
    const ul = document.createElement('ul');
    ul.innerHTML = '<li>One</li><li>Two</li>';
    const arr = new MatreshkaArray();
    arr.itemRenderer = '<li>x</li>';
    arr.bindNode('sandbox', ul);
    arr.restore();
    arr.rerender({ forceRerender: true });
    expect(texts(ul)).toEqual(['x', 'x']);
  });

  it('COL-8 after itemRenderer = null, sorting does not bring the old nodes back', () => {
    const arr = renderedArray('<li>{{v}}</li>');
    arr.push({ v: 'a' }, { v: 'b' });
    arr.itemRenderer = null;
    expect(arr.nodes.sandbox.children.length).toBe(0);
    arr.reverse();
    expect(arr.nodes.sandbox.children.length).toBe(0);
  });

  it('COL-9 forced rerender removes the old nodes from a container the array no longer uses', () => {
    const arr = new MatreshkaArray();
    const oldContainer = document.createElement('ul');
    const newContainer = document.createElement('ul');
    arr.itemRenderer = '<li></li>';
    arr.bindNode('container', oldContainer);
    arr.push({});
    arr.unbindNode('container');
    arr.bindNode('container', newContainer);
    arr.rerender({ forceRerender: true });
    expect(newContainer.children.length).toBe(1);
    expect(oldContainer.children.length).toBe(0);
  });

  it('COL-10 unshift keeps holes as holes, as the native method does', () => {
    const arr = new MatreshkaArray(2);
    const native = new Array(2);
    arr.unshift(1);
    native.unshift(1);
    expect(arr.indexOf(undefined)).toBe(native.indexOf(undefined));
  });

  it('COL-11 orderBy puts NaN last, as lodash does', () => {
    const arr = MatreshkaArray.of({ v: 3 }, { v: NaN }, { v: 1 }, { v: 2 });
    arr.orderBy('v');
    expect(Array.from(arr, (item) => item.v)).toEqual([1, 2, 3, NaN]);
  });

  it('COL-12 Matreshka.Object#toJSON keeps a data key named __proto__', () => {
    const data = '{"__proto__":{"x":1},"a":2}';
    const object = new MatreshkaObject(JSON.parse(data));
    expect(object.keys()).toEqual(['__proto__', 'a']);
    expect(JSON.stringify(object.toJSON())).toBe(data);
  });

  it('COL-13 Matreshka.Array has toString and toLocaleString like an ordinary array', () => {
    const arr = MatreshkaArray.of(1, 2);
    expect(String(arr)).toBe('1,2');
    expect(arr.toLocaleString()).toBe([1, 2].toLocaleString());
  });

  it('COL-16 the toJSON page example prints what its comments say', () => {
    const examples = docs('matreshka-array/to-json.md').split('## Examples')[1];
    const block = examples.match(/```js\n([\s\S]*?)```/)[1];
    const logged = [];
    new Function('Matreshka', 'MatreshkaArray', 'console', block)(Matreshka, MatreshkaArray, {
      log: (value) => logged.push(value)
    });
    expect(logged[0]).toEqual([1, 2, [3, 4]]);
    expect(logged[1].slice(0, 2)).toEqual([1, 2]);
    expect(logged[1][2].isMatreshkaArray).toBe(true);
  });

  it('COL-17 every class example in the docs calls super() before using this', () => {
    const root = resolve(import.meta.dirname, '../../../docs/content');
    const files = readdirSync(root, { recursive: true }).filter((file) => file.endsWith('.md'));
    const missing = [];
    for (const file of files) {
      const text = readFileSync(resolve(root, file), 'utf8');
      for (const [, body] of text.matchAll(/class \w+ extends [\w.]+[^{]*\{([\s\S]*?)\n\}/g)) {
        for (const [, , constructorBody] of body.matchAll(/\n(\s+)constructor\([^)]*\)\s*\{([\s\S]*?)\n\1\}/g)) {
          const usesThis = constructorBody.search(/\bthis\b/);
          const callsSuper = constructorBody.search(/\bsuper\b/);
          if (constructorBody.trim() !== '...' && (callsSuper === -1 || (usesThis !== -1 && usesThis < callsSuper))) {
            missing.push(file);
          }
        }
      }
    }
    expect(missing).toEqual([]);
  });
});
