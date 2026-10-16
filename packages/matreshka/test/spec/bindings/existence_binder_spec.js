import bindNode from 'src/bindnode';
import select from 'src/select';
import MatreshkaArray from 'src/array';
import { existence } from 'src/binders';

describe('Existence binder', () => {
  const noDebounceFlag = {
    debounceSetValue: false,
    debounceGetValue: false
  };

  let obj;
  let node;
  let parent;

  beforeEach(() => {
    obj = {};
    node = window.document.createElement('div');
    node.innerHTML = '<div><i class="foo" id="foo"></i></div>';
    parent = window.document.createElement('div');
    parent.appendChild(node);
  });

  it('should allow to use exitence binder', () => {
    node.id = 'foo';
    node.className = 'bar baz';

    obj.x = false;
    bindNode(obj, 'x', node, existence(), noDebounceFlag);

    expect(parent.childNodes.length).toEqual(1);
    expect(parent.childNodes[0].nodeName).toEqual('#comment');
    expect(parent.childNodes[0].nodeValue).toEqual('DIV#foo.bar.baz');

    obj.x = true;

    expect(parent.childNodes.length).toEqual(1);
    expect(parent.childNodes[0].tagName).toEqual('DIV');

    obj.x = false; // try again

    expect(parent.childNodes.length).toEqual(1);
    expect(parent.childNodes[0].nodeName).toEqual('#comment');
    expect(parent.childNodes[0].nodeValue).toEqual('DIV#foo.bar.baz');

    obj.x = true; // try again

    expect(parent.childNodes.length).toEqual(1);
    expect(parent.childNodes[0].tagName).toEqual('DIV');
  });

  it('should allow to use exitence binder with reverse behavior', () => {
    node.id = 'foo';
    node.className = 'bar baz';

    obj.x = false;
    bindNode(obj, 'x', node, existence(false), noDebounceFlag);

    expect(parent.childNodes.length).toEqual(1);
    expect(parent.childNodes[0].nodeName).toEqual('DIV');

    obj.x = true;

    expect(parent.childNodes.length).toEqual(1);
    expect(parent.childNodes[0].nodeName).toEqual('#comment');
    expect(parent.childNodes[0].nodeValue).toEqual('DIV#foo.bar.baz');

    obj.x = false; // try again

    expect(parent.childNodes.length).toEqual(1);
    expect(parent.childNodes[0].nodeName).toEqual('DIV');

    obj.x = true; // try again

    expect(parent.childNodes.length).toEqual(1);
    expect(parent.childNodes[0].nodeName).toEqual('#comment');
    expect(parent.childNodes[0].nodeValue).toEqual('DIV#foo.bar.baz');
  });

  it('should allow to select nodes inside original element', () => {
    obj.x = false;
    bindNode(obj, 'x', node, existence(), noDebounceFlag);

    expect(select(obj, ':bound(x)')).toEqual(node);
    expect(select(obj, ':bound(x) .foo').id).toEqual('foo');

    obj.x = true;
    expect(select(obj, ':bound(x)')).toEqual(node);
    expect(select(obj, ':bound(x) .foo').id).toEqual('foo');

    obj.x = false;
    expect(select(obj, ':bound(x)')).toEqual(node);
    expect(select(obj, ':bound(x) .foo').id).toEqual('foo');
  });

  it('should be possible to bind array item and manipulate with an array', () => {
    const arr = new MatreshkaArray();
    arr.itemRenderer = '<div class="child"></div>';

    bindNode(arr, 'sandbox', '<div class="parent"></div>');

    arr.push(
      { x: 3, exists: true },
      { x: 1, exists: false },
      { x: 5, exists: true },
      { x: 2, exists: false },
      { x: 4, exists: true }
    );

    for (const item of arr) {
      bindNode(item, 'exists', ':sandbox', existence(), noDebounceFlag);
    }

    expect(Array.from(arr.nodes.sandbox.childNodes).map(({ nodeName }) => nodeName)).toEqual([
      'DIV',
      '#comment',
      'DIV',
      '#comment',
      'DIV'
    ]);

    arr.sort((a, b) => (a.x > b.x ? 1 : -1));
    arr.sort((a, b) => (a.x > b.x ? 1 : -1));

    expect(Array.from(arr.nodes.sandbox.childNodes).map(({ nodeName }) => nodeName)).toEqual([
      '#comment',
      '#comment',
      'DIV',
      'DIV',
      'DIV'
    ]);

    arr.reverse();

    expect(Array.from(arr.nodes.sandbox.childNodes).map(({ nodeName }) => nodeName)).toEqual([
      'DIV',
      'DIV',
      'DIV',
      '#comment',
      '#comment'
    ]);

    arr[0].exists = false;

    arr[4].exists = true;

    expect(Array.from(arr.nodes.sandbox.childNodes).map(({ nodeName }) => nodeName)).toEqual([
      '#comment',
      'DIV',
      'DIV',
      '#comment',
      'DIV'
    ]);
  });

  it('allows to move sandbox across arrays', () => {
    class Arr extends MatreshkaArray {
      constructor(...args) {
        super(...args).bindNode('sandbox', '<div data-foo="bar"></div>');
      }
    }

    const arr = new Arr();
    const arr2 = new Arr();
    const obj = { exists: true };
    arr.itemRenderer = arr2.itemRenderer = '<div><span></span></div>';

    arr.push(obj);
    const arrItemNode = arr.nodes.sandbox.childNodes[0];
    expect(arrItemNode.nodeName).toEqual('DIV');

    bindNode(obj, 'exists', ':sandbox', existence(), noDebounceFlag);
    obj.exists = false;

    const replacedBy = arr.nodes.sandbox.childNodes[0];

    expect(replacedBy.nodeName).toEqual('#comment');

    arr2.push_(obj, {
      moveSandbox: true
    });

    expect(arr2.nodes.sandbox.childNodes[0]).toEqual(replacedBy);

    obj.exists = true;

    expect(arr2.nodes.sandbox.childNodes[0]).toEqual(arrItemNode);
  });
});
