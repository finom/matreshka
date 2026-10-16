import type { MatreshkaArrayInstance } from '../types.js';

// returns pairs like [index, value]
export default function values(this: MatreshkaArrayInstance): [number, any][] {
  const { length } = this;
  const result: [number, any][] = new Array(length);

  for (let i = 0; i < length; i++) {
    result[i] = [i, this[i]];
  }

  return result;
}
