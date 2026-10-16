// Type-level checks of the public API; tsc runs them (tsconfig includes test), vitest doesn't.
import { expectTypeOf } from 'vitest';
import DefaultMatreshka, {
  bindNode,
  bindOptionalNode,
  bindSandbox,
  binders,
  calc,
  chain,
  Class,
  defaultBinders,
  instantiate,
  lookForBinder,
  Matreshka,
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
} from '../src/index.js';
import type { Binder as PublicBinder, BindNodeOptions as PublicBindNodeOptions } from '../src/index.js';
import BundledMatreshka from '../src/bundle.js';

const node = document.createElement('div');

// the default and the named export are the same class
expectTypeOf(DefaultMatreshka).toEqualTypeOf(Matreshka);

// statics: the object comes first and is returned
const plain = { a: 1, b: 2 };
expectTypeOf(Matreshka.bindNode(plain, 'a', node)).toEqualTypeOf(plain);
expectTypeOf(bindNode(plain, { a: node, b: { node: '.b', binder: binders.text() } })).toEqualTypeOf(plain);
expectTypeOf(bindNode(plain, [{ key: 'a', node }], { silent: true })).toEqualTypeOf(plain);
expectTypeOf(bindOptionalNode(plain, 'a', null)).toEqualTypeOf(plain);
expectTypeOf(unbindNode(plain, 'a')).toEqualTypeOf(plain);
expectTypeOf(bindSandbox(plain, node)).toEqualTypeOf(plain);
expectTypeOf(Matreshka.calc(plain, 'sum', ['a', 'b'], (a: number, b: number) => a + b)).toEqualTypeOf(plain);
expectTypeOf(calc(plain, { sum: { source: ['a', 'b'] } }, { debounceCalc: false })).toEqualTypeOf(plain);
expectTypeOf(Matreshka.on(plain, 'change:a', () => {}, true)).toEqualTypeOf(plain);
expectTypeOf(on(plain, { 'change:a': () => {} })).toEqualTypeOf(plain);
expectTypeOf(once(plain, 'change:a', () => {})).toEqualTypeOf(plain);
expectTypeOf(onDebounce(plain, 'change:a', () => {}, 100)).toEqualTypeOf(plain);
expectTypeOf(off(plain)).toEqualTypeOf(plain);
expectTypeOf(trigger(plain, 'foo', 1, 2)).toEqualTypeOf(plain);
expectTypeOf(set(plain, 'a', 3, { silent: true })).toEqualTypeOf(plain);
expectTypeOf(set(plain, { a: 3 })).toEqualTypeOf(plain);
expectTypeOf(remove(plain, ['a', 'b'])).toEqualTypeOf(plain);
expectTypeOf(mediate(plain, 'a', Number)).toEqualTypeOf(plain);
expectTypeOf(instantiate(plain, 'a', MatreshkaObject)).toEqualTypeOf(plain);
expectTypeOf(select(plain, '.x')).toEqualTypeOf<Node | null>();
expectTypeOf(selectAll(plain, '.x')).toEqualTypeOf<Node[]>();
expectTypeOf(parseBindings(plain, '<b>{{a}}</b>')).toEqualTypeOf<Node[]>();
expectTypeOf(Matreshka.Class).toEqualTypeOf(Class);
expectTypeOf(Matreshka.defaultBinders).toEqualTypeOf(defaultBinders);
expectTypeOf(Matreshka.lookForBinder).toEqualTypeOf(lookForBinder);
expectTypeOf(Matreshka.parserBrackets).toEqualTypeOf(parserBrackets);
expectTypeOf(Matreshka.chain).toEqualTypeOf(chain);
expectTypeOf(Matreshka.toMatreshka).toEqualTypeOf(toMatreshka);
expectTypeOf(Matreshka.Object).toEqualTypeOf(MatreshkaObject);
expectTypeOf(Matreshka.Array).toEqualTypeOf(MatreshkaArray);
// @ts-expect-error the object is required
Matreshka.bindNode('a', node);

// instance methods: the instance is the object, every method but the selectors returns it
const m = new Matreshka();
expectTypeOf(m.isMatreshka).toEqualTypeOf<true>();
expectTypeOf(m.nodes).toEqualTypeOf<Record<string, Node>>();
expectTypeOf(m.$nodes).toEqualTypeOf<Record<string, Node[]>>();
expectTypeOf(m.bindNode('a', node)).toEqualTypeOf<Matreshka>();
expectTypeOf(m.bindNode({ a: node }, null, { silent: true })).toEqualTypeOf<Matreshka>();
expectTypeOf(m.bindNode([{ key: 'a', node }])).toEqualTypeOf<Matreshka>();
expectTypeOf(m.select('.a')).toEqualTypeOf<Node | null>();
expectTypeOf(m.selectAll('.a')).toEqualTypeOf<Node[]>();
expectTypeOf(m.$('.a')).toEqualTypeOf<Node[]>();
expectTypeOf(m.parseBindings(node)).toEqualTypeOf<Node[]>();
m.bindOptionalNode('a', null)
  .unbindNode('a')
  .bindSandbox(node)
  .calc('sum', ['a', 'b'], (a: number, b: number) => a + b, { debounceCalc: false })
  .calc({ total: { source: { object: plain, key: ['a', 'b'] } } })
  .on('change:a', () => {}, true)
  .on('change:a', () => {}, {}, true)
  .on({ 'change:a': () => {} })
  .once('change:a', () => {})
  .onDebounce('change:a', () => {}, 100)
  .off('change:a')
  .off()
  .trigger('foo', 1, 2)
  .set('a', 1)
  .set({ a: 1, b: 2 }, { silent: true })
  .remove('a')
  .mediate('a', Number)
  .mediate({ b: String })
  .instantiate('obj', MatreshkaObject)
  .instantiate({ arr: MatreshkaArray });
