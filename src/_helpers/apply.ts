// a falsy context calls the function without `this`, as a plain call does
export default function apply(func: (...args: any[]) => any, context: any, args: ArrayLike<any>): any {
  return Reflect.apply(func, context || undefined, args);
}
