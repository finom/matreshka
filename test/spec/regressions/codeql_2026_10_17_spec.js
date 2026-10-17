import set from 'src/set';
import Matreshka from 'src/matreshka';

describe('set with a key named __proto__ (CodeQL js/prototype-polluting-assignment)', () => {
  it('writes an own key on a plain object, not its prototype', () => {
    const obj = {};
    set(obj, '__proto__', { polluted: true });
    expect(Object.getPrototypeOf(obj)).toBe(Object.prototype);
    expect(obj.polluted).toBe(undefined);
    expect(Object.keys(obj)).toEqual(['__proto__']);
    expect(Object.getOwnPropertyDescriptor(obj, '__proto__').value).toEqual({ polluted: true });
  });

  it('writes an own key on an initialized object with no such property', () => {
    const obj = new Matreshka();
    const proto = Object.getPrototypeOf(obj);
    obj.set('__proto__', { polluted: true });
    expect(Object.getPrototypeOf(obj)).toBe(proto);
    expect(obj.polluted).toBe(undefined);
    expect(Object.hasOwn(obj, '__proto__')).toBe(true);
  });

  it('writes other keys as before', () => {
    const obj = {};
    set(obj, { a: 1, constructor: 2 });
    expect(obj).toEqual({ a: 1, constructor: 2 });
  });
});

// CodeQL js/xss-through-dom follows a form field's name and an attribute's {{key}} into bindNode's node argument,
// through the argument shift of the method form; in the real call they are keys, never HTML
describe('DOM text used as a key is never parsed as HTML', () => {
  // no spaces or dots: those make several keys or a path
  const payload = '<img/src=x/onerror=__mkXss=1>';

  afterEach(() => {
    delete window.__mkXss;
  });

  it('parseForm with a field named like HTML binds the field', async () => {
    const { parseForm } = await import('src/parse-form');
    const form = document.createElement('form');
    const input = document.createElement('input');
    input.setAttribute('name', payload);
    form.appendChild(input);
    const obj = {};
    parseForm(obj, form, undefined, { debounceSetValue: false });
    obj[payload] = 'value';
    expect(input.value).toBe('value');
    expect(form.querySelector('img')).toBe(null);
    expect(window.__mkXss).toBe(undefined);
  });

  it('parseBindings with HTML inside {{}} binds the attribute', async () => {
    const { default: parseBindings } = await import('src/parsebindings');
    const node = document.createElement('div');
    node.setAttribute('title', `{{${payload}}}`);
    const obj = {};
    parseBindings(obj, node);
    expect(node.querySelector('img')).toBe(null);
    expect(window.__mkXss).toBe(undefined);
  });
});

// a path step named __proto__ reads the object's own key, never its prototype
describe('a path through __proto__ never reaches the prototype', () => {
  const added = () => Object.getOwnPropertyNames(Object.prototype).filter((key) => /^mk/.test(key));

  afterEach(() => {
    for (const key of added()) delete Object.prototype[key];
  });

  it('calc with a source path', async () => {
    const { default: calc } = await import('src/calc');
    const obj = {};
    calc(obj, 'a', '__proto__.mkA', (value) => value);
    expect(added()).toEqual([]);
    expect(obj.a).toBe(undefined);
  });

  it('on with a delegated path', async () => {
    const { default: on } = await import('src/on');
    const obj = {};
    on(obj, '__proto__@change:mkB', () => {});
    expect(added()).toEqual([]);
  });

  it('bindNode with a deep key', async () => {
    const { default: bindNode } = await import('src/bindnode');
    const obj = {};
    bindNode(obj, '__proto__.mkC', document.createElement('input'));
    expect(added()).toEqual([]);
  });

  it('a Matreshka instance keeps its class prototype clean', async () => {
    const { default: Matreshka } = await import('src/matreshka');
    const obj = new Matreshka();
    obj.calc('a', '__proto__.mkD', (value) => value);
    expect(Object.hasOwn(Matreshka.prototype, 'mkD')).toBe(false);
  });

  it('an own __proto__ key is walked like any key', async () => {
    const { default: calc } = await import('src/calc');
    const { default: set } = await import('src/set');
    const obj = {};
    const inner = { mkE: 1 };
    set(obj, '__proto__', inner);
    calc(obj, 'a', '__proto__.mkE', (value) => value * 2, { debounceCalc: false });
    expect(obj.a).toBe(2);
    inner.mkE = 5;
    expect(obj.a).toBe(10);
    expect(added()).toEqual([]);
  });
});

describe('bindKey, the single-key core of bindNode', () => {
  it('a path ending with a dot still throws the falsy key error', async () => {
    const { default: bindNode } = await import('src/bindnode');
    const obj = { a: {} };
    expect(() => bindNode(obj, 'a.', document.createElement('input'))).toThrow(/falsy/i);
  });
});
