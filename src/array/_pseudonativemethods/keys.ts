import type { MatreshkaArrayInstance } from '../types.js';

// returns indexes
export default function keys(this: MatreshkaArrayInstance): number[] {
  const { length } = this;
  const result: number[] = new Array(length);

  for (let i = 0; i < length; i++) {
    result[i] = i;
  }

  return result;
}
