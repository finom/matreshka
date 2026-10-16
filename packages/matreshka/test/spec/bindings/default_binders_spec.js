import { textarea, input, select, output, progress } from 'src/binders';

import lookForBinder from 'src/lookforbinder';
import bindNode from 'src/bindnode';

expect.extend({
  bindersEqual(actual, expected) {
    const pass =
      this.equals(actual.on, expected.on) &&
      `${actual.getValue}` === `${expected.getValue}` &&
      `${actual.setValue}` === `${expected.setValue}`;
    return { pass, message: () => (pass ? 'Binders are equal' : 'Binders are not equal') };
  }
});

describe('Default binders', () => {
  const noDebounceFlag = {
    debounceSetValue: false,
    debounceGetValue: false
  };
  let obj;

  beforeEach(() => {
    obj = {};
  });

  it('should bind textarea', () => {
    const node = window.document.createElement('textarea');
    node.value = 'foo';
    bindNode(obj, 'x', node, textarea(), noDebounceFlag);
    expect(obj.x).toEqual('foo');
    obj.x = 'bar';
    expect(node.value).toEqual('bar');

    expect(lookForBinder(node)).bindersEqual(textarea());
  });

  it('should bind progress', () => {
    const node = window.document.createElement('progress');
    node.max = 3;
    node.value = 1;
    bindNode(obj, 'x', node, progress(), noDebounceFlag);
    expect(obj.x).toEqual(1);
    obj.x = 2;
    expect(node.value).toEqual(2);

    expect(lookForBinder(node)).bindersEqual(progress());
  });

  it('should bind text input', () => {
    const node = window.document.createElement('input');
    node.type = 'text';
    node.value = 'foo';
    bindNode(obj, 'x', node, input('text'), noDebounceFlag);
    expect(obj.x).toEqual('foo');
    obj.x = 'bar';
    expect(node.value).toEqual('bar');

    expect(lookForBinder(node)).bindersEqual(input('text'));
  });

  it('should bind output', () => {
    const node = window.document.createElement('output');
    node.innerHTML = 'foo';
    bindNode(obj, 'x', node, output(), noDebounceFlag);
    expect(obj.x).toEqual('foo');
    obj.x = 'bar';
    expect(node.innerHTML).toEqual('bar');
    expect(lookForBinder(node)).bindersEqual(output());
  });

  it('should bind select', () => {
    const node = window.document.createElement('select');
    for (let i = 0; i < 10; i++) {
      const option = node.appendChild(window.document.createElement('option'));
      option.value = `${i}`;
      if (i === 1) {
        option.selected = true;
      }
    }

    bindNode(obj, 'x', node, select(), noDebounceFlag);
    expect(obj.x).toEqual('1');
    obj.x = '5';
    expect(node.value).toEqual('5');

    expect(lookForBinder(node)).bindersEqual(select());
  });

  it('should bind select (multiple)', () => {
    const node = window.document.createElement('select');
    node.multiple = true;

    for (let i = 0; i < 10; i++) {
      const option = node.appendChild(window.document.createElement('option'));
      option.value = `${i}`;
      if (i === 1 || i === 4 || i === 7) {
        option.selected = true;
      }
    }

    bindNode(obj, 'x', node, select(true), noDebounceFlag);
    expect(obj.x).toEqual(['1', '4', '7']);
    obj.x = ['2', '5', '8'];

    for (let i = 0; i < 10; i++) {
      expect(node.options[i].selected).toEqual(i === 2 || i === 5 || i === 8);
    }

    expect(lookForBinder(node)).bindersEqual(select(true));
  });
});
