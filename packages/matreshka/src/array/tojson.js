import forEach from '../_helpers/foreach';

// converts Matreshka.Array instance to ordinary array
export default function toJSON(recursive = true) {
  const result = new Array(this.length);

  forEach(this, (item, index) => {
    // when recursive is true and when an item has toJSON method then call it recusively
    if (recursive && item && typeof item.toJSON === 'function') {
      result[index] = item.toJSON(true);
    } else {
      result[index] = item;
    }
  });

  return result;
}
