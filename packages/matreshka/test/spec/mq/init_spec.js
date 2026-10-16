import $ from 'src/_dom/mq';

describe('mq initialization', () => {
  let testSandbox;

  beforeEach(() => {
    testSandbox = window.document.createElement('div');

    testSandbox.innerHTML = `
            <div class="test">
                <div class="test-1"></div>
                <div class="test-2"></div>
                <div class="test-3"></div>
            </div>
        `;
  });

  it('accepts window', () => {
    const result = $(window);
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual(window);
  });

  it('accepts document', () => {
    const result = $(window.document);
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual(window.document);
  });

  it('parses HTML', () => {
    const result = $('<div></div><span></span>');

    expect(result.length).toEqual(2);
    expect(result[0].tagName).toEqual('DIV');
    expect(result[1].tagName).toEqual('SPAN');
  });

  it('converts array-like', () => {
    const children = testSandbox.querySelectorAll('*');
    const result = $(children);

    expect(children.length).toEqual(result.length);

    for (let i = 0; i < children.length; i++) {
      expect(children[i]).toEqual(result[i]);
    }
  });

  it('converts one element', () => {
    const element = window.document.querySelector('*');
    const result = $(element);

    expect(result.length).toEqual(1);
    expect(element).toEqual(result[0]);
  });

  it('uses context', () => {
    expect($('.test-1', testSandbox).length).toEqual(1);
  });

  it('does not use wrong context', () => {
    expect($('.test-1', '.wrong-context').length).toEqual(0);
  });

  it('allows to pass null', () => {
    expect($(null).length).toEqual(0);
  });

  it('allows to pass nothing', () => {
    expect($().length).toEqual(0);
  });
});
