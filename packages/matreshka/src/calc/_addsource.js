import addListener from '../on/_addlistener';
import addTreeListener from '../on/_addtreelistener';
import matreshkaError from '../_helpers/matreshkaerror';

// adds a source to a source list and adds needed event listener to a it
export default function addSource({ calcHandler, allSources, sourceKey, sourceObject, eventOptions }) {
  let { exactKey = false } = eventOptions;
  let isDelegated = false;

  // source key must be a string
  if (typeof sourceKey !== 'string') {
    throw matreshkaError('calc:source_key_type', { sourceKey });
  }

  // source object must be an object
  if (!sourceObject || typeof sourceObject !== 'object') {
    throw matreshkaError('calc:source_object_type', { sourceObject });
  }

  if (!exactKey) {
    const deepPath = sourceKey.split('.');

    // if something like a.b.c is used as a key
    if (deepPath.length > 1) {
      isDelegated = true;
      // TODO: Avoid collisions with bindings by using another event name
      // ... instead of _change:tree:xxx
      addTreeListener(sourceObject, deepPath, calcHandler);
    } else {
      exactKey = true;
    }
  }

  if (exactKey) {
    // normal handler
    addListener(sourceObject, `_change:deps:${sourceKey}`, calcHandler);
  }

  allSources.push({
    sourceKey,
    sourceObject,
    isDelegated
  });
}
