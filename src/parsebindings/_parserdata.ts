import calc from '../calc/index.js';
import parserBrackets from '../parserbrackets.js';
import escapeRegExp from './_escaperegexp.js';

// the parser's brackets and the regular expressions made of them
export interface ParserData {
  leftBracket: string;
  rightBracket: string;
  escLeftBracket: string;
  escRightBracket: string;
  bindingReg: RegExp;
  strictBindingReg: RegExp;
}

// calc fills every field right away
const parserData = {} as ParserData;

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
      handler: (left: string, right: string) => new RegExp(`${left}\\s*(.+?)\\s*${right}`, 'g')
    },
    strictBindingReg: {
      source: ['escLeftBracket', 'escRightBracket'],
      handler: (left: string, right: string) => new RegExp(`^${left}\\s*(.+?)\\s*${right}$`, 'g')
    }
  },
  {
    debounceCalc: false // we need to get new regexps immediately when brackets are changed
  }
);

export default parserData;
