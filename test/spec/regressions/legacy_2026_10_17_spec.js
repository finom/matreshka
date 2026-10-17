import Class from 'src/class';
import MatreshkaArray from 'src/array';
import assign from 'src/_helpers/assign';
import arrayFrom from 'src/_helpers/arrayfrom';
import privateKey from 'src/_helpers/privatekey';
import addSymbolMembers from 'src/_helpers/addsymbolmembers';
import is from 'src/_helpers/is';
import isInteger from 'src/_helpers/isinteger';
import removeNode from 'src/_helpers/removenode';
import { createMethods } from 'src/array/_pseudonativemethods';
import { listen, matches, parseHTML, unlisten } from 'src/_dom';
import { parseForm } from 'src/parse-form';
import objectValues from 'src/_helpers/objectvalues';

// IE 11 support: each case runs with the API IE 11 lacks taken away, the way IE 11 has it.
// The result is read with the API back, so the test runner keeps working.
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

describe('IE 11: no Reflect', () => {
  it('Class takes a constructor and a parent without Reflect', () => {
    const result = without(globalThis, ['Reflect'], () => {
      const A = Class({
        constructor: function A(x) {
          this.x = x;
        }
      });
      const B = Class({ extends: A });
      const C = Class({
        extends: B,
        constructor: function C(x) {
          B.call(this, x);
          this.c = true;
        }
      });
      const c = new C(1);
      const b = new B(2);
      return [c.x, c.c, c instanceof A, b.x];
    });
    expect(result).toEqual([1, true, true, 2]);
  });

  it('Class keeps building an ES class parent through Reflect where it is', () => {
    class Base {
      constructor(x) {
        this.x = x;
      }
    }
    const Child = Class({ extends: Base });
    expect(new Child(3).x).toBe(3);
  });
});

describe('IE 11: no Symbol', () => {
  it('a private key is a string', () => {
    const key = without(globalThis, ['Symbol'], () => privateKey('x'));
    expect(key).toBe('@@matreshka:x');
  });

  it('Class keeps statics hidden from for-in under a string key', () => {
    const names = without(globalThis, ['Symbol'], () => {
      const A = Class({}, { a: 1 });
      const B = Class({ extends: A }, { b: 2 });
      return { own: Object.keys(B), a: B.a, b: B.b };
    });
    expect(names).toEqual({ own: ['a', 'b'], a: 1, b: 2 });
  });

  it('no iterator and no isConcatSpreadable are added', () => {
    const members = {};
    without(globalThis, ['Symbol'], () => addSymbolMembers(members, () => {}, true));
    expect(Object.getOwnPropertySymbols(members)).toEqual([]);
  });

  it('with Symbol, the iterator and isConcatSpreadable are added', () => {
    const members = {};
    const iterator = () => {};
    addSymbolMembers(members, iterator, true);
    expect(members[Symbol.iterator]).toBe(iterator);
    expect(members[Symbol.isConcatSpreadable]).toBe(true);
    const objectMembers = {};
    addSymbolMembers(objectMembers, iterator);
    expect(Symbol.isConcatSpreadable in objectMembers).toBe(false);
  });
});

describe('IE 11: no Object.getOwnPropertySymbols', () => {
  it('assign copies string keys', () => {
    const symbol = Symbol('s');
    const result = without(Object, ['getOwnPropertySymbols'], () => assign({}, { a: 1, [symbol]: 2 }, null, undefined));
    expect(result).toEqual({ a: 1 });
    expect(Object.getOwnPropertySymbols(result)).toEqual([]);
  });

  it('assign copies enumerable symbol keys where the browser has them', () => {
    const shown = Symbol('shown');
    const hidden = Symbol('hidden');
    const source = { [shown]: 1 };
    Object.defineProperty(source, hidden, { value: 2, enumerable: false });
    const result = assign({}, source);
    expect(result[shown]).toBe(1);
    expect(hidden in result).toBe(false);
  });

  it('Class copies the members and statics without it', () => {
    const result = without(Object, ['getOwnPropertySymbols'], () => {
      const A = Class({ hello: () => 'hi' }, { a: 1 });
      const B = Class({ extends: A }, { b: 2 });
      return [new B().hello(), B.a, B.b];
    });
    expect(result).toEqual(['hi', 1, 2]);
  });
});

