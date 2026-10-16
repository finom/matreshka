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
import matreshkaError from '../_helpers/matreshkaerror.js';
import forEach from '../_helpers/foreach.js';
import assign from '../_helpers/assign.js';

const spaceReg = /\s+/;

// handles binding for single property & node
// the function is used at bindNode
interface SingleBindingData {
  binder: Binder | null;
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
  let binder: Binder | undefined;
  let objectHandler: Binding['objectHandler'];
  let nodeHandler: Binding['nodeHandler'];
  let syncNodeHandler: NodeHandler | undefined;
  let debouncedNodeHandler: Debounced<NodeHandler> | undefined;
  let debouncedObjectHandler: Debounced<(eventOptions?: BindNodeOptions) => void> | undefined;

  // do not allow to bind more than 2 nodes to "sandbox" (for all nodes)
  // and "container" (for Matreshka.Array)
  if (bindings.length && (key === 'sandbox' || (object.isMatreshkaArray && key === 'container'))) {
    throw matreshkaError('binding:magic_props_nodes_length');
  }

  // get actual binder
  if (givenBinder !== null) {
    // by default binder passed to bindNode is extended by default binder
    // useExactBinder turns this behavior off
    if (useExactBinder) {
      binder = givenBinder;
    } else {
      // getting default binder
      const foundBinder = lookForBinder(node);

      // if default binder is found
      if (foundBinder) {
        // extend found binder by given binder
        if (givenBinder) {
          assign(foundBinder, givenBinder);
        }

        binder = foundBinder;
      } else {
        // default binder is not found
        binder = givenBinder || {};
      }
    }
  }

  // a null binder throws here, as before
  const { getValue, setValue, on, initialize } = binder as Binder;

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
      binder: binder as Binder,
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
      // input from the node is newer than a program write still waiting for its debounce, so that write is dropped
      const readNode = nodeHandler;
      nodeHandler = function nodeEventHandler(this: unknown, ...args: Parameters<NodeHandler>) {
        debouncedObjectHandler?.cancel();
        return readNode.apply(this, args);
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
    const syncObjectHandler = createObjectHandler({
      node,
      propDef,
      binder: binder as Binder,
      bindingOptions,
      eventOptions
    });

    if (debounceSetValue || debounceSetValueOnBind) {
      debouncedObjectHandler = debounce(syncObjectHandler, debounceSetValueDelay);
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
    binder: binder as Binder,
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
