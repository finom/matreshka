import MatreshkaArray from 'src/array';
import bindNode from 'src/bindnode';

const names = (container) => [...container.children].map((node) => node.textContent).join(',');

describe('Matreshka.Array recreate order', () => {
  it('recreate with the same items in a new order moves their nodes', () => {
    const a = { name: 'a' };
    const b = { name: 'b' };
    const c = { name: 'c' };
    const container = document.createElement('ul');
    const arr = new MatreshkaArray();
    arr.itemRenderer = '<li>{{name}}</li>';
    bindNode(arr, 'container', container);

    arr.recreate([a, b, c]);
    expect(names(container)).toBe('a,b,c');

    arr.recreate([c, a, b]);
    expect(arr.map((item) => item.name).join(',')).toBe('c,a,b');
    expect(names(container)).toBe('c,a,b');
  });

  it('recreate with a subset in a new order moves their nodes', () => {
    const items = ['a', 'b', 'c', 'd'].map((name) => ({ name }));
    const container = document.createElement('ul');
    const arr = new MatreshkaArray();
    arr.itemRenderer = '<li>{{name}}</li>';
    bindNode(arr, 'container', container);

    arr.recreate(items);
    arr.recreate([items[3], items[1]]);
    expect(names(container)).toBe('d,b');
  });
  it('recreate with the same items in the same order leaves the nodes in place', () => {
    const items = ['a', 'b'].map((name) => ({ name }));
    const container = document.createElement('ul');
    const arr = new MatreshkaArray();
    arr.itemRenderer = '<li>{{name}}</li>';
    bindNode(arr, 'container', container);
    arr.recreate(items);

    const observer = new MutationObserver(() => {});
    observer.observe(container, { childList: true });
    arr.recreate([...items]);
    expect(observer.takeRecords()).toEqual([]);
    observer.disconnect();
  });
});
