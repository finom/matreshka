// a falsy context calls the function without `this`, as a plain call does
export default function apply(func: (...args: any[]) => any, context: any, args: ArrayLike<any>): any {
  return Function.prototype.apply.call(func, context || undefined, args);
}
