import type { AnyObject, ObjectDef } from '../../types.js';
import defs from '../../_core/defs.js';

// tells whether a Matreshka.Object still holds given value under a data key other than exceptKey
export default function isHeldByDataKey(object: AnyObject, value: any, exceptKey?: string): boolean {
  // a Matreshka.Object always has a definition with data keys
  const { keys } = defs.get(object) as ObjectDef;
  return Object.keys(keys).some((key) => key !== exceptKey && object[key] === value);
}
