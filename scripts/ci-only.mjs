// prepublishOnly: the package publishes from publish.yml (trusted publishing, provenance), never from a laptop.
if (!process.env.GITHUB_ACTIONS) {
  console.error('Publish through a release tag: `npm run patch|minor|major|beta`.');
  process.exit(1);
}
