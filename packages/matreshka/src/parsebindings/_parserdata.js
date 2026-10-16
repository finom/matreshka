import calc from '../calc';
import parserBrackets from '../parserbrackets';
import escapeRegExp from './_escaperegexp';

const parserData = {};

// since Matreshka allows to change parser brackets via parserBrackets objects
// the parser needs to generate required regular expressions and escaped brackets every time
// when parseBindings is called
// to optimize this behavior parserData object is created
// it calculates needed data every time when parserBrackets are changed
// and when parseBindings function is called it uses previously generated regeps
// from parserData object
calc(
  parserData,
  {
    leftBracket: {
      source: {
        object: parserBrackets,
        key: 'left'
      }
    },
    rightBracket: {
      source: {
        object: parserBrackets,
        key: 'right'
      }
    },
    escLeftBracket: {
      source: 'leftBracket',
      handler: escapeRegExp
    },
    escRightBracket: {
      source: 'rightBracket',
      handler: escapeRegExp
    },
    bindingReg: {
      source: ['escLeftBracket', 'escRightBracket'],
      handler: (left, right) => new RegExp(`${left}\\s*(.+?)\\s*${right}`, 'g')
    },
    strictBindingReg: {
      source: ['escLeftBracket', 'escRightBracket'],
      handler: (left, right) => new RegExp(`^${left}\\s*(.+?)\\s*${right}$`, 'g')
    }
  },
  {
    debounceCalc: false // we need to get new regexps immediately when brackets are changed
  }
);

export default parserData;
