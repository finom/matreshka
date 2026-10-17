import Matreshka from 'src/matreshka';
import bindNode from 'src/bindnode';
import parseBindings from 'src/parsebindings';
import parserBrackets from 'src/parserbrackets';
import defaultBinders from 'src/defaultbinders';
import selectAll from 'src/selectall';
import mediate from 'src/mediate';
import on from 'src/on';
import { existence, text } from 'src/binders';

const sync = { debounceSetValue: false, debounceGetValue: false };
const el = (h) => {
  const w = document.createElement('div');
  w.innerHTML = h;
  return w.firstElementChild;
};
const type = (node, value) => {
  node.value = value;
  node.dispatchEvent(new Event('input'));
};
const tick = () => new Promise((resolve) => setTimeout(resolve, 5));

describe('bindings sweep 4', () => {
  it('BR-1: parser brackets with "<" and ">" (<% %>) bind text', () => {
    const { left, right } = parserBrackets;
    parserBrackets.left = '<%';
    parserBrackets.right = '%>';
    try {
      const obj = { name: 'Joe' };
      const div = document.createElement('div');
      div.appendChild(document.createTextNode('Hello, <%name%>'));
      parseBindings(obj, div, sync);
      expect(div.textContent).toBe('Hello, Joe');
    } finally {
      parserBrackets.left = left;
      parserBrackets.right = right;
    }
  });

  it('BR-1: parser brackets with "&" (&[ ]&) bind an attribute and text', () => {
    const { left, right } = parserBrackets;
    parserBrackets.left = '&[';
    parserBrackets.right = ']&';
    try {
      const obj = { name: 'Joe' };
      const div = el('<div title="&amp;[name]&amp;">&amp;[name]&amp; <i data-x="<&amp;[name]&amp;>"></i></div>');
      parseBindings(obj, div, sync);
      expect(div.title).toBe('Joe');
      expect(div.firstChild.textContent).toBe('Joe');
      expect(div.lastChild.dataset.x).toBe('<Joe>');
    } finally {
      parserBrackets.left = left;
      parserBrackets.right = right;
    }
  });

  it('BR-2: existence() bound to an input does not take the typed text as the flag', () => {
    const obj = { show: true };
    const wrapper = el('<div><input></div>');
    const field = wrapper.firstChild;
    bindNode(obj, 'show', field, existence(), sync);
    type(field, '');
    expect(obj.show).toBe(true);
  });

  it('BR-3: a field shows the value its mediator turned the typed text into (clamping)', () => {
    const obj = {};
    const field = el('<input>');
    mediate(obj, 'x', (value) => Math.min(100, Number(value)));
    bindNode(obj, 'x', field, null, sync);
    type(field, '150');
    expect(obj.x).toBe(100);
    expect(field.value).toBe('100');
  });

  it('BR-3: a focused number field a mediator rewrites gets the value without a caret', () => {
    const obj = {};
    const field = el('<input type="number">');
    document.body.appendChild(field);
    field.focus();
    mediate(obj, 'x', (value) => Math.min(100, Number(value)));
    bindNode(obj, 'x', field, null, sync);
    type(field, '150');
    expect(field.value).toBe('100');
    field.remove();
  });

  it('BR-5: an HTML string that parses to nothing gives no nodes', () => {
    expect(parseBindings({}, '</b{{a}}>', sync)).toEqual([]);
  });

  it('BR-4: parseBindings binds value="{{x}}" of a submit button', () => {
    const obj = { label: 'Send' };
    const form = el('<form><input type="submit" value="{{label}}"></form>');
    parseBindings(obj, form, sync);
    expect(form.firstChild.value).toBe('Send');
  });

  it('BR-5: parseBindings binds a top-level text node of an HTML string', () => {
    const obj = { a: 'A', b: 'B' };
    const nodes = parseBindings(obj, '{{a}} <b>{{b}}</b>', sync);
    expect(nodes.map((node) => node.textContent).join('')).toBe('A B');
  });

  it('BR-6: a refused second sandbox node does not appear in $nodes', () => {
    const m = new Matreshka();
    const first = el('<div></div>');
    const second = el('<div></div>');
    m.bindNode('sandbox', first);
    expect(() => m.bindNode('sandbox', second)).toThrow();
    expect(m.$nodes.sandbox).toEqual([first]);
  });

  it('BR-7: a binder given to bindNode does not change the binder a defaultBinders function returns', () => {
    const shared = {
      on: 'input',
      getValue() {
        return this.value;
      },
      setValue(value) {
        this.value = value;
      }
    };
    defaultBinders.unshift((node) => (node.classList?.contains('foo') ? shared : undefined));
    try {
      bindNode({}, 'a', el('<input class="foo">'), { on: 'blur' });
      expect(shared.on).toBe('input');
    } finally {
      defaultBinders.shift();
    }
  });

  it('BR-8: selectAll with a selector list stays inside the sandbox', () => {
    document.body.innerHTML = '<div class="app"><i class="y"></i></div><i class="y"></i><b class="z"></b>';
    try {
      const obj = {};
      bindNode(obj, 'sandbox', '.app');
      bindNode(obj, 'k', '.z', null, sync);
      expect(selectAll(obj, '.y, :bound(k)').length).toBe(2);
    } finally {
      document.body.innerHTML = '';
    }
  });

  it('BR-9: a keyup that does not change a checkbox keeps a pending write from code', async () => {
    const obj = {};
    const checkbox = el('<input type="checkbox">');
    document.body.appendChild(checkbox);
    try {
      bindNode(obj, 'x', checkbox);
      await tick();
      obj.x = true;
      checkbox.dispatchEvent(new KeyboardEvent('keyup', { key: 'Tab', bubbles: true }));
      await tick();
      expect(obj.x).toBe(true);
      expect(checkbox.checked).toBe(true);
    } finally {
      checkbox.remove();
    }
  });

  it('BR-10: a node bound in an unbind handler stays bound and can be unbound later', () => {
    const m = new Matreshka();
    const a = el('<span></span>');
    const b = el('<span></span>');
    m.bindNode('x', a, text(), sync);
    m.once('unbind:x', () => m.bindNode('x', b, text(), sync));
    m.unbindNode('x');
    expect(m.$nodes.x).toEqual([b]);
    m.unbindNode('x');
    m.x = 'after';
    expect(b.textContent).toBe('');
  });

  it('BR-11: a silent deep binding does not fire unbind on the old branch when the branch changes', () => {
    const obj = { a: { b: 1 } };
    const handler = vi.fn();
    on(obj.a, 'unbind', handler);
    bindNode(obj, 'a.b', el('<span></span>'), text(), { ...sync, silent: true });
    obj.a = { b: 2 };
    expect(handler).not.toHaveBeenCalled();
  });
});
