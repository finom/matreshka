// Prints one version's CHANGELOG section, the text its GitHub Release carries; fails when there is none.
// node scripts/changelog-section.mjs <CHANGELOG.md> <version>
import { readFileSync } from 'node:fs';

const [file, version] = process.argv.slice(2);
if (!file || !version) {
  console.error('usage: node scripts/changelog-section.mjs <CHANGELOG.md> <version>');
  process.exit(1);
}

const lines = readFileSync(file, 'utf8').split('\n');
// `## 1.2.3 - date`, or Keep a Changelog's `## [1.2.3] - date`
const isHeading = (line) =>
  line === `## ${version}` || line.startsWith(`## ${version} `) || line.startsWith(`## [${version}]`);
const start = lines.findIndex(isHeading);
// the section ends at the next version heading or at the link list
const isEnd = (line, index) => index > start && (line.startsWith('## ') || /^\[[^\]]+\]: /.test(line));
const end = lines.findIndex(isEnd);
const body = start === -1 ? [] : lines.slice(start + 1, end === -1 ? undefined : end);
const section = body.join('\n').trim();

if (!section) {
  console.error(`${file} has no section for ${version}`);
  process.exit(1);
}
process.stdout.write(`${section}\n`);
