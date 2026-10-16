import type { Binder } from './types.js';
import input from './binders/input.js';
import textarea from './binders/textarea.js';
import select from './binders/select.js';
import progress from './binders/progress.js';
import output from './binders/output.js';

// returns a binder for a node, or nothing when it doesn't know the node; "this" is the node too
export type BinderChecker = (this: any, node: any) => Binder | null | undefined;

// defaultBinders collection by default contains only one function-checker
const defaultBinders: BinderChecker[] = [
  (node: HTMLElement) => {
    switch (node.tagName) {
      case 'INPUT':
        return input((node as HTMLInputElement).type);
      case 'TEXTAREA':
        return textarea();
      case 'SELECT':
        return select((node as HTMLSelectElement).multiple);
      case 'PROGRESS':
        return progress();
      case 'OUTPUT':
        return output();
      default:
        return null;
    }
  }
];

export default defaultBinders;
