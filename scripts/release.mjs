// `npm run <patch|minor|major|beta|beta-minor|beta-major>` releases the package: the gates, a version bump, the
// CHANGELOG's `## [Unreleased]` section becomes the version's section, a commit pushed to main, then the
// `v<version>` tag, whose push runs .github/workflows/publish.yml. `-- --dry-run` stops before the commit and undoes
// the changes.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const TYPES = {
  patch: ['patch'],
  minor: ['minor'],
  major: ['major'],
  beta: ['prerelease', '--preid', 'beta'],
  'beta-minor': ['preminor', '--preid', 'beta'],
  'beta-major': ['premajor', '--preid', 'beta']
};
const REPO = 'https://github.com/finom/matreshka';

const type = process.argv[2];
const dryRun = process.argv.includes('--dry-run') || process.env.npm_config_dry_run === 'true';
const fail = (message) => {
  console.error(`release: ${message}`);
  process.exit(1);
};
if (!Object.hasOwn(TYPES, type)) fail(`usage: npm run <${Object.keys(TYPES).join('|')}> [-- --dry-run]`);

process.chdir(fileURLToPath(new URL('..', import.meta.url)));
const run = (command, args) => execFileSync(command, args, { stdio: 'inherit' });
const read = (command, args) => execFileSync(command, args, { encoding: 'utf8' }).trim();

if (read('git', ['status', '--porcelain', '--untracked-files=all'])) {
  fail('the tree is not clean; the release makes its own commit');
}
const branch = read('git', ['branch', '--show-current']);
if (branch !== 'main') fail(`on ${branch || 'a detached HEAD'}; releases go from main`);

// [Unreleased] holds the changes; an empty one has nothing to release
const changelog = readFileSync('CHANGELOG.md', 'utf8');
const unreleased = /^## \[Unreleased\]\n([\s\S]*?)(?=^## |^\[[^\]]+\]: |(?![\s\S]))/m.exec(changelog);
if (!unreleased?.[1].trim()) fail('CHANGELOG.md has nothing under ## [Unreleased]');

run('npm', ['run', 'lint']);
run('npm', ['run', 'typecheck']);
run('npm', ['run', 'test:coverage']);
run('npm', ['run', 'build']);
run('npm', ['run', 'check:dist']);

run('npm', ['version', ...TYPES[type], '--no-git-tag-version', '--no-workspaces-update']);
const { version } = JSON.parse(readFileSync('package.json', 'utf8'));
const tag = `v${version}`;
const today = new Date().toISOString().slice(0, 10);

// Keep a Changelog: the section gets the version and the date, and both get a link at the bottom
const previous = /^\[(\d[^\]]*)\]: /m.exec(changelog)?.[1];
let updated = changelog.replace('## [Unreleased]\n', `## [Unreleased]\n\n## [${version}] - ${today}\n`);
updated = updated.replace(/^\[Unreleased\]: .*$/m, `[Unreleased]: ${REPO}/compare/${tag}...HEAD`);
const link = previous ? `${REPO}/compare/v${previous}...${tag}` : `${REPO}/releases/tag/${tag}`;
updated = updated.replace(/^(\[Unreleased\]: .*)$/m, `$1\n[${version}]: ${link}`);
writeFileSync('CHANGELOG.md', updated);
run('node', ['scripts/changelog-section.mjs', 'CHANGELOG.md', version]);

if (dryRun) {
  run('git', ['checkout', '--', 'package.json', 'package-lock.json', 'CHANGELOG.md']);
  console.log(`release: dry run; would commit, push and tag ${tag}`);
  process.exit(0);
}

run('git', ['commit', '-am', `chore(release): ${version}`]);
run('git', ['push', 'origin', 'main']);
run('git', ['tag', tag]);
run('git', ['push', 'origin', tag]);
