import $ from 'src/_dom/mq';
import simulateClick from '../../helpers/simulateclick';

describe('mq events', () => {
  let testSandbox;
  let child1;
  let child2;
  let grandchild1;
  let handler;

  beforeEach(() => {
    testSandbox = window.document.createElement('div');

    testSandbox.innerHTML = `
            <div class="child1">
                <div class="grandchild1"></div>
            </div>
            <div class="child2"></div>
        `;

    child1 = testSandbox.querySelector('.child1');
    child2 = testSandbox.querySelector('.child2');
    grandchild1 = testSandbox.querySelector('.grandchild1');

    handler = vi.fn();
  });

  afterEach(() => {
    $([testSandbox, child1, child2, grandchild1]).off('click');
  });

  it('adds event listener', () => {
    $(testSandbox).on('click', handler);
    simulateClick(testSandbox);
    expect(handler).toHaveBeenCalled();
  });

  it('removes event listener (listener is specified)', () => {
    $(testSandbox).on('click', handler).off('click', handler);
    simulateClick(testSandbox);
    expect(handler).not.toHaveBeenCalled();
  });

  it('removes event listener (listener is not specified)', () => {
    $(testSandbox).on('click', handler).off('click');
    simulateClick(testSandbox);
    expect(handler).not.toHaveBeenCalled();
  });

  it('adds namespaced listener', () => {
    $(testSandbox).on('click.yo', handler);
    simulateClick(testSandbox);
    expect(handler).toHaveBeenCalled();
  });

  it('removes namespaced listener (listener is specified)', () => {
    $(testSandbox).on('click.yo', handler).off('click.yo', handler);
    simulateClick(testSandbox);
    expect(handler).not.toHaveBeenCalled();
  });

  it('removes namespaced listener (listener is not specified)', () => {
    $(testSandbox).on('click.yo', handler).off('click.yo');
    simulateClick(testSandbox);
    expect(handler).not.toHaveBeenCalled();
  });

  it('adds bubbling event listener', () => {
    $(testSandbox).on('click', handler);
    simulateClick(grandchild1);
    expect(handler).toHaveBeenCalled();
  });

  it('adds delegated event listener', () => {
    $(testSandbox).on('click', '.child1', handler);
    simulateClick(child1);
    expect(handler).toHaveBeenCalled();
  });

  it('adds delegated event listener (click on grandchildren)', () => {
    $(testSandbox).on('click', '.child1', handler);
    simulateClick(grandchild1);
    expect(handler).toHaveBeenCalled();
  });

  it('does not trigger when clicked on wrong child', () => {
    $(testSandbox).on('click', '.child2', handler);
    simulateClick(grandchild1);
    expect(handler).not.toHaveBeenCalled();
  });

  it('removes delegated event listener (selector and handler are specified)', () => {
    $(testSandbox).on('click', '.child1', handler).off('click', '.child1', handler);
    simulateClick(child1);
    expect(handler).not.toHaveBeenCalled();
  });

  it('removes delegated event listener (selector is specified, handler is not specified)', () => {
    $(testSandbox).on('click', '.child1', handler).off('click', '.child1');
    simulateClick(child1);
    expect(handler).not.toHaveBeenCalled();
  });

  it('removes delegated event listener (selector is not specified, handler is specified)', () => {
    $(testSandbox).on('click', '.child1', handler).off('click', handler);
    simulateClick(child1);
    expect(handler).not.toHaveBeenCalled();
  });

  it('removes delegated event listener (selector and handler are not specified)', () => {
    $(testSandbox).on('click', '.child1', handler).off('click');
    simulateClick(child1);
    expect(handler).not.toHaveBeenCalled();
  });

  it('stops propagation', () => {
    $(testSandbox).on('click', handler);
    $(child1).on('click', (evt) => evt.stopPropagation());
    simulateClick(child1);
    expect(handler).not.toHaveBeenCalled();
  });
});
