// After `npm run test:coverage`: writes the shields.io endpoint the README's coverage badge reads, served by the site
// at /badges/coverage.json.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const { total } = JSON.parse(readFileSync('coverage/coverage-summary.json', 'utf8'));
const percent = total.lines.pct;
const color = percent >= 95 ? 'brightgreen' : percent >= 90 ? 'green' : percent >= 80 ? 'yellow' : 'red';

mkdirSync('docs/public/badges', { recursive: true });
writeFileSync(
  'docs/public/badges/coverage.json',
  `${JSON.stringify({ schemaVersion: 1, label: 'coverage', message: `${percent}%`, color })}\n`
);
console.log(`coverage badge: ${percent}%`);
