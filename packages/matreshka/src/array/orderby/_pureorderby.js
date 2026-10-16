// the function orders by given order data any array-like object
export default function pureOrderBy(arr, givenKeys, orders) {
  if ('length' in arr && typeof arr === 'object') {
    const defaultOrder = 'asc';
    let commonOrder;

    if (!Array.isArray(orders)) {
      commonOrder = orders || defaultOrder;
    }

    const { length } = arr;
    const result = Array(length);

    for (let i = 0; i < length; i++) {
      result[i] = arr[i];
    }

    if (!givenKeys) {
      return result;
    }

    const keys = Array.isArray(givenKeys) ? givenKeys : [givenKeys];

    return result.sort((a, b) => {
      if (a && b) {
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const order = (commonOrder || orders[i]) !== 'desc' ? -1 : 1;

          if (a[key] > b[key]) {
            return -order;
          }
          if (a[key] < b[key]) {
            return order;
          }
        }
      }

      return 0;
    });
  }

  return [];
}
