// event names split by spaces outside a selector's parentheses, brackets and quotes; empty names are dropped
export default function splitNames(names: string): string[] {
  const result: string[] = [];
  let depth = 0;
  let quote = '';
  let current = '';
  for (let i = 0; i < names.length; i++) {
    const char = names[i];
    if (quote) {
      if (char === quote) quote = '';
    } else if (char === '"' || char === "'") quote = char;
    else if (char === '(' || char === '[') depth++;
    else if ((char === ')' || char === ']') && depth) depth--;
    else if (!depth && /\s/.test(char)) {
      if (current) result.push(current);
      current = '';
      continue;
    }
    current += char;
  }
  if (current) result.push(current);
  return result;
}

// "a.b@change:c" as its path and event name; an @ inside a DOM event's selector is not a path separator
export function splitDelegated(name: string): [string, string] | null {
  const at = name.indexOf('@');
  const selector = name.search(/::|\(/);
  return at > -1 && (selector === -1 || at < selector) ? [name.slice(0, at), name.slice(at + 1)] : null;
}
