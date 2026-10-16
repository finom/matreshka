import type { ObjectDef } from '../types.js';

// object -> its Matreshka definition (events, props, id)
export default new WeakMap<object, ObjectDef>();
