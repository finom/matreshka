import type { AnyObject, ObjectDef } from '../types.js';
import type { CalcEventOptions, CalcHandler, CalcSourceEntry } from './types.js';
import set from '../set.js';
import deepFind from '../_helpers/deepfind.js';
import forEach from '../_helpers/foreach.js';
import apply from '../_helpers/apply.js';

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
    // flags meant for the source property don't apply to the target ("silent" does)
    const {
      protector = {},
      skipMediator,
      fromMediator,
      force,
      forceHTML,
      silentHTML,
      ...sourceEventOptions
    } = changeEvent;
    const protectKey = `${def.id}:${target}`;
    const { promiseCalc } = eventOptions;
    const setEventOptions = {
      protector,
      ...eventOptions,
      ...sourceEventOptions
    };

    if (protectKey in protector) {
      return;
    }

    protector[protectKey] = true;

    forEach(allSources, ({ sourceObject, sourceKey, isDelegated }) => {
      const value = isDelegated ? deepFind(sourceObject, sourceKey) : sourceObject[sourceKey];
      values.push(value);
    });

    const targetValue = apply(handler, object, values);

    if (promiseCalc) {
      latestCalcId += 1;
      const calcId = latestCalcId;

      // a rejection is left unhandled, so the original error reaches the environment
      const promise = targetValue instanceof Promise ? targetValue : Promise.resolve(targetValue);
      promise.then((promiseResult) => {
        if (calcId === latestCalcId) {
          set(object, target, promiseResult, setEventOptions);
        }
      });
    } else {
      set(object, target, targetValue, setEventOptions);
    }
  };
}
