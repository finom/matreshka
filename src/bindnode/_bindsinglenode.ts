import type { AnyObject, Binder, Binding, BindingOptions, PropDef } from '../types.js';
import type { BindNodeOptions } from './types.js';
import type { NodeHandler } from './_createnodehandler.js';
import type { Debounced } from '../_helpers/debounce.js';
import lookForBinder from '../lookforbinder.js';
import createNodeHandler from './_createnodehandler.js';
import createObjectHandler from './_createobjecthandler.js';
import triggerOne from '../trigger/_triggerone.js';
import addListener from '../on/_addlistener.js';
import debounce from '../_helpers/debounce.js';
import forEach from '../_helpers/foreach.js';
import assign from '../_helpers/assign.js';
import is from '../_helpers/is.js';

const spaceReg = /\s+/;

// handles binding for single property & node
// the function is used at bindNode
interface SingleBindingData {
  binder: Binder;
  key: string;
  $nodes: Node[];
  node: Node;
  eventOptions: BindNodeOptions;
  propDef: PropDef;
}

export default function bindSingleNode(
  object: AnyObject,
  { binder: givenBinder, key, $nodes, node, eventOptions, propDef }: SingleBindingData
): void {
  const {
    silent,
    getValueOnBind,
    setValueOnBind,
    // TODO: We probably need some general flag to cancel or force debouncing
    // ... which overrides the following flags (something like debounceBinding)
    debounceSetValue = true,
    debounceGetValue = true,
    debounceSetValueOnBind = false,
    debounceGetValueOnBind = false,
    debounceSetValueDelay = 0,
    debounceGetValueDelay = 0,
    useExactBinder = false
  } = eventOptions;
  // create bindings array in property definition object
  propDef.bindings = propDef.bindings || [];
  const { bindings } = propDef;
  const bindingOptions: BindingOptions = {
    self: object,
    key,
    // the binder's functions get the current value, not the one at bind time
    get value() {
      return propDef.value;
    },
    $nodes,
    node
  };
  let isUndefined = typeof propDef.value === 'undefined';
  let objectHandler: Binding['objectHandler'];
  let nodeHandler: Binding['nodeHandler'];
  let syncNodeHandler: NodeHandler | undefined;
  let debouncedNodeHandler: Debounced<NodeHandler> | undefined;
  let debouncedObjectHandler: Debounced<(eventOptions?: BindNodeOptions) => void> | undefined;
  // what the node showed when a program write was scheduled, while that write waits
  let pendingWrite: { shown: unknown } | null = null;

  // the given binder extends the node's default binder, unless useExactBinder is on
  const defaultBinder = useExactBinder ? null : lookForBinder(node);
  const binder: Binder = defaultBinder ? assign({}, defaultBinder, givenBinder) : givenBinder;

  const { getValue, setValue, on, initialize } = binder;
  const readNode = () => getValue?.call(node, { ...bindingOptions, previousValue: propDef.value });

  // call binder.initialize
  if (initialize) {
    initialize.call(node, bindingOptions);
  }

  // add needed event handlers to given node when getValue is given
  if (getValue) {
    syncNodeHandler = createNodeHandler({
      object,
      key,
      node,
      propDef,
      binder,
      bindingOptions
    });

    if (debounceGetValue || debounceGetValueOnBind) {
      debouncedNodeHandler = debounce(syncNodeHandler, debounceGetValueDelay);
    }

    if (debounceGetValue) {
      nodeHandler = debouncedNodeHandler as Debounced<NodeHandler>;
    } else {
      nodeHandler = syncNodeHandler;
    }

    // TODO: Throw error when "on" and maybe other binder properties has wrong type
    if (typeof on === 'function') {
      on.call(node, nodeHandler, bindingOptions);
    } else if (typeof on === 'string') {
      // input from the node is newer than a program write still waiting for its debounce, so that write is dropped;
      // an event that leaves the node as it was (a Tab keyup on a checkbox) is not input, and the write goes ahead
      const handleNode = nodeHandler;
      nodeHandler = function nodeEventHandler(this: unknown, ...args: Parameters<NodeHandler>) {
        if (pendingWrite) {
          if (is(readNode(), pendingWrite.shown)) {
            return;
          }
          debouncedObjectHandler?.cancel();
        }
        return handleNode.apply(this, args);
      };
      forEach(on.split(spaceReg), (evtName) => node.addEventListener(evtName, nodeHandler as NodeHandler));
    }

    if ((isUndefined && getValueOnBind !== false) || getValueOnBind === true) {
      if (debounceGetValueOnBind) {
        (debouncedNodeHandler as Debounced<NodeHandler>)();
      } else {
        syncNodeHandler();
      }
    }

    isUndefined = typeof propDef.value === 'undefined';
  }

  // add needed event handlers to the object when setValue is given
  if (setValue) {
    const writeNode = createObjectHandler({
      node,
      propDef,
      binder,
      bindingOptions,
      eventOptions
    });
    const syncObjectHandler = (handlerEventOptions?: BindNodeOptions) => {
      pendingWrite = null;
      writeNode(handlerEventOptions);
    };

    if (debounceSetValue || debounceSetValueOnBind) {
      const debouncedWrite = debounce(syncObjectHandler, debounceSetValueDelay);
      debouncedObjectHandler = Object.assign(
        (handlerEventOptions?: BindNodeOptions) => {
          if (!pendingWrite && getValue) {
            pendingWrite = { shown: readNode() };
          }
          debouncedWrite(handlerEventOptions);
        },
        {
          cancel() {
            pendingWrite = null;
            debouncedWrite.cancel();
          }
        }
      );
    }

    if (debounceSetValue) {
      objectHandler = debouncedObjectHandler as Debounced<(eventOptions?: BindNodeOptions) => void>;
    } else {
      objectHandler = syncObjectHandler;
    }

    // TODO: Is it possible to get previous value of a property?
    addListener(object, `_change:bindings:${key}`, objectHandler, null, { skipChecks: true });

    if ((!isUndefined && setValueOnBind !== false) || setValueOnBind === true) {
      if (debounceSetValueOnBind) {
        (debouncedObjectHandler as Debounced<(eventOptions?: BindNodeOptions) => void>)();
      } else {
        syncObjectHandler();
      }
    }
  }

  // add binding data to bindings array
  bindings.push({
    on,
    node,
    binder,
    objectHandler,
    nodeHandler,
    syncNodeHandler,
    debouncedNodeHandler,
    debouncedObjectHandler,
    bindingOptions
  });

  const extendedEventOptions = {
    key,
    node,
    ...eventOptions
  };

  // DOM listeners ("click::x") follow the node even when the binding is silent
  triggerOne(object, `_bind:${key}`, extendedEventOptions);

  // fire events
  if (!silent) {
    triggerOne(object, `bind:${key}`, extendedEventOptions);
    triggerOne(object, 'bind', extendedEventOptions);
  }
}
