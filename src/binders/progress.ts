import type { Binder } from '../types.js';
import input from './input.js';

// returns a binder for textarea element
export default function progress(): Binder {
  return input();
}
