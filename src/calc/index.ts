import type { AnyObject } from '../types.js';
import type { CalcDefinition, CalcEventOptions, CalcHandler, CalcSource, CalcSourceEntry } from './types.js';
import initMK from '../_core/init.js';
import checkObjectType from '../_helpers/checkobjecttype.js';
import matreshkaError from '../_helpers/matreshkaerror.js';
import assign from '../_helpers/assign.js';
import debounce, { type Debounced } from '../_helpers/debounce.js';
import forEach from '../_helpers/foreach.js';
import forOwn from '../_helpers/forown.js';
import addSource from './_addsource.js';
import createCalcHandler from './_createcalchandler.js';
import defineProp from '../_core/defineprop.js';
import removeListener from '../off/_removelistener.js';
import removeTreeListener from '../off/_removetreelistener.js';

// defines a property which is dependend on other properties
export default function calc<T extends object>(
  object: T,
  target: string,
  sources: CalcSource | CalcSource[],
  handler?: CalcHandler | null,
  eventOptions?: CalcEventOptions
): T;
export default function calc<T extends object>(
  object: T,
  targets: Record<string, CalcDefinition>,
  eventOptions?: CalcEventOptions
): T;
export default function calc(
  this: any,
  object: any,
  target: any,
  sources?: any,
  givenHandler?: any,
  eventOptions?: any
): any {
  if (typeof this === 'object' && this.isMatreshka) {
    // when context is Matreshka instance, use this as an object and shift other args
    eventOptions = givenHandler;
    givenHandler = sources;
    sources = target;
    target = object;
    object = this;
  } else {
    // throw error when object type is wrong
    checkObjectType(object, 'calc');
  }

  if (target instanceof Object) {
    /*
     * accept an object
     * this.calc({target: { source, handler, event } }, commonEventOptions);
     */
    forOwn(
      target as Record<string, CalcDefinition>,
      ({ source: itemSource, handler: itemHandler, event: itemEventOptions }, itemTarget) => {
        const commonEventOptions = sources;
        const mergedEventOptions: CalcEventOptions = {};

        if (commonEventOptions) {
          // extend event object by "global" event
          assign(mergedEventOptions, commonEventOptions);
        }

        if (itemEventOptions) {
          // extend event object by "local" event ("event" key of an object)
          assign(mergedEventOptions, itemEventOptions);
        }

        calc(object, itemTarget, itemSource, itemHandler, mergedEventOptions);
      }
    );

    return object;
  }

  if (typeof target !== 'string') {
    throw matreshkaError('calc:target_type', { target });
  }

  eventOptions = (eventOptions || {}) as CalcEventOptions;
  const def = initMK(object);
  const {
    setOnInit = true,
    debounceCalcOnInit = false,
    debounceCalc = true,
    debounceCalcDelay = 0,
    // the next option is used to hide a property for internal use (eg in bindings parser)
    // hidden property means no accessors
    isTargetPropertyHidden = false
  } = eventOptions;
  const defaultHandler = (value: any) => value;
  const handler: CalcHandler = givenHandler || defaultHandler;
  const allSources: CalcSourceEntry[] = [];
  const syncCalcHandler = createCalcHandler({
    object,
    eventOptions,
    allSources,
    target,
    def,
    handler
  });

  let debouncedCalcHandler: Debounced<typeof syncCalcHandler> | undefined;
  let calcHandler: (changeEvent?: AnyObject) => void;

  if (debounceCalcOnInit || debounceCalc) {
    debouncedCalcHandler = debounce(syncCalcHandler, debounceCalcDelay);
  }

  defineProp(object, target, isTargetPropertyHidden);

  if (!Array.isArray(sources)) {
    sources = [sources];
  }

  if (debounceCalc) {
    // created above, since debounceCalc is on
    calcHandler = debouncedCalcHandler as Debounced<typeof syncCalcHandler>;
  } else {
    calcHandler = syncCalcHandler;
  }

  forEach(sources as unknown[], (source) => {
    if (typeof source === 'string') {
      // source object is current object
      addSource({
        calcHandler,
        allSources,
        sourceKey: source,
        sourceObject: object,
        eventOptions
      });
    } else {
      // source object is external object
      if (!source || typeof source !== 'object') {
        throw matreshkaError('calc:source_type', { source });
      }

      const sourceKey = (source as AnyObject).key;
      const sourceObject = (source as AnyObject).object;
      if (Array.isArray(sourceKey)) {
        // many keys are passed
        forEach(sourceKey, (sourceKeyItem) => {
          addSource({
            calcHandler,
            allSources,
            sourceKey: sourceKeyItem,
            sourceObject,
            eventOptions
          });
        });
      } else {
        // one key is passed
        addSource({
          calcHandler,
          allSources,
          sourceKey,
          sourceObject,
          eventOptions
        });
      }
    }
  });

  // a hidden target belongs to one binding of the bindings parser, which removes the calc with the binding
  if (isTargetPropertyHidden) {
    def.props[target].removeCalc = () => {
      forEach(allSources, ({ sourceKey, sourceObject, isDelegated }) => {
        if (isDelegated) {
          removeTreeListener(sourceObject, sourceKey, calcHandler);
        } else {
          removeListener(sourceObject, `_change:deps:${sourceKey}`, calcHandler);
        }
      });
      debouncedCalcHandler?.cancel();
      delete def.props[target];
    };
  }

  if (setOnInit) {
    if (debounceCalcOnInit) {
      // created above, since debounceCalcOnInit is on
      (debouncedCalcHandler as Debounced<typeof syncCalcHandler>)();
    } else {
      syncCalcHandler();
    }
  }

  return object;
}
