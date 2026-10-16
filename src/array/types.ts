// Types of Matreshka.Array: the instance, the constructor and what its methods take.
import type { AnyObject, EventOptions, ObjectDef } from '../types.js';
import type Matreshka from '../matreshka/index.js';
import type { MatreshkaStatics } from '../matreshka/index.js';

// converts a value to an array item, called with the array as `this`
export type ItemMediator<Item = any> = (value: any, index: number) => Item;
export type ItemMediatorCallback<Item = any> = (
  this: MatreshkaArrayInstance<Item>,
  value: any,
  index: number,
  array: MatreshkaArrayInstance<Item>
) => Item;

// a class an array converts its items to; it gets the item data, the array and the index
export type ModelConstructor = new (data: any, parentArray: MatreshkaArrayInstance, index: number) => any;

// HTML, a selector of a node whose HTML is used, or a node
export type RendererValue = string | Node;
export type ItemRenderer<Item = any> = RendererValue | ((this: any, item: Item) => RendererValue);

// a node rendered for an item; the existence binder may replace it with a placeholder
export type RenderedNode = ChildNode & { __replacedByNode?: ChildNode };

// what render and afterrender handlers get
export interface ItemEventOptions {
  node: RenderedNode;
  self: AnyObject;
  parentArray: MatreshkaArrayInstance;
}

// options the methods take besides the event options any method takes
export interface ArrayMethodOptions extends EventOptions {
  dontRender?: boolean;
  skipItemMediator?: boolean;
  forceRerender?: boolean;
  moveSandbox?: boolean;
}

// options of events fired by a modifying method; they also drive rendering
export interface ArrayEventOptions extends ArrayMethodOptions {
  method: string;
  self?: MatreshkaArrayInstance;
  added: any[];
  removed: any[];
  [option: symbol]: any;
}

// what Matreshka keeps about an array or an item rendered by arrays
export interface ArrayDef extends ObjectDef {
  itemMediator?: ItemMediator;
  // array id -> the node rendered for this item
  renderedInArrays?: Record<string, RenderedNode>;
}

type Predicate<Item, Self> = (item: Item, index: number, array: Self) => unknown;
type Callback<Item, Self, Result> = (item: Item, index: number, array: Self) => Result;
type Reducer<Item, Self, Result> = (previous: Result, item: Item, index: number, array: Self) => Result;

// the instance members of Matreshka.Array
export interface MatreshkaArrayInstance<Item = any> extends Matreshka {
  [index: number]: Item;
  length: number;
  readonly isMatreshkaArray: true;
  Model?: ModelConstructor;
  itemRenderer?: ItemRenderer<Item> | null;
  // false turns rendering off
  renderIfPossible?: boolean;
  // a key of items, or '$index', whose value says which old item a new item updates in recreate
  trackBy?: string;
  // called with the array as this when an item is rendered
  onItemRender?(item: Item, eventOptions: ItemEventOptions): void;

  // mutating methods fire events and render; the "_" ones take event options as the last argument
  push(...items: Item[]): number;
  push_(...args: [...items: Item[], eventOptions: ArrayMethodOptions]): number;
  unshift(...items: Item[]): number;
  unshift_(...args: [...items: Item[], eventOptions: ArrayMethodOptions]): number;
  pop(): Item | undefined;
  pop_(eventOptions?: ArrayMethodOptions): Item | undefined;
  shift(): Item | undefined;
  shift_(eventOptions?: ArrayMethodOptions): Item | undefined;
  sort(compareFn?: (a: Item, b: Item) => number): this;
  sort_(compareFn: ((a: Item, b: Item) => number) | undefined, eventOptions: ArrayMethodOptions): this;
  sort_(eventOptions: ArrayMethodOptions): this;
  reverse(): this;
  reverse_(eventOptions?: ArrayMethodOptions): this;
  splice(start: number, deleteCount?: number, ...items: Item[]): MatreshkaArrayInstance<Item>;
  splice_(start: number, eventOptions: ArrayMethodOptions): MatreshkaArrayInstance<Item>;
  splice_(
    ...args: [start: number, deleteCount: number, ...items: Item[], eventOptions: ArrayMethodOptions]
  ): MatreshkaArrayInstance<Item>;
  fill(value: Item, start?: number, end?: number): this;
  fill_(value: Item, eventOptions: ArrayMethodOptions): this;
  fill_(value: Item, start: number, eventOptions: ArrayMethodOptions): this;
  fill_(value: Item, start: number, end: number, eventOptions: ArrayMethodOptions): this;
  copyWithin(target: number, start?: number, end?: number): this;
  copyWithin_(target: number, eventOptions: ArrayMethodOptions): this;
  copyWithin_(target: number, start: number, eventOptions: ArrayMethodOptions): this;
  copyWithin_(target: number, start: number, end: number, eventOptions: ArrayMethodOptions): this;

