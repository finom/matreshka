import Class from '../class.js';
import staticMembers from './_staticmembers.js';
import instanceMembers from './_prototype.js';
import initMK from '../_core/init.js';
import matreshkaError from '../_helpers/matreshkaerror.js';
import type { Binder, EventHandler, EventOptions, Mediator } from '../types.js';
import type { EventHandlerMap, EventNames } from '../on/types.js';
import type { BindingItem, BindNodeOptions, KeyNodeMap, NodeInput } from '../bindnode/types.js';
import type { CalcDefinition, CalcEventOptions, CalcHandler, CalcSource } from '../calc/types.js';
import type { InstantiatedClass, InstantiateUpdateFunction } from '../instantiate.js';
import type * as universalMethods from './_universalmethods.js';
import type * as bindersModule from '../binders/index.js';
import type defaultBinders from '../defaultbinders.js';
import type lookForBinder from '../lookforbinder.js';
import type parserBrackets from '../parserbrackets.js';
import type chain from '../chain.js';
import type { MatreshkaObjectConstructor } from '../object/index.js';
import type MatreshkaArray from '../array/index.js';
import type toMatreshka from '../tomatreshka.js';

// a Matreshka instance; the universal methods take this as the object, so every argument shifts by one
interface Matreshka {
  // users set any property
  [key: string]: any;

  readonly isMatreshka: true;
  // the first bound node of every key
  nodes: Record<string, Node>;
  // all bound nodes of every key
  $nodes: Record<string, Node[]>;

  on(names: EventNames, callback: EventHandler, triggerOnInit?: boolean, context?: any): this;
  on(names: EventNames, callback: EventHandler, context: object, triggerOnInit?: boolean): this;
  on(handlers: EventHandlerMap, triggerOnInit?: boolean, context?: any): this;
  on(handlers: EventHandlerMap, context: object, triggerOnInit?: boolean): this;

  once(names: EventNames, callback: EventHandler, context?: any): this;
  once(handlers: EventHandlerMap, context?: any): this;

  onDebounce(names: EventNames, callback: EventHandler, delay?: number, triggerOnInit?: boolean, context?: any): this;
  onDebounce(
    names: EventNames,
    callback: EventHandler,
    delay: number | undefined,
    context: object,
    triggerOnInit?: boolean
  ): this;
  onDebounce(handlers: EventHandlerMap, delay?: number, triggerOnInit?: boolean, context?: any): this;
  onDebounce(handlers: EventHandlerMap, delay: number | undefined, context: object, triggerOnInit?: boolean): this;

  // with no arguments, removes every listener added by on, once and onDebounce
  off(names?: EventNames | null, callback?: EventHandler | null, context?: any): this;
  off(handlers: EventHandlerMap, context?: any): this;

  trigger(names: string, ...args: any[]): this;

  calc(
    target: string,
    sources: CalcSource | CalcSource[],
    handler?: CalcHandler | null,
    eventOptions?: CalcEventOptions
  ): this;
  calc(definitions: Record<string, CalcDefinition>, eventOptions?: CalcEventOptions): this;

  bindNode(key: string | string[], node: NodeInput, binder?: Binder | null, eventOptions?: BindNodeOptions): this;
  bindNode(bindings: BindingItem[], eventOptions?: BindNodeOptions): this;
  bindNode(bindings: KeyNodeMap, binder?: Binder | null, eventOptions?: BindNodeOptions): this;

  // like bindNode, but a missing node is not an error
  bindOptionalNode(
    key: string | string[],
    node: NodeInput,
    binder?: Binder | null,
    eventOptions?: BindNodeOptions
  ): this;
  bindOptionalNode(bindings: BindingItem[], eventOptions?: BindNodeOptions): this;
  bindOptionalNode(bindings: KeyNodeMap, binder?: Binder | null, eventOptions?: BindNodeOptions): this;

  // no key (or null) removes the bindings of every key; no node removes every node of the key
  unbindNode(key?: string | string[] | null, node?: NodeInput, eventOptions?: BindNodeOptions): this;
  unbindNode(bindings: BindingItem[], eventOptions?: BindNodeOptions): this;
  unbindNode(bindings: KeyNodeMap, eventOptions?: BindNodeOptions): this;

  bindSandbox(node: NodeInput, eventOptions?: BindNodeOptions): this;

  // returns the parsed nodes
  parseBindings(nodes: NodeInput, eventOptions?: BindNodeOptions): Node[];

  select(selector: string): Node | null;
  selectAll(selector: string): Node[];
  // selectAll
  $(selector: string): Node[];

  set(key: string, value: any, eventOptions?: EventOptions): this;
  set(data: Record<string, any>, eventOptions?: EventOptions): this;

  remove(key: string | string[], eventOptions?: EventOptions): this;

  instantiate(
    key: string | string[],
    UsedClass: InstantiatedClass,
    updateFunction?: InstantiateUpdateFunction | null
  ): this;
  instantiate(classes: Record<string, InstantiatedClass>, updateFunction?: InstantiateUpdateFunction | null): this;

  mediate(key: string | string[], mediator: Mediator): this;
  mediate(mediators: Record<string, Mediator>): this;
}

// the statics every class made from Matreshka inherits; the universal methods take the object first
export interface MatreshkaStatics {
  on: typeof universalMethods.on;
  once: typeof universalMethods.once;
  onDebounce: typeof universalMethods.onDebounce;
  off: typeof universalMethods.off;
  trigger: typeof universalMethods.trigger;
  calc: typeof universalMethods.calc;
  bindNode: typeof universalMethods.bindNode;
  unbindNode: typeof universalMethods.unbindNode;
  bindOptionalNode: typeof universalMethods.bindOptionalNode;
  bindSandbox: typeof universalMethods.bindSandbox;
  parseBindings: typeof universalMethods.parseBindings;
  select: typeof universalMethods.select;
  selectAll: typeof universalMethods.selectAll;
  set: typeof universalMethods.set;
  remove: typeof universalMethods.remove;
  instantiate: typeof universalMethods.instantiate;
  mediate: typeof universalMethods.mediate;

  Class: typeof Class;
  binders: typeof bindersModule;
  defaultBinders: typeof defaultBinders;
  lookForBinder: typeof lookForBinder;
  parserBrackets: typeof parserBrackets;
  chain: typeof chain;
}

export interface MatreshkaConstructor extends MatreshkaStatics {
  new (): Matreshka;
  readonly prototype: Matreshka;

  // the package entry sets these, so Matreshka.Object and Matreshka.Array don't have them
  Object: MatreshkaObjectConstructor;
  Array: typeof MatreshkaArray;
  toMatreshka: typeof toMatreshka;
}

instanceMembers.constructor = function Matreshka(this: Matreshka) {
  if (!(this instanceof Matreshka)) {
    throw matreshkaError('common:call_class');
  }

  initMK(this);
};

const Matreshka = Class(instanceMembers, staticMembers) as unknown as MatreshkaConstructor;

// the value and the instance type under one name
export { Matreshka as default };
