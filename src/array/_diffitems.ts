// the items of one list that the other doesn't have, counted per value: a dropped duplicate counts
export default function itemsNotIn(list: ArrayLike<any>, other: ArrayLike<any>): any[] {
  const counts = new Map<any, number>();
  for (let i = 0; i < other.length; i++) counts.set(other[i], (counts.get(other[i]) ?? 0) + 1);
  const result: any[] = [];
  for (let i = 0; i < list.length; i++) {
    const left = counts.get(list[i]) ?? 0;
    if (left) counts.set(list[i], left - 1);
    else result.push(list[i]);
  }
  return result;
}
