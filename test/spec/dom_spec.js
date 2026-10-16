import { listen, parseHTML, toNodes, uniqueNodes, unlisten } from 'src/_dom';
import simulateClick from '../helpers/simulateclick';

describe('DOM helpers', () => {
  let root;
  let child1;
  let child2;
  let grandchild1;
  let handler;

  beforeEach(() => {
    document.body.innerHTML = `
      <div class="root">
        <div class="child1"><div class="grandchild1"></div></div>
        <div class="child2"><input class="field"></div>
      </div>
      <div class="child1 outside"></div>`;
    root = document.querySelector('.root');
    child1 = root.querySelector('.child1');
    child2 = root.querySelector('.child2');
    grandchild1 = root.querySelector('.grandchild1');
    handler = vi.fn();
  });

  describe('toNodes', () => {
    it('gives an empty array for nothing', () => {
      expect(toNodes()).toEqual([]);
      expect(toNodes(null)).toEqual([]);
      expect(toNodes('')).toEqual([]);
    });

    it('selects by selector', () => {
      expect(toNodes('.child1')).toEqual([child1, document.querySelector('.outside')]);
    });

    it('parses HTML', () => {
      const nodes = toNodes('<b>1</b><i>2</i>');
      expect(nodes.map((node) => node.tagName)).toEqual(['B', 'I']);
    });

    it('wraps a node and window', () => {
      expect(toNodes(child1)).toEqual([child1]);
      expect(toNodes(window)).toEqual([window]);
    });

    it('takes anything array-like', () => {
      expect(toNodes(root.querySelectorAll('div'))).toEqual([child1, grandchild1, child2]);
      expect(toNodes({ 0: child1, length: 1 })).toEqual([child1]);
    });

    it('wraps any other object', () => {
      const object = {};
      expect(toNodes(object)).toEqual([object]);
    });
  });

  describe('parseHTML', () => {
    it.each([
      ['<tr><td>1</td></tr>', 'TR'],
      ['<td>1</td>', 'TD'],
      ['<option>1</option>', 'OPTION'],
      ['<col>', 'COL'],
      ['  <li>1</li>  ', 'LI']
    ])('parses %s', (html, tagName) => {
      expect(parseHTML(html)[0].tagName).toBe(tagName);
    });

    it('keeps text nodes between elements', () => {
      expect(parseHTML('<b>1</b> <i>2</i>').length).toBe(3);
    });
  });

  it('uniqueNodes keeps the first occurrence of each node, in order', () => {
    expect(uniqueNodes([child1, child2], [child2, grandchild1], new Set([child1]))).toEqual([
      child1,
      child2,
      grandchild1
    ]);
  });

  describe('listen and unlisten', () => {
    it('adds and removes a listener', () => {
      listen(root, 'click', null, handler);
      simulateClick(grandchild1);
      unlisten(root, 'click', null, handler);
      simulateClick(grandchild1);
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('adds the same listener once', () => {
      listen(root, 'click', null, handler);
      listen(root, 'click', undefined, handler);
      simulateClick(root);
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('takes several names', () => {
      listen(root, 'click keyup', null, handler);
      simulateClick(root);
      root.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
      unlisten(root, 'click keyup', null, handler);
      simulateClick(root);
      expect(handler).toHaveBeenCalledTimes(2);
    });

    it('delegates to a selector, also for a click on a descendant', () => {
      listen(root, 'click', '.child1', handler);
      simulateClick(child1);
      simulateClick(grandchild1);
      simulateClick(child2);
      expect(handler).toHaveBeenCalledTimes(2);
      expect(handler.mock.contexts[0]).toBe(root);
    });

    it('matches the selector only inside the node', () => {
      listen(document.body, 'click', '.root .child1', handler);
      listen(child2, 'click', '.root .field', vi.fn());
      simulateClick(child1);
      expect(handler).toHaveBeenCalledTimes(1);
      const inner = vi.fn();
      listen(child1, 'click', '.root .grandchild1', inner);
      simulateClick(grandchild1);
      expect(inner).not.toHaveBeenCalled();
    });

    it('takes a selector list', () => {
      listen(root, 'click', '.child1, .child2', handler);
      simulateClick(child1);
      simulateClick(child2);
      expect(handler).toHaveBeenCalledTimes(2);
    });

    it('removes only the listener with the same selector', () => {
      const other = vi.fn();
      listen(root, 'click', '.child1', handler);
      listen(root, 'click', '.child2', other);
      unlisten(root, 'click', '.child1', handler);
      unlisten(root, 'click', '.child2', handler);
      simulateClick(child1);
      simulateClick(child2);
      expect(handler).not.toHaveBeenCalled();
      expect(other).toHaveBeenCalledTimes(1);
    });

    it('catches delegated focus, which does not bubble', () => {
      listen(root, 'focus', '.field', handler);
      root.querySelector('.field').dispatchEvent(new FocusEvent('focus'));
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('ignores unlisten on a node without listeners', () => {
      expect(() => unlisten(child2, 'click', null, handler)).not.toThrow();
    });
  });
});
