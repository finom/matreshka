// converts HTML string to NodeList instance
export default function html2nodeList(givenHTML) {
  // wrapMap is taken from jQuery
  const wrapMap = {
    option: [1, '<select multiple="multiple">', '</select>'],
    legend: [1, '<fieldset>', '</fieldset>'],
    thead: [1, '<table>', '</table>'],
    tr: [2, '<table><tbody>', '</tbody></table>'],
    td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
    col: [2, '<table><colgroup>', '</colgroup></table>'],
    area: [1, '<map>', '</map>'],
    _: [0, '', '']
  };

  const html = givenHTML.replace(/^\s+|\s+$/g, '');
  let node = window.document.createElement('div');
  let i;

  wrapMap.optgroup = wrapMap.option;
  wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
  wrapMap.th = wrapMap.td;

  const ex = /<([\w:]+)/.exec(html);
  const wrapper = (ex && wrapMap[ex[1]]) || wrapMap._;

  node.innerHTML = wrapper[1] + html + wrapper[2];

  i = wrapper[0];

  while (i) {
    i -= 1;
    node = node.children[0];
  }

  return node.childNodes;
}
