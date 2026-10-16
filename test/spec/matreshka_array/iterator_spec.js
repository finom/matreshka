import MatreshkaArray from 'src/array';

describe('Matreshka.Array iterator', () => {
  const symbolIt = typeof Symbol === 'function' ? it : xit;

  symbolIt('iterates via for..of', () => {
    const arr = new MatreshkaArray(1, 2, 3);
    let i = 1;

    for (const item of arr) {
      expect(item).toEqual(i);
      i += 1;
    }
  });
});
