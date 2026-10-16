// the brackets the bindings parser looks for
export interface ParserBrackets {
  left: string;
  right: string;
}

// brackets for bindings parser
const parserBrackets: ParserBrackets = {
  left: '{{',
  right: '}}'
};

export default parserBrackets;
