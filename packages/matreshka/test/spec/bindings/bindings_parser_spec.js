import parseBindings from 'src/parsebindings';
import bindNode from 'src/bindnode';
import parserBrackets from 'src/parserbrackets';

const noDebounceFlag = {
  debounceSetValue: false,
  debounceGetValue: false
};

function parse(html) {
  const node = window.document.createElement('div');
  node.innerHTML = html;
  return node.children[0];
}

describe('Bindings parser', () => {
  it('should parse inner content', () => {
    const node = parse('<span>{{x}}</span>');
    const obj = {};

    parseBindings(obj, node, noDebounceFlag);
    obj.x = 'foo';
    expect(node.textContent).toEqual(obj.x);
  });

  it('should parse inner content with spaces', () => {
    const node = parse('<span>{{  x  }}</span>');
    const obj = {};

    parseBindings(obj, node, noDebounceFlag);
    obj.x = 'foo';
    expect(node.textContent).toEqual(obj.x);
  });

  it('should parse inner content and keep node empty if property value is not given', () => {
    const node = parse('<span>{{x}}</span>');
    const obj = {};

    parseBindings(obj, node, noDebounceFlag);
    expect(node.textContent).toEqual('');
  });

  it('should bind complex inner content', () => {
    const node = parse('<span>{{x}} {{y}}</span>');
    const obj = {};

    parseBindings(obj, node, noDebounceFlag);
    obj.x = 'foo';
    obj.y = 'bar';
    expect(node.textContent).toEqual(`${obj.x} ${obj.y}`);
  });

  it('should bind attributes', () => {
    const node = parse('<a href="{{x}}"></a>');
    const obj = {};

    parseBindings(obj, node, noDebounceFlag);
    obj.x = 'bar';
    expect(node.getAttribute('href')).toEqual(obj.x);
  });

  it('should bind complex attributes', () => {
    const node = parse('<a href="{{ x }}/{{ y }}"></a>');
    const obj = {};

    parseBindings(obj, node, noDebounceFlag);
    obj.x = 'foo';
    obj.y = 'bar';
    expect(node.getAttribute('href')).toEqual(`${obj.x}/${obj.y}`);
  });

  it('should bind inner content in context of an object which has isMatreshka=true property', () => {
    const node = parse('<span>{{x}}</span>');
    const obj = { isMatreshka: true, nodes: {}, $nodes: {} };

    parseBindings.call(obj, node, noDebounceFlag);
    obj.x = 'foo';
    expect(node.textContent).toEqual(obj.x);
  });

  it('should bind input value', () => {
    const node = parse('<input value="{{x}}">');
    const obj = {};

    parseBindings(obj, node, noDebounceFlag);
    obj.x = 'foo';
    expect(node.value).toEqual(obj.x);
  });

  it('should bind input value with type=text attribute (bugfix)', () => {
    const node = parse('<input type="text" value="{{x}}">');
    const obj = {};

    parseBindings(obj, node, noDebounceFlag);
    obj.x = 'foo';
    expect(node.value).toEqual(obj.x);
  });

  it('should bind select value (bugfix)', () => {
    const node = parse(`<select value="{{x}}">
            <option selected value="bar">bar</option>
            <option value="foo">foo</option>
        </select>`);
    const obj = {};

    parseBindings(obj, node, noDebounceFlag);
    obj.x = 'foo';
    expect(node.value).toEqual(obj.x);
  });

  it('should bind complex input value', () => {
    const node = parse('<input value="{{x}} {{y}}">');
    const obj = {};

    parseBindings(obj, node, noDebounceFlag);
    obj.x = 'foo';
    obj.x = 'bar';
    // y is undefined, which shows as empty (BN-16)
    expect(node.value).toEqual('bar ');
  });

  it('should bind input=checkbox checked', () => {
    const node = parse('<input type="checkbox" checked="{{x}}">');
    const obj = {};

    parseBindings(obj, node, noDebounceFlag);
    obj.x = true;
    expect(node.checked).toEqual(obj.x);
  });

  it('should bind input=checkbox is not checked (bugfix)', () => {
    const node = parse('<input type="checkbox" checked="{{x}}">');
    const obj = {};

    parseBindings(obj, node, noDebounceFlag);
    obj.x = false;
    expect(node.checked).toEqual(obj.x);
  });

  it('should bind textarea value', () => {
    const node = parse('<textarea value="{{x}}"></textarea>');
    const obj = {};

    parseBindings(obj, node, noDebounceFlag);
    obj.x = 'foo';
    expect(node.value).toEqual(obj.x);
  });

  it(`shouldnt create additional properties
        (complex node values require to create hidden computable property)`, () => {
    const node = parse('<input value="{{x}} and {{y}}">');
    const obj = {};

    parseBindings(obj, node, noDebounceFlag);
    obj.x = 'foo';
    obj.y = 'bar';
    expect(node.value).toEqual(`${obj.x} and ${obj.y}`);
    expect(Object.keys(obj)).toEqual(['x', 'y']);
  });

  it('should bind nested nodes', () => {
    const node = parse(`
            <div>{{x}}
                <input value="{{y}}">
                <span>
                    <span>
                        <span data-qux="hey {{z}}"></span>
                    </span>
                </span>
            </div>
        `);
    const obj = {};
    parseBindings(obj, node, noDebounceFlag);
    obj.x = 'foo';
    obj.y = 'bar';
    obj.z = 'baz';

    expect(node.innerHTML.indexOf(obj.x)).toEqual(0);

    expect(node.querySelector('input').value).toEqual(obj.y);

    expect(node.querySelector('[data-qux]').getAttribute('data-qux')).toEqual(`hey ${obj.z}`);

    expect(Object.keys(obj).sort()).toEqual(['x', 'y', 'z']);
  });

  it('should bind nested nodes and nested properties', () => {
    const node = parse(`
            <div>{{a.b}}
                <input value="{{c.d}}">
                <span>
                    <span>
                        <span data-qux="hey {{e.f}}"></span>
                    </span>
                </span>
            </div>
        `);

    const obj = {
      a: { b: 1 },
      c: { d: 2 },
      e: { f: 2 }
    };

    parseBindings(obj, node, noDebounceFlag);

    obj.a.b = 'foo';
    obj.c.d = 'bar';
    obj.e.f = 'baz';

    expect(node.innerHTML.indexOf(obj.a.b)).toEqual(0);

    expect(node.querySelector('input').value).toEqual(obj.c.d);

    expect(node.querySelector('[data-qux]').getAttribute('data-qux')).toEqual(`hey ${obj.e.f}`);
  });

  it('works when brackets are redefined', () => {
    const node = parse('<input value="[[x]] bar">');
    const obj = {};

    parserBrackets.left = '[[';
    parserBrackets.right = ']]';

    parseBindings(obj, node, noDebounceFlag);
    obj.x = 'foo';
    expect(node.value).toEqual(`${obj.x} bar`);

    parserBrackets.left = '{{';
    parserBrackets.right = '}}';
  });

  it('accepts HTML', () => {
    const obj = {};
    const result = parseBindings(obj, '<span>{{x}}</span>', noDebounceFlag);
    obj.x = 'foo';

    expect(result[0].textContent).toEqual(obj.x);
  });

  it('accepts selector', () => {
    const obj = {};
    bindNode(obj, 'y', '<span>{{x}}</span>', noDebounceFlag);

    const result = parseBindings(obj, ':bound(y)', noDebounceFlag);

    obj.x = 'foo';

    expect(result[0].textContent).toEqual(obj.x);
  });
});
