// converts a relative index (negative counts from the end) to an index within 0..length, like native methods do
export default function toAbsoluteIndex(value: any, length: number, defaultValue = 0): number {
  if (typeof value === 'undefined') {
    return defaultValue;
  }

  // Math.trunc, which IE 11 lacks
  const number = +value;
  const relative = (number < 0 ? Math.ceil(number) : Math.floor(number)) || 0;

  return relative < 0 ? Math.max(length + relative, 0) : Math.min(relative, length);
}
