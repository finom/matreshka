import type { AnyObject, ObjectDef } from '../types.js';
import type { CalcEventOptions, CalcHandler, CalcSourceEntry } from './types.js';
import set from '../set.js';
import deepFind from '../_helpers/deepfind.js';
import forEach from '../_helpers/foreach.js';
import apply from '../_helpers/apply.js';
import assign from '../_helpers/assign.js';

// the flags meant for the source property only; "silent" reaches the target
const sourceOnlyOptions = ['protector', 'skipMediator', 'fromMediator', 'force', 'forceHTML', 'silentHTML'];

// creates event handler for target object which will be fired when a source is changed
export default function createCalcHandler({
  object,
  eventOptions,
  allSources,
  target,
  def,
  handler
}: {
  object: AnyObject;
  eventOptions: CalcEventOptions;
  allSources: CalcSourceEntry[];
  target: string;
  def: ObjectDef;
  handler: CalcHandler;
}): (changeEvent?: AnyObject) => void {
  // the id of the latest calculation; a promise of an older one doesn't set the target
  let latestCalcId = 0;

  return function calcHandler(changeEvent: AnyObject = {}) {
    const values: any[] = [];
    const protector: AnyObject = changeEvent.protector || {};
    const sourceEventOptions = assign({}, changeEvent);
    forEach(sourceOnlyOptions, (name) => {
      delete sourceEventOptions[name];
    });
    // a deep source hears skipCalc here; a plain one is skipped by set; a removed target is not written back
    if (changeEvent.skipCalc || !def.props[target]) {
      return;
    }

    const protectKey = `${def.id}:${target}`;
    const { promiseCalc } = eventOptions;

    // a calc already on this path is a cycle; a target reached by two paths (a diamond) runs on each
    if (protectKey in protector) {
      return;
    }

    const nextProtector = assign({}, protector);
    nextProtector[protectKey] = true;
    const setEventOptions = assign({ protector: nextProtector }, eventOptions, sourceEventOptions);

    forEach(allSources, ({ sourceObject, sourceKey, isDelegated }) => {
      const value = isDelegated ? deepFind(sourceObject, sourceKey) : sourceObject[sourceKey];
      values.push(value);
    });

    const targetValue = apply(handler, object, values);

    if (promiseCalc) {
      latestCalcId += 1;
      const calcId = latestCalcId;

      // a rejection is left unhandled, so the original error reaches the environment
      // a thenable needs no global Promise, which IE 11 lacks without a polyfill
      const promise =
        targetValue && typeof targetValue.then === 'function' ? targetValue : Promise.resolve(targetValue);
      promise.then((promiseResult: any) => {
        if (calcId === latestCalcId) {
          set(object, target, promiseResult, setEventOptions);
        }
      });
    } else {
      set(object, target, targetValue, setEventOptions);
    }
  };
}
