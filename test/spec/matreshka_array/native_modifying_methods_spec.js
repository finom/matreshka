import MatreshkaArray from 'src/array';
import createSpy from '../../helpers/createspy';

describe(
  'Matreshka.Array native modifying methods (including ones that ending by underscore)' + ' and their events',
  () => {
    const testFlag = { test: 'ok' };
    let simpleHandler;
    let testFlagHandler;

    beforeEach(() => {
      simpleHandler = createSpy();
      testFlagHandler = createSpy((evt) => expect(evt.test).toEqual('ok'));
    });

    it('supports push method', () => {
      const arr = new MatreshkaArray();
      arr.on('push', simpleHandler);
      arr.on('add', simpleHandler);
      arr.on('modify', simpleHandler);
      const result = arr.push('foo', 'bar');
      expect(arr.toJSON(false)).toEqual(['foo', 'bar']);
      expect(arr.length).toEqual(2);
      expect(result).toEqual(2);
      expect(simpleHandler).toHaveBeenCalledTimes(3);
    });

    it('supports push_ method', () => {
      const arr = new MatreshkaArray();

      arr.on('push', testFlagHandler);
      arr.on('add', testFlagHandler);
      arr.on('modify', testFlagHandler);

      const result = arr.push_('foo', 'bar', testFlag);
      expect(arr.toJSON(false)).toEqual(['foo', 'bar']);

      expect(arr.length).toEqual(2);
      expect(result).toEqual(2);

      expect(testFlagHandler).toHaveBeenCalledTimes(3);

      // test silent only once
      arr.push_('baz', 'qux', { silent: true });

      expect(testFlagHandler).toHaveBeenCalledTimes(3);
    });

    it('supports pop method', () => {
      const arr = new MatreshkaArray();
      arr.push('foo', 'bar');

      arr.on('pop', simpleHandler);
      arr.on('remove', simpleHandler);
      arr.on('modify', simpleHandler);

      const result = arr.pop();

      expect(arr.toJSON(false)).toEqual(['foo']);

      expect(arr.length).toEqual(1);
      expect(result).toEqual('bar');

      expect(simpleHandler).toHaveBeenCalledTimes(3);
    });

    it('supports pop_ method', () => {
      const arr = new MatreshkaArray();
      arr.push('foo', 'bar');

      arr.on('pop', testFlagHandler);
      arr.on('remove', testFlagHandler);
      arr.on('modify', testFlagHandler);

      const result = arr.pop_(testFlag);

      expect(arr.toJSON(false)).toEqual(['foo']);

      expect(arr.length).toEqual(1);
      expect(result).toEqual('bar');
      expect(testFlagHandler).toHaveBeenCalledTimes(3);
    });

    it('supports unshift method', () => {
      const arr = new MatreshkaArray();
      arr.push('foo', 'bar');
      arr.on('unshift', simpleHandler);
      arr.on('add', simpleHandler);
      arr.on('modify', simpleHandler);

      const result = arr.unshift('baz', 'qux');

      expect(arr.toJSON(false)).toEqual(['baz', 'qux', 'foo', 'bar']);

      expect(arr.length).toEqual(4);
      expect(result).toEqual(4);
      expect(simpleHandler).toHaveBeenCalledTimes(3);
    });

    it('supports unshift_ method', () => {
      const arr = new MatreshkaArray();
      arr.push('foo', 'bar');
      arr.on('unshift', testFlagHandler);
      arr.on('add', testFlagHandler);
      arr.on('modify', testFlagHandler);

      const result = arr.unshift_('baz', 'qux', testFlag);

      expect(arr.toJSON(false)).toEqual(['baz', 'qux', 'foo', 'bar']);

      expect(arr.length).toEqual(4);
      expect(result).toEqual(4);
      expect(testFlagHandler).toHaveBeenCalledTimes(3);
    });

    it('supports shift method', () => {
      const arr = new MatreshkaArray();
      arr.push('foo', 'bar');
      arr.on('shift', simpleHandler);
      arr.on('remove', simpleHandler);
      arr.on('modify', simpleHandler);
      const result = arr.shift();
      expect(arr.length).toEqual(1);
      expect(arr.toJSON(false)).toEqual(['bar']);
      expect(result).toEqual('foo');
      expect(simpleHandler).toHaveBeenCalledTimes(3);
    });

    it('supports shift_ method', () => {
      const arr = new MatreshkaArray();
      arr.push('foo', 'bar');
      arr.on('shift', testFlagHandler);
      arr.on('remove', testFlagHandler);
      arr.on('modify', testFlagHandler);
      const result = arr.shift_(testFlag);
      expect(arr.length).toEqual(1);
      expect(arr.toJSON(false)).toEqual(['bar']);
      expect(result).toEqual('foo');
      expect(testFlagHandler).toHaveBeenCalledTimes(3);
    });

    it('supports splice method', () => {
      const arr = new MatreshkaArray();
      arr.push('foo', 'bar', 'baz', 'qux');
      arr.on('splice', simpleHandler);
      arr.on('add', simpleHandler);
      arr.on('remove', simpleHandler);
      arr.on('modify', simpleHandler);
      const result = arr.splice(1, 2, 'puk', 'boo', 'lol');

      expect(arr.toJSON(false)).toEqual(['foo', 'puk', 'boo', 'lol', 'qux']);
      expect(result.toJSON(false)).toEqual(['bar', 'baz']);

      expect(simpleHandler).toHaveBeenCalledTimes(4);
    });

    it('supports splice_ method', () => {
      const arr = new MatreshkaArray();
      arr.push('foo', 'bar', 'baz', 'qux');
      arr.on('splice', testFlagHandler);
      arr.on('add', testFlagHandler);
      arr.on('remove', testFlagHandler);
      arr.on('modify', testFlagHandler);
      const result = arr.splice_(1, 2, 'puk', 'boo', 'lol', testFlag);

      expect(arr.toJSON(false)).toEqual(['foo', 'puk', 'boo', 'lol', 'qux']);
      expect(result.toJSON(false)).toEqual(['bar', 'baz']);

      expect(testFlagHandler).toHaveBeenCalledTimes(4);
    });

    it('supports sort method', () => {
      const arr = new MatreshkaArray();
      arr.push(2, 3, 1);
      arr.on('sort', simpleHandler);
      arr.on('modify', simpleHandler);
      const result = arr.sort();
      expect(arr.toJSON(false)).toEqual([1, 2, 3]);
      expect(result).toEqual(arr);
      expect(simpleHandler).toHaveBeenCalledTimes(2);
    });

    it('supports sort_ method', () => {
      const arr = new MatreshkaArray();
      arr.push(2, 3, 1);
      arr.on('sort', testFlagHandler);
      arr.on('modify', testFlagHandler);
      const result = arr.sort_(testFlag);
      expect(arr.toJSON(false)).toEqual([1, 2, 3]);
      expect(result).toEqual(arr);
      expect(testFlagHandler).toHaveBeenCalledTimes(2);
    });

    it('supports reverse method', () => {
      const arr = new MatreshkaArray();
      arr.push('foo', 'bar', 'baz');
      arr.on('reverse', simpleHandler);
      arr.on('modify', simpleHandler);
      const result = arr.reverse();
      expect(arr.toJSON(false)).toEqual(['baz', 'bar', 'foo']);
      expect(result).toEqual(arr);
      expect(simpleHandler).toHaveBeenCalledTimes(2);
    });

    it('supports reverse_ method', () => {
      const arr = new MatreshkaArray();
      arr.push('foo', 'bar', 'baz');
      arr.on('reverse', testFlagHandler);
      arr.on('modify', testFlagHandler);
      const result = arr.reverse_(testFlag);
      expect(arr.toJSON(false)).toEqual(['baz', 'bar', 'foo']);
      expect(result).toEqual(arr);
      expect(testFlagHandler).toHaveBeenCalledTimes(2);
    });

    it('supports copyWithin method', () => {
      const arr = new MatreshkaArray();
      arr.push(1, 2, 3, 4, 5);
      arr.on('copyWithin', simpleHandler);
      arr.on('modify', simpleHandler);
      const result = arr.copyWithin(0, 3);
      expect(arr.length).toEqual(5);
      expect(arr.toJSON(false)).toEqual([4, 5, 3, 4, 5]);
      expect(result).toEqual(arr);
      expect(simpleHandler).toHaveBeenCalledTimes(2);
    });

    it('supports copyWithin_ method', () => {
      const arr = new MatreshkaArray();
      arr.push(1, 2, 3, 4, 5);
      arr.on('copyWithin', testFlagHandler);
      arr.on('modify', testFlagHandler);
      const result = arr.copyWithin_(0, 3, testFlag);
      expect(arr.length).toEqual(5);
      expect(arr.toJSON(false)).toEqual([4, 5, 3, 4, 5]);
      expect(result).toEqual(arr);
      expect(testFlagHandler).toHaveBeenCalledTimes(2);
    });

    it('supports fill method', () => {
      const arr = new MatreshkaArray();
      arr.push(1, 2, 3);
      arr.on('fill', simpleHandler);
      arr.on('modify', simpleHandler);
      const result = arr.fill(4, -3, -2);
      expect(arr.length).toEqual(3);
      expect(arr.toJSON(false)).toEqual([4, 2, 3]);
      expect(result).toEqual(arr);
      expect(simpleHandler).toHaveBeenCalledTimes(2);
    });

    it('supports fill_ method', () => {
      const arr = new MatreshkaArray();
      arr.push(1, 2, 3);
      arr.on('fill', testFlagHandler);
      arr.on('modify', testFlagHandler);
      const result = arr.fill_(4, 1, 2, testFlag);
      expect(arr.length).toEqual(3);
      expect(arr.toJSON(false)).toEqual([1, 4, 3]);
      expect(result).toEqual(arr);
      expect(testFlagHandler).toHaveBeenCalledTimes(2);
    });
  }
);
