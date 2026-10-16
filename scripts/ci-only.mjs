// prepublishOnly: packages publish from publish.yml (trusted publishing, provenance), never from a laptop.
if (!process.env.GITHUB_ACTIONS) {
  console.error('Publish through a release tag: `PACKAGE=<dir> npm run patch|minor`.');
  process.exit(1);
}
