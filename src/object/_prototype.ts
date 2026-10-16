import _afterInit from './_afterinit.js';
import addDataKeys from './adddatakeys.js';
import removeDataKeys from './removedatakeys.js';
import isDataKey from './isdatakey.js';
import setData from './setdata.js';
import keyOf from './keyof.js';
import keys from './keys.js';
import values from './values.js';
import entries from './entries.js';
import toJSON from './tojson.js';
import each from './each.js';
import iterator from './iterator.js';
import type { AnyObject } from '../types.js';

// the members Class() puts on the prototype; extends and constructor join in ./index.js
const instanceMembers: AnyObject = {
  _afterInit,
  setData,
  addDataKeys,
  removeDataKeys,
  isDataKey,
  keys,
  values,
  entries,
  keyOf,
  toJSON,
  each,
  isMatreshkaObject: true,
  jset: setData, // alias
  [Symbol.iterator]: iterator
};

export default instanceMembers;
