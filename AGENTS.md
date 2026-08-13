# AGENTS.md

Grunt build environment for WordPress projects generated with `generator-wp-dev-env`. Npm package `wp-dev-env-grunt`. Not a standalone grunt plugin — only usable inside generated projects (which depend on it via `git+ssh://...#<version>`).

## Ecosystem (read before changing anything)

Part of the `wp-dev-env` toolset; works hand in hand with:

- `generator-wp-dev-env` — scaffolds projects and pins this package's version in its `subModules`.
- `wp-dev-env-frame` (composer `croox/wp-dev-env-frame`) — PHP side of generated projects.

Local checkouts on the author's machine (not guaranteed elsewhere): generator at `../generator-wp-dev-env`, frame at `../../php_composer/wp-dev-env-frame`.

Release order: bump version here ("Bump version X.Y.Z" commits), then update the generator's `subModules` and bump it.

## Commands

- `npm run lint` — `eslint .` (xo + prettier via `.eslintrc.js`); `npm run format` — `prettier . --write` (`.prettierrc`: tabs, single quotes).
- `npm install` in this repo **must** use `--legacy-peer-deps` — `@eater/grunt-po2mo@1.0.0` peers `grunt ~1.0.4` vs root `^1.6.1` (pre-existing conflict). Same for `npm audit fix --legacy-peer-deps`.
- `npm test` is a stub (`??? test missing`) — no real tests. Verify JS with `node --check <file>`.
- No lint/build tooling for this repo itself; grunt tasks run inside generated projects (`grunt` lists them).

## Known accepted-risk npm advisories

Remaining `npm audit` findings are build-time tooling; fixes need breaking changes or abandoned parents. Accepted and dismissed on GitHub:

- `adm-zip` via `grunt-contrib-compress@2.x` (crafted-zip DoS on our own build output; no fixed 2.x, force would downgrade to 1.6.0).
- `form-data`, `qs`, `minimatch`, `js-yaml`, `lodash` via legacy grunt plugin chains (`css-purge` → `request`, etc.).
- Note: this repo's lockfile does not reach generated projects — only dependency **ranges** in this `package.json` do (generated projects resolve them at `npm install` time).

## Structure & extension model

- `index.js` exports `startGrunt` (invoked by generated Gruntfiles) and `createHooks`.
- `grunt/tasks/` — task definitions; `grunt/config/` — config modules.
- Extensibility via `@wordpress/hooks`: `grunt.hooks.addFilter`/`addAction`. Full list of filter/action names in README.md. Generated projects override behavior in their own `./grunt/hooked/` files (each exports a function named after its basename).
- Default hooked tasks live in `grunt/hooked/` (e.g. `addDefaultBuildTasks.js` — priorities referenced from generated projects).

## Conventions

- Tabs; task/config files use the `const taskName = grunt => { ... }` pattern.
