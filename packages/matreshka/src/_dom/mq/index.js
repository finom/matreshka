import Init from './_init';
import parseHTML from './parsehtml';
import on from './on';
import off from './off';
import add from './add';
import assign from '../../_helpers/assign';

// tiny jQuery replacement for Matreshka
export default function mq(selector, context) {
  return new Init(selector, context);
}

mq.parseHTML = parseHTML;

assign(Init.prototype, {
  on,
  off,
  add
});