  // non-mutating methods; the ones returning an array return Matreshka.Array
  concat(...items: (Item | ArrayLike<Item>)[]): MatreshkaArrayInstance<Item>;
  map<Result>(callback: Callback<Item, this, Result>, thisArg?: any): MatreshkaArrayInstance<Result>;
  filter<Narrowed extends Item>(
    predicate: (item: Item, index: number, array: this) => item is Narrowed,
    thisArg?: any
  ): MatreshkaArrayInstance<Narrowed>;
  filter(predicate: Predicate<Item, this>, thisArg?: any): MatreshkaArrayInstance<Item>;
  slice(start?: number, end?: number): MatreshkaArrayInstance<Item>;
  forEach(callback: Callback<Item, this, void>, thisArg?: any): this;
  every(predicate: Predicate<Item, this>, thisArg?: any): boolean;
  some(predicate: Predicate<Item, this>, thisArg?: any): boolean;
  find(predicate: Predicate<Item, this>, thisArg?: any): Item | undefined;
  findIndex(predicate: Predicate<Item, this>, thisArg?: any): number;
  reduce(callback: Reducer<Item, this, Item>): Item;
  reduce<Result>(callback: Reducer<Item, this, Result>, initialValue: Result): Result;
  reduceRight(callback: Reducer<Item, this, Item>): Item;
  reduceRight<Result>(callback: Reducer<Item, this, Result>, initialValue: Result): Result;
  join(separator?: string): string;
  indexOf(searchElement: Item, fromIndex?: number): number;
  lastIndexOf(searchElement: Item, fromIndex?: number): number;
  includes(searchElement: Item, fromIndex?: number): boolean;
  // arrays, not iterators
  keys(): number[];
  values(): Item[];
  entries(): [number, Item][];
  [Symbol.iterator](): Iterator<Item>;

  // removes an item by index or by value; returns it, or null when nothing is removed
  pull(toRemove: number | Item, eventOptions?: ArrayMethodOptions): Item | null;
  recreate(newItems?: ArrayLike<Item>, eventOptions?: ArrayMethodOptions): this;
  // builds items from nodes found by the selector, or from the container's children
  restore(selector?: string | null, eventOptions?: ArrayMethodOptions): this;
  rerender(eventOptions?: ArrayMethodOptions): this;
  orderBy(
    keys: string | string[],
    orders?: 'asc' | 'desc' | ('asc' | 'desc')[],
    eventOptions?: ArrayMethodOptions
  ): this;
  mediateItem(mediator: ItemMediatorCallback<Item>): this;
  toJSON(recursive?: boolean): any[];
}

// Matreshka.Array itself: the constructor and its statics
export interface MatreshkaArrayConstructor extends MatreshkaStatics {
  // a single number is the length, as for native Array
  new <Item = any>(length: number): MatreshkaArrayInstance<Item>;
  new <Item = any>(...items: Item[]): MatreshkaArrayInstance<Item>;
  readonly prototype: MatreshkaArrayInstance;
  from<Item = any>(arrayLike: ArrayLike<Item> | Iterable<Item>): MatreshkaArrayInstance<Item>;
  from<Source, Item>(
    arrayLike: ArrayLike<Source> | Iterable<Source>,
    mapFn: (value: Source, index: number) => Item,
    thisArg?: any
  ): MatreshkaArrayInstance<Item>;
  of<Item = any>(...items: Item[]): MatreshkaArrayInstance<Item>;
}

// what the rendering functions get for one array method call
export interface RenderingArgs {
  self: MatreshkaArrayInstance;
  // the array's definition, given for speed
  selfDef: ArrayDef;
  eventOptions: ArrayEventOptions;
  container: Node;
}
