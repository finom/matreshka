import defs from '../_core/defs.js';

// a write to length, the method's own or a native method's, goes through length's accessor;
// it gets the method's options, so silent: true fires no change:length either
export default function withLengthOptions<R>(self: object, eventOptions: object | null | undefined, run: () => R): R {
  const propDef = defs.get(self)?.props.length;

  if (!propDef || !eventOptions) {
    return run();
  }

  const previous = propDef.setterOptions;
  propDef.setterOptions = eventOptions;

  try {
    return run();
  } finally {
    propDef.setterOptions = previous;
  }
}
