import input from './input';

// returns a binder for textarea element
export default function textarea() {
  // textarea behaves just like text input
  return input('text');
}
