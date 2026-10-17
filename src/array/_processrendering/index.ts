import defs from '../../_core/defs.js';
import matreshkaError from '../../_helpers/matreshkaerror.js';
import processPush from './processpush.js';
import processUnshift from './processunshift.js';
import processRecreate from './processrecreate.js';
import processSort from './processsort.js';
import processRemove from './processremove.js';
import processRerender from './processrerender.js';
import processSpliceAdd from './processspliceadd.js';
import type { ArrayDef, ArrayEventOptions, MatreshkaArrayInstance } from '../types.js';

// the containers an array has rendered into: a forced rerender takes old nodes out of these, and leaves a node
// the user moved elsewhere
export function addContainer(selfDef: ArrayDef, container: Node): void {
  selfDef.containers ??= new WeakSet();
  selfDef.containers.add(container);
}

// makes possible to render array items based on a name of called method
export default function processRendering({
  self,
  eventOptions
}: {
  self: MatreshkaArrayInstance;
  eventOptions: ArrayEventOptions;
}): void {
  const { method, added, removed } = eventOptions;
  // nodes object always exist at Matreshka instances
  const container: Node | undefined = self.nodes.container || self.nodes.sandbox;
  const selfDef = defs.get(self) as ArrayDef;

  if (!container) {
    return;
  }

  addContainer(selfDef, container);

  switch (method) {
    case 'fill':
    case 'copyWithin':
      throw matreshkaError('array:method_compat_renderer', { method });
    case 'push':
      processPush({
        self,
        selfDef,
        eventOptions,
        container
      });
      break;
    case 'unshift':
      processUnshift({
        self,
        selfDef,
        eventOptions,
        container
      });
      break;
    case 'pull':
    case 'pop':
    case 'shift':
      processRemove({
        self,
        selfDef,
        eventOptions,
        container
      });
      break;
    case 'sort':
    case 'reverse':
      processSort({
        self,
        selfDef,
        eventOptions,
        container
      });
      break;
    case 'rerender':
      processRerender({
        self,
        selfDef,
        eventOptions,
        container
      });
      break;
    case 'recreate':
      processRecreate({
        self,
        selfDef,
        eventOptions,
        container
      });
      break;
    case 'splice':
      if (added.length) {
        processSpliceAdd({
          self,
          selfDef,
          eventOptions,
          container
        });
      }

      if (removed.length) {
        processRemove({
          self,
          selfDef,
          eventOptions,
          container
        });
      }

      break;
  }
}
