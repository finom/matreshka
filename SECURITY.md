# Security Policy

## Reporting

Use GitHub's private vulnerability reporting on this repository: [Report a vulnerability](https://github.com/finom/matreshka/security/advisories/new). Do not open a public issue. Include the version and a minimal page or script that reproduces it.

## Scope

In scope: code in this repository that turns data into DOM, for example a binder or the `{{key}}` bindings parser writing a value as HTML where the docs say it writes text, or prototype pollution through `set`, `calc`, `setData` or delegated event paths.

Out of scope: the `html` binder and `itemRenderer`/`renderer` templates, which write what they are given as HTML by design — escaping untrusted data before it reaches them is the application's job.

## Verifying a release

Every version is published from GitHub Actions through npm trusted publishing, with an npm provenance attestation signed through Sigstore. In a project that installs it, `npm audit signatures` checks the registry signature and the attestation; npm fetches the public keys itself (`https://registry.npmjs.org/-/npm/v1/keys`). Each GitHub Release carries the same attestation (`v<version>.intoto.jsonl`).

## Handling a report

1. The maintainer acknowledges the report within 14 days.
2. The maintainer reproduces it and agrees on the impact with the reporter in the private advisory.
3. The fix gets a regression test that fails on the code before it, and ships as a patch release of the latest version, within 60 days for a confirmed vulnerability.
4. The advisory is published with the release, with a CVE when one applies, and the CHANGELOG entry links it.

Reporters are credited in the advisory and the CHANGELOG entry, unless they ask not to be.

## What you can expect

- A value bound with a text binder (`text`, the default binders for inputs and outputs, `{{key}}` in markup) is written as text, never parsed as HTML.
- A key named `__proto__`, `constructor` or `toString` (`set`, `setData`) is stored as an own key, and a path through `__proto__` (`calc`, `bindNode`, `on('a.b@…')`) never reaches `Object.prototype`.
- The library runs no code from strings (no `eval`, no `new Function`), so it works under a Content Security Policy without `unsafe-eval`.
- No runtime dependencies.

What it does not do: the `html` binder and the `itemRenderer`/`renderer` templates write HTML by design, and an attribute binder writes the value as given (a `javascript:` URL in an `href` included). Escaping or checking untrusted data before it reaches them is the application's job.

## Assurance case

- **Threat model.** The attacker controls data the application puts into Matreshka objects: field values typed into a page, JSON from a server, keys of that JSON. The attacker does not control the application's code, its templates or its binder choices.
- **Trust boundary.** Values and keys are untrusted; code, selectors, templates and binders are trusted. The library treats every value as data and every key as a plain name.
- **Why the requirements hold.** Text binders write through `textContent`, `value` and similar DOM properties, never `innerHTML`. Per-object state lives in a `WeakMap`, in tables made with `Object.create(null)`, and a `__proto__` step in a key or a path reads and writes only an own property, so no key reaches `Object.prototype`. There is no code path that turns a string into code. Secure design principles: least privilege (the library only touches the nodes it is given), fail-safe defaults (text, not HTML, unless the `html` binder is chosen), economy of mechanism (no dependencies, one small DOM layer).
- **Weaknesses countered.** CWE-79 (XSS) through the text-only defaults; CWE-1321 (prototype pollution) through null-prototype tables and own-property `__proto__` steps; CWE-1333 (ReDoS) through regexes CodeQL checks for polynomial backtracking; CWE-94 (code injection) through no string evaluation; supply-chain attacks through zero dependencies, actions pinned by SHA, trusted publishing and provenance.
- **Evidence.** Tests for each of these, in `test/spec/regressions/` (`codeql_2026_10_17_spec.js` holds the CodeQL findings) and the property tests in `test/spec/properties_spec.js`; 100% coverage; CodeQL on every push and pull request, with no open alerts; OpenSSF Scorecard on `main`.

## Terms

Fixes ship in the latest version — no backports. The software is provided **as is**, without warranty of any kind, per the [MIT license](./LICENSE).
