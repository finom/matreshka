// Number.isInteger, which IE 11 lacks
export default function isInteger(value: unknown): boolean {
  // biome-ignore lint/suspicious/noGlobalIsFinite: Number.isFinite is what IE 11 lacks; value is a number here
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
}
