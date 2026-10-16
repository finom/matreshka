import defs from '../../_core/defs';

// tells whether a Matreshka.Object still holds given value under a data key other than exceptKey
export default function isHeldByDataKey(object, value, exceptKey) {
  const { keys } = defs.get(object);
  return Object.keys(keys).some((key) => key !== exceptKey && object[key] === value);
}
