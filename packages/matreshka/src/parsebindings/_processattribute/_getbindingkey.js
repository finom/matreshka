import parserData from '../_parserdata';
import defineHiddenContentProperty from './_definehiddencontentproperty';

// analyzes string and returns only one key which will be actually bound to an attribute
export default function getBindingKey({
  object,
  text // for example 'Hello, {{x}}'
}) {
  const { strictBindingReg, bindingReg } = parserData;
  const keys = [];

  let execResult;
  let key;

  strictBindingReg.lastIndex = 0;
  bindingReg.lastIndex = 0;

  // extract keys given in parser brackers
  // '{{x}} {{y}}' -> ['x', 'y']
  execResult = bindingReg.exec(text);
  while (execResult) {
    keys.push(execResult[1]);
    execResult = bindingReg.exec(text);
  }

  if (keys.length === 1 && strictBindingReg.test(text)) {
    // if there is only one key and if only binding substring is present in a text
    // in other words '{{x}}' is given instead of '{{x}} {{y}}' or '{{x}}foo'
    // then don't create computable property and use that key (eg 'x') for binding
    key = keys[0];
  } else {
    // create hidden computable property
    key = defineHiddenContentProperty({
      object,
      keys,
      text
    });
  }

  return key;
}
