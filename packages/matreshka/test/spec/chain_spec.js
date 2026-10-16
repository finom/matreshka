import chain from 'src/chain';

describe('chain', () => {
  it('has all needed methods', () => {
    const inst = chain({});

    `on,
        once,
        onDebounce,
        off,
        trigger,
        calc,
        bindNode,
        unbindNode,
        bindOptionalNode,
        bindSandbox,
        parseBindings,
        select,
        selectAll,
        set,
        remove,
        instantiate,
        mediate`
      .split(/\s*,\s*/)
      .forEach((name) => {
        expect(typeof inst[name]).toEqual('function');
      });
  });

  it('can call calc and set as proof of chain work', () => {
    const obj = { a: 1 };
    chain(obj)
      .calc('b', 'a', (a) => a * 2, { debounceCalc: false })
      .set('a', 2);

    expect(obj.b).toEqual(4);
  });
});