describe('IE 11: no Array.from', () => {
  it('takes an array-like, with and without a map function', () => {
    const result = without(Array, ['from'], () => [
      arrayFrom({ length: 2, 0: 'a', 1: 'b' }),
      arrayFrom({ length: 2, 0: 1, 1: 2 }, (x, i) => x * 10 + i)
    ]);
    expect(result).toEqual([
      ['a', 'b'],
      [10, 21]
    ]);
  });

  it('Matreshka.Array.from works on it', () => {
    const items = without(Array, ['from'], () => MatreshkaArray.from({ length: 1, 0: 5 }, (x) => x + 1).toJSON());
    expect(items).toEqual([6]);
  });
});

describe('IE 11: array methods it lacks', () => {
  it('a method the browser lacks is left out, fill stays', () => {
    const proto = {};
    for (const name of Object.getOwnPropertyNames(Array.prototype)) {
      if (name !== 'includes' && name !== 'at' && name !== 'fill' && name !== 'copyWithin') proto[name] = true;
    }
    const methods = createMethods(proto);
    expect('includes' in methods || 'at' in methods || 'copyWithin' in methods || 'copyWithin_' in methods).toBe(false);
    expect(typeof methods.fill).toBe('function');
    expect(typeof methods.fill_).toBe('function');
    expect(typeof methods.indexOf).toBe('function');
  });
});

describe('IE 11: no <template> content', () => {
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

  it('parses rows, cells, options and plain HTML through a wrapping element', () => {
    const tags = withoutTemplate(() =>
      [
        '<tr><td>1</td></tr>',
        ' <td>2</td> ',
        '<option>o</option>',
        '<b>b</b> text',
        'just text',
        '<THEAD></THEAD>'
      ].map((html) => parseHTML(html).map((node) => node.nodeName))
    );
    expect(tags).toEqual([['TR'], ['TD'], ['OPTION'], ['B', '#text'], ['#text'], ['THEAD']]);
  });

  it('renders table rows of a Matreshka.Array', () => {
    const tbody = document.createElement('tbody');
    const rows = withoutTemplate(() => {
      const list = new MatreshkaArray();
      list.itemRenderer = '<tr><td>{{name}}</td></tr>';
      list.bindNode('sandbox', tbody);
      list.push({ name: 'a' });
      return tbody.innerHTML;
    });
    expect(rows).toBe('<tr><td>a</td></tr>');
  });
});

describe('IE 11: msMatchesSelector, no closest', () => {
  it('matches falls back to msMatchesSelector, and is false without either', () => {
    const node = document.createElement('div');
    node.className = 'a';
    node.matches = undefined;
    node.msMatchesSelector = Element.prototype.matches;
    expect(matches(node, '.a')).toBe(true);
    expect(matches(document.createTextNode('x'), '.a')).toBe(false);
    expect(matches(document, '.a')).toBe(false);
  });

  it('a delegated listener on the document finds its target without closest', () => {
    const button = document.createElement('button');
    button.className = 'go';
    const span = document.createElement('span');
    button.appendChild(span);
    document.body.appendChild(button);
    const handler = vi.fn();
    without(Element.prototype, ['closest'], () => {
      listen(document, 'click', '.go', handler);
      span.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      unlisten(document, 'click', '.go', handler);
    });
    document.body.removeChild(button);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('parseForm checks fields with msMatchesSelector', () => {
    const form = document.createElement('form');
    form.innerHTML = '<input name="a" value="1">';
    const obj = {};
    without(Element.prototype, ['matches'], () => {
      Element.prototype.msMatchesSelector = Element.prototype.webkitMatchesSelector;
      try {
        parseForm(obj, form);
      } finally {
        delete Element.prototype.msMatchesSelector;
      }
    });
    expect(obj.a).toBe('1');
  });
});

describe('IE 11: small helpers', () => {
  it('is: NaN is NaN, 0 is not -0', () => {
    expect([is(NaN, NaN), is(0, -0), is(-0, -0), is(1, 1), is('a', 'b'), is({}, {})]).toEqual([
      true,
      false,
      true,
      true,
      false,
      false
    ]);
  });

  it('isInteger', () => {
    expect([1, 1.5, '1', Infinity, NaN, -3].map(isInteger)).toEqual([true, false, false, false, false, true]);
  });

  it('removeNode takes a node out of its parent, and skips a node without one', () => {
    const parent = document.createElement('div');
    const child = document.createElement('i');
    parent.appendChild(child);
    removeNode(child);
    removeNode(child);
    removeNode(null);
    expect(parent.childNodes.length).toBe(0);
  });
});

describe('IE 11: no Object.values', () => {
  it('objectValues gives the values in key order', () => {
    expect(objectValues({ a: 1, b: 2 })).toEqual([1, 2]);
    expect(objectValues({})).toEqual([]);
  });
});
