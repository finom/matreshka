import matreshkaError from './matreshkaerror.js';

// checks type of a variable and throws an error if its type is not an object
export default function checkObjectType(object: unknown, method: string): void {
  const typeofObject = object === null ? 'null' : typeof object;

  if (typeofObject !== 'object' && typeofObject !== 'function') {
    throw matreshkaError('common:object_type', {
      object,
      method
    });
  }
}
