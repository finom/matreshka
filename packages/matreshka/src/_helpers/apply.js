export default function apply(func, context, args) {
  if (context) {
    switch (args.length) {
      case 0:
        return func.call(context);
      case 1:
        return func.call(context, args[0]);
      case 2:
        return func.call(context, args[0], args[1]);
      case 3:
        return func.call(context, args[0], args[1], args[2]);
      case 4:
        return func.call(context, args[0], args[1], args[2], args[3]);
      default:
        return func.apply(context, args);
    }
  }

  switch (args.length) {
    case 0:
      return func();
    case 1:
      return func(args[0]);
    case 2:
      return func(args[0], args[1]);
    case 3:
      return func(args[0], args[1], args[2]);
    case 4:
      return func(args[0], args[1], args[2], args[3]);
    default:
      return func.apply(undefined, args);
  }
}
