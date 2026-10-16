import Matreshka from 'src';
import MatreshkaObject from 'src/object';

describe('Matreshka.Object class', () => {
  const methodNames = `_afterInit,
    setData,
    addDataKeys,
    removeDataKeys,
    isDataKey,
    keys,
    entries,
    values,
    keyOf,
    toJSON,
    each`.split(/\s*,\s*/);

  it('an instance should have isMatreshka=true and isMatreshkaObject=true properties', () => {
    const obj = new MatreshkaObject();
    expect(obj.isMatreshka).toEqual(true);
    expect(obj.isMatreshkaObject).toEqual(true);
  });

  it('includes all instance methods', () => {
    const obj = new MatreshkaObject();
    for (let i = 0; i < methodNames.length; i++) {
      const name = methodNames[i];
      expect(typeof obj[name]).toEqual('function', `${name} method is missing`);
    }

    expect(typeof obj.jset).toEqual('function', 'jset method is missing');
    expect(obj.jset).toEqual(obj.setData);
  });

  it('is a property of Matreshka', () => {
    expect(Matreshka.Object).toEqual(MatreshkaObject);
  });
});
