// Property-based tests: each one runs the API on generated input and checks it against a plain model.
import fc from 'fast-check';
import Matreshka, { MatreshkaArray, MatreshkaObject, bindNode, binders, calc, mediate } from 'matreshka';
import { parseForm } from 'src/parse-form';
import { Router } from 'src/router';

const noDebounce = { debounceGetValue: false, debounceSetValue: false };

describe('properties', () => {
  it('bindNode keeps an input and a property equal in both directions', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (fromCode, fromUser) => {
        const obj = {};
        const input = document.createElement('input');
        bindNode(obj, 'x', input, null, noDebounce);

        obj.x = fromCode;
        expect(input.value).toBe(fromCode.replace(/[\r\n]/g, ''));

        input.value = fromUser;
        input.dispatchEvent(new Event('input'));
        expect(obj.x).toBe(input.value);
      })
    );
  });

  it('a text binding shows the property as it is', () => {
    fc.assert(
      fc.property(fc.string(), (value) => {
        const obj = {};
        const node = document.createElement('span');
        bindNode(obj, 'x', node, binders.text(), noDebounce);
        obj.x = value;
        expect(node.textContent).toBe(value);
      })
    );
  });

  it('calc keeps a sum equal to its sources after any assignments', () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(fc.constantFrom('a', 'b', 'c'), fc.integer())), (assignments) => {
        const obj = { a: 0, b: 0, c: 0 };
        calc(obj, 'sum', ['a', 'b', 'c'], (a, b, c) => a + b + c, { debounceCalc: false });
        for (const [key, value] of assignments) {
          obj[key] = value;
          expect(obj.sum).toBe(obj.a + obj.b + obj.c);
        }
      })
    );
  });

  it('mediate passes every value through the mediator', () => {
    fc.assert(
      fc.property(
        fc.array(fc.oneof(fc.string(), fc.double(), fc.boolean(), fc.constant(null), fc.constant(undefined))),
        (values) => {
          const obj = {};
          mediate(obj, 'x', (value) => String(value));
          for (const value of values) {
            obj.x = value;
            expect(obj.x).toBe(String(value));
          }
        }
      )
    );
  });

  it('Matreshka.Array matches a plain array and renders its items in order', () => {
    class Item extends MatreshkaObject {
      constructor(data) {
        super(data).on('render', () => this.bindNode('id', ':sandbox', binders.text(), noDebounce));
      }
    }
    class List extends MatreshkaArray {
      get Model() {
        return Item;
      }
      itemRenderer = '<span></span>';
      constructor() {
        super().bindNode('sandbox', document.createElement('div'));
      }
    }

    const command = fc.oneof(
      fc.record({ name: fc.constant('push'), ids: fc.array(fc.nat(), { maxLength: 3 }) }),
      fc.record({ name: fc.constant('unshift'), ids: fc.array(fc.nat(), { maxLength: 3 }) }),
      fc.record({ name: fc.constantFrom('pop', 'shift', 'reverse', 'sort') }),
      fc.record({
        name: fc.constant('splice'),
        start: fc.integer({ min: -5, max: 10 }),
        count: fc.nat({ max: 4 }),
        ids: fc.array(fc.nat(), { maxLength: 3 })
      })
    );

    fc.assert(
      fc.property(fc.array(command, { maxLength: 30 }), (commands) => {
        const list = new List();
        const model = [];
        const byId = (a, b) => a.id - b.id;
        for (const { name, ids = [], start, count } of commands) {
          const items = ids.map((id) => ({ id }));
          if (name === 'splice') {
            list.splice(start, count, ...items);
            model.splice(start, count, ...items);
          } else if (name === 'sort') {
            list.sort(byId);
            model.sort(byId);
          } else {
            list[name](...items);
            model[name](...items);
          }
          expect(Array.from(list, ({ id }) => id)).toEqual(model.map(({ id }) => id));
          expect(Array.from(list.nodes.sandbox.children, (node) => node.textContent)).toEqual(
            model.map(({ id }) => String(id))
          );
        }
      })
    );
  });

  it('parseForm binds every named field to the property of the same name', () => {
    const name = fc.stringMatching(/^[a-z][a-z0-9]{0,8}$/);
    fc.assert(
      fc.property(fc.uniqueArray(fc.tuple(name, fc.string()), { selector: ([key]) => key, maxLength: 6 }), (fields) => {
        const form = document.createElement('form');
        for (const [key, value] of fields) {
          const input = document.createElement('input');
          input.name = key;
          input.value = value;
          form.append(input);
        }
        const obj = {};
        parseForm(obj, form, null, noDebounce);
        for (const [key] of fields) expect(obj[key]).toBe(form.elements.namedItem(key).value);
      })
    );
  });

  it('the router reads back every value it writes to the URL', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), fc.string({ minLength: 1 }), (a, b) => {
        const obj = {};
        const router = new Router(null).subscribe(obj, 'a/b');
        obj.a = a;
        obj.b = b;
        const written = router.path;
        obj.a = 'other';
        router.path = written;
        expect(obj.a).toBe(a);
        expect(obj.b).toBe(b);
      })
    );
  });

  it('instances and plain objects behave the same under bindNode', () => {
    fc.assert(
      fc.property(fc.string(), (value) => {
        const instance = new Matreshka();
        const plain = {};
        const a = document.createElement('input');
        const b = document.createElement('input');
        instance.bindNode('x', a, null, noDebounce);
        bindNode(plain, 'x', b, null, noDebounce);
        instance.x = value;
        plain.x = value;
        expect(a.value).toBe(b.value);
      })
    );
  });
});
