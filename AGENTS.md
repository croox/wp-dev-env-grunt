# AGENTS.md

Grunt build environment for WordPress projects generated with `generator-wp-dev-env`. Npm package `wp-dev-env-grunt`. Not a standalone grunt plugin — only usable inside generated projects (which depend on it via `git+ssh://...#<version>`).

## Ecosystem (read before changing anything)

Part of the `wp-dev-env` toolset; works hand in hand with:

- `generator-wp-dev-env` — scaffolds projects and pins this package's version in its `subModules`.
- `wp-dev-env-frame` (composer `croox/wp-dev-env-frame`) — PHP side of generated projects.

Local checkouts on the author's machine (not guaranteed elsewhere): generator at `../generator-wp-dev-env`, frame at `../../php_composer/wp-dev-env-frame`.

Release order: bump version here ("Bump version X.Y.Z" commits), then update the generator's `subModules` and bump it.

## Commands

- `npm test` is a stub (`??? test missing`) — no real tests. Verify JS with `node --check <file>`.
- No lint/build tooling for this repo itself; grunt tasks run inside generated projects (`grunt` lists them).

## Structure & extension model

- `index.js` exports `startGrunt` (invoked by generated Gruntfiles) and `createHooks`.
- `grunt/tasks/` — task definitions; `grunt/config/` — config modules.
- Extensibility via `@wordpress/hooks`: `grunt.hooks.addFilter`/`addAction`. Full list of filter/action names in README.md. Generated projects override behavior in their own `./grunt/hooked/` files (each exports a function named after its basename).
- Default hooked tasks live in `grunt/hooked/` (e.g. `addDefaultBuildTasks.js` — priorities referenced from generated projects).

## Conventions

- Tabs; task/config files use the `const taskName = grunt => { ... }` pattern.