// arbitrary properties
m.anything = 1;
expectTypeOf(m.anything).toBeAny();
// @ts-expect-error the key is required
m.bindNode();
// @ts-expect-error a string is not a handler
m.on('change:a', 'nope');

// subclasses
class App extends Matreshka {
  declare count: number;

  constructor() {
    super();
    this.bindNode('count', '.count')
      .calc('double', 'count', (count: number) => count * 2)
      .on('change:count', () => this.render());
    this.title = 'app';
  }

  render(): this {
    return this.set('rendered', true);
  }
}

const app = new App();
expectTypeOf(app.bindNode('a', node)).toEqualTypeOf<App>();
expectTypeOf(app.render()).toEqualTypeOf<App>();
expectTypeOf(app.count).toBeNumber();
expectTypeOf(App.bindNode(plain, 'a', node)).toEqualTypeOf(plain);
expectTypeOf(app).toMatchTypeOf<Matreshka>();

interface UserData {
  name: string;
  age: number;
}

class User extends MatreshkaObject<UserData> {
  constructor(data?: Partial<UserData>) {
    super(data);
    this.bindNode('name', '.name').addDataKeys('age');
  }
}

const user = new User({ name: 'Ann' });
expectTypeOf(user.setData('age', 30)).toEqualTypeOf<User>();
expectTypeOf(user.setData({ name: 'Bob' }, { replaceData: true })).toEqualTypeOf<User>();
expectTypeOf(user.keys()).toEqualTypeOf<Array<'name' | 'age'>>();
expectTypeOf(user.values()).toEqualTypeOf<Array<string | number>>();
expectTypeOf(user.entries()).toEqualTypeOf<Array<['name' | 'age', string | number]>>();
expectTypeOf(user.keyOf('Ann')).toEqualTypeOf<'name' | 'age' | null>();
expectTypeOf(user.toJSON()).toEqualTypeOf<UserData>();
expectTypeOf(user.isDataKey('name')).toBeBoolean();
expectTypeOf(user.removeDataKeys(['age'])).toEqualTypeOf<User>();
expectTypeOf(user.each((value, key) => [value, key])).toEqualTypeOf<User>();
expectTypeOf(user.calc('label', ['name', 'age'])).toEqualTypeOf<User>();
expectTypeOf(user.isMatreshka).toEqualTypeOf<true>();
for (const value of user) {
  expectTypeOf(value).toEqualTypeOf<string | number>();
}
// @ts-expect-error not a data key of UserData
user.setData('email', 'a@b.c');
// @ts-expect-error age is a number
user.setData('age', 'old');
// @ts-expect-error not a data key of UserData
user.addDataKeys('email');

// without type arguments, any data
const object = new MatreshkaObject({ a: 1 });
expectTypeOf(object.keys()).toEqualTypeOf<string[]>();
expectTypeOf(object.setData('b', 2)).toEqualTypeOf<MatreshkaObject>();
expectTypeOf(new Matreshka.Object()).toEqualTypeOf<MatreshkaObject>();
class Plain extends MatreshkaObject {}
expectTypeOf(new Plain().setData('x', 1)).toEqualTypeOf<Plain>();
expectTypeOf(MatreshkaObject.bindNode(plain, 'a', node)).toEqualTypeOf(plain);

// toMatreshka
expectTypeOf(toMatreshka([1, 2])).toEqualTypeOf<MatreshkaArray>();
expectTypeOf(toMatreshka({ a: 1 })).toEqualTypeOf<MatreshkaObject>();
expectTypeOf(toMatreshka(1)).toEqualTypeOf<number>();

// the script-tag bundle adds the router and the form parser
expectTypeOf(BundledMatreshka.bindNode(plain, 'a', node)).toEqualTypeOf(plain);
expectTypeOf(BundledMatreshka.initRouter).toBeFunction();
expectTypeOf(BundledMatreshka.parseForm).toBeFunction();
expectTypeOf(BundledMatreshka.Router).not.toBeAny();
// @ts-expect-error only the bundle has the router
Matreshka.initRouter;

// the public types are importable from the entry
const upperBinder: PublicBinder = {
  setValue(value) {
    this.textContent = String(value).toUpperCase();
  }
};
const syncOptions: PublicBindNodeOptions = { debounceSetValue: false };
expectTypeOf(upperBinder).toMatchTypeOf<PublicBinder>();
expectTypeOf(syncOptions).toMatchTypeOf<PublicBindNodeOptions>();
