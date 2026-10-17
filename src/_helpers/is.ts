// Object.is, which IE 11 lacks: NaN is NaN, 0 is not -0
export default function is(a: any, b: any): boolean {
  // biome-ignore lint/suspicious/noSelfCompare: only NaN differs from itself
  return a === b ? a !== 0 || 1 / a === 1 / b : a !== a && b !== b;
}
