// `PACKAGE=<dir> npm run patch|minor` releases one package: after the gates it bumps the version, commits, and pushes a
// `<dir>-v<version>` tag, whose push runs publish.yml. Several packages: one run each, in DIRS order.
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { DIRS } from './exports.mjs';

const type = process.argv[2];
const dir = process.env.PACKAGE;
if (!['patch', 'minor'].includes(type) || !DIRS.includes(dir)) {
  throw new Error(`Usage: PACKAGE=<${DIRS.join('|')}> npm run patch|minor`);
}

const sh = (command) => execSync(command, { stdio: 'inherit' });
const read = (command) => execSync(command, { encoding: 'utf8' }).trim();
const manifest = () => JSON.parse(readFileSync(`packages/${dir}/package.json`, 'utf8'));
if (read('git status --porcelain')) throw new Error('The tree is not clean; the release makes its own commit.');
// A range bump from an earlier run counts as a change, so a package that depends on a released one goes through.
// The first release under this scheme has no tag to compare with.
const last = `${dir}-v${manifest().version}`;
if (read(`git tag --list ${last}`) && !read(`git diff --name-only ${last} -- packages/${dir}`)) {
  throw new Error(`packages/${dir} is unchanged since ${last}`);
}

// the GitHub Release carries this section
const [major, minor, patch] = manifest().version.split('.').map(Number);
const next = type === 'minor' ? `${major}.${minor + 1}.0` : `${major}.${minor}.${patch + 1}`;
sh(`node scripts/changelog-section.mjs packages/${dir}/CHANGELOG.md ${next} >/dev/null`);

sh('npm run lint && npm run test:coverage && npm run build && npm run check:dist');
sh(`npm version ${type} --no-git-tag-version --prefix packages/${dir}`);
sh('node scripts/sync-internal-deps.mjs');

const { name, version } = manifest();
if (version !== next) throw new Error(`npm version gave ${version}, not ${next}`);
// `## [2.5.0] - unreleased` gets the release date
const changelog = `packages/${dir}/CHANGELOG.md`;
const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  changelog,
  readFileSync(changelog, 'utf8').replace(`## [${version}] - unreleased`, `## [${version}] - ${today}`)
);
sh(`git commit -am "chore(release): ${name}@${version}"`);
sh('git push');
sh(`git tag ${dir}-v${version} && git push origin ${dir}-v${version}`);
