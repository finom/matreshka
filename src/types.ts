// Types shared by the modules: the public ones (binders, event options) and the definition Matreshka keeps per object.

// any object Matreshka works with; its properties are read and written by name
export type AnyObject = Record<PropertyKey, any>;

export type Mediator = (value: any, previousValue: any, key: string, object: AnyObject) => any;

// what a binder's functions get as their second argument
export interface BindingOptions {
  self: AnyObject;
  key: string;
  value: any;
  $nodes: Node[];
  node: Node;
  [option: string]: any;
}

// a binder connects a property with a node: how the node changes, how to read it, how to write it
export interface Binder {
  on?: string | ((this: any, handler: (domEvent?: any) => void, options: BindingOptions) => void) | null;
  getValue?: ((this: any, options: BindingOptions & Record<string, any>) => any) | null;
  setValue?: ((this: any, value: any, options: BindingOptions) => void) | null;
  initialize?: ((this: any, options: BindingOptions) => void) | null;
  destroy?: ((this: any, options: BindingOptions) => void) | null;
}

// options passed to set, bindNode, trigger and the rest; custom keys reach the event handlers
export interface EventOptions {
  silent?: boolean;
  [option: string]: any;
}

// a context passed to on() becomes this
export type EventHandler = (this: any, ...args: any[]) => any;

// one listener in an object's definition
export interface EventEntry {
  callback: EventHandler & { _callback?: EventHandler; _kind?: string };
  context?: any;
  ctx: any;
  name: string;
  info: Record<string, any>;
}

// one node bound to a property
export interface Binding {
  node: Node;
  binder: Binder;
  objectHandler?: ((eventOptions?: EventOptions) => void) & { cancel?: () => void };
  nodeHandler?: ((domEvent?: any) => void) & { cancel?: () => void; disabled?: boolean };
  [field: string]: any;
}

// what Matreshka keeps about a property
export interface PropDef {
  value: any;
  mediator: Mediator | null;
  bindings: Binding[] | null;
  // the property's own getter and setter, kept when Matreshka defines its accessor
  accessor?: { get?: () => any; set?: (value: any) => void };
  // event options for a write through the accessor, while an array method runs
  setterOptions?: Record<string, any>;
  [field: string]: any;
}

// what Matreshka keeps about an object: its listeners and its properties
export interface ObjectDef {
  events: Record<string, EventEntry[]>;
  props: Record<string, PropDef>;
  id: number;
  [field: string]: any;
}
