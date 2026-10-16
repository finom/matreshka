import { html, className, display, existence, input, output, select } from 'src/binders';
import bindNode from 'src/bindnode';

describe('Binders, less common arguments', () => {
  const noDebounceFlag = {
    debounceSetValue: false,
    debounceGetValue: false
  };

  let obj;

  beforeEach(() => {
    obj = {};
  });

  it('className with switcher=false reads a missing class as true', () => {
    const node = window.document.createElement('div');
    bindNode(obj, 'x', node, className('hidden', false), noDebounceFlag);

    expect(obj.x).toBe(true);
    obj.x = false;
    expect(node.classList.contains('hidden')).toBe(true);
  });

  it('display reads the computed display when no inline style is set', () => {
    const node = window.document.createElement('div');
    const style = window.document.createElement('style');
    style.textContent = '.gone { display: none }';
    window.document.head.appendChild(style);
    node.className = 'gone';
    window.document.body.appendChild(node);

    bindNode(obj, 'x', node, display(), noDebounceFlag);

    expect(obj.x).toBe(false);
    node.remove();
    style.remove();
  });

  it('display takes a switcher function', () => {
    const node = window.document.createElement('div');
    bindNode(
      obj,
      'x',
      node,
      display((value) => value === 'show'),
      noDebounceFlag
    );

    obj.x = 'show';
    expect(node.style.display).toEqual('');
    obj.x = 'hide';
    expect(node.style.display).toEqual('none');
  });

  it('existence takes a switcher function', () => {
    const parent = window.document.createElement('div');
    const node = window.document.createElement('span');
    parent.appendChild(node);
    bindNode(
      obj,
      'x',
      node,
      existence((value) => value > 0),
      noDebounceFlag
    );

    obj.x = 0;
    expect(parent.contains(node)).toBe(false);
    obj.x = 5;
    expect(parent.firstChild).toBe(node);
  });

  it('existence keeps a detached node detached and puts it back later', () => {
    const node = window.document.createElement('span');
    bindNode(obj, 'x', node, existence(), noDebounceFlag);

    obj.x = false;
    expect(node.parentNode).toBe(null);
    obj.x = true;
    expect(node.parentNode).toBe(null);
  });

  it('html puts an element given as a value inside the node', () => {
    const node = window.document.createElement('div');
    const child = window.document.createElement('b');
    node.innerHTML = '<i>old</i>';
    bindNode(obj, 'x', node, html(), noDebounceFlag);

    obj.x = child;

    expect(node.childNodes.length).toEqual(1);
    expect(node.firstChild).toBe(child);
  });

  it('input of type submit, button, image and reset binds nothing', () => {
    for (const type of ['submit', 'button', 'image', 'reset']) {
      expect(input(type)).toEqual({});
    }
  });

  it('input of type hidden has no event, of type file listens to change', () => {
    const hidden = window.document.createElement('input');
    hidden.type = 'hidden';
    hidden.value = 'h';
    bindNode(obj, 'h', hidden, null, noDebounceFlag);

    expect(obj.h).toEqual('h');
    obj.h = null;
    expect(hidden.value).toEqual('');
    expect(input('hidden').on).toBe(null);
    expect(input('file').on).toEqual('change');

    const text = window.document.createElement('input');
    text.type = 'hidden';
    bindNode(obj, 'f', text, input('file'), noDebounceFlag);
    text.value = 'changed';
    text.dispatchEvent(new window.Event('change'));
    expect(obj.f).toEqual('changed');
  });

  it('output bound to a node without a form property uses textContent', () => {
    const node = window.document.createElement('div');
    bindNode(obj, 'x', node, output(), noDebounceFlag);

    expect(obj.x).toEqual('');
    obj.x = 5;
    expect(node.textContent).toEqual('5');
    obj.x = undefined;
    expect(node.textContent).toEqual('');
  });

  describe('select', () => {
    function createSelect(multiple, values) {
      const node = window.document.createElement('select');
      node.multiple = multiple;
      node.innerHTML = values.map((value) => `<option value="${value}">${value || 'none'}</option>`).join('');
      return node;
    }

    it('multiple takes a single value and null', () => {
      const node = createSelect(true, ['a', 'b', '1']);
      bindNode(obj, 'x', node, null, noDebounceFlag);

      obj.x = 'b';
      expect(obj.x).toEqual('b');
      expect([...node.selectedOptions].map((o) => o.value)).toEqual(['b']);

      obj.x = 1;
      expect([...node.selectedOptions].map((o) => o.value)).toEqual(['1']);

      obj.x = null;
      expect(node.selectedOptions.length).toEqual(0);

      obj.x = ['a', 'b'];
      obj.x = undefined;
      expect(node.selectedOptions.length).toEqual(0);
    });

    it('single selects the option without value for an empty value, 0 is a value', () => {
      const node = createSelect(false, ['a', '', '0', 'b']);
      bindNode(obj, 'x', node, select(), noDebounceFlag);

      obj.x = 'b';
      expect(node.value).toEqual('b');

      obj.x = null;
      expect(node.selectedIndex).toEqual(1);

      obj.x = 0;
      expect(node.value).toEqual('0');
    });

    it('single without an empty option leaves nothing selected for an empty value', () => {
      const node = createSelect(false, ['a', 'b']);
      bindNode(obj, 'x', node, select(), noDebounceFlag);

      obj.x = '';

      expect(node.selectedIndex).toEqual(-1);
    });
  });
});
