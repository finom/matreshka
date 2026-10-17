// After `npm run build`: dist/ is ES5 (import and export aside; matreshka.min.mjs is left out, it needs ES modules) and
// reads no global or static member IE 11 lacks, except where the code checks for it first: each such name has a count
// below, and a new use fails until it is checked and counted. check-legacy-run.mjs catches prototype methods.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { parse } from 'acorn';
import { ancestor, full } from 'acorn-walk';

const fail = (message) => {
  console.error(`check-legacy: ${message}`);
  process.exit(1);
};

const files = [];
const walkDir = (dir) => {
  for (const name of readdirSync(dir)) {
    const file = path.join(dir, name);
    if (statSync(file).isDirectory()) walkDir(file);
    // matreshka.min.mjs needs a browser with ES modules, which IE 11 is not
    else if (name.endsWith('.js')) files.push(file);
  }
};
walkDir('dist');

// the script-tag files parse as ES5 scripts
for (const file of ['dist/matreshka.js', 'dist/matreshka.min.js']) {
  try {
    parse(readFileSync(file, 'utf8'), { ecmaVersion: 5, sourceType: 'script' });
  } catch (error) {
    fail(`${file} is not ES5: ${error.message}`);
  }
}

// the modules: ES5 inside, import and export around it
const es2015Nodes = new Set([
  'ArrowFunctionExpression',
  'ClassDeclaration',
  'ClassExpression',
  'TemplateLiteral',
  'TaggedTemplateExpression',
  'SpreadElement',
  'RestElement',
  'ObjectPattern',
  'ArrayPattern',
  'AssignmentPattern',
  'ForOfStatement',
  'MetaProperty',
  'Super',
  'YieldExpression'
]);
for (const file of files) {
  const ast = parse(readFileSync(file, 'utf8'), { ecmaVersion: 2015, sourceType: 'module' });
  full(ast, (node) => {
    const newer =
      es2015Nodes.has(node.type) ||
      (node.type === 'VariableDeclaration' && node.kind !== 'var') ||
      (node.type === 'Property' && (node.shorthand || node.method || node.computed)) ||
      ((node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') && node.generator) ||
      (node.type === 'Literal' && node.regex && /[uy]/.test(node.regex.flags));
    if (newer) fail(`${file}: ${node.type} at ${node.start}`);
  });
}

// the globals and static members IE 11 lacks, and how often the bundle reads each one behind a check (typeof Symbol,
// Array.from ? … : …)
const guarded = {
  globalThis: 2, // rollup's UMD wrapper
  Symbol: 7,
  Reflect: 4,
  Promise: 1, // promiseCalc with a value that isn't a promise
  'Array.from': 2,
  'Object.getOwnPropertySymbols': 4
};
const missingGlobals = [
  'Symbol',
  'Reflect',
  'Promise',
  'Proxy',
  'WeakSet',
  'WeakRef',
  'globalThis',
  'queueMicrotask',
  'structuredClone'
];
const missingStatics = {
  Object: [
    'assign',
    'is',
    'values',
    'entries',
    'fromEntries',
    'hasOwn',
    'getOwnPropertyDescriptors',
    'getOwnPropertySymbols'
  ],
  Array: ['from', 'of'],
  Number: ['isNaN', 'isInteger', 'isFinite', 'isSafeInteger', 'parseFloat', 'parseInt', 'EPSILON'],
  Math: ['trunc', 'sign', 'log10', 'log2', 'hypot', 'cbrt', 'expm1', 'fround', 'imul', 'clz32'],
  String: ['raw', 'fromCodePoint']
};
const source = readFileSync('dist/matreshka.js', 'utf8');
const ast = parse(source, { ecmaVersion: 5, sourceType: 'script', locations: true });
const declared = new Set();
full(ast, (node) => {
  if (node.type === 'VariableDeclarator') declared.add(node.id.name);
  if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
    if (node.id) declared.add(node.id.name);
    for (const param of node.params) declared.add(param.name);
  }
  if (node.type === 'CatchClause' && node.param) declared.add(node.param.name);
});
const found = Object.create(null);
const note = (name, node) => {
  found[name] ??= [];
  found[name].push(node.loc.start.line);
};
ancestor(ast, {
  MemberExpression(node) {
    if (node.computed || node.object.type !== 'Identifier' || declared.has(node.object.name)) return;
    if (
      Object.hasOwn(missingStatics, node.object.name) &&
      missingStatics[node.object.name].includes(node.property.name)
    ) {
      note(`${node.object.name}.${node.property.name}`, node);
    }
  },
  Identifier(node, _state, ancestors) {
    const parent = ancestors[ancestors.length - 2];
    const isName =
      (parent.type === 'MemberExpression' && parent.property === node && !parent.computed) ||
      (parent.type === 'Property' && parent.key === node && !parent.computed);
    if (!isName && missingGlobals.includes(node.name) && !declared.has(node.name)) note(node.name, node);
  }
});
const problems = [];
for (const name of Object.keys(found)) {
  if (found[name].length !== guarded[name]) {
    problems.push(
      `reads ${name} ${found[name].length} times (lines ${found[name].join(', ')}), ${guarded[name] ?? 0} expected`
    );
  }
}
for (const name of Object.keys(guarded)) {
  if (!found[name] && guarded[name]) problems.push(`no longer reads ${name}: update the count`);
}
if (problems.length) fail(`dist/matreshka.js ${problems.join('; ')}`);
console.log(`check-legacy: ${files.length} files are ES5`);
