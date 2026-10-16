import { html, text, prop, attr, className, dataset, style, display } from 'src/binders';
import bindNode from 'src/bindnode';

describe('Binders', () => {
  const noDebounceFlag = {
    debounceSetValue: false,
    debounceGetValue: false
  };

  const mappingFn = (value) => `mapping_${value}`;

  let obj;
  let node;

  beforeEach(() => {
    obj = {};
    node = window.document.createElement('div');
  });

  it('should bind prop', () => {
    node.someProp = 'foo';
    bindNode(obj, 'x', node, prop('someProp'), noDebounceFlag);
    expect(obj.x).toEqual('foo');
    obj.x = 'bar';
    expect(node.someProp).toEqual('bar');
  });

  it('should bind prop and use mapping function', () => {
    node.someProp = 'foo';
    bindNode(obj, 'x', node, prop('someProp', mappingFn), noDebounceFlag);
    expect(obj.x).toEqual('foo');
    obj.x = 'bar';
    expect(node.someProp).toEqual('mapping_bar');
  });

  it('should bind attr', () => {
    node.setAttribute('some-attribute', 'foo');
    bindNode(obj, 'x', node, attr('some-attribute'), noDebounceFlag);
    expect(obj.x).toEqual('foo');
    obj.x = 'bar';
    expect(node.getAttribute('some-attribute')).toEqual('bar');
  });

  it('should bind attr and use mapping function', () => {
    node.setAttribute('some-attribute', 'foo');
    bindNode(obj, 'x', node, attr('some-attribute', mappingFn), noDebounceFlag);
    expect(obj.x).toEqual('foo');
    obj.x = 'bar';
    expect(node.getAttribute('some-attribute')).toEqual('mapping_bar');
  });

  it('should bind html', () => {
    node.innerHTML = '<i>foo</i>';
    bindNode(obj, 'x', node, html(), noDebounceFlag);
    expect(obj.x).toEqual('<i>foo</i>');
    obj.x = '<b>bar</b>';
    expect(node.innerHTML).toEqual('<b>bar</b>');
  });

  it('should bind html and use mapping function', () => {
    node.innerHTML = '<i>foo</i>';
    bindNode(obj, 'x', node, html(mappingFn), noDebounceFlag);
    expect(obj.x).toEqual('<i>foo</i>');
    obj.x = '<b>bar</b>';
    expect(node.innerHTML).toEqual('mapping_<b>bar</b>');
  });

  it('should bind text', () => {
    node.textContent = '<i>foo</i>';
    bindNode(obj, 'x', node, text(), noDebounceFlag);
    expect(obj.x).toEqual('<i>foo</i>');
    obj.x = '<b>bar</b>';
    expect(node.textContent).toEqual('<b>bar</b>');
  });

  it('should bind text and use mapping function', () => {
    node.textContent = '<i>foo</i>';
    bindNode(obj, 'x', node, text(mappingFn), noDebounceFlag);
    expect(obj.x).toEqual('<i>foo</i>');
    obj.x = '<b>bar</b>';
    expect(node.textContent).toEqual('mapping_<b>bar</b>');
  });

  it('should bind style', () => {
    node.style.textAlign = 'center';
    bindNode(obj, 'x', node, style('textAlign'), noDebounceFlag);
    expect(obj.x).toEqual('center');
    obj.x = 'right';
    expect(node.style.textAlign).toEqual('right');
  });

  it('should bind style and use mapping function', () => {
    node.style.background = 'red';
    bindNode(
      obj,
      'x',
      node,
      style('background', (url) => `url("${url}")`),
      noDebounceFlag
    );
    expect(obj.x).toEqual('red');
    obj.x = 'cats.jpg';
    expect(node.style.background.replace(/"/g, '')).toEqual('url(cats.jpg)');
  });

  it('should bind dataset', () => {
    // @IE9
    node.setAttribute('data-foo', 'bar');
    bindNode(obj, 'x', node, dataset('foo'), noDebounceFlag);
    expect(obj.x).toEqual('bar');
    obj.x = 'baz';
    expect(node.getAttribute('data-foo')).toEqual('baz');
  });

  it('should bind dataset and use mapping function', () => {
    // @IE9
    node.setAttribute('data-foo', 'bar');
    bindNode(obj, 'x', node, dataset('foo', mappingFn), noDebounceFlag);
    expect(obj.x).toEqual('bar');
    obj.x = 'baz';
    expect(node.getAttribute('data-foo')).toEqual('mapping_baz');
  });

  it('should bind display', () => {
    node.style.display = 'none';
    bindNode(obj, 'x', node, display(true), noDebounceFlag);
    expect(obj.x).toEqual(false);
    obj.x = true;
    expect(node.style.display).toEqual('');

    node.style.display = 'none';
    bindNode(obj, 'y', node, display(false), noDebounceFlag);
    expect(obj.y).toEqual(true);
    obj.y = false;
    expect(node.style.display).toEqual('');
  });

  it('should bind className', () => {
    // @IE9
    node.className = 'foo';
    bindNode(obj, 'x', node, className('foo'), noDebounceFlag);
    expect(obj.x).toEqual(true);
    obj.x = false;
    expect(node.className).toEqual('');

    node.className = 'foo';
    bindNode(obj, 'x', node, className('foo', false), noDebounceFlag);
    expect(obj.x).toEqual(false);
    obj.x = true;
    expect(node.className).toEqual('');
  });
});
