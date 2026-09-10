# Install the package patches

Targets: **scichart 5.0.178** and **scichart-react 1.0.0**. Generated against fresh npm releases, not the repository's initial commit.

Copy this entire `patches/` directory and `scripts/apply-scichart-wasm.cjs` into the consuming project's root, preserving their relative locations. Replace any older patches for these same packages with these consolidated patches; do not apply the previous watermark/heap-write patch on top.

Install the matching packages and patch tool:

```sh
npm install --save-exact scichart@5.0.178 scichart-react@1.0.0
npm install --save-dev patch-package@8.0.1
```

If the project already has an install hook that applies old patches, update the patch files and hook before reinstalling.

Run:

```sh
npx patch-package --error-on-fail
node scripts/apply-scichart-wasm.cjs
```

For repeat installs, merge this into the application's `package.json` scripts:

```json
{
  "postinstall": "patch-package --error-on-fail && node scripts/apply-scichart-wasm.cjs"
}
```

If the app serves WASM from `public/` and already has a `copy:wasm` script, run the copy **after** both patch steps:

```json
{
  "postinstall": "patch-package --error-on-fail && node scripts/apply-scichart-wasm.cjs && npm run copy:wasm"
}
```

Restart the development server and reload the page after changing its served files.

## Included changes

- `scichart+5.0.178.patch`: all current text-file changes in the chart package, including branding, licensing/watermark modifications, and browser WASM URL defaults.
- `scichart-react+1.0.0.patch`: current React wrapper README and metadata changes. Its executable code is identical to upstream.
- `wasm/`: the four repaired native binaries plus their original/patched SHA-256 checksums.
- The companion script validates package version and all asset checksums before replacing binaries. Re-running it is safe.

**patch-package does not apply Git binary patches.** Running only `patch-package` leaves the original WASM installed. The companion script is necessary to install the matching native changes. It uses Node's built-in modules and requires no compiler.

Package names and versions remain `scichart@5.0.178` and `scichart-react@1.0.0` to preserve dependency resolution, peer compatibility, and versioned patch names. Other current metadata changes are included. These patches do not rename the installed packages to `newchart`.

These artifacts reproduce the current package changes; they are not an additional cleanup of every remaining legacy licensing helper or alternate entry point. In particular, they retain the CommonJS draw-call suppression and branding-only modifications of the older `index.dev.js` / `index.min.js` files identified in `UPSTREAM-COMPARISON.md`.

The root demo, server, WAT sources, and audit reports are not part of the npm-package patches. No files in the consuming app are changed until you copy and run these artifacts there.

## Verification

Tested with patch-package 8.0.1 against a clean installation of both target releases. Both text patches and the WASM installer applied successfully twice. All 1,518 package files matched the local copies after normalizing line endings and preserving upstream package names/versions; all four WASM files matched byte-for-byte.
