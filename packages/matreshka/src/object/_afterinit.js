import afterMatreshkaInit from '../matreshka/_afterinit';
import addListener from '../on/_addlistener';
import triggerOne from '../trigger/_triggerone';
import defs from '../_core/defs';

// The handlers listen to internal events ("_" prefix), so that off() with no name doesn't remove them

// called on _change:delegated
// tiggers asterisk events logic by triggering _asterisk:set
function changeDelegatedHandler(eventOptions = {}) {
  const { key } = eventOptions;
  const def = defs.get(this);

  if (key && key in def.keys) {
    triggerOne(this, '_asterisk:set', eventOptions);
  }
}

// called on _change (fired by set together with change)
// triggers set and modify if data keys are changed
function changeHandler(eventOptions = {}) {
  const { key } = eventOptions;
  const def = defs.get(this);

  if (key && key in def.keys) {
    triggerOne(this, 'set', eventOptions);
    triggerOne(this, 'modify', eventOptions);
  }
}

// called on _delete:delegated (fired by remove, silent or not)
// removes asterisk events logic, removes a data key and triggers remove and modify
function deleteHandler(eventOptions = {}) {
  const { key, silent } = eventOptions;
  const def = defs.get(this);

  if (key && key in def.keys) {
    delete def.keys[key];

    // undelegate asterisk listeners from the value (the handler skips a value another data key holds)
    triggerOne(this, '_asterisk:remove', eventOptions);

    if (!silent) {
      triggerOne(this, 'remove', eventOptions);
      triggerOne(this, 'modify', eventOptions);
    }
  }
}

// Matreshka.Object initializer
export default function afterMatreshkaObjectInit(def) {
  // Matreshka initializer
  afterMatreshkaInit.call(this);
  // create a set of data keys; no prototype, so "toString" and the like are not data keys
  def.keys = Object.create(null);

  // trigger asterisk events
  addListener(this, '_change:delegated', changeDelegatedHandler);

  // fire "modify" and "set" events when data key is changed
  addListener(this, '_change', changeHandler);

  // fire "modify" and "remove" events when data key is removed
  addListener(this, '_delete:delegated', deleteHandler);
}
