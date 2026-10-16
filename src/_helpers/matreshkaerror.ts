const bindingErrorPrefix = 'Binding error:';
const calcErrorPrefix = 'Calc error:';
const eventsErrorPrefix = 'Events error:';
const arrayErrorPrefix = 'Matreshka.Array error:';

const getType = (variable: unknown): string => {
  if (variable === null) {
    return 'null';
  }

  return typeof variable;
};
const getTypeError = (variable: unknown, variableName: string, expectedType: string): string =>
  `${variableName} must have type "${expectedType}" but got "${getType(variable)}" instead.`;

// each message gets the details its caller passes
const errors: Record<string, (data: any) => string> = {
  'common:object_type': ({ object, method }) => `Error in ${method}: ${getTypeError(object, 'object', 'object')}`,
  'common:call_class': () => 'Cannot call a class as a function',
  'common:use_magic_props': () =>
    '"sandbox" key (for all objects) and "container" key (for Matreshka.Array instances)' +
    ' are reserved for service use and cannot be used as usual properties',

  'binding:node_missing': ({ key, node }) => {
    const selectorInfo = typeof node === 'string' ? ` (given selector is "${node}")` : '';
    return `${bindingErrorPrefix} node is missing for key "${key}"${selectorInfo}.`;
  },
  'binding:falsy_key': () => `${bindingErrorPrefix} "key" arg cannot be falsy`,
  'binding:instance_nodes_missing': ({ $nodes }) => {
    const missing = !$nodes ? '$nodes' : 'nodes';
    return (
      `${bindingErrorPrefix} "${missing}" property of Matreshka instance is missing.` +
      ' It must be an object and must not be reassigned.'
    );
  },
  'binding:magic_props_nodes_length': () =>
    `${bindingErrorPrefix} "sandbox" key (for all objects) and "container" key` +
    ' (for Matreshka.Array instances) cannot have more than one bound node',

  'calc:target_type': ({ target }) => `${calcErrorPrefix} ${getTypeError(target, 'target key', 'string')}`,
  'calc:source_key_type': ({ sourceKey }) => `${calcErrorPrefix} ${getTypeError(sourceKey, 'source key', 'string')}`,
  'calc:source_object_type': ({ sourceObject }) =>
    `${calcErrorPrefix} ${getTypeError(sourceObject, 'source object', 'object')}`,
  'calc:source_type': ({ source }) => `${calcErrorPrefix} ${getTypeError(source, 'source', 'object')}`,

  'array:model_type': ({ Model }) => `${arrayErrorPrefix} ${getTypeError(Model, 'Model', 'function')}`,
  'array:add_render_twice': () => `${arrayErrorPrefix} one rendered object was inserted twice.`,
  'array:rendered_number_nodes': ({ length }) =>
    `${arrayErrorPrefix} renderer returned ${length} nodes instead of one.` +
    ` ${length > 0 ? 'To fix this wrap these nodes by single node.' : ''}`,
  'array:renderer_node_missing': ({ selector }) =>
    `${arrayErrorPrefix} renderer node is missing (given selector is "${selector}")`,
  'array:method_compat_renderer': ({ method }) =>
    `${arrayErrorPrefix} Not possible to render when ${method} method is called`,

  'pull:to_remove_type': ({ toRemove }) => `Error in pull: ${getTypeError(toRemove, 'toRemove', 'number')}`,

  'restore:no_nodes': () =>
    `${arrayErrorPrefix} cannot find any container to restore an instance using "restore" method`,

  'trigger:names_type': ({ names }) => `${eventsErrorPrefix} ${getTypeError(names, 'event name', 'string')}`,

  'on:names_type': ({ names }) => errors['trigger:names_type']({ names }),

  'removedatakeys:key_type': ({ key }) => `Error in removeDataKeys: ${getTypeError(key, 'key', 'string')}`,

  'adddatakeys:key_type': ({ key }) => `Error in addDataKeys: ${getTypeError(key, 'key', 'string')}`,

  'remove:key_type': ({ key }) => `Error in remove: ${getTypeError(key, 'key', 'string')}`,

  'mediate:key_type': ({ key }) => `Error in mediate: ${getTypeError(key, 'key', 'string')}`
};

export default function matreshkaError(key: string, data?: Record<string, any>): Error {
  const getError = errors[key];
  if (!getError) {
    throw Error(`Unknown error "${key}". Please report about this on Github.`);
  }

  return new Error(getError(data));
}
