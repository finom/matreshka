import calc from '../../calc';
import parserData from '../_parserdata';
import escapeRegExp from '../_escaperegexp';

const hiddenPropertyPrefix = `${Math.random()}`.replace('0.', 'hidden');
let hiddenPropertyIndex = 0;

// defines hiden (without accessors) computed property
// that dependent on given properties ('keys') as text template describes
// for example if text='{{x}} blah {{y}}', x='foo', y='bar'
// then the new property should have value 'foo blah bar'
export default function defineHiddenContentProperty({ object, keys, text }) {
  const key = `${hiddenPropertyPrefix}${hiddenPropertyIndex}`;
  const regs = {};
  const { escLeftBracket, escRightBracket } = parserData;

  hiddenPropertyIndex += 1;

  // create and cache regular expressions which will help us to
  // change target property value quickly when sources are changed
  // TODO: We need better parser!
  for (let i = 0; i < keys.length; i++) {
    regs[keys[i]] = new RegExp(`${escLeftBracket}\\s*${escapeRegExp(keys[i])}\\s*${escRightBracket}`, 'g');
  }

  calc(
    object,
    key,
    keys,
    (...values) => {
      let result = text;

      // replace things like {{x}} by actual values; a function keeps "$&" and the like in a value literal
      for (let i = 0; i < keys.length; i++) {
        const value = values[i] === null || values[i] === undefined ? '' : `${values[i]}`;
        result = result.replace(regs[keys[i]], () => value);
      }

      return result;
    },
    {
      isTargetPropertyHidden: true,
      debounceCalc: false
    }
  );

  return key;
}
