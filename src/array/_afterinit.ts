import afterMatreshkaInit from '../matreshka/_afterinit.js';
import addListener from '../on/_addlistener.js';
import matreshkaError from '../_helpers/matreshkaerror.js';
import type { EventOptions } from '../types.js';
import type { MatreshkaArrayInstance, ModelConstructor } from './types.js';

// the function returns array item converted to Model instance
function modelItemMediator(this: MatreshkaArrayInstance, item: any, index: number): any {
  const Model = this.Model as ModelConstructor;

  // if an item is already instance of Model
  if (item instanceof Model) {
    return item;
  }

  let itemData: any;

  if (item && typeof item.toJSON === 'function') {
    // if item is not falsy and if it has toJSON method
    // then retrieve instance data by this method
    itemData = item.toJSON(false);
  } else {
    // if not then use an item as its data
    itemData = item;
  }

  return new Model(itemData, this, index);
}

// event handler to listen changes of Model property
function changeModel(this: MatreshkaArrayInstance): void {
  const { Model } = this;

  // if model has wrong type then throw an error
  if (typeof Model !== 'function') {
    throw matreshkaError('array:model_type', { Model });
  }

  // attatch item mediator
  this.mediateItem(modelItemMediator);
}

// event handler to listen changes of itemRenderer property
function changeItemRendererHandler(this: MatreshkaArrayInstance, eventOptions: EventOptions = {}): void {
  const { forceRerender = true } = eventOptions;
  this.rerender({ forceRerender });
}

// Matreshka.Array initializer
export default function afterMatreshkaArrayInit(this: MatreshkaArrayInstance): void {
  // we need to calculate hasModel before change:Model is added
  const hasModel = 'Model' in this;

  // call Matreshka initializer
  afterMatreshkaInit.call(this);

  addListener(this, '_change:common:Model', changeModel, this, {
    skipChecks: true
  });

  addListener(this, '_change:common:itemRenderer', changeItemRendererHandler, this, {
    skipChecks: true
  });

  // call changeModel handler immediately if model is present
  // it will throw an error if Model is not a function
  if (hasModel) {
    changeModel.call(this);
  }
}
