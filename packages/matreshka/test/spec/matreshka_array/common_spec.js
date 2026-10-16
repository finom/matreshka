import Matreshka from 'src';
import MatreshkaArray from 'src/array';
import createSpy from '../../helpers/createspy';

describe('Matreshka.Array class', () => {
  const methodNames = `_afterInit,
    mediateItem,
    orderBy,
    pull,
    recreate,
    rerender,
    restore,
    toJSON,
    concat,
    join,
    pop,
    push,
    reverse,
    shift,
    slice,
    sort,
    splice,
    toString,
    unshift,
    every,
    filter,
    forEach,
    indexOf,
    lastIndexOf,
    map,
    some,
    entries,
    keys,
    values,
    copyWithin,
    fill,
    includes,
    find,
    findIndex,
    push_,
    pop_,
    unshift_,
    shift_,
    sort_,
    reverse_,
    splice_`.split(/\s*,\s*/);

  it('an instance should have isMatreshka=true and isMatreshkaArray=true properties', () => {
    const obj = new MatreshkaArray();
    expect(obj.isMatreshka).toEqual(true);
    expect(obj.isMatreshkaArray).toEqual(true);
  });

  it('includes all instance methods', () => {
    const obj = new MatreshkaArray();
    for (let i = 0; i < methodNames.length; i++) {
      const name = methodNames[i];
      expect(typeof obj[name]).toEqual('function', `${name} method is missing`);
    }
  });

  it('includes all static methods', () => {
    expect(typeof MatreshkaArray.of).toEqual('function', 'of method is missing');
    expect(typeof MatreshkaArray.from).toEqual('function', 'from method is missing');
  });

  it('is a property of Matreshka', () => {
    expect(Matreshka.Array).toEqual(MatreshkaArray);
  });

  it('triggers addone and removeone', () => {
    const arr = MatreshkaArray.of(1, 2, 3, 4, 5);
    const addOneHandler = createSpy(({ addedItem }) => {
      expect(addedItem).toEqual('foo');
    });
    const removeOneHandler = createSpy(({ removedItem }) => {
      expect(removedItem).toEqual(2);
    });

    arr.on('addone', addOneHandler);
    arr.on('removeone', removeOneHandler);

    arr.push('foo');
    arr.pull(1);

    expect(addOneHandler).toHaveBeenCalledTimes(1);
    expect(removeOneHandler).toHaveBeenCalledTimes(1);
  });
});
