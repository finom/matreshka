import toMatreshka from 'src/tomatreshka';
import MatreshkaObject from 'src/object';
import MatreshkaArray from 'src/array';

describe('toMatreshka function', () => {
  it('converts to Matreshka via Matreshka.toMatreshka', () => {
    const obj = toMatreshka({
      a: 1,
      b: [
        1,
        2,
        3,
        {
          foo: 'bar'
        }
      ]
    });

    expect(obj.constructor).toEqual(MatreshkaObject);
    expect(obj.b.constructor).toEqual(MatreshkaArray);
    expect(obj.b[3].constructor).toEqual(MatreshkaObject);

    expect(obj.a).toEqual(1);
    expect(obj.b[0]).toEqual(1);
    expect(obj.b[1]).toEqual(2);
    expect(obj.b[2]).toEqual(3);
    expect(obj.b[3].foo).toEqual('bar');
  });
});
