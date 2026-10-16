import type { MatreshkaArrayInstance } from '../types.js';

// returns values
export default function values(this: MatreshkaArrayInstance): any[] {
  const { length } = this;
  const result: any[] = new Array(length);

  for (let i = 0; i < length; i++) {
    result[i] = this[i];
  }

  return result;
}
