import $ from 'src/_dom/mq';

describe('mq.parseHTML', () => {
  it('parses HTML', () => {
    const result = $.parseHTML('<div></div><span></span>');

    expect(result.length).toEqual(2);
    expect(result[0].tagName).toEqual('DIV');
    expect(result[1].tagName).toEqual('SPAN');
  });

  it('parses contextual elements', () => {
    const result = $.parseHTML('<td></td><td></td>');

    expect(result.length).toEqual(2);
    expect(result[0].tagName).toEqual('TD');
    expect(result[1].tagName).toEqual('TD');
  });
});
