import Class from 'src/class';
import MatreshkaArray from 'src/array';
import MatreshkaObject from 'src/object';
import arrayFrom from 'src/_helpers/arrayfrom';
import assign from 'src/_helpers/assign';
import forOwn from 'src/_helpers/forown';
import fromEntries from 'src/_helpers/fromentries';
import bindNode from 'src/bindnode';
import instantiate from 'src/instantiate';
import parseBindings from 'src/parsebindings';
import { html, output, text } from 'src/binders';
import { parseHTML } from 'src/_dom';

// sweep 5, the ES5 build: each case also runs against dist/ (npm run test:dist), where Babel compiled the code for IE 11
const without = (object, names, fn) => {
  const saved = names.map((name) => Object.getOwnPropertyDescriptor(object, name));
  for (const name of names) {
    Object.defineProperty(object, name, { value: undefined, configurable: true, writable: true });
  }
  try {
    return fn();
  } finally {
    names.forEach((name, i) => {
      if (saved[i]) Object.defineProperty(object, name, saved[i]);
      else delete object[name];
    });
  }
};

const withoutTemplate = (fn) => {
  const { createElement } = document;
  document.createElement = function (name) {
    return createElement.call(this, name === 'template' ? 'x-template' : name);
  };
  try {
    return fn();
  } finally {
    document.createElement = createElement;
  }
};

// IE 11's Object.keys is ES5's: a primitive throws
const withES5Keys = (fn) => {
  const { keys } = Object;
  Object.keys = (object) => {
    if (object === null || (typeof object !== 'object' && typeof object !== 'function')) {
      throw new TypeError('Object.keys: argument is not an Object');
    }
    return keys(object);
  };
  try {
    return fn();
  } finally {
    Object.keys = keys;
  }
};

const names = (nodes) => nodes.map((node) => node.nodeName);

describe('sweep 5 ES5: parseHTML without <template>', () => {
  it('gives the same nodes as <template> for every wrapped tag', () => {
    const tags = ['option', 'optgroup', 'legend', 'thead', 'tbody', 'tfoot', 'colgroup', 'caption'];
    const markup = tags.concat(['tr', 'td', 'th', 'col', 'area']).map((tag) => `<${tag}></${tag}>`);
    markup.push('<col>', '<col><col>', '<COL span="2">');
    const expected = markup.map((item) => names(parseHTML(item)));
    expect(withoutTemplate(() => markup.map((item) => names(parseHTML(item))))).toEqual(expected);
    expect(withoutTemplate(() => names(parseHTML('<col><col>')))).toEqual(['COL', 'COL']);
  });

  it('a Matreshka.Array renders <col> items into a colgroup', () => {
    const colgroup = document.createElement('colgroup');
    const count = withoutTemplate(() => {
      const list = new MatreshkaArray();
      list.itemRenderer = '<col>';
      list.bindNode('container', colgroup);
      list.push({}, {});
      return colgroup.children.length;
    });
    expect(count).toBe(2);
  });
});

// a value whose valueOf and toString differ, as a date or a money class has
const money = () => ({ valueOf: () => 42, toString: () => '$42.00' });
const settle = () => new Promise((resolve) => setTimeout(resolve, 50));

describe('sweep 5 ES5: a shown value is String(value)', () => {
  it('binders.text, binders.html and binders.output', async () => {
    const nodes = ['span', 'span', 'output'].map((name) => document.createElement(name));
    const object = {};
    bindNode(object, 'a', nodes[0], text());
    bindNode(object, 'b', nodes[1], html());
    bindNode(object, 'c', nodes[2], output());
    object.a = money();
    object.b = money();
    object.c = money();
    await settle();
    expect([nodes[0].textContent, nodes[1].innerHTML, nodes[2].value]).toEqual(['$42.00', '$42.00', '$42.00']);
  });

  it('{{x}} in text and in an attribute', async () => {
    const node = document.createElement('div');
    node.innerHTML = '<a title="price {{x}}">{{x}}</a>';
    const object = {};
    parseBindings(object, node);
    object.x = money();
    await settle();
    expect([node.firstChild.getAttribute('title'), node.firstChild.textContent]).toEqual(['price $42.00', '$42.00']);
  });
});

