import input from './binders/input';
import textarea from './binders/textarea';
import select from './binders/select';
import progress from './binders/progress';
import output from './binders/output';

// defaultBinders collection by default contains only one function-checker
export default [
  (node) => {
    switch (node.tagName) {
      case 'INPUT':
        return input(node.type);
      case 'TEXTAREA':
        return textarea();
      case 'SELECT':
        return select(node.multiple);
      case 'PROGRESS':
        return progress();
      case 'OUTPUT':
        return output();
      default:
        return null;
    }
  }
];
