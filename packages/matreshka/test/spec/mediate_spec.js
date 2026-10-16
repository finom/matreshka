import mediate from 'src/mediate';

describe('mediate', () => {
  it('mediates', () => {
    const obj = {};

    mediate(obj, 'a', (v) => Number(v));
    mediate(obj, ['b', 'c'], (v) => Number(v));

    obj.a = obj.b = obj.c = '123';

    expect(typeof obj.a).toEqual('number');
    expect(typeof obj.b).toEqual('number');
    expect(typeof obj.c).toEqual('number');
  });

  it('mediates in context of an object which has isMatreshka=true property', () => {
    const obj = { isMatreshka: true };

    mediate.call(obj, 'a', (v) => Number(v));
    mediate.call(obj, ['b', 'c'], (v) => Number(v));

    obj.a = obj.b = obj.c = '123';

    expect(typeof obj.a).toEqual('number');
    expect(typeof obj.b).toEqual('number');
    expect(typeof obj.c).toEqual('number');
  });

  it('mediates using key-mediator object', () => {
    const obj = {};

    mediate(obj, {
      a: (v) => Number(v),
      b: (v) => Number(v)
    });

    obj.a = obj.b = '123';

    expect(typeof obj.a).toEqual('number');
    expect(typeof obj.b).toEqual('number');
  });
});
