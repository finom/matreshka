import Class from '../class.js';
import Matreshka from '../matreshka/index.js';
import type { MatreshkaStatics } from '../matreshka/index.js';
import type { EventOptions } from '../types.js';
import instanceMembers from './_prototype.js';
import matreshkaError from '../_helpers/matreshkaerror.js';
import initMK from '../_core/init.js';

type DataKey<Data> = Extract<keyof Data, string>;

export interface SetDataOptions extends EventOptions {
  // removes the data keys the call doesn't list
  replaceData?: boolean;
}

// a Matreshka.Object instance: Matreshka plus data keys, the properties toJSON, keys and iteration see
interface MatreshkaObject<Data extends object = Record<string, any>> extends Matreshka {
  readonly isMatreshkaObject: true;

  // sets a value and makes the key a data key
  setData<Key extends DataKey<Data>>(key: Key, value: Data[Key], eventOptions?: SetDataOptions): this;
  setData(data: Partial<Data>, eventOptions?: SetDataOptions): this;
  // setData
  jset<Key extends DataKey<Data>>(key: Key, value: Data[Key], eventOptions?: SetDataOptions): this;
  jset(data: Partial<Data>, eventOptions?: SetDataOptions): this;

  addDataKeys(keys: DataKey<Data>[]): this;
  addDataKeys(...keys: DataKey<Data>[]): this;
  removeDataKeys(keys: DataKey<Data>[]): this;
  removeDataKeys(...keys: DataKey<Data>[]): this;
  isDataKey(key: string): boolean;

  keys(): DataKey<Data>[];
  values(): Data[DataKey<Data>][];
  entries(): [DataKey<Data>, Data[DataKey<Data>]][];
  // the data key that holds the value, or null
  keyOf(value: any): DataKey<Data> | null;
  // with recursive (the default), values that have toJSON are converted too
  toJSON(recursive?: boolean): Data;
  each(callback: (this: any, value: Data[DataKey<Data>], key: DataKey<Data>, self: this) => void, thisArg?: any): this;
  [Symbol.iterator](): IterableIterator<Data[DataKey<Data>]>;
}

// Matreshka.Object inherits the statics Matreshka has when it's created, so not Object, Array and toMatreshka
// NoInfer for TypeScript before 5.4: a type the compiler doesn't infer a type argument from
type NotInferred<T> = [T][T extends any ? 0 : never];

export interface MatreshkaObjectConstructor extends MatreshkaStatics {
  // Data comes from the type argument only, so new MatreshkaObject({ a: 1 }) takes any data keys later
  new <Data extends object = Record<string, any>>(data?: NotInferred<Partial<Data>>): MatreshkaObject<Data>;
  readonly prototype: MatreshkaObject;
}

instanceMembers.extends = Matreshka;

instanceMembers.constructor = function MatreshkaObject(this: MatreshkaObject, data?: Record<string, any>) {
  if (!(this instanceof MatreshkaObject)) {
    throw matreshkaError('common:call_class');
  }

  initMK(this);

  // return is used to make possible to chain super() calls
  return typeof data !== 'undefined' ? this.setData(data) : this;
};

const MatreshkaObject = Class(instanceMembers) as unknown as MatreshkaObjectConstructor;

// the value and the instance type under one name
export { MatreshkaObject as default };
