// as lodash's orderBy: values first, then null, then undefined (a missing key or a null item); desc flips it all
const rank = (value: any): number => (value === undefined ? 2 : value === null ? 1 : 0);
function compareValues(a: any, b: any): number {
  const ranks = rank(a) - rank(b);
  if (ranks || rank(a)) {
    return ranks;
  }
  return a > b ? 1 : a < b ? -1 : 0;
}

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
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const direction = (commonOrder || (orders as string[])[i]) === 'desc' ? -1 : 1;
        const compared = compareValues(a?.[key], b?.[key]);

        if (compared) {
          return compared * direction;
        }
      }

      return 0;
    });
  }

  return [];
}
