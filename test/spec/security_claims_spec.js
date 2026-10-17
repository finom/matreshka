// one test per claim in SECURITY.md, "What you can expect"
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import MatreshkaObject from 'src/object';
import binders from 'src/binders';
import set from 'src/set';
import calc from 'src/calc';
import on from 'src/on';
import bindNode from 'src/bindnode';
import parseBindings from 'src/parsebindings';

// bound nodes are written on the next timer tick
const tick = () => new Promise((resolve) => setTimeout(resolve, 10));

const payload = '<img src=x onerror="window.__mkXss=1">';

describe('SECURITY.md: text binders write text', () => {
  afterEach(() => {
    delete window.__mkXss;
  });

  it('the text binder', async () => {
    const node = document.createElement('span');
    const obj = {};
    bindNode(obj, 'x', node, binders.text());
    obj.x = payload;
    await tick();
    expect(node.textContent).toBe(payload);
    expect(node.children.length).toBe(0);
    expect(window.__mkXss).toBe(undefined);
  });

  it('the default binders of input, textarea and output', async () => {
    const nodes = ['input', 'textarea', 'output'].map((tag) => document.createElement(tag));
    const obj = {};
    for (const node of nodes) bindNode(obj, `x${node.tagName}`, node);
    for (const node of nodes) obj[`x${node.tagName}`] = payload;
    await tick();
    for (const node of nodes) {
      expect(node.value).toBe(payload);
      expect(node.children.length).toBe(0);
    }
  });

  it('{{key}} in markup', async () => {
    const node = document.createElement('div');
    node.innerHTML = '<p>{{x}}</p>';
    const obj = {};
    parseBindings(obj, node);
    obj.x = payload;
    await tick();
    expect(node.querySelector('p').textContent).toBe(payload);
    expect(node.querySelector('img')).toBe(null);
  });
});

describe('SECURITY.md: keys and paths never reach Object.prototype', () => {
  afterEach(() => {
    for (const name of ['x', 'y', 'polluted']) delete Object.prototype[name];
  });

  it('__proto__, constructor and toString are stored as own keys', () => {
    for (const name of ['__proto__', 'constructor', 'toString']) {
      const plain = {};
      set(plain, name, { polluted: true });
      const obj = new MatreshkaObject();
      obj.setData({ [name]: { polluted: true } });
      for (const target of [plain, obj]) {
        // a plain object gets a data property, a Matreshka object an accessor
        const descriptor = Object.getOwnPropertyDescriptor(target, name);
        expect(descriptor.get ? descriptor.get.call(target) : descriptor.value, name).toEqual({ polluted: true });
      }
      expect(Object.getPrototypeOf(plain)).toBe(Object.prototype);
    }
    expect(Object.prototype.polluted).toBe(undefined);
    expect({}.toString).toBe(Object.prototype.toString);
    expect({}.constructor).toBe(Object);
  });

  it('a path through __proto__ in set, calc, bindNode and on', () => {
    const obj = new MatreshkaObject();
    set(obj, '__proto__', { x: 1 });
    calc(obj, 'z', '__proto__.x', (v) => v);
    on(obj, '__proto__@change:y', () => {});
    bindNode(obj, '__proto__.y', document.createElement('input'));
    const plain = {};
    calc(plain, 'z', '__proto__.x', (v) => v);
    bindNode(plain, '__proto__.y', document.createElement('input'));
    expect(Object.prototype.x).toBe(undefined);
    expect(Object.prototype.y).toBe(undefined);
    expect(Object.hasOwn(Object.prototype, 'x')).toBe(false);
    expect(Object.hasOwn(Object.prototype, 'y')).toBe(false);
  });
});

describe('SECURITY.md: no code from strings', () => {
  it('src/ has no eval and no Function constructor', () => {
    const files = [];
    const walk = (dir) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) walk(path);
        else if (path.endsWith('.ts')) files.push(path);
      }
    };
    walk('src');
    expect(files.length).toBeGreaterThan(50);
    for (const file of files) {
      const code = readFileSync(file, 'utf8');
      expect(code, file).not.toMatch(/\beval\s*\(|\bnew\s+Function\b|(?<![\w.])Function\s*\(/);
    }
  });

  it('package.json has no runtime dependencies', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
    expect(pkg.dependencies).toBe(undefined);
  });
});
