/* global $ */
import mq from './mq';

// check existence of needed methods in $ global variable
// to use it for internal needs

const neededMethods = ['on', 'off', 'add'];

const globalDollar = typeof $ === 'function' ? $ : null;
let useGlobalDollar = true;

/* istanbul ignore if */
if (globalDollar) {
  const fn = globalDollar.fn || globalDollar.prototype;
  for (let i = 0; i < neededMethods.length; i++) {
    if (!fn[neededMethods[i]]) {
      useGlobalDollar = false;
      break;
    }
  }

  if (!globalDollar.parseHTML) {
    // Zepto doesn't include its own parseHTML
    // TODO: Assignment of parseHTML is side effect
    globalDollar.parseHTML = mq.parseHTML;
  }
} else {
  useGlobalDollar = false;
}

export default useGlobalDollar ? globalDollar : mq;
