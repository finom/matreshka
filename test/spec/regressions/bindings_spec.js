import bindNode from 'src/bindnode';
import bindOptionalNode from 'src/bindoptionalnode';
import unbindNode from 'src/unbindnode';
import parseBindings from 'src/parsebindings';
import select from 'src/select';
import selectAll from 'src/selectall';
import selectNodes from 'src/bindnode/_selectnodes';
import mediate from 'src/mediate';
import Matreshka from 'src/matreshka';
import parserBrackets from 'src/parserbrackets';
import { existence, text, html, attr, dataset, style } from 'src/binders';

const sync = { debounceSetValue: false, debounceGetValue: false };
const { document } = window;
const el = (markup) => {
  const d = document.createElement('div');
  d.innerHTML = markup;
  return d.firstElementChild;
};
const fire = (node, name) => node.dispatchEvent(new window.Event(name, { bubbles: true }));
const wait = (ms = 20) => new Promise((r) => setTimeout(r, ms));

describe('Bindings regressions', () => {
  // BN-1
  it('BN-1 binding a radio group keeps the pre-checked radio and takes its value', () => {
    const group = el(
      '<div><input type="radio" name="g1" value="a"><input type="radio" name="g1" value="b" checked></div>'
    );
    const obj = {};
    bindNode(obj, 'x', group.querySelectorAll('input'), null, sync);
    expect(obj.x).toBe('b');
    expect(group.children[1].checked).toBe(true);
  });

  it('BN-1 binding an unchecked radio does not take its value', () => {
    const radio = el('<input type="radio" name="g2" value="a">');
    const obj = {};
    bindNode(obj, 'x', radio, null, sync);
    expect(obj.x).toBe(undefined);
  });

  it('BN-1 keyup on an unchecked radio (Tab into the group) does not change the value', () => {
    const radio = el('<input type="radio" name="g3" value="a">');
    const obj = {};
    bindNode(obj, 'x', radio, null, { ...sync, getValueOnBind: false });
    fire(radio, 'keyup');
    expect(obj.x).toBe(undefined);
  });

  // BN-2
  it('BN-2 unbindNode(key, node) keeps the other bound node in nodes and $nodes', () => {
    const m = new Matreshka();
    const a = document.createElement('input');
    const b = document.createElement('input');
    m.bindNode('x', [a, b], null, sync);
    m.unbindNode('x', a);
    expect(m.nodes.x).toBe(b);
    expect([...m.$nodes.x]).toEqual([b]);
  });

  it('BN-2 unbindNode(key, [a, b]) leaves exactly the binding of c', () => {
    const obj = {};
    const destroy = vi.fn();
    const [a, b, c] = [1, 2, 3].map(() => document.createElement('input'));
    bindNode(obj, 'x', [a, b, c], { destroy }, sync);
    unbindNode(obj, 'x', [a, b]);
    expect(destroy).toHaveBeenCalledTimes(2);
    unbindNode(obj, 'x');
    // only c's binding is left, so one more destroy call
    expect(destroy).toHaveBeenCalledTimes(3);
  });

  // BN-3
  it('BN-3 unbindNode("a.b") stops the binding from coming back when a is replaced', () => {
    const obj = { a: { b: 1 } };
    const node = document.createElement('input');
    bindNode(obj, 'a.b', node, null, sync);
    unbindNode(obj, 'a.b', node);
    obj.a = { b: 2 };
    expect(node.value).toBe('1');
  });

  it('BN-3 unbindNode(null) also removes deep bindings for good', () => {
    const obj = { a: { b: 1 } };
    const node = document.createElement('input');
    bindNode(obj, 'a.b', node, null, sync);
    unbindNode(obj, null);
    obj.a = { b: 2 };
    expect(node.value).toBe('1');
  });

  // BN-4
  it('BN-4 unbindNode("a.b.c") does not break the binding of "a.b.d"', () => {
    const obj = { a: { b: { c: 1, d: 1 } } };
    const nc = document.createElement('input');
    const nd = document.createElement('input');
    bindNode(obj, 'a.b.c', nc, null, sync);
    bindNode(obj, 'a.b.d', nd, null, sync);
    unbindNode(obj, 'a.b.c', nc);
    obj.a = { b: { c: 2, d: 2 } };
    expect(nd.value).toBe('2');
  });

  it('BN-4 after unbindNode("a.b.c"), "a.b.d" follows a reassigned middle branch', () => {
    const obj = { a: { b: { c: 1, d: 1 } } };
    const nc = document.createElement('input');
    const nd = document.createElement('input');
    bindNode(obj, 'a.b.c', nc, null, sync);
    bindNode(obj, 'a.b.d', nd, null, sync);
    unbindNode(obj, 'a.b.c', nc);
    obj.a = { b: { c: 2, d: 2 } };
    obj.a.b = { c: 3, d: 3 };
    expect(nd.value).toBe('3');
    expect(nc.value).toBe('1');
  });

  it('BN-3 unbindNode("a.b", node) keeps the deep binding of the other node', () => {
    const obj = { a: { b: 1 } };
    const n1 = document.createElement('input');
    const n2 = document.createElement('input');
    bindNode(obj, 'a.b', [n1, n2], null, sync);
    unbindNode(obj, 'a.b', n1);
    obj.a = { b: 2 };
    expect(n1.value).toBe('1');
    expect(n2.value).toBe('2');
  });

  // BN-5
  it('BN-5 unbindNode of an exactKey batch (docs example) removes the binding', () => {
    const obj = { 'c.d.e': 1 };
    const node = document.createElement('input');
    const batch = [{ key: 'c.d.e', node, event: { exactKey: true } }];
    bindNode(obj, batch, sync);
    expect(() => unbindNode(obj, batch)).not.toThrow();
  });

  // BN-6
  it('BN-6 unbindNode("a.b") does not throw after a became null', () => {
    const obj = { a: { b: 1 } };
    const node = document.createElement('input');
    bindNode(obj, 'a.b', node, null, sync);
    obj.a = null;
    expect(() => unbindNode(obj, 'a.b', node)).not.toThrow();
  });

  // BN-7
  it('BN-7 a debounced setValue pending at unbindNode does not touch the node', async () => {
    const obj = { x: 1 };
    const node = document.createElement('input');
    bindNode(obj, 'x', node);
    obj.x = 2;
    unbindNode(obj, 'x', node);
    await wait();
    expect(node.value).toBe('1');
  });

  it('BN-7 a debounced getValue pending at unbindNode does not change the property', async () => {
    const obj = { x: 'a' };
    const node = document.createElement('input');
    bindNode(obj, 'x', node);
    node.value = 'b';
    fire(node, 'input');
    unbindNode(obj, 'x', node);
    await wait();
    expect(obj.x).toBe('a');
  });

  it('BN-7 a binder with an "on" function stops updating the property after unbindNode (default debounce)', async () => {
    const obj = { x: 'a' };
    const node = document.createElement('div');
    let handler;
    bindNode(obj, 'x', node, {
      on(cb) {
        handler = cb;
      },
      getValue: () => 'b'
    });
    unbindNode(obj, 'x', node);
    handler();
    await wait();
    expect(obj.x).toBe('a');
  });

  // BN-8
  it('BN-8 Matreshka.parserBrackets is the parser brackets object (docs name)', () => {
    expect(Matreshka.parserBrackets).toBe(parserBrackets);
  });

  // BN-9
  it('BN-9 select binder selects option "0" for value 0 when an empty option exists', () => {
    const s = el('<select><option value="">-</option><option value="0">zero</option></select>');
    const obj = { x: 0 };
    bindNode(obj, 'x', s, null, sync);
    expect(s.value).toBe('0');
  });

  // BN-10
  it('BN-10 existence binder bound to two nodes hides and restores both', () => {
    const parent = el('<div><span></span><span></span></div>');
    const [s1, s2] = parent.children;
    const obj = { x: true };
    bindNode(obj, 'x', [s1, s2], existence(), sync);
    obj.x = false;
    obj.x = true;
    expect(s1.parentNode).toBe(parent);
    expect(s2.parentNode).toBe(parent);
  });

  // BN-11
  it('BN-11 attribute template inserts a value containing "$&" literally', () => {
    const obj = { price: '$&', y: 'z' };
    const node = el('<a title="{{price}} {{y}}"></a>');
    parseBindings(obj, node, sync);
    expect(node.getAttribute('title')).toBe('$& z');
  });

  // BN-12
  it('BN-12 node change mediated from "5" to 5 does not call setValue on the same node', () => {
    const setValue = vi.fn();
    const node = document.createElement('div');
    const obj = {};
    let handler;
    mediate(obj, 'x', Number);
    bindNode(
      obj,
      'x',
      node,
      {
        on(cb) {
          handler = cb;
        },
        getValue: () => '5',
        setValue
      },
      sync
    );
    setValue.mockClear();
    handler();
    expect(obj.x).toBe(5);
    expect(setValue).not.toHaveBeenCalled();
  });

  it('3.0: clearing a field mediated to a number keeps it empty and updates the other nodes', () => {
    const input = el('<input type="number" value="5">');
    const output = el('<output></output>');
    const obj = {};
    mediate(obj, 'x', Number);
    bindNode(obj, 'x', input, undefined, sync);
    bindNode(obj, 'x', output, undefined, sync);
    input.value = '';
    fire(input, 'input');
    expect(obj.x).toBe(0);
    expect(input.value).toBe('');
    expect(output.value).toBe('0');
  });

  it('3.0: a mediator rewrites the field being typed in and keeps its caret', () => {
    const input = el('<input>');
    document.body.appendChild(input);
    input.focus();
    const obj = {};
    mediate(obj, 'x', (value = '') => value.toUpperCase());
    bindNode(obj, 'x', input, undefined, sync);
    input.value = 'abc';
    input.setSelectionRange(1, 2);
    fire(input, 'input');
    expect(obj.x).toBe('ABC');
    expect(input.value).toBe('ABC');
    expect([input.selectionStart, input.selectionEnd]).toEqual([1, 2]);
    input.remove();
    obj.x = 'def';
    expect(input.value).toBe('DEF');
  });

  it('3.0: a mediator rewrites the textarea being typed in and keeps its caret', () => {
    const textarea = el('<textarea></textarea>');
    document.body.appendChild(textarea);
    textarea.focus();
    const obj = {};
    mediate(obj, 'x', (value = '') => value.toUpperCase());
    bindNode(obj, 'x', textarea, undefined, sync);
    textarea.value = 'abc';
    textarea.setSelectionRange(1, 1);
    fire(textarea, 'input');
    expect(textarea.value).toBe('ABC');
    expect([textarea.selectionStart, textarea.selectionEnd]).toEqual([1, 1]);
    textarea.remove();
  });

  it('3.0: a program write into a focused field puts the caret at the end, as before', () => {
    // TodoMVC's edit: the field is focused, then the debounced title lands in it
    const input = el('<input>');
    document.body.appendChild(input);
    input.focus();
    const obj = {};
    bindNode(obj, 'x', input, undefined, sync);
    input.setSelectionRange(0, 0);
    obj.x = 'second';
    expect([input.selectionStart, input.selectionEnd]).toEqual([6, 6]);
    input.remove();
  });

  // BN-13
  it('BN-13 custom parser brackets with regexp characters ("$[" "]") work', () => {
    const obj = { x: 'foo' };
    parserBrackets.left = '$[';
    parserBrackets.right = ']';
    try {
      const node = el('<span>$[x]</span>');
      parseBindings(obj, node, sync);
      expect(node.textContent).toBe('foo');
    } finally {
      parserBrackets.left = '{{';
      parserBrackets.right = '}}';
    }
  });

  // BN-14
  it('BN-14 select multiple accepts null', () => {
    const s = el('<select multiple><option value="a">a</option></select>');
    const obj = { x: ['a'] };
    bindNode(obj, 'x', s, null, sync);
    expect(() => {
      obj.x = null;
    }).not.toThrow();
    expect(s.options[0].selected).toBe(false);
  });

  it('BN-14 select multiple selects numeric values like the single select does', () => {
    const s = el('<select multiple><option value="1">a</option><option value="2">b</option></select>');
    const obj = { x: [1] };
    bindNode(obj, 'x', s, null, sync);
    expect(s.options[0].selected).toBe(true);
  });

  // BN-15
  it('BN-15 :sandbox selector with a comma inside :is() works', () => {
    const m = new Matreshka();
    const n = el('<div><b class="a"></b><b class="b"></b></div>');
    m.bindNode('sandbox', n);
    expect(m.$(':sandbox :is(.a, .b)').length).toBe(2);
  });

  // BN-16
  it('BN-16 input binder shows undefined as an empty field', () => {
    const i = document.createElement('input');
    const obj = { x: 'a' };
    bindNode(obj, 'x', i, null, sync);
    obj.x = undefined;
    expect(i.value).toBe('');
  });

  it('BN-16 output binder shows undefined as empty', () => {
    const o = document.createElement('output');
    const obj = { x: 'a' };
    bindNode(obj, 'x', o, null, sync);
    obj.x = undefined;
    expect(o.value).toBe('');
  });

  it('BN-16 text binder shows undefined as empty', () => {
    const d = document.createElement('div');
    const obj = { x: 'a' };
    bindNode(obj, 'x', d, text(), sync);
    obj.x = undefined;
    expect(d.textContent).toBe('');
  });

  it('BN-16 html, attr and dataset binders show undefined and null as empty', () => {
    const d = document.createElement('div');
    const obj = { h: 'a', a: 'a', d: 'a' };
    bindNode(obj, 'h', d, html(), sync);
    bindNode(obj, 'a', d, attr('title'), sync);
    bindNode(obj, 'd', d, dataset('foo'), sync);
    obj.h = undefined;
    obj.a = null;
    obj.d = undefined;
    expect(d.innerHTML).toBe('');
    expect(d.getAttribute('title')).toBe('');
    expect(d.dataset.foo).toBe('');
  });

  it('BN-16 parsed attribute shows undefined as empty, like a parsed text node', () => {
    const obj = {};
    const node = el('<a class="{{cls}}">{{cls}}</a>');
    parseBindings(obj, node, sync);
    expect(node.textContent).toBe('');
    expect(node.getAttribute('class')).toBe('');
  });

  // BN-17
  it('BN-17 style binder reads a camel-cased computed style on bind', () => {
    const d = document.createElement('div');
    const st = document.createElement('style');
    st.textContent = '.bn17 { background-color: red; }';
    document.head.appendChild(st);
    document.body.appendChild(d);
    d.className = 'bn17';
    const obj = {};
    try {
      bindNode(obj, 'bg', d, style('backgroundColor'), sync);
      expect(obj.bg).toBe('rgb(255, 0, 0)');
    } finally {
      d.remove();
      st.remove();
    }
  });

  it('BN-17 style binder sets and reads a custom property', () => {
    const d = document.createElement('div');
    const obj = {};
    bindNode(obj, 'v', d, style('--size'), sync);
    obj.v = '10px';
    expect(d.style.getPropertyValue('--size')).toBe('10px');
    const other = {};
    bindNode(other, 'v', d, style('--size'), sync);
    expect(other.v).toBe('10px');
    obj.v = null;
    expect(d.style.getPropertyValue('--size')).toBe('');
  });

  it('BN-17 style binder sets and reads a dashed property name', () => {
    const d = document.createElement('div');
    const obj = {};
    bindNode(obj, 'v', d, style('background-color'), sync);
    obj.v = 'red';
    expect(d.style.backgroundColor).toBe('red');
    const other = {};
    bindNode(other, 'v', d, style('background-color'), sync);
    expect(other.v).toBe('red');
  });

  // BN-18
  it('BN-18 a failed bindOptionalNode call does not make the next bindNode optional', () => {
    expect(() => bindOptionalNode(null, 'x', '.nope')).toThrow();
    expect(() => bindNode({}, 'x', '.does-not-exist')).toThrow();
  });

  // BN-19
  it('BN-19 select(":sandbox") on an object without bindings returns null', () => {
    expect(select({}, ':sandbox')).toBe(null);
  });

  // bindNode's selectors: select and selectAll look inside the sandbox only (sweep 4, BR-8)
  it('BN-19 on an object without bindings, plain selectors in a list with :sandbox still select', () => {
    const foo = document.createElement('i');
    foo.className = 'bn19-foo';
    document.body.appendChild(foo);
    try {
      expect(selectNodes({}, ':sandbox, .bn19-foo')).toEqual([foo]);
      expect(selectAll({}, ':sandbox, .bn19-foo')).toEqual([]);
    } finally {
      foo.remove();
    }
  });

  it('BN-20 setValue options carry the current value, not the one at bind time', () => {
    const obj = { x: 'a' };
    const seen = [];
    const binder = {
      setValue(value, options) {
        seen.push([value, options.value]);
      }
    };
    bindNode(obj, 'x', document.createElement('span'), binder, sync);
    obj.x = 'b';
    expect(seen).toEqual([
      ['a', 'a'],
      ['b', 'b']
    ]);
  });

  it('BN-20 getValue options carry the current value, not the one at bind time', () => {
    const obj = { x: 'a' };
    const node = document.createElement('input');
    const seen = [];
    const binder = {
      on: 'input',
      getValue(options) {
        seen.push(options.value);
        return this.value;
      },
      setValue(value) {
        this.value = value;
      }
    };
    bindNode(obj, 'x', node, binder, { ...sync, useExactBinder: true });
    obj.x = 'b';
    node.value = 'c';
    fire(node, 'input');
    expect(seen.at(-1)).toBe('b');
    expect(obj.x).toBe('c');
  });
  it('BN-21 input typed before a pending program write lands wins over it', async () => {
    const obj = {};
    const node = document.createElement('input');
    bindNode(obj, 'x', node);
    obj.x = 'old';
    await wait();

    obj.x = '';
    node.value = 'typed';
    fire(node, 'input');
    await wait();
    expect(node.value).toBe('typed');
    expect(obj.x).toBe('typed');

    obj.x = 'from code';
    await wait();
    expect(node.value).toBe('from code');
  });
});
