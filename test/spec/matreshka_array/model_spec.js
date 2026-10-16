import Class from 'src/class';
import MatreshkaArray from 'src/array';
import MatreshkaObject from 'src/object';

describe('Matreshka.Array Model', () => {
  it('can use Model and Model gets correct arguments', () =>
    new Promise((done) => {
      const item = {};

      const Model = Class({
        constructor(data, parent, index) {
          expect(data === item).toBeTruthy();
          expect(index).toEqual(0);
          setTimeout(() => {
            expect(parent === arr).toBeTruthy();
            done();
          });
        }
      });

      const MatreshkaArrayChild = Class({
        extends: MatreshkaArray,
        get Model() {
          return Model;
        },
        constructor() {
          this.push(item);
        }
      });

      const arr = new MatreshkaArrayChild();

      expect(arr[0] instanceof Model).toBeTruthy();
    }));

  it('allows to change Model dynamically', () => {
    const item = {};
    const arr = new Class({
      extends: MatreshkaArray,

      constructor() {
        this.push({});
      }
    });

    expect(arr[0]).toEqual(item);

    arr.Model = MatreshkaObject;

    expect(arr[0] instanceof MatreshkaObject).toBeTruthy();
  });

  it('throws error if Model has wront type', () => {
    expect(
      () =>
        new Class({
          extends: MatreshkaArray,
          Model: undefined,
          constructor() {
            this.push({});
          }
        })
    ).toThrow();

    expect(
      () =>
        new Class({
          extends: MatreshkaArray,
          Model: {},
          constructor() {
            this.push({});
          }
        })
    ).toThrow();
  });
});
