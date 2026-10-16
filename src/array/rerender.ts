import syncFields from './_syncfields.js';
import processRendering from './_processrendering/index.js';
import type { ArrayMethodOptions, MatreshkaArrayInstance } from './types.js';

// rerenders not rendered items in an array
// force rerender when forceRerender event option is truthy
export default function rerender(
  this: MatreshkaArrayInstance,
  eventOptions: ArrayMethodOptions = {}
): MatreshkaArrayInstance {
  syncFields(this);
  const { renderIfPossible = true } = this;
  if (renderIfPossible) {
    processRendering({
      self: this,
      eventOptions: {
        method: 'rerender',
        added: [],
        removed: [],
        ...eventOptions
      }
    });
  }

  return this;
}
