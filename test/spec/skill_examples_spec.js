import Matreshka, {
  bindNode,
  bindOptionalNode,
  bindSandbox,
  binders,
  calc,
  chain,
  defaultBinders,
  instantiate,
  lookForBinder,
  MatreshkaArray,
  MatreshkaObject,
  mediate,
  off,
  on,
  once,
  onDebounce,
  parseBindings,
  parserBrackets,
  remove,
  select,
  selectAll,
  set,
  toMatreshka,
  trigger,
  unbindNode
} from 'src';
import { initRouter, Router } from 'src/router';
import { parseForm } from 'src/parse-form';

// every claim and snippet of skills/matreshka/SKILL.md, run as written
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// with no delay: hops through timers, so a debounced step that schedules the next one (getValue, then the
// write-back) is done on a slow machine too
const wait = async (ms) => {
  if (ms !== undefined) return sleep(ms);
  for (let i = 0; i < 5; i++) await sleep(0);
};
const $ = (selector) => document.querySelector(selector);
const type = (input, value) => {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
};
const click = (node) => node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
const html = (markup) => {
  document.body.innerHTML = markup;
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('skill: setup', () => {
  it('A: the script-tag page', async () => {
    html('<input class="name"><p>Hello, <span class="greeting"></span>!</p>');
    const app = {};
    bindNode(app, 'name', '.name');
    calc(app, 'greeting', 'name', (name) => name || 'stranger');
    bindNode(app, 'greeting', '.greeting', binders.text());
    await wait();
    expect($('.greeting').textContent).toBe('stranger');
    type($('.name'), 'Ann');
    await wait();
    expect(app.name).toBe('Ann');
    expect($('.greeting').textContent).toBe('Ann');
  });

  it('D: the TypeScript classes, run as JavaScript', async () => {
    html('<ul class="todos"></ul>');
    class Todo extends MatreshkaObject {}
    class Todos extends MatreshkaArray {
      get Model() {
        return Todo;
      }
      itemRenderer = '<li>{{title}}</li>';
      constructor() {
        super();
        this.bindNode('sandbox', '.todos');
      }
    }
    const todos = new Todos();
    todos.push({ title: 'a' });
    await wait();
    expect(todos[0]).toBeInstanceOf(Todo);
    expect($('.todos').textContent).toBe('a');
  });

  it('E: the test helpers turn the delays off', () => {
    const input = document.createElement('input');
    const obj = {};
    bindNode(obj, 'x', input, null, { debounceSetValue: false, debounceGetValue: false });
    calc(obj, 'y', 'x', (x) => x * 2, { debounceCalc: false });
    obj.x = 2;
    expect(input.value).toBe('2');
    expect(obj.y).toBe(4);
    type(input, '5');
    expect(obj.x).toBe('5');
    expect(obj.y).toBe(10);
  });
});

describe('skill: two styles', () => {
  it('the class style chains bindNode and calc', () => {
    html('<input class="name" value="Bob">');
    class Page extends Matreshka {
      constructor() {
        super();
        this.bindNode('name', '.name').calc('greeting', 'name', (name) => name || 'stranger');
      }
    }
    expect(new Page().greeting).toBe('Bob');
  });

  it('chain gives the method style for a plain object', () => {
    html('<span class="node"></span>');
    const obj = {};
    chain(obj)
      .calc('a', 'b', (b) => b * 2, { debounceCalc: false })
      .set('b', 3)
      .bindNode('c', '.node', binders.text());
    expect(obj.a).toBe(6);
    obj.c = 'c';
    return wait().then(() => expect($('.node').textContent).toBe('c'));
  });
});

describe('skill: behavior to rely on', () => {
  it('updates are debounced; several writes cause one update', async () => {
    const input = document.createElement('input');
    const obj = {};
    bindNode(obj, 'x', input);
    const setValue = vi.spyOn(input, 'value', 'set');
    obj.x = 'a';
    obj.x = 'b';
    expect(input.value).toBe('');
    await wait();
    expect(input.value).toBe('b');
    expect(setValue).toHaveBeenCalledTimes(1);
  });

  it('the first sync is immediate in both directions', () => {
    const filled = document.createElement('input');
    filled.value = 'from page';
    const empty = document.createElement('input');
    const obj = { y: 'from object' };
    bindNode(obj, 'x', filled);
    bindNode(obj, 'y', empty);
    expect(obj.x).toBe('from page');
    expect(empty.value).toBe('from object');
  });

  it('only form elements get a binder automatically', async () => {
    for (const tag of ['input', 'textarea', 'select', 'output', 'progress']) {
      expect(lookForBinder(document.createElement(tag)), tag).toBeTruthy();
    }
    expect(lookForBinder(document.createElement('span'))).toBeUndefined();
    const span = document.createElement('span');
    const obj = {};
    bindNode(obj, 'x', span);
    obj.x = 'hi';
    await wait();
    expect(span.textContent).toBe('');
  });

  it('a checkbox holds a boolean, a radio group the checked value, a select multiple an array', async () => {
    html(`<input type="checkbox" class="c">
      <input type="radio" name="r" value="a" class="r"><input type="radio" name="r" value="b" class="r">
      <select multiple class="m"><option value="1">1</option><option value="2">2</option></select>
      <input type="number" class="n">`);
    const obj = {};
    bindNode(obj, { checked: '.c', choice: '.r', many: '.m', num: '.n' });
    click($('.c'));
    document.querySelectorAll('.r')[1].click();
    $('.m').options[0].selected = true;
    $('.m').options[1].selected = true;
    $('.m').dispatchEvent(new Event('change', { bubbles: true }));
    type($('.n'), '5');
    await wait();
    expect(obj.checked).toBe(true);
    expect(obj.choice).toBe('b');
    expect(obj.many).toEqual(['1', '2']);
    expect(obj.num).toBe('5');
  });

  it('a typed value is not written back; other elements and a changing mediator are', async () => {
    html('<input class="x"><input class="x2"><input class="p">');
    const obj = {};
    bindNode(obj, 'x', '.x, .x2');
    mediate(obj, 'x', Number);
    type($('.x'), '12');
    await wait();
    expect(obj.x).toBe(12);
    type($('.x'), '');
    await wait();
    expect(obj.x).toBe(0);
    expect($('.x').value).toBe('');
    expect($('.x2').value).toBe('0');
    type($('.x'), '5abc');
    await wait();
    expect(obj.x).toBeNaN();
    expect($('.x').value).toBe('5abc');

    bindNode(obj, 'percent', '.p');
    mediate(obj, 'percent', (v) => Math.min(100, Math.max(0, Number(v) || 0)));
    $('.p').focus();
    type($('.p'), '150');
    await wait();
    expect(obj.percent).toBe(100);
    expect($('.p').value).toBe('100');
  });

  it('assigning the same value fires nothing; force fires', () => {
    const obj = { x: 1 };
    const handler = vi.fn();
    on(obj, 'change:x', handler);
    obj.x = 1;
    expect(handler).not.toHaveBeenCalled();
    set(obj, 'x', 1, { force: true });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('a missing element throws; bindOptionalNode skips it', () => {
    expect(() => bindNode({}, 'x', '.missing')).toThrow('Binding error: node is missing for key "x"');
    expect(() => bindOptionalNode({}, 'x', '.missing')).not.toThrow();
  });

  it('a selector is resolved once', async () => {
    html('<i class="item"></i>');
    const obj = {};
    bindNode(obj, 'x', '.item', binders.text());
    document.body.insertAdjacentHTML('beforeend', '<i class="item"></i>');
    obj.x = 'a';
    await wait();
    expect([...document.querySelectorAll('.item')].map((node) => node.textContent)).toEqual(['a', '']);
  });

  it('nodes may be an HTMLCollection or a NodeList; $nodes and selectAll are arrays', () => {
    html('<i></i><i></i><b></b><b></b>');
    const obj = {};
    bindNode(obj, 'a', document.getElementsByTagName('i'), binders.text());
    bindNode(obj, 'b', document.querySelectorAll('b'), binders.text());
    obj.a = 'a';
    obj.b = 'b';
    const instance = new Matreshka();
    instance.bindNode('x', document.getElementsByTagName('i'));
    expect(Array.isArray(instance.$nodes.x)).toBe(true);
    expect(instance.$nodes.x.length).toBe(2);
    expect(instance.nodes.x).toBe($('i'));
    expect(obj.nodes).toBe(undefined);
    bindNode(obj, 'sandbox', document.body);
    expect(Array.isArray(selectAll(obj, 'i'))).toBe(true);
    return wait().then(() => expect(document.body.textContent).toBe('aabb'));
  });

  it('a dotted key is a path that follows a replaced object; exactKey uses it as is', async () => {
    const span = document.createElement('span');
    const obj = { user: { name: 'Ann' } };
    bindNode(obj, 'user.name', span, binders.text());
    await wait();
    expect(span.textContent).toBe('Ann');
    obj.user = { name: 'Bob' };
    await wait();
    expect(span.textContent).toBe('Bob');

    const exact = document.createElement('span');
    bindNode(obj, 'a.b', exact, binders.text(), { exactKey: true });
    obj['a.b'] = 'plain';
    await wait();
    expect(exact.textContent).toBe('plain');
  });
});

describe('skill: bindings', () => {
  it('a partial binder extends the default one; useExactBinder does not', async () => {
    html('<input class="search"><input class="exact">');
    const obj = {};
    bindNode(obj, 'q', 'input.search', { on: 'change' });
    type($('.search'), 'a');
    await wait();
    expect(obj.q).toBe('');
    $('.search').dispatchEvent(new Event('change'));
    await wait();
    expect(obj.q).toBe('a');

    bindNode(obj, 'e', '.exact', { setValue() {} }, { useExactBinder: true });
    obj.e = 'x';
    await wait();
    expect($('.exact').value).toBe('');
  });

  it('the object form and the array form, unbound with the same list', async () => {
    html(
      '<input class="name"><div class="bio"></div><div class="tags"></div><span class="tags-count"></span><b class="a"></b><b class="b"></b>'
    );
    const obj = { name: 'n', bio: '<i>b</i>', tags: 't' };
    bindNode(obj, {
      name: '.name',
      bio: { node: '.bio', binder: binders.html() },
      tags: [
        { node: '.tags', binder: binders.text() },
        { node: '.tags-count', binder: binders.text() }
      ]
    });
    await wait();
    expect($('.name').value).toBe('n');
    expect($('.bio').innerHTML).toBe('<i>b</i>');
    expect($('.tags').textContent).toBe('t');
    expect($('.tags-count').textContent).toBe('t');

    const bindChange = vi.fn();
    on(obj, 'bind:b', bindChange);
    const bindings = [
      { key: 'a', node: '.a', binder: binders.text() },
      { key: 'b', node: '.b', binder: binders.text(), event: { silent: true } }
    ];
    bindNode(obj, bindings);
    expect(bindChange).not.toHaveBeenCalled();
    unbindNode(obj, bindings);
    obj.a = 'after';
    await wait();
    expect($('.a').textContent).toBe('');
  });

  it('the bindNode flags', async () => {
    const input = document.createElement('input');
    input.value = 'page';
    const obj = { x: 'object' };
    bindNode(obj, 'x', input, null, { getValueOnBind: true });
    expect(obj.x).toBe('page');

    const other = document.createElement('input');
    const obj2 = { x: 'object' };
    bindNode(obj2, 'x', other, null, { setValueOnBind: false });
    expect(other.value).toBe('');

    const delayed = document.createElement('input');
    const obj3 = {};
    bindNode(obj3, 'x', delayed, null, { debounceSetValueDelay: 60 });
    obj3.x = 'late';
    await wait(20);
    expect(delayed.value).toBe('');
    await wait(80);
    expect(delayed.value).toBe('late');

    const first = document.createElement('input');
    const obj4 = { x: 'v' };
    bindNode(obj4, 'x', first, null, { debounceSetValueOnBind: true });
    expect(first.value).toBe('');
    await wait();
    expect(first.value).toBe('v');
  });

  it('bind and unbind events, custom data, unbindNode with null and the destroy hook', () => {
    const obj = {};
    const node = document.createElement('i');
    const destroy = vi.fn();
    const bound = vi.fn();
    on(obj, 'bind:x', bound);
    bindNode(obj, 'x', node, { setValue() {}, destroy }, { foo: 'bar' });
    expect(bound.mock.calls[0][0].foo).toBe('bar');
    bindNode(obj, 'y', document.createElement('i'), binders.text());
    unbindNode(obj, null);
    expect(destroy).toHaveBeenCalled();
    const unbound = vi.fn();
    on(obj, 'unbind:x', unbound);
    bindNode(obj, 'x', node, { setValue: unbound });
    unbindNode(obj, 'x');
    expect(unbound).toHaveBeenCalledTimes(1);
  });

  it('the sandbox: :sandbox, select, selectAll, $, :bound(), nodes, reserved key', () => {
    html(
      '<div class="w"><input class="name"><i class="x"></i><i class="x"></i><div class="card"><h2></h2></div></div><div class="w2"></div>'
    );
    const obj = {};
    bindNode(obj, 'sandbox', '.w');
    bindNode(obj, 'name', ':sandbox .name');
    obj.name = 'n';
    expect(select(obj, '.x')).toBe(document.querySelectorAll('.x')[0]);
    expect(selectAll(obj, '.x').length).toBe(2);
    expect(select(obj, '.missing')).toBe(null);
    bindNode(obj, 'card', ':sandbox .card');
    bindNode(obj, 'title', ':bound(card) h2', binders.text());
    expect(selectAll(obj, ':bound(card) h2')).toEqual([$('h2')]);
    expect(() => obj.sandbox).toThrow();
    expect(() => {
      obj.sandbox = 1;
    }).toThrow();
    expect(Object.keys(obj)).not.toContain('sandbox');
    expect(() => bindNode(obj, 'sandbox', '.w2')).toThrow();
    bindSandbox(obj, '.w2');
    expect(select(obj, ':sandbox')).toBe($('.w2'));
    expect(selectAll(obj, '.x')).toEqual([]);

    class Widget extends Matreshka {
      constructor() {
        super().bindNode('sandbox', '.w');
      }
    }
    const widget = new Widget();
    expect(widget.$('.x').length).toBe(2);
    expect(widget.nodes.sandbox).toBe($('.w'));
  });

  it('parseBindings: text, two-way fields, checkbox, attribute, an HTML string, brackets', async () => {
    html(`<div class="card">
      <h2>{{user.name}}</h2>
      <input value="{{query}}">
      <input type="checkbox" checked="{{done}}">
      <a href="/users/{{user.id}}">profile</a>
    </div>`);
    const app = { user: { name: 'Ann', id: 7 }, query: 'q', done: true };
    parseBindings(app, '.card');
    await wait();
    expect($('h2').textContent).toBe('Ann');
    expect($('input').value).toBe('q');
    expect($('[type=checkbox]').checked).toBe(true);
    expect($('a').getAttribute('href')).toBe('/users/7');
    type($('input'), 'typed');
    await wait();
    expect(app.query).toBe('typed');

    const nodes = parseBindings(app, '<h3>Hello, {{name}}</h3>');
    app.name = 'Arthur';
    await wait();
    expect(nodes[0].textContent).toBe('Hello, Arthur');
    expect(nodes[0].isConnected).toBe(false);

    const { left, right } = parserBrackets;
    try {
      parserBrackets.left = '[[';
      parserBrackets.right = ']]';
      const [node] = parseBindings(app, '<b>[[name]]</b>');
      await wait();
      expect(node.textContent).toBe('Arthur');
    } finally {
      parserBrackets.left = left;
      parserBrackets.right = right;
    }
  });
});

describe('skill: binders', () => {
  it('the built-in binders', async () => {
    html(`<i class="text"></i><i class="html"></i><img class="attr"><button class="prop"></button>
      <i class="dataset"></i><i class="style"></i><i class="cls"></i><i class="neg"></i><i class="display"></i>
      <div><i class="exists"></i></div><span class="total"></span>`);
    const obj = { text: null, attr: null };
    bindNode(obj, {
      text: { node: '.text', binder: binders.text() },
      html: { node: '.html', binder: binders.html() },
      attr: { node: '.attr', binder: binders.attr('src') },
      disabled: { node: '.prop', binder: binders.prop('disabled') },
      userId: { node: '.dataset', binder: binders.dataset('userId') },
      color: { node: '.style', binder: binders.style('backgroundColor') },
      done: [
        { node: '.cls', binder: binders.className('completed') },
        { node: '.neg', binder: binders.className('open', false) }
      ],
      loading: { node: '.display', binder: binders.display() },
      exists: { node: '.exists', binder: binders.existence() },
      total: { node: '.total', binder: binders.text((total) => `$${Number(total).toFixed(2)}`) }
    });
    Object.assign(obj, {
      html: '<b>x</b>',
      disabled: true,
      userId: '5',
      color: 'red',
      done: true,
      loading: false,
      exists: false,
      total: 3
    });
    expect(lookForBinder(document.createElement('span'))).toBeUndefined();
    await wait();
    expect($('.text').textContent).toBe('');
    expect($('.attr').getAttribute('src')).toBe('');
    expect($('.html').innerHTML).toBe('<b>x</b>');
    expect($('.prop').disabled).toBe(true);
    expect($('.dataset').getAttribute('data-user-id')).toBe('5');
    expect($('.style').style.backgroundColor).toBe('red');
    expect($('.cls').classList.contains('completed')).toBe(true);
    expect($('.neg').classList.contains('open')).toBe(false);
    expect($('.display').style.display).toBe('none');
    expect($('.exists')).toBe(null);
    expect($('.total').textContent).toBe('$3.00');
    obj.exists = true;
    await wait();
    expect($('.exists')).not.toBe(null);
  });

  it('a binder gets the element as this and the options', () => {
    const node = document.createElement('i');
    const obj = {};
    let seen;
    bindNode(
      obj,
      'x',
      node,
      {
        setValue(value, options) {
          seen = { self: this, value, options };
        }
      },
      { debounceSetValue: false }
    );
    obj.x = 1;
    expect(seen.self).toBe(node);
    expect(seen.value).toBe(1);
    expect(seen.options.self).toBe(obj);
    expect(seen.options.key).toBe('x');
    expect(seen.options.node).toBe(node);
    expect(seen.options.$nodes).toEqual([node]);
  });

  it('a custom binder added to Matreshka.binders', async () => {
    html('<b></b>');
    Matreshka.binders.upper = () => ({
      setValue(value) {
        this.textContent = String(value).toUpperCase();
      }
    });
    try {
      const obj = { x: 'hi' };
      bindNode(obj, 'x', 'b', Matreshka.binders.upper());
      await wait();
      expect($('b').textContent).toBe('HI');
    } finally {
      delete Matreshka.binders.upper;
    }
  });

  it('a slider-like widget binder with on, getValue, setValue and initialize', async () => {
    html('<div class="volume"></div>');
    Matreshka.binders.slider = (min, max) => ({
      on: 'slide',
      getValue() {
        return this.sliderValue;
      },
      setValue(value) {
        this.sliderValue = value;
      },
      initialize() {
        this.range = [min, max];
      }
    });
    try {
      const app = {};
      bindNode(app, 'volume', '.volume', Matreshka.binders.slider(0, 100));
      expect($('.volume').range).toEqual([0, 100]);
      $('.volume').sliderValue = 30;
      $('.volume').dispatchEvent(new Event('slide'));
      await wait();
      expect(app.volume).toBe(30);
    } finally {
      delete Matreshka.binders.slider;
    }
  });

  it('defaultBinders.unshift wins over the built-in rules', async () => {
    html('<div class="rich-editor"></div>');
    const rule = (node) => {
      if (node.classList?.contains('rich-editor'))
        return {
          setValue(v) {
            this.dataset.v = v;
          }
        };
    };
    defaultBinders.unshift(rule);
    try {
      expect(lookForBinder($('.rich-editor'))).toBeTruthy();
      const obj = { x: 'v' };
      bindNode(obj, 'x', '.rich-editor');
      await wait();
      expect($('.rich-editor').dataset.v).toBe('v');
    } finally {
      defaultBinders.splice(defaultBinders.indexOf(rule), 1);
    }
  });
});

describe('skill: events', () => {
  it('on, triggerOnInit, the object form, once, onDebounce, off, trigger', async () => {
    const obj = {};
    const init = vi.fn();
    on(obj, 'foo', init, true);
    expect(init).toHaveBeenCalledTimes(1);
    const a = vi.fn();
    const b = vi.fn();
    on(obj, { 'change:a': a, 'change:b': b });
    obj.a = 1;
    obj.b = 1;
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);

    const one = vi.fn();
    once(obj, 'bar', one);
    trigger(obj, 'bar');
    trigger(obj, 'bar');
    expect(one).toHaveBeenCalledTimes(1);

    const debounced = vi.fn();
    onDebounce(obj, 'change:c', debounced, 30);
    for (let i = 0; i < 5; i++) obj.c = i;
    await wait(60);
    expect(debounced).toHaveBeenCalledTimes(1);

    const args = vi.fn();
    on(obj, 'baz qux', args);
    trigger(obj, 'qux', 1, 2);
    expect(args).toHaveBeenCalledWith(1, 2);

    const twice = vi.fn();
    on(obj, 'dup', twice);
    on(obj, 'dup', twice);
    trigger(obj, 'dup');
    expect(twice).toHaveBeenCalledTimes(1);

    off(obj);
    obj.a = 2;
    trigger(obj, 'qux');
    expect(a).toHaveBeenCalledTimes(1);
    expect(args).toHaveBeenCalledTimes(1);
  });

  it('property events carry value, previousValue, key, self and custom keys', () => {
    const app = { query: 'a' };
    const handler = vi.fn();
    const before = vi.fn();
    on(app, 'change:query', handler);
    on(app, 'beforechange:query', before);
    set(app, 'query', 'x', { source: 'url' });
    const evt = handler.mock.calls[0][0];
    expect(evt.value).toBe('x');
    expect(evt.previousValue).toBe('a');
    expect(evt.key).toBe('query');
    expect(evt.self).toBe(app);
    expect(evt.source).toBe('url');
    expect(before).toHaveBeenCalled();
    const any = vi.fn();
    on(app, 'change', any);
    app.other = 1;
    expect(any).not.toHaveBeenCalled();
    app.query = 'y';
    expect(any).toHaveBeenCalledTimes(1);
    for (const [makeReactive, key] of [
      [(o) => bindNode(o, 'k', document.createElement('i'), binders.text()), 'k'],
      [(o) => calc(o, 'k', 'z'), 'k'],
      [(o) => mediate(o, 'k', String), 'k'],
      [(o) => on(o, 'k@foo', () => {}), 'k']
    ]) {
      const target = {};
      makeReactive(target);
      const changed = vi.fn();
      on(target, 'change', changed);
      set(target, key, { v: 1 });
      expect(changed).toHaveBeenCalled();
    }
  });

  it('DOM events: KEY, KEY(SELECTOR) and (SELECTOR) inside the sandbox', () => {
    html(
      '<div class="app"><button class="save"></button><ul class="list"><li><b class="remove"></b></li></ul><a class="clear" href="#x"></a></div>'
    );
    const app = { query: 'q' };
    bindNode(app, 'sandbox', '.app');
    bindNode(app, 'saveButton', '.save');
    bindNode(app, 'list', '.list');
    const save = vi.fn();
    const remove = vi.fn();
    on(app, 'click::saveButton', save);
    on(app, 'click::list(.remove)', remove);
    on(app, 'click::(.clear)', (evt) => {
      evt.preventDefault();
      app.query = '';
    });
    click($('.save'));
    click($('.remove'));
    click($('.clear'));
    expect(save).toHaveBeenCalledTimes(1);
    const evt = save.mock.calls[0][0];
    expect(evt.domEvent).toBeInstanceOf(MouseEvent);
    expect(evt.self === app).toBe(true);
    expect(evt.node).toBe($('.save'));
    expect(evt.key).toBe('saveButton');
    expect(evt.target).toBe($('.save'));
    expect(typeof evt.stopPropagation).toBe('function');
    expect(remove).toHaveBeenCalledTimes(1);
    expect(app.query).toBe('');
    expect(location.hash).toBe('');
  });

  it('PATH@EVENT follows a replaced object; *@EVENT listens to every item', () => {
    const obj = { user: { name: 'a' } };
    const handler = vi.fn();
    on(obj, 'user@change:name', handler);
    obj.user = { name: 'b' };
    obj.user.name = 'c';
    expect(handler).toHaveBeenCalledTimes(1);

    const list = new MatreshkaArray(new MatreshkaObject({ done: false }));
    const done = vi.fn();
    on(list, '*@change:done', done);
    list[0].done = true;
    expect(done).toHaveBeenCalledTimes(1);

    const deep = { a: { b: { c: {} } } };
    const nested = vi.fn();
    on(deep, 'a.b.c@change:d', nested);
    deep.a.b.c.d = 1;
    expect(nested).toHaveBeenCalledTimes(1);
  });
});

describe('skill: values', () => {
  it('set flags', async () => {
    const span = document.createElement('span');
    const obj = { a: 1 };
    bindNode(obj, 'a', span, binders.text());
    calc(obj, 'double', 'a', (a) => a * 2, { debounceCalc: false });
    const change = vi.fn();
    on(obj, 'change:a', change);

    set(obj, 'a', 2, { silent: true });
    await wait();
    expect(change).not.toHaveBeenCalled();
    expect(span.textContent).toBe('2');
    expect(obj.double).toBe(4);

    set(obj, 'a', 3, { silentHTML: true });
    await wait();
    expect(span.textContent).toBe('2');

    span.textContent = 'stale';
    set(obj, 'a', 3, { forceHTML: true });
    await wait();
    expect(span.textContent).toBe('3');

    mediate(obj, 'm', String);
    set(obj, 'm', 1, { skipMediator: true });
    expect(obj.m).toBe(1);

    set(obj, 'a', 10, { skipCalc: true });
    expect(obj.double).toBe(6);

    set(obj, { b: 1, c: 2 });
    expect([obj.b, obj.c]).toEqual([1, 2]);
  });

  it('calc source forms, the batch form and cycles', () => {
    const sync = { debounceCalc: false };
    const other = { a: 2, b: 3 };
    const obj = { first: 'Ann', last: 'Lee', cart: { sum: 5 }, a: 4 };
    calc(obj, 'full', ['first', 'last'], (first, last) => `${first} ${last}`);
    calc(obj, 'total', 'cart.sum');
    calc(obj, 'sum', { object: other, key: ['a', 'b'] }, (a, b) => a + b);
    calc(
      obj,
      'x',
      [
        { object: obj, key: 'a' },
        { object: other, key: 'b' }
      ],
      (a, b) => a * b
    );
    expect([obj.full, obj.total, obj.sum, obj.x]).toEqual(['Ann Lee', 5, 5, 12]);

    calc(
      obj,
      { y: { source: ['a', 'total'], handler: (a, total) => a + total }, z: { source: 'y', event: sync } },
      sync
    );
    expect([obj.y, obj.z]).toEqual([9, 9]);

    const rect = { a: 3, b: 4 };
    calc(rect, 'p', ['a', 'b'], (a, b) => (a + b) * 2, sync);
    calc(rect, 'a', ['p', 'b'], (p, b) => p / 2 - b, sync);
    rect.a = 5;
    expect(rect.p).toBe(18);
  });

  it('calc flags: setOnInit, delay, a silent source, promiseCalc where the newest wins', async () => {
    const obj = { b: 1 };
    calc(obj, 'a', 'b', (b) => b * 2, { setOnInit: false });
    expect(obj.a).toBe(undefined);

    calc(obj, 'late', 'b', (b) => b, { debounceCalcDelay: 50 });
    obj.b = 2;
    await wait(20);
    expect(obj.late).toBe(1);
    await wait(60);
    expect(obj.late).toBe(2);

    const changed = vi.fn();
    calc(obj, 's', 'b', (b) => b, { debounceCalc: false });
    on(obj, 'change:s', changed);
    set(obj, 'b', 3, { silent: true });
    expect(obj.s).toBe(3);
    expect(changed).not.toHaveBeenCalled();

    const app = { query: 'a' };
    const delays = { a: 40, b: 10 };
    calc(
      app,
      'results',
      'query',
      (query) => new Promise((resolve) => setTimeout(() => resolve(query), delays[query])),
      {
        promiseCalc: true,
        debounceCalc: false
      }
    );
    app.query = 'b';
    await wait(80);
    expect(app.results).toBe('b');
  });

  it('mediate forms', () => {
    const obj = {};
    obj.x = 1;
    const seen = [];
    mediate(obj, 'x', (value, previousValue, key, self) => {
      seen.push([value, previousValue, key, self === obj]);
      return value * 10;
    });
    expect(obj.x).toBe(10);
    obj.x = 2;
    expect(obj.x).toBe(20);
    expect(seen.at(-1)).toEqual([2, 10, 'x', true]);
    mediate(obj, ['a', 'b'], Number);
    obj.a = '2';
    expect(obj.a).toBe(2);
    mediate(obj, { age: Number, name: String, admin: Boolean });
    obj.age = '3';
    obj.name = 4;
    obj.admin = 1;
    expect([obj.age, obj.name, obj.admin]).toEqual([3, '4', true]);
  });

  it('instantiate: Object and Array subclasses, plain classes, constructor args, updateCallback', () => {
    class Settings extends MatreshkaObject {}
    class Friends extends MatreshkaArray {}
    class Plain {
      constructor(data, parent, key) {
        Object.assign(this, data);
        this.args = [parent, key];
      }
    }
    const app = { settings: { name: 'a' }, friends: [1, 2], plain: { p: 1 } };
    instantiate(app, { settings: Settings, friends: Friends });
    instantiate(app, 'plain', Plain);
    const { settings, friends, plain } = app;
    expect(plain.args).toEqual([app, 'plain']);
    app.settings = { name: 'b' };
    app.friends = [3];
    app.plain = { p: 2 };
    expect(app.settings).toBe(settings);
    expect(settings.toJSON()).toEqual({ name: 'b' });
    expect(app.friends).toBe(friends);
    expect(friends.toJSON()).toEqual([3]);
    expect(app.plain).toBe(plain);
    expect(plain.p).toBe(2);

    const update = vi.fn();
    instantiate(app, 'custom', Plain, update);
    const data = { z: 1 };
    app.custom = data;
    expect(update.mock.calls[0][0]).toBe(app.custom);
    expect(update.mock.calls[0][1]).toEqual(data);
  });

  it('remove deletes the property with its bindings and listeners', async () => {
    const span = document.createElement('span');
    const obj = { x: 1 };
    bindNode(obj, 'x', span, binders.text());
    const deleted = vi.fn();
    const changed = vi.fn();
    on(obj, 'delete:x', deleted);
    on(obj, 'change:x', changed);
    remove(obj, 'x');
    expect('x' in obj).toBe(false);
    expect(deleted).toHaveBeenCalled();
    obj.x = 5;
    await wait();
    expect(span.textContent).toBe('1');
    expect(changed).not.toHaveBeenCalled();

    const data = new MatreshkaObject({ a: 1 });
    const events = [];
    data.on('remove modify', (evt) => events.push(evt.key ?? 'modify'));
    data.remove('a');
    expect(data.keys()).toEqual([]);
    expect(events.length).toBe(2);
  });
});

describe('skill: Matreshka.Object', () => {
  it('data keys, calc outside the data, JSON', () => {
    class User extends Matreshka.Object {
      constructor(data) {
        super(data);
        this.calc('fullName', ['first', 'last'], (f, l) => `${f} ${l}`);
      }
    }
    const user = new User({ first: 'Ann', last: 'Lee' });
    expect(user.fullName).toBe('Ann Lee');
    expect(JSON.stringify(user)).toBe('{"first":"Ann","last":"Lee"}');
  });

  it('every member', () => {
    const obj = new MatreshkaObject({ a: 1, b: 2 });
    const set_ = vi.fn();
    const modify = vi.fn();
    obj.on('set', set_).on('modify', modify);
    obj.setData('c', 3).jset({ d: 4 });
    expect(set_).toHaveBeenCalled();
    expect(modify).toHaveBeenCalled();
    obj.addDataKeys('e', 'f').addDataKeys(['g']);
    expect(obj.isDataKey('e')).toBe(true);
    obj.removeDataKeys(['e', 'f', 'g']);
    expect(obj.isDataKey('e')).toBe(false);
    obj.notData = 1;
    expect(obj.keys()).toEqual(['a', 'b', 'c', 'd']);
    expect(obj.values()).toEqual([1, 2, 3, 4]);
    expect(obj.entries()).toEqual([
      ['a', 1],
      ['b', 2],
      ['c', 3],
      ['d', 4]
    ]);
    const seen = [];
    obj.each((value, key) => seen.push(key + value));
    expect(seen).toEqual(['a1', 'b2', 'c3', 'd4']);
    expect([...obj]).toEqual([1, 2, 3, 4]);
    expect(obj.keyOf(2)).toBe('b');
    expect(obj.keyOf(9)).toBe(null);
    obj.setData({ a: 1 }, { replaceData: true });
    expect(obj.keys()).toEqual(['a']);
    obj.setData('nested', new MatreshkaObject({ x: 1 }));
    expect(obj.toJSON()).toEqual({ a: 1, nested: { x: 1 } });
    expect(obj.toJSON(false).nested).toBeInstanceOf(MatreshkaObject);
    expect(obj.isMatreshkaObject).toBe(true);

    const changes = vi.fn();
    obj.on('*@change:x', changes);
    obj.nested.x = 2;
    expect(changes).toHaveBeenCalled();
  });

  it('toMatreshka converts a plain tree', () => {
    const tree = toMatreshka({ a: 1, b: { c: 2 }, d: [{ e: 1 }] });
    expect(tree).toBeInstanceOf(MatreshkaObject);
    expect(tree.b).toBeInstanceOf(MatreshkaObject);
    expect(tree.d).toBeInstanceOf(MatreshkaArray);
    expect(tree.d[0]).toBeInstanceOf(MatreshkaObject);
  });
});

describe('skill: Matreshka.Array', () => {
  it('the Users example: Model, renderer, a delegated DOM event with evt.self, recreate', async () => {
    html('<ul class="users"></ul>');
    class User extends Matreshka.Object {}
    class Users extends Matreshka.Array {
      get Model() {
        return User;
      }
      itemRenderer = '<li><b>{{name}}</b> <button class="remove">×</button></li>';
      constructor(data) {
        super();
        this.bindNode('sandbox', '.users')
          .on('*@click::(.remove)', (evt) => this.pull(evt.self))
          .recreate(data);
      }
    }
    const users = new Users([{ name: 'Ann' }, { name: 'Bob' }]);
    users.push({ name: 'Cid' });
    await wait();
    expect(users[0]).toBeInstanceOf(User);
    expect([...document.querySelectorAll('.users b')].map((b) => b.textContent)).toEqual(['Ann', 'Bob', 'Cid']);
    users[0].name = 'Anna';
    await wait();
    expect($('.users b').textContent).toBe('Anna');
    click(document.querySelectorAll('.remove')[1]);
    await wait();
    expect(users.map((user) => user.name).toJSON()).toEqual(['Anna', 'Cid']);
    expect(document.querySelectorAll('.users li').length).toBe(2);
  });

  it('array methods and their results', () => {
    const arr = new MatreshkaArray(3, 1, 2);
    expect(arr.map((x) => x * 2)).toBeInstanceOf(MatreshkaArray);
    expect(arr.filter(Boolean)).toBeInstanceOf(MatreshkaArray);
    expect(arr.forEach(() => {})).toBe(arr);
    expect(Array.isArray(arr.keys())).toBe(true);
    expect(arr.toSorted().toJSON()).toEqual([1, 2, 3]);
    expect(arr.at(-1)).toBe(2);
    expect(arr.findLast((x) => x > 1)).toBe(2);
    expect(new MatreshkaArray(3).length).toBe(3);
    expect(new MatreshkaArray('a', 'b').length).toBe(2);
  });

  it('a container, a template selector, an item renderer, reassigning, renderIfPossible, rerender', async () => {
    html(`<div class="w"><h1>Title</h1><ul class="list"></ul>
      <template id="user-template"><li class="t">{{name}}</li></template></div>`);
    class List extends MatreshkaArray {
      itemRenderer = '#user-template';
      constructor() {
        super();
        this.bindNode('sandbox', '.w');
        this.bindNode('container', '.list');
      }
    }
    const list = new List();
    list.push({ name: 'a' }, { name: 'b', renderer: '<li class="own">own</li>' });
    await wait();
    expect($('.list').children.length).toBe(2);
    expect($('.list .t').textContent).toBe('a');
    expect($('.list .own')).not.toBe(null);
    list.itemRenderer = (item) => `<li class="fn">${item.name}</li>`;
    await wait();
    expect($('.list .fn').textContent).toBe('a');

    class Silent extends MatreshkaArray {
      renderIfPossible = false;
      itemRenderer = '<li></li>';
      constructor() {
        super().bindNode('container', document.createElement('ul'));
      }
    }
    const silent = new Silent();
    silent.push({});
    expect(silent.nodes.container.children.length).toBe(0);

    class Late extends MatreshkaArray {
      itemRenderer = '<li></li>';
    }
    const late = new Late({}, {});
    const ul = document.createElement('ul');
    late.bindNode('container', ul);
    late.rerender();
    expect(ul.children.length).toBe(2);
    const first = ul.children[0];
    late.rerender({ forceRerender: true });
    expect(ul.children[0]).not.toBe(first);
  });

  it('onRender, onItemRender, render and afterrender; the event object', async () => {
    html('<form class="my-form"></form>');
    const calls = [];
    class Item extends MatreshkaObject {
      onRender(evt) {
        calls.push('onRender');
        this.bindNode('text', ':sandbox .text', binders.html());
        expect(evt.node).toBe(this.nodes.sandbox);
        expect(evt.self).toBe(this);
        expect(evt.parentArray).toBe(list);
      }
    }
    class Items extends MatreshkaArray {
      get Model() {
        return Item;
      }
      itemRenderer = '<label><span class="text"></span></label>';
      constructor() {
        super().bindNode('sandbox', '.my-form');
        this.on('*@render', () => calls.push('render')).on('*@afterrender', () => calls.push('afterrender'));
      }
      onItemRender(item, evt) {
        calls.push('onItemRender');
        expect(evt.self).toBe(item);
      }
    }
    const list = new Items();
    list.push({ text: 'Buy a raccoon' });
    await wait();
    expect($('.text').textContent).toBe('Buy a raccoon');
    expect(calls).toEqual(expect.arrayContaining(['onRender', 'onItemRender', 'render', 'afterrender']));
  });

  it('plain object items bound in onItemRender', async () => {
    const ul = document.createElement('ul');
    class List extends MatreshkaArray {
      itemRenderer = '<li><i class="x"></i></li>';
      constructor() {
        super().bindNode('container', ul);
      }
      onItemRender(item) {
        bindNode(item, 'x', ':sandbox .x', binders.text());
      }
    }
    const list = new List();
    list.push({ x: 'plain' });
    await wait();
    expect(ul.querySelector('.x').textContent).toBe('plain');
  });

  it('bindRenderedAsSandbox = false and moveSandbox', () => {
    class Item extends MatreshkaObject {
      bindRenderedAsSandbox = false;
    }
    class A extends MatreshkaArray {
      get Model() {
        return Item;
      }
      itemRenderer = '<li></li>';
      constructor() {
        super().bindNode('container', document.createElement('ul'));
      }
    }
    const a = new A();
    const b = new A();
    const item = new Item();
    a.push(item);
    b.push(item);
    expect(a.nodes.container.children.length).toBe(1);
    expect(b.nodes.container.children.length).toBe(1);

    class C extends MatreshkaArray {
      itemRenderer = '<li></li>';
      constructor() {
        super().bindNode('container', document.createElement('ul'));
      }
    }
    const c = new C();
    const d = new C();
    const moved = new MatreshkaObject();
    c.push(moved);
    const node = c.nodes.container.firstChild;
    c.pull(moved);
    d.push_(moved, { moveSandbox: true });
    expect(d.nodes.container.firstChild).toBe(node);
  });

  it('restore reads the items from server-rendered nodes', () => {
    html('<ul class="list"><li><span class="title">Milk</span></li><li><span class="title">Eggs</span></li></ul>');
    class Item extends Matreshka.Object {
      onRender() {
        this.bindNode('title', ':sandbox .title', binders.text());
      }
    }
    class List extends Matreshka.Array {
      get Model() {
        return Item;
      }
      itemRenderer = '<li><span class="title"></span></li>';
      constructor() {
        super().bindNode('sandbox', '.list').restore(':sandbox li');
      }
    }
    const list = new List();
    expect(list.map((item) => item.title).toJSON()).toEqual(['Milk', 'Eggs']);
    list.push({ title: 'Tea' });
    expect(document.querySelectorAll('.list li').length).toBe(3);
  });

  it('Model as a getter converts items passed to super; as a field only on the next change', () => {
    class Item {}
    class Getter extends MatreshkaArray {
      get Model() {
        return Item;
      }
    }
    expect(new Getter({}, {})[0]).toBeInstanceOf(Item);
    class Field extends MatreshkaArray {
      Model = Item;
    }
    const field = new Field({}, {});
    expect(field[0]).not.toBeInstanceOf(Item);
    field.push({});
    expect(field[0]).toBeInstanceOf(Item);
  });

  it('mediateItem, trackBy and $index', () => {
    const numbers = new MatreshkaArray('1', '2');
    const indexes = [];
    numbers.mediateItem((item, index) => {
      indexes.push(index);
      return Number(item);
    });
    numbers.push('3');
    expect(numbers.toJSON()).toEqual([1, 2, 3]);
    expect(indexes).toEqual([0, 1, 2]);

    class Rows extends MatreshkaArray {
      trackBy = 'id';
      get Model() {
        return MatreshkaObject;
      }
      itemRenderer = '<li></li>';
      constructor() {
        super().bindNode('container', document.createElement('ul'));
      }
    }
    const rows = new Rows();
    rows.recreate([
      { id: 1, name: 'a' },
      { id: 2, name: 'b' }
    ]);
    const [one, two] = rows;
    const [nodeOne, nodeTwo] = rows.nodes.container.children;
    rows.recreate([
      { id: 2, name: 'B' },
      { id: 1, name: 'A' },
      { id: 3, name: 'c' }
    ]);
    expect(rows[0]).toBe(two);
    expect(rows[1]).toBe(one);
    expect(two.name).toBe('B');
    expect([...rows.nodes.container.children].slice(0, 2)).toEqual([nodeTwo, nodeOne]);

    class ByIndex extends MatreshkaArray {
      trackBy = '$index';
      get Model() {
        return MatreshkaObject;
      }
    }
    const byIndex = new ByIndex();
    byIndex.recreate([{ name: 'a' }]);
    const kept = byIndex[0];
    byIndex.recreate([{ name: 'b' }, { name: 'c' }]);
    expect(byIndex[0]).toBe(kept);
    expect(kept.name).toBe('b');
  });

  it('recreate, pull, orderBy, toJSON, from and of', () => {
    const arr = new MatreshkaArray();
    arr.recreate([
      { name: 'fred', age: 48 },
      { name: 'barney', age: 34 },
      { name: 'fred', age: 42 },
      { name: 'barney', age: 36 }
    ]);
    arr.orderBy(['name', 'age'], ['asc', 'desc']);
    expect(arr.map((x) => `${x.name}${x.age}`).toJSON()).toEqual(['barney36', 'barney34', 'fred48', 'fred42']);
    const item = arr[1];
    expect(arr.pull(item)).toBe(item);
    expect(arr.pull(0).age).toBe(36);
    expect(arr.pull(99)).toBe(null);
    arr.recreate();
    expect(arr.length).toBe(0);
    const nested = new MatreshkaArray(1, MatreshkaArray.of(2));
    expect(nested.toJSON()).toEqual([1, [2]]);
    expect(nested.toJSON(false)[1]).toBeInstanceOf(MatreshkaArray);
    class Sub extends MatreshkaArray {}
    expect(Sub.from([1, 2], (x) => x * 2)).toBeInstanceOf(Sub);
    expect(Sub.from([1, 2], (x) => x * 2).toJSON()).toEqual([2, 4]);
    expect(Sub.of(1, 2)).toBeInstanceOf(Sub);
    expect(arr.isMatreshkaArray).toBe(true);
  });

  it('METHOD_ flags and the array events', () => {
    const arr = new MatreshkaArray();
    const log = [];
    arr
      .on('push', (evt) => log.push(['push', evt.method, evt.added, evt.removed]))
      .on('add', (evt) => log.push(['add', evt.added]))
      .on('addone', (evt) => log.push(['addone', evt.addedItem]))
      .on('remove', (evt) => log.push(['remove', evt.removed]))
      .on('removeone', (evt) => log.push(['removeone', evt.removedItem]))
      .on('modify', (evt) => log.push(['modify', evt.myFlag]))
      .on('change:length', () => log.push(['length']));
    arr.push(1, 2);
    for (const entry of [
      ['push', 'push', [1, 2], []],
      ['add', [1, 2]],
      ['addone', 1],
      ['addone', 2],
      ['modify', undefined],
      ['length']
    ]) {
      expect(log).toContainEqual(entry);
    }
    log.length = 0;
    arr.splice_(0, 1, { myFlag: 1 });
    expect(log).toContainEqual(['remove', [1]]);
    expect(log).toContainEqual(['removeone', 1]);
    expect(log).toContainEqual(['modify', 1]);
    log.length = 0;
    arr.pop_({ silent: true });
    expect(log).toEqual([]);
    expect(arr.length).toBe(0);

    class Rendered extends MatreshkaArray {
      itemRenderer = '<li></li>';
      get Model() {
        return MatreshkaObject;
      }
      constructor() {
        super().bindNode('container', document.createElement('ul'));
      }
    }
    const rendered = new Rendered();
    rendered.push_({}, { dontRender: true });
    expect(rendered.nodes.container.children.length).toBe(0);
    rendered.push_({}, { skipItemMediator: true });
    expect(rendered[1]).not.toBeInstanceOf(MatreshkaObject);
  });

  it('length can be bound', async () => {
    const count = document.createElement('span');
    const arr = new MatreshkaArray(1);
    bindNode(arr, 'length', count, binders.text());
    arr.push(2);
    await wait();
    expect(count.textContent).toBe('2');
  });
});

describe('skill: router', () => {
  afterEach(() => {
    history.replaceState(null, '', '/');
  });

  it('hash routing both ways, encoding, null cuts the URL, *, plain anchors', async () => {
    const obj = {};
    initRouter(obj, '/section/id/');
    obj.section = 'users';
    obj.id = '42';
    await wait();
    expect(location.hash).toBe('#!/users/42/');
    location.hash = '#!/posts/7/';
    await wait();
    expect([obj.section, obj.id]).toEqual(['posts', '7']);

    obj.id = 'a b/c';
    await wait();
    expect(location.hash).toBe('#!/posts/a%20b%2Fc/');
    expect(obj.id).toBe('a b/c');

    obj.section = null;
    await wait();
    expect(obj.id).toBe(null);
    expect(location.hash).toBe('');

    const other = {};
    initRouter(other, '/*/second/');
    obj.section = 'x';
    obj.id = 'y';
    await wait();
    expect(other.second).toBe('y');

    expect(Router.hash.parts).toEqual(['x', 'y']);
    expect(Router.hash.path).toBe('/x/y/');
    expect(Router.hash.hashPath).toBe('#!/x/y/');
    const span = document.createElement('span');
    bindNode(Router.hash, 'path', span, binders.text());
    await wait();
    expect(span.textContent).toBe('/x/y/');

    location.hash = '#top';
    await wait();
    expect(location.hash).toBe('#top');
  });

  it('history routing keeps the query and the hash', async () => {
    history.replaceState(null, '', '/?q=1#h');
    const obj = {};
    initRouter(obj, '/page/', 'history');
    obj.page = 'about';
    await wait();
    expect(location.pathname).toBe('/about/');
    expect(location.search).toBe('?q=1');
    expect(location.hash).toBe('#h');
  });

  it('the isHome snippet', async () => {
    html('<div class="home"></div>');
    const app = {};
    initRouter(app, '/page/');
    bindNode(app, 'isHome', '.home', binders.display());
    calc(app, 'isHome', 'page', (page) => !page || page === 'home');
    await wait();
    expect($('.home').style.display).toBe('');
    app.page = 'about';
    await wait();
    expect($('.home').style.display).toBe('none');
  });
});

describe('skill: parseForm', () => {
  it('the sign-up form', async () => {
    html(`<form class="signup">
      <input name="email" type="email">
      <input name="password" type="password">
      <input name="agree" type="checkbox">
      <button class="submit" disabled>Sign up</button>
    </form>`);
    const form = {};
    expect(parseForm(form, '.signup')).toBe($('.signup'));
    calc(
      form,
      'valid',
      ['email', 'password', 'agree'],
      (email, password, agree) => /\S+@\S+/.test(email) && password.length >= 8 && agree
    );
    bindNode(
      form,
      'valid',
      '.submit',
      binders.prop('disabled', (valid) => !valid)
    );
    type($('[name=email]'), 'a@b.c');
    type($('[name=password]'), '12345678');
    click($('[name=agree]'));
    await wait();
    expect(form.valid).toBe(true);
    expect($('.submit').disabled).toBe(false);
  });

  it('filled fields, radios, dotted names, the callback, a missing form', () => {
    html(`<form class="f">
      <input name="x" value="foo">
      <input type="radio" name="r" value="a"><input type="radio" name="r" value="b" checked>
      <input name="user.email" value="e">
    </form>`);
    const obj = { user: {} };
    const names = [];
    parseForm(obj, '.f', (name) => names.push(name));
    expect(obj.x).toBe('foo');
    expect(obj.r).toBe('b');
    expect(obj.user.email).toBe('e');
    expect(names).toEqual(['x', 'r', 'r', 'user.email']);
    expect(parseForm({}, '.missing')).toBe(null);
  });
});

describe('skill: Matreshka.Class', () => {
  it('extends, constructor, statics', () => {
    const Counter = Matreshka.Class(
      {
        extends: Matreshka,
        constructor(start) {
          this.count = start;
        },
        increment() {
          this.count++;
        }
      },
      { create: (start) => new Counter(start) }
    );
    const counter = Counter.create(1);
    counter.increment();
    expect(counter.count).toBe(2);
    expect(counter).toBeInstanceOf(Matreshka);
  });
});

describe('skill: recipes', () => {
  it('a number that keeps an empty field as null', () => {
    const obj = {};
    mediate(obj, 'x', (v) => (v === '' ? null : Number(v)));
    obj.x = '';
    expect(obj.x).toBe(null);
    obj.x = '3';
    expect(obj.x).toBe(3);
  });

  it('typing debounced with onDebounce', async () => {
    const obj = {};
    const search = vi.fn();
    onDebounce(obj, 'change:query', search, 30);
    obj.query = 'a';
    obj.query = 'ab';
    await wait(60);
    expect(search).toHaveBeenCalledTimes(1);
  });

  it('a count of done items', () => {
    class Todos extends MatreshkaArray {
      get Model() {
        return MatreshkaObject;
      }
      constructor(data) {
        super();
        this.recreate(data).on(
          'modify *@change:done',
          () => {
            this.doneCount = this.filter((todo) => todo.done).length;
          },
          true
        );
      }
    }
    const todos = new Todos([{ done: true }, { done: false }]);
    expect(todos.doneCount).toBe(1);
    todos[1].done = true;
    expect(todos.doneCount).toBe(2);
    todos.push({ done: true });
    expect(todos.doneCount).toBe(3);
  });

  it('saving to storage on every change', () => {
    const saved = [];
    const list = new MatreshkaArray();
    list.mediateItem((item) => (item instanceof MatreshkaObject ? item : new MatreshkaObject(item)));
    on(list, 'modify *@change', () => saved.push(JSON.stringify(list)));
    list.push({ title: 'a' });
    list[0].title = 'b';
    expect(saved.at(-1)).toBe('[{"title":"b"}]');
    const restored = new MatreshkaArray().recreate(JSON.parse(saved.at(-1)));
    expect(restored.length).toBe(1);
  });
});
