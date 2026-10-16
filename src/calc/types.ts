import type { EventOptions } from '../types.js';

// a source of a calculated property: a key of the object itself ("a" or "a.b.c"), or keys of another object
export type CalcSource = string | { object: object; key: string | string[] };

// gets source values in source order and returns the target value (or a promise of it with promiseCalc)
export type CalcHandler = (this: any, ...values: any[]) => any;

// calc options; the other keys reach the change events of the target
export interface CalcEventOptions extends EventOptions {
  // calculate right away (default true)
  setOnInit?: boolean;
  // debounce the first calculation (default false)
  debounceCalcOnInit?: boolean;
  // debounce calculations on source changes (default true)
  debounceCalc?: boolean;
  debounceCalcDelay?: number;
  // a source key with dots is a key, not a path
  exactKey?: boolean;
  // the handler returns a promise; only the latest one sets the target
  promiseCalc?: boolean;
  // the target property gets no accessors (internal)
  isTargetPropertyHidden?: boolean;
}

// one target of the object form: calc(object, { target: { source, handler, event } }, eventOptions)
export interface CalcDefinition {
  source: CalcSource | CalcSource[];
  handler?: CalcHandler;
  event?: CalcEventOptions;
}

// a source as calc keeps it
export interface CalcSourceEntry {
  sourceKey: string;
  sourceObject: Record<PropertyKey, any>;
  isDelegated: boolean;
}
