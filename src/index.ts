import MatreshkaArray from './array/index.js';
import binders from './binders/index.js';
import bindNode from './bindnode/index.js';
import bindOptionalNode from './bindoptionalnode.js';
import bindSandbox from './bindsandbox.js';
import calc from './calc/index.js';
import chain from './chain.js';
import Class from './class.js';
import defaultBinders from './defaultbinders.js';
import instantiate from './instantiate.js';
import lookForBinder from './lookforbinder.js';
import Matreshka from './matreshka/index.js';
import mediate from './mediate.js';
import MatreshkaObject from './object/index.js';
import off from './off/index.js';
import on from './on/index.js';
import onDebounce from './ondebounce.js';
import once from './once.js';
import parseBindings from './parsebindings/index.js';
import parserBrackets from './parserbrackets.js';
import remove from './remove.js';
import select from './select.js';
import selectAll from './selectall.js';
import set from './set.js';
// toMatreshka imports both classes, which extend Matreshka, so it joins here rather than in the class's static members
import toMatreshka from './tomatreshka.js';
import trigger from './trigger/index.js';
import unbindNode from './unbindnode/index.js';

Matreshka.Object = MatreshkaObject;
Matreshka.Array = MatreshkaArray;
Matreshka.toMatreshka = toMatreshka;

export default Matreshka;
export {
  Matreshka,
  MatreshkaObject,
  MatreshkaArray,
  toMatreshka,
  Class,
  binders,
  defaultBinders,
  lookForBinder,
  parserBrackets,
  chain,
  on,
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
  mediate
};

// the types a host writes against: custom binders, options, handlers, renderers
export type { Binder, BindingOptions, EventOptions, EventHandler, Mediator } from './types.js';
export type { NodeInput, BindNodeOptions } from './bindnode/types.js';
export type { CalcSource, CalcHandler, CalcEventOptions, CalcDefinition } from './calc/types.js';
export type { EventNames, EventHandlerMap } from './on/types.js';
export type { ItemRenderer, ModelConstructor, ArrayMethodOptions } from './array/types.js';
export type { SetDataOptions } from './object/index.js';
