import MatreshkaArray from 'src/array';

describe('Matreshka.Array mediate item', () => {
  it('allows to set item mediator via mediateItem', () => {
    const arr = new MatreshkaArray('foo', 'bar');
    arr.mediateItem((value) => `x${value}`);

    expect(arr.toJSON(false)).toEqual(['xfoo', 'xbar']);

    arr.push('baz');

    expect(arr.toJSON(false)).toEqual(['xfoo', 'xbar', 'xbaz']);

    arr.splice(0, 0, 'qux');

    expect(arr.toJSON(false)).toEqual(['xqux', 'xfoo', 'xbar', 'xbaz']);
  });
});
