import MatreshkaObject from 'src/object';
import MatreshkaArray from 'src/array';
import { html } from 'src/binders';
import createSpy from '../../helpers/createspy';

// TODO: Split this file by smaller ones
describe('Matreshka.Array renderer', () => {
  const n = 10;

  class Model extends MatreshkaObject {
    constructor(obj) {
      super(obj).on('render', () =>
        this.bindNode('x', ':sandbox span', html(), {
          debounceGetValue: false,
          debounceSetValue: false
        })
      );
    }
  }

  class Arr extends MatreshkaArray {
    get Model() {
      return Model;
    }

    constructor(...args) {
      super(...args).bindNode('sandbox', '<div data-foo="bar"></div>');
    }
  }

  function createArray() {
    return new Arr();
  }

  it('renders', () => {
    const arr = createArray();

    arr.itemRenderer = createSpy(() => '<div><span></span></div>');

    for (let i = 0; i < n; i++) {
      arr.push({
        x: i
      });
    }

    expect(arr.length).toEqual(n);
    expect(arr.itemRenderer).toHaveBeenCalledTimes(n);
    expect(arr.nodes.sandbox.children.length).toEqual(n);
  });

  it('throws an error when two nodes are given as render for single item', () => {
    const arr = createArray();

    arr.itemRenderer = () => '<div></div><div></div>';

    expect(() => {
      arr.push({});
    }).toThrow();
  });

  it('throws an error when trying to insert same rendered node twice', () => {
    const arr = createArray();

    arr.itemRenderer = createSpy(() => '<div><span></span></div>');

    for (let i = 0; i < n; i++) {
      arr.push({
        x: i
      });
    }

    expect(() => arr.push(arr[0])).toThrow();

    expect(arr.length).toEqual(n + 1);
    expect(arr.itemRenderer).toHaveBeenCalledTimes(n);
    expect(arr.nodes.sandbox.children.length).toEqual(n);
  });

  it('renders via recreate', () => {
    const arr = createArray();
    const newItems = [];

    arr.itemRenderer = createSpy(() => '<div><span></span></div>');

    for (let i = 0; i < n; i++) {
      newItems.push({
        x: i
      });
    }

    arr.recreate(newItems);

    expect(arr.length).toEqual(n);
    expect(arr.itemRenderer).toHaveBeenCalledTimes(n);
    expect(arr.nodes.sandbox.children.length).toEqual(n);
  });

  it('throws an error when the same objects are passed to recreate', () => {
    const arr = createArray();
    const newItems = [];

    arr.itemRenderer = createSpy(() => '<div><span></span></div>');

    for (let i = 0; i < n; i++) {
      newItems.push({
        x: i
      });
    }

    arr.recreate(newItems);

    expect(() => {
      arr.recreate([arr[0], arr[0]]);
    }).toThrow();

    expect(arr.length).toEqual(2);
    expect(arr.itemRenderer).toHaveBeenCalledTimes(n);
    expect(arr.nodes.sandbox.children.length).toEqual(1);
  });

  it('allows to rerender and allows to force rerender', () => {
    const arr = createArray();

    arr.itemRenderer = createSpy(() => '<div><span></span></div>');

    for (let i = 0; i < n; i++) {
      arr.push({
        x: i
      });
    }

    arr.nodes.sandbox.innerHTML = '';

    arr.rerender();

    expect(arr.length).toEqual(n);
    expect(arr.itemRenderer).toHaveBeenCalledTimes(n);
    expect(arr.nodes.sandbox.children.length).toEqual(n);

    arr.rerender({
      forceRerender: true
    });

    expect(arr.length).toEqual(n);
    expect(arr.itemRenderer).toHaveBeenCalledTimes(n * 2);
    expect(arr.nodes.sandbox.children.length).toEqual(n);
  });

  it('rerenders when renderer is changed', () => {
    const arr = createArray();

    arr.itemRenderer = createSpy(() => '<div><span></span></div>');

    for (let i = 0; i < n; i++) {
      arr.push({
        x: i
      });
    }

    expect(arr.itemRenderer).toHaveBeenCalledTimes(n);

    arr.itemRenderer = createSpy(() => '<div><span></span></div>');

    expect(arr.length).toEqual(n);
    expect(arr.itemRenderer).toHaveBeenCalledTimes(n);
    expect(arr.nodes.sandbox.children.length).toEqual(n);
  });

  it('allows to pass dontRender=true to push and forceRerender=false' + ' setting to itemRenderer', () => {
    const arr = createArray();

    arr.itemRenderer = createSpy(() => '<div><span></span></div>');

    for (let i = 0; i < n / 2; i++) {
      arr.push({
        x: i
      });
    }

    for (let i = 0; i < n / 2; i++) {
      arr.push_(
        {
          x: i + n / 2
        },
        {
          dontRender: true
        }
      );
    }

    expect(arr.itemRenderer).toHaveBeenCalledTimes(n / 2);

    arr.set(
      'itemRenderer',
      createSpy(() => '<div><span></span></div>'),
      {
        forceRerender: false
      }
    );

    expect(arr.length).toEqual(n);
    expect(arr.itemRenderer).toHaveBeenCalledTimes(n / 2);
    expect(arr.nodes.sandbox.children.length).toEqual(n);
  });

  it('removes rendered nodes recreate method is used', () => {
    const arr = createArray();

    arr.itemRenderer = () => '<div><span></span></div>';

    for (let i = 0; i < n; i++) {
      arr.push({
        x: i
      });
    }

    arr.recreate();

    expect(arr.length).toEqual(0);
    expect(arr.nodes.sandbox.children.length).toEqual(0);
  });

  it('renders if silent=true', () => {
    const arr = createArray();

    arr.itemRenderer = createSpy(() => '<div><span></span></div>');

    for (let i = 0; i < n; i++) {
      arr.push_(
        {
          x: i
        },
        {
          silent: true
        }
      );
    }

    expect(arr.length).toEqual(n);
    expect(arr.itemRenderer).toHaveBeenCalledTimes(n);
    expect(arr.nodes.sandbox.children.length).toEqual(n);
  });

  it('uses bindings parser', () => {
    const arr = createArray();

    arr.itemRenderer = createSpy(() => '  <div><span attr="hey {{x}}"></span></div>  ');

    for (let i = 0; i < n; i++) {
      arr.push_(
        {
          x: i
        },
        {
          debounce: false
        }
      );
    }

    expect(arr[5].nodes.sandbox.firstChild.getAttribute('attr')).toEqual('hey 5');
    expect(arr.length).toEqual(n);
    expect(arr.itemRenderer).toHaveBeenCalledTimes(n);
    expect(arr.nodes.sandbox.children.length).toEqual(n);
  });

  it('allows to use selector as renderer', () => {
    const arr = createArray();
    const div = window.document.createElement('div');

    div.innerHTML = '<span>Hi there <div><span attr="hey {{x}}"></span></div>{{x}}</span>';
    div.className = 'item-renderer';

    arr.nodes.sandbox.appendChild(div);

    arr.itemRenderer = ':sandbox .item-renderer';

    for (let i = 0; i < n; i++) {
      arr.push_(
        {
          x: i
        },
        { debounce: false }
      );
    }

    expect(arr.nodes.sandbox.children[0].tagName).toEqual('DIV');
    // the first node is itemrenderer node
    expect(arr.nodes.sandbox.children[1].childNodes[2].textContent).toEqual('0');
    expect(arr.length).toEqual(n);
  });

  it('restores from container via restore method', () => {
    const arr = createArray();
    let HTML = '';

    for (let i = 0; i < n; i++) {
      HTML += '<div><span>Hi there</span></div>';
    }

    arr.nodes.sandbox.innerHTML = HTML;

    arr.restore();

    expect(arr.length).toEqual(n);
    expect(arr.nodes.sandbox.children.length).toEqual(n);
    expect(arr.nodes.sandbox.children[0].textContent).toEqual('Hi there');
  });

  it('restores from nodes with custom selector', () => {
    const arr = createArray();
    let HTML = '';

    for (let i = 0; i < n; i++) {
      HTML += `<div class="${i % 2 ? 'fit' : 'nope'}"><span>Hi there</span></div>`;
    }

    arr.nodes.sandbox.innerHTML = HTML;
    arr.restore(':sandbox .fit');
    expect(arr.length).toEqual(n / 2);
    expect(arr.nodes.sandbox.children.length).toEqual(n);
    expect(arr.nodes.sandbox.children[0].textContent).toEqual('Hi there');
  });

  it('restores from nodes with custom selector when renderer is placed in sandbox', () => {
    const arr = createArray();
    let HTML = '';

    arr.itemRenderer = ':sandbox .renderer';
    HTML += '<script class="renderer"><div></div></script>';
    for (let i = 0; i < n; i++) {
      HTML += `<div class="${i >= 5 ? 'fit' : 'nope'}"><span>Hi there</span></div>`;
    }

    arr.nodes.sandbox.innerHTML = HTML;
    arr.restore(':sandbox .fit');
    expect(arr.length).toEqual(5);
    expect(arr.nodes.sandbox.children.length).toEqual(n + 1); // script plus number of divs
    expect(arr.nodes.sandbox.children[1].textContent).toEqual('Hi there');
  });

  it('restores from external node', () => {
    const arr = createArray();
    const div = window.document.createElement('div');
    let HTML = '';

    div.className = 'restore-items';

    for (let i = 0; i < n; i++) {
      HTML += '<div><span>Hi there</span></div>';
    }

    div.innerHTML = HTML;
    window.document.body.appendChild(div);
    arr.restore('.restore-items > div');
    window.document.body.removeChild(div);
    expect(arr.length).toEqual(n);
    expect(arr[0].nodes.sandbox.textContent).toEqual('Hi there');
  });

  it('allows to sort', () => {
    const arr = createArray();

    arr.itemRenderer = '<span><span></span></span>';

    for (let i = 0; i < n; i++) {
      arr.push({
        x: i
      });
    }

    arr.reverse();
    expect(arr.length).toEqual(n);

    expect(+arr[0].nodes.sandbox.textContent).toEqual(n - 1);

    expect(+arr[n - 1].nodes.sandbox.textContent).toEqual(0);

    expect(+arr.nodes.sandbox.children[0].textContent).toEqual(n - 1);

    expect(+arr.nodes.sandbox.children[n - 1].textContent).toEqual(0);

    arr.sort((a, b) => (a.x > b.x ? 1 : -1));

    expect(+arr[0].nodes.sandbox.textContent).toEqual(0);

    expect(+arr[n - 1].nodes.sandbox.textContent).toEqual(n - 1);

    expect(+arr.nodes.sandbox.children[0].textContent).toEqual(0);

    expect(+arr.nodes.sandbox.children[n - 1].textContent).toEqual(n - 1);
  });

  it('orders by key', () => {
    // detailed test for orderby is
    const arr = createArray();

    arr.itemRenderer = '<span><span></span></span>';

    for (let i = 0; i < n; i++) {
      arr.push({ x: i });
    }

    arr.orderBy('x', 'desc');
    expect(arr.length).toEqual(n);
    expect(arr[0].nodes.sandbox.textContent).toEqual(String(n - 1));
    expect(arr[n - 1].nodes.sandbox.textContent).toEqual(String(0));
    expect(arr.nodes.sandbox.children[0].textContent).toEqual(String(n - 1));
    expect(arr.nodes.sandbox.children[n - 1].textContent).toEqual(String(0));

    arr.orderBy('x', 'asc');

    expect(arr[0].nodes.sandbox.textContent).toEqual(String(0));
    expect(arr[n - 1].nodes.sandbox.textContent).toEqual(String(n - 1));
    expect(arr.nodes.sandbox.children[0].textContent).toEqual(String(0));
    expect(arr.nodes.sandbox.children[n - 1].textContent).toEqual(String(n - 1));
  });

  it('allows to unshift', () => {
    const arr = createArray();

    arr.itemRenderer = createSpy(() => '<div><span></span></div>');

    for (let i = 0; i < n; i++) {
      arr.unshift({
        x: i
      });
    }

    expect(arr.length).toEqual(n);
    expect(arr.itemRenderer).toHaveBeenCalledTimes(n);
    expect(arr.nodes.sandbox.children.length).toEqual(n);

    let index = 0;
    for (const node of Array.from(arr.nodes.sandbox.children)) {
      expect(+node.querySelector('span').innerHTML).toEqual(n - index - 1);
      index += 1;
    }
  });

  it('allows to unshift', () => {
    const arr = createArray();

    arr.itemRenderer = createSpy(() => '<div><span></span></div>');

    for (let i = 0; i < n; i++) {
      arr.unshift({
        x: i
      });
    }

    expect(arr.length).toEqual(n);
    expect(arr.itemRenderer).toHaveBeenCalledTimes(n);
    expect(arr.nodes.sandbox.children.length).toEqual(n);

    let index = 0;
    for (const node of Array.from(arr.nodes.sandbox.children)) {
      expect(+node.querySelector('span').innerHTML).toEqual(n - index - 1);
      index += 1;
    }
  });

  it('allows to call pull pop and shift', () => {
    const arr = createArray();

    arr.itemRenderer = '<span><span></span></span>';

    for (let i = 0; i < n; i++) {
      arr.push({
        x: i
      });
    }

    arr.pull(1);
    expect(arr.length).toEqual(n - 1);
    expect(+arr[1].nodes.sandbox.textContent).toEqual(2);

    arr.pop();
    expect(arr.length).toEqual(n - 2);
    expect(+arr[n - 3].nodes.sandbox.textContent).toEqual(n - 2);

    arr.shift();
    expect(arr.length).toEqual(n - 3);
    expect(+arr[0].nodes.sandbox.textContent).toEqual(2);
  });

  it('allows to use custom trackBy value', () => {
    const arr = createArray();

    arr.trackBy = '_id';
    arr.itemRenderer = '<div><span></span></div>';
    arr.recreate([
      { _id: 0, x: 'a' },
      { _id: 1, x: 'b' }
    ]);

    const [item0, item1] = arr;
    const [node0, node1] = arr.nodes.sandbox.children;

    arr.recreate([
      { _id: 2, x: 'c' },
      { _id: 1, x: 'B' },
      { _id: 0, x: 'A' }
    ]);

    expect(arr[1]).toBe(item1);
    expect(arr[2]).toBe(item0);
    expect(item1.x).toEqual('B');
    expect(arr.nodes.sandbox.children.length).toEqual(3);
    expect(arr.nodes.sandbox.children[1]).toBe(node1);
    expect(arr.nodes.sandbox.children[2]).toBe(node0);
    expect(arr.nodes.sandbox.children[1].textContent).toEqual('B');
  });

  it('allows to use $index as trackBy value', () => {
    const arr = createArray();

    arr.trackBy = '$index';
    arr.itemRenderer = '<div><span></span></div>';
    arr.recreate([{ x: 'a' }, { x: 'b' }]);

    const [item0, item1] = arr;
    const [node0, node1] = arr.nodes.sandbox.children;

    arr.recreate([{ x: 'A' }, { x: 'B' }, { x: 'C' }]);

    expect(arr[0]).toBe(item0);
    expect(arr[1]).toBe(item1);
    expect(arr.nodes.sandbox.children.length).toEqual(3);
    expect(arr.nodes.sandbox.children[0]).toBe(node0);
    expect(arr.nodes.sandbox.children[1]).toBe(node1);
    expect(arr.nodes.sandbox.textContent).toEqual('ABC');
  });

  it('renders on splice', () => {
    const arr = createArray();

    arr.itemRenderer = '<span><span></span></span>';

    for (let i = 0; i < n; i++) {
      arr.push({ x: i });
    }

    arr.splice(
      1,
      2,
      {
        x: 'foo'
      },
      {
        x: 'bar'
      }
    );

    expect(arr.length).toEqual(n);
    expect(arr[1].nodes.sandbox.textContent).toEqual('foo');
    expect(arr[2].nodes.sandbox.textContent).toEqual('bar');
  });

  it('triggers "afterrender" event', () => {
    const arr = new MatreshkaArray();
    let handler;
    let item;

    arr.itemRenderer = createSpy(() => '<div><span></span></div>');
    arr.bindNode('container', '<div></div>');

    handler = createSpy();
    item = new MatreshkaObject();
    item.on('afterrender', handler);
    arr.push(item);
    expect(handler).toHaveBeenCalledTimes(1);

    handler = createSpy();
    item = new MatreshkaObject();
    item.on('afterrender', handler);
    arr.unshift(item);
    expect(handler).toHaveBeenCalledTimes(1);

    handler = createSpy();
    item = new MatreshkaObject();
    item.on('afterrender', handler);
    arr.splice(0, 0, item);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('trims itemRenderer', () => {
    const arr = createArray();

    arr.itemRenderer = createSpy(() => '         <div><span></span></div>            ');

    for (let i = 0; i < n; i++) {
      arr.push({
        x: i
      });
    }

    expect(arr.length).toEqual(n);
    expect(arr.itemRenderer).toHaveBeenCalledTimes(n);
    expect(arr.nodes.sandbox.children.length).toEqual(n);
  });

  it('makes possible to move sandbox via moveSandbox=true event option', () => {
    const arr = createArray();
    const arr2 = createArray();
    arr.itemRenderer = arr2.itemRenderer = '<div><span></span></div>';

    arr.push({});

    const arrItemNode = arr.nodes.sandbox.children[0];

    // just in case
    expect(arrItemNode).toBeTruthy();

    arr2.push_(arr[0], {
      moveSandbox: true
    });

    expect(arr2.nodes.sandbox.children[0]).toEqual(arrItemNode);
  });
});
