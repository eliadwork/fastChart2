// patch-package applies the text patches; this installs their matching WASM assets.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

function applyWasm() {
  const projectRoot = path.resolve(process.argv[2] || process.cwd());
  const assetsRoot = path.resolve(__dirname, '../patches/wasm');
  const manifest = JSON.parse(fs.readFileSync(path.join(assetsRoot, 'manifest.json'), 'utf8'));
  const packageJson = require.resolve('scichart/package.json', { paths: [projectRoot] });
  const installed = JSON.parse(fs.readFileSync(packageJson, 'utf8'));
  if (installed.name !== manifest.package || installed.version !== manifest.version) {
    throw new Error(`Expected ${manifest.package}@${manifest.version}, found ${installed.name}@${installed.version}.`);
  }
  const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
  // Validate every input before modifying any installed asset.
  const operations = manifest.files.map(entry => {
    if (!/^scichart(?:2d|3d)(?:-nosimd)?\.wasm$/.test(entry.file)) {
      throw new Error(`Unexpected WASM filename: ${entry.file}`);
    }
    const bytes = fs.readFileSync(path.join(assetsRoot, entry.file));
    if (hash(bytes) !== entry.patchedSha256) throw new Error(`Patch asset checksum mismatch: ${entry.file}`);
    const destination = path.join(path.dirname(packageJson), '_wasm', entry.file);
    const currentHash = hash(fs.readFileSync(destination));
    if (![entry.originalSha256, entry.patchedSha256].includes(currentHash)) {
      throw new Error(`Unrecognized installed ${entry.file}; expected the original release or this patch's output.`);
    }
    return { destination, bytes, entry, alreadyApplied: currentHash === entry.patchedSha256 };
  });
  for (const operation of operations) {
    if (!operation.alreadyApplied) {
      const temporary = `${operation.destination}.newchart-${process.pid}.tmp`;
      try {
        fs.writeFileSync(temporary, operation.bytes, { flag: 'wx' });
        fs.renameSync(temporary, operation.destination);
      } finally {
        if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
      }
    }
    console.log(`${operation.entry.file}: ${operation.alreadyApplied ? 'already applied' : 'updated'}`);
  }
}

try {
  applyWasm();
} catch (error) {
  console.error(`WASM patch failed: ${error.message}`);
  process.exitCode = 1;
}
