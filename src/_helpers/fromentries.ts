// Object.fromEntries for an array of pairs; IE 11 lacks it
export default function fromEntries(entries: [string, any][]): Record<string, any> {
  const result: Record<string, any> = {};
  for (let i = 0; i < entries.length; i++) result[entries[i][0]] = entries[i][1];
  return result;
}
