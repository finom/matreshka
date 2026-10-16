import MatreshkaArray from 'src/array';
import Class from 'src/class';

describe('Matreshka.Array static methods (of and from)', () => {
  it('converts an array to Matreshka.Array instance via Matreshka.Array.from', () => {
    const items = [1, 2, 3];
    const arr = MatreshkaArray.from(items);

    expect(arr instanceof MatreshkaArray).toBe(true);
    expect(arr.toJSON(false)).toEqual(items);
  });

  it('allows to inherit Matreshka.Array.from', () => {
    const items = [1, 2, 3];
    const OwnerClass = Class({ extends: MatreshkaArray });
    const arr = OwnerClass.from(items);

    expect(arr instanceof OwnerClass).toBe(true);
    expect(arr.toJSON(false)).toEqual(items);
  });

  it('allows to assign Matreshka.Array.from to a variable', () => {
    const items = [1, 2, 3];
    const from = MatreshkaArray.from;
    const arr = from(items);

    expect(arr instanceof MatreshkaArray).toBe(true);
    expect(arr.toJSON(false)).toEqual(items);
  });

  it('converts arguments to Matreshka.Array instance via Matreshka.Array.of', () => {
    const items = [1, 2, 3];
    const arr = MatreshkaArray.of(...items);

    expect(arr instanceof MatreshkaArray).toBe(true);
    expect(arr.toJSON(false)).toEqual(items);
  });

  it('allows to inherit Matreshka.Array.of', () => {
    const items = [1, 2, 3];
    const OwnerClass = Class({ extends: MatreshkaArray });
    const arr = OwnerClass.of(...items);

    expect(arr instanceof OwnerClass).toBe(true);
    expect(arr.toJSON(false)).toEqual(items);
  });

  it('allows to assign Matreshka.Array.of to a variable', () => {
    const items = [1, 2, 3];
    const of = MatreshkaArray.of;
    const arr = of(...items);

    expect(arr instanceof MatreshkaArray).toBe(true);
    expect(arr.toJSON(false)).toEqual(items);
  });
});
