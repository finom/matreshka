import MatreshkaObject from 'src/object';
import createSpy from '../../helpers/createspy';

describe('Matreshka.Object data keys', () => {
  it('the class accepts an object as an argument', () => {
    const obj = new MatreshkaObject({
      a: 1
    });

    expect(obj.keys()).toEqual(['a']);
  });

  it('sets data via setData', () => {
    const obj = new MatreshkaObject({
      a: 1
    });
    obj.setData('b', 2);
    expect(obj.a).toEqual(1);
    expect(obj.b).toEqual(2);
    expect(obj.keys()).toEqual(['a', 'b']);
  });

  it('replaces data via setData and replaceData=true', () => {
    const obj = new MatreshkaObject({
      a: 1
    });
    obj.setData('b', 2, {
      replaceData: true
    });

    expect(obj.a).toEqual(1);
    expect(obj.b).toEqual(2);
    expect(obj.keys()).toEqual(['b']);
  });

  it('allows to pass key-value object to setData', () => {
    const obj = new MatreshkaObject({
      a: 1
    });

    obj.setData({
      b: 2,
      c: 3
    });
    expect(obj.a).toEqual(1);
    expect(obj.b).toEqual(2);
    expect(obj.c).toEqual(3);
    expect(obj.keys()).toEqual(['a', 'b', 'c']);
  });

  it('allows to pass key-value object and replace data via setData and replaceData=true', () => {
    const obj = new MatreshkaObject({
      a: 1
    });

    obj.setData(
      {
        b: 2,
        c: 3
      },
      {
        replaceData: true
      }
    );

    expect(obj.a).toEqual(1);
    expect(obj.b).toEqual(2);
    expect(obj.c).toEqual(3);
    expect(obj.keys()).toEqual(['b', 'c']);
  });

  it('adds data keys', () => {
    const obj = new MatreshkaObject({
      a: 1
    });
    obj.addDataKeys('c', 'd');
    obj.addDataKeys(['e', 'f']);
    expect(obj.keys()).toEqual(['a', 'c', 'd', 'e', 'f']);
  });

  it('removes data keys', () => {
    const obj = new MatreshkaObject({
      a: 1
    });
    obj.addDataKeys('c', 'd');
    obj.addDataKeys(['e', 'f']);
    obj.removeDataKeys('c', 'd');
    obj.removeDataKeys(['e', 'f']);
    expect(obj.keys()).toEqual(['a']);
  });

  it('triggers "modify" when data keys are added', () => {
    const obj = new MatreshkaObject();
    const handler = createSpy();
    obj.on('modify', handler);
    obj.addDataKeys('c', 'd');
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('triggers "modify" and "remove" when data keys are removed', () => {
    const obj = new MatreshkaObject();
    const modifyHandler = createSpy();
    const removeHandler = createSpy();
    obj.addDataKeys('c', 'd');
    obj.on('modify', modifyHandler);
    obj.on('remove', removeHandler);
    obj.removeDataKeys('c', 'd');
    expect(modifyHandler).toHaveBeenCalledTimes(2);
    expect(removeHandler).toHaveBeenCalledTimes(2);
  });

  it('does not trigger "modify" and "remove" when data keys are not removed', () => {
    const obj = new MatreshkaObject();
    const handler = createSpy();
    obj.addDataKeys('c', 'd');
    obj.on('modify', handler);
    obj.on('remove', handler);
    obj.removeDataKeys('e', 'f');
    expect(handler).not.toHaveBeenCalled();
  });

  it('triggers "modify" and "set" when data is changed', () => {
    const obj = new MatreshkaObject();
    const modifyHandler = createSpy();
    const setHandler = createSpy();
    obj.addDataKeys('a');
    obj.on('modify', modifyHandler);
    obj.on('set', setHandler);
    obj.a = 'foo';
    expect(modifyHandler).toHaveBeenCalledTimes(1);
    expect(setHandler).toHaveBeenCalledTimes(1);
  });

  it('triggers "modify" and "remove" when data is removed', () => {
    const obj = new MatreshkaObject();
    const modifyHandler = createSpy();
    const removeHandler = createSpy();
    obj.addDataKeys('a');
    obj.on('modify', modifyHandler);
    obj.on('remove', removeHandler);
    obj.remove('a');
    expect(modifyHandler).toHaveBeenCalledTimes(1);
    expect(removeHandler).toHaveBeenCalledTimes(1);
  });

  it('does not trigger "modify" and "remove" when non-data is removed', () => {
    const obj = new MatreshkaObject({
      a: 1
    });
    const handler = createSpy();
    obj.b = 'foo';
    obj.on('modify', handler);
    obj.on('remove', handler);
    obj.remove('b');
    expect(handler).not.toHaveBeenCalled();
  });

  it('checks is data key by isDataKey method', () => {
    const obj = new MatreshkaObject();
    obj.setData('a', 1);
    obj.b = 2;
    expect(obj.isDataKey('a')).toBeTruthy();
    expect(obj.isDataKey('b')).toBeFalsy();
  });

  it('finds a key of an object', () => {
    const toFind = {};
    const obj = new MatreshkaObject({
      a: 42,
      b: toFind,
      c: 'yop'
    });

    expect(obj.keyOf(toFind)).toEqual('b');
  });

  it('allows to use keys, values and entrues methods', () => {
    const obj = new MatreshkaObject({
      a: 'foo',
      b: 'bar',
      c: 'baz'
    });

    expect(obj.keys(obj)).toEqual(['a', 'b', 'c']);
    expect(obj.values(obj)).toEqual(['foo', 'bar', 'baz']);
    expect(obj.entries(obj)).toEqual([
      ['a', 'foo'],
      ['b', 'bar'],
      ['c', 'baz']
    ]);
  });
});
