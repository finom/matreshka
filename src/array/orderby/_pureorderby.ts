// as lodash's orderBy: values first, then null, then undefined (a missing key or a null item); desc flips it all
const rank = (value: any): number => (value === undefined ? 2 : value === null ? 1 : 0);
function compareValues(a: any, b: any): number {
  const ranks = rank(a) - rank(b);
  if (ranks || rank(a)) {
    return ranks;
  }
  return a > b ? 1 : a < b ? -1 : 0;
}

// returns the items of an array-like ordered by given keys, as lodash's orderBy
export default function pureOrderBy(
  arr: ArrayLike<any>,
  givenKeys?: string | string[] | null,
  orders?: string | string[] | null
): any[] {
  const result = Array.from(arr);

  if (!givenKeys) {
    return result;
  }

  const keys = Array.isArray(givenKeys) ? givenKeys : [givenKeys];
  const commonOrder = Array.isArray(orders) ? undefined : orders || 'asc';

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
