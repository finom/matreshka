# Security Policy

## Reporting

Use GitHub's private vulnerability reporting on this repository: [Report a vulnerability](https://github.com/finom/matreshka/security/advisories/new). Do not open a public issue. Include the version and a minimal page or script that reproduces it.

## Scope

In scope: code in this repository that turns data into DOM, for example a binder or the `{{key}}` bindings parser writing a value as HTML where the docs say it writes text, or prototype pollution through `set`, `calc`, `setData` or delegated event paths.

Out of scope: the `html` binder and `itemRenderer`/`renderer` templates, which write what they are given as HTML by design — escaping untrusted data before it reaches them is the application's job.

## Verifying a release

Every version is published from GitHub Actions with npm provenance. `npm audit signatures` in a project that installs it checks the signature and the attestation.

## Terms

Fixes ship in the latest version — no backports. The software is provided **as is**, without warranty of any kind, per the [MIT license](./LICENSE).
