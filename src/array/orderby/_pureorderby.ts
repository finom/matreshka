// the function orders by given order data any array-like object
export default function pureOrderBy(
  arr: ArrayLike<any>,
  givenKeys?: string | string[] | null,
  orders?: string | string[] | null
): any[] {
  if ('length' in arr && typeof arr === 'object') {
    const defaultOrder = 'asc';
    let commonOrder: string | undefined;

    if (!Array.isArray(orders)) {
      commonOrder = orders || defaultOrder;
    }

    const { length } = arr;
    const result: any[] = Array(length);

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
          const order = (commonOrder || (orders as string[])[i]) !== 'desc' ? -1 : 1;

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
