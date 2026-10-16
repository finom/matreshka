import MatreshkaObject from 'src/object';
import createSpy from '../../helpers/createspy';

describe('Matreshka.Object each', () => {
  it('is iterated via each', () => {
    const obj = new MatreshkaObject({
      a: 'foo',
      b: 'bar',
      c: 'baz'
    });
    const keys = ['a', 'b', 'c'];
    const values = ['foo', 'bar', 'baz'];
    const context = {};
    let i = 0;
    const callback = createSpy(function iterate(value, key, itSelf) {
      expect(value).toEqual(values[i]);
      expect(key).toEqual(keys[i]);
      expect(itSelf).toEqual(obj);
      expect(this).toEqual(context);
      i += 1;
    });

    obj.each(callback, context);

    expect(callback).toHaveBeenCalledTimes(3);
  });
});