describe('sweep 5 ES5: arrayFrom without Array.from', () => {
  it('visits every index, holes included', () => {
    const result = without(Array, ['from'], () => [
      arrayFrom({ length: 3 }, (_, i) => i),
      arrayFrom({ length: 2 }),
      arrayFrom({ length: 3, 0: 1, 2: 3 }),
      arrayFrom({}),
      arrayFrom({ length: -1 }),
      arrayFrom({ length: 2.5, 0: 'a', 1: 'b' }),
      arrayFrom(
        { length: 2, 0: 1, 1: 2 },
        function (x) {
          return x * this.k;
        },
        { k: 10 }
      )
    ]);
    expect(result).toEqual([[0, 1, 2], [undefined, undefined], [1, undefined, 3], [], [], ['a', 'b'], [10, 20]]);
    expect(1 in result[1] && 1 in result[2]).toBe(true);
  });

  it('Matreshka.Array.from({ length: 3 }, (_, i) => i * 2)', () => {
    const items = without(Array, ['from'], () => MatreshkaArray.from({ length: 3 }, (_, i) => i * 2).toJSON());
    expect(items).toEqual([0, 2, 4]);
  });
});

describe('sweep 5 ES5: a data key named __proto__', () => {
  it('fromEntries keeps it as an own key', () => {
    const result = fromEntries([
      ['__proto__', { x: 1 }],
      ['a', 2]
    ]);
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.keys(result)).toEqual(['__proto__', 'a']);
    expect(Object.getOwnPropertyDescriptor(result, '__proto__')).toEqual({
      value: { x: 1 },
      writable: true,
      enumerable: true,
      configurable: true
    });
  });

  it('setData(aMatreshkaObject) keeps it', () => {
    const source = new MatreshkaObject(JSON.parse('{"__proto__":{"x":1},"a":2}'));
    const target = new MatreshkaObject();
    target.setData(source);
    expect(target.keys()).toEqual(['__proto__', 'a']);
    // biome-ignore lint/suspicious/noProto: the data key, an own accessor
    expect(target.__proto__).toEqual({ x: 1 });
    expect(Object.getPrototypeOf(target)).toBe(MatreshkaObject.prototype);
  });

  it('setData("__proto__", v, { replaceData: true }) removes only the other keys', () => {
    const object = new MatreshkaObject(JSON.parse('{"__proto__":1,"a":2}'));
    const removed = [];
    object.on('remove', (evt) => removed.push(evt.key));
    object.setData('__proto__', 3, { replaceData: true });
    expect(removed).toEqual(['a']);
    expect(object.keys()).toEqual(['__proto__']);
  });
});

describe('sweep 5 ES5: a Class chain over an ES class', () => {
  class Base {
    constructor(x) {
      this.x = x;
    }
  }

  it('Class({ extends: Class({ extends: Base }) })', () => {
    const A = Class({ extends: Base });
    const B = Class({ extends: A });
    const b = new B(1);
    expect([b.x, b instanceof B, b instanceof A, b instanceof Base, b.constructor]).toEqual([1, true, true, true, B]);
    expect(new A(2).constructor).toBe(A);
  });

  it('a subclass of a Class whose constructor is an ES class', () => {
    const A = Class({ constructor: Base });
    const B = Class({ extends: A });
    const b = new B(2);
    expect([b.x, b instanceof B, b instanceof A]).toEqual([2, true, true]);
  });

  it('called on another object, a plain function parent runs on it', () => {
    const A = Class({
      extends: function Parent() {
        this.p = 1;
      }
    });
    const object = {};
    A.call(object);
    expect(object.p).toBe(1);
  });

  it('an ES class that extends the chain', () => {
    const A = Class({ extends: Base });
    const B = Class({ extends: A });
    class C extends B {}
    const c = new C(3);
    expect([c.x, c instanceof C, c instanceof Base]).toEqual([3, true, true]);
  });
});

describe('sweep 5 ES5: a primitive under the ES5 Object.keys', () => {
  it('assign skips null and undefined and copies a string as Object.assign does', () => {
    const native = Object.assign({}, 5, 'ab', true, null, undefined, { c: 1 });
    expect(withES5Keys(() => assign({}, 5, 'ab', true, null, undefined, { c: 1 }))).toEqual(native);
  });

  it('forOwn walks a primitive as an object', () => {
    const seen = [];
    withES5Keys(() => {
      forOwn('ab', (value, key) => seen.push(key + value));
      forOwn(5, (value, key) => seen.push(key + value));
    });
    expect(seen).toEqual(['0a', '1b']);
  });

  it('instantiate takes a number after an object', () => {
    function C(data) {
      this.d = data;
    }
    const object = {};
    const a = withES5Keys(() => {
      instantiate(object, 'x', C);
      object.x = { a: 1 };
      object.x = 5;
      return object.x.a;
    });
    expect(a).toBe(1);
  });
});
