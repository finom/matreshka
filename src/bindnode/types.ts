// Types of the binding functions: what a node argument may be, the binding options, the forms bindNode takes.
import type { Binder, EventOptions } from '../types.js';

// a selector (custom ones included: :sandbox, :bound(KEY)), HTML, a node, window or anything array-like of nodes
export type NodeInput = string | Node | Window | ArrayLike<Node> | null | undefined;

// options of bindNode and the rest; custom keys reach the "bind" and "unbind" handlers
export interface BindNodeOptions extends EventOptions {
  // don't throw when no node is found
  optional?: boolean;
  // "a.b" is a key with a dot, not a path
  exactKey?: boolean;
  // unbindNode: deep: false treats "a.b" as a key with a dot
  deep?: boolean;
  // read the node on bind; by default only when the value is undefined
  getValueOnBind?: boolean;
  // write the value to the node on bind; by default only when the value is defined
  setValueOnBind?: boolean;
  debounceSetValue?: boolean;
  debounceGetValue?: boolean;
  debounceSetValueOnBind?: boolean;
  debounceGetValueOnBind?: boolean;
  debounceSetValueDelay?: number;
  debounceGetValueDelay?: number;
  // use the given binder as is, without the default binder of the node
  useExactBinder?: boolean;
}

// a node with its own binder, a value of the key-node map
export interface NodeWithBinder {
  node: NodeInput;
  binder?: Binder | null;
}

// bindNode(object, { key: node }) and unbindNode(object, { key: node })
export type KeyNodeMap = Record<string, NodeInput | NodeWithBinder | NodeWithBinder[]>;

// one item of bindNode(object, [{ key, node, binder, event }])
export interface BindingItem {
  key: string;
  node: NodeInput;
  binder?: Binder | null;
  event?: BindNodeOptions;
}

// one item of unbindNode(object, [{ key, node, event }]); no node unbinds every node of the key
export interface UnbindingItem extends Omit<BindingItem, 'node'> {
  node?: NodeInput | null;
}

// a deep binding ("a.b.c"); unbindNode removes its tree listener
export interface DeepBinding {
  key: string;
  deepPath: string[];
  $nodes: Node[];
  bindingSwitcher?: (changeEvent?: any) => void;
}

// bindOptionalNode sets this flag on bindNode right before calling it
export interface OptionalFlagHolder {
  temporaryOptionalFlag?: boolean;
}
