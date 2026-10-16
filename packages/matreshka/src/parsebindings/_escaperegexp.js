// escapes a string to use it in a regular expression as is
export default function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
