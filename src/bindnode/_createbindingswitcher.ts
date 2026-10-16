import type { AnyObject, Binder } from '../types.js';
import type { BindNodeOptions, DeepBinding } from './types.js';
import type bindNodeFunction from './index.js';
import unbindNode from '../unbindnode/index.js';

interface BindingSwitcherData {
  object: AnyObject;
  deepBinding: DeepBinding;
  binder: Binder | null;
  eventOptions: BindNodeOptions;
  bindNode: typeof bindNodeFunction;
}

// what addTreeListener passes when a branch changes
interface BranchChangeEvent {
  value?: any;
  previousValue?: any;
  restPath?: string[];
}

// returns a function which re-adds binding when object branch is changed
// the function is called by bindNode when something like
// 'foo.bar.baz' is passed to it as key argument value
// this is one of the hardest things in the framework to understand
// deepBinding.$nodes is read on every call: unbindNode removes nodes from it
export default function createBindingSwitcher({
  object,
  deepBinding,
  binder,
  eventOptions,
  bindNode
}: BindingSwitcherData): (changeEvent?: BranchChangeEvent) => void {
  return function bindingSwitcher(changeEvent: BranchChangeEvent = {}) {
    const { deepPath, $nodes } = deepBinding;
    const deepPathLength = deepPath.length;
    const lastDeepPathItem = deepPath[deepPathLength - 1];
    const {
      value, // new value of a branch
      previousValue, // previous value of a branch
      restPath // path starting currently changed branch (passed by addTreeListener)
    } = changeEvent;
    // a forced set of a branch to the same object leaves the binding where it is
    if (restPath && value === previousValue) {
      return;
    }

    let target: any; // an object to call bindNode
    let previousTarget: any; // an object to call unbindNode

    if (value && typeof value === 'object' && restPath) {
      // if rest path is given and new value is an object
      target = value;
      for (let i = 0; i < restPath.length; i++) {
        target = target[restPath[i]];
        if (!target) {
          break;
        }
      }
    } else {
      // if rest path is not given
      target = object;
      for (let i = 0; i < deepPathLength - 1; i++) {
        target = target[deepPath[i]];
        if (!target) {
          break;
        }
      }
    }

    // if rest path is given and previous value is an object
    if (previousValue && typeof previousValue === 'object' && restPath) {
      previousTarget = previousValue;
      for (let i = 0; i < restPath.length; i++) {
        previousTarget = previousTarget[restPath[i]];
        if (!previousTarget) {
          break;
        }
      }
    }

    // remove binding for previously used object; first, so a target both share keeps its binding
    if (previousTarget && typeof previousTarget === 'object') {
      unbindNode(previousTarget, lastDeepPathItem, $nodes);
    }

    // add binding for new target
    if (target && typeof target === 'object') {
      bindNode(target, lastDeepPathItem, $nodes, binder, eventOptions);
    }
  };
}
