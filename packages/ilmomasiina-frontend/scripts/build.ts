import { build } from 'esbuild';

import configure from './esbuild';

const config = configure('production');

build(config)
  .then((result) => {
    if (!process.argv.includes('--reportBundleSize')) return result;

    const { inputs } = result.metafile!.outputs['build/index.js'];

    const totals = new Map<string, number>();
    for (const [path, { bytesInOutput }] of Object.entries(inputs)) {
      // extract package name from path
      const names = path.replace(/\\/g, '/').match(/\/node_modules\/(?:@[^/]+\/)?[^/]+/g) || ['.'];
      const lastName = names[names.length - 1].replace('/node_modules/', '');
      // count size
      totals.set(lastName, (totals.get(lastName) ?? 0) + bytesInOutput);
    }

    // sort by name
    const sorted = Array.from(totals.entries())
      .sort(([aName], [bName]) => aName.localeCompare(bName));
    const longest = sorted.reduce((prev, [name]) => Math.max(prev, name.length), 0);

    process.stderr.write('\nPackage sizes in output:\n');
    for (const [name, bytes] of sorted) {
      process.stderr.write(`  ${name.padEnd(longest)} ${String(bytes).padStart(8)} B\n`);
    }

    return result;
  })
  .catch((err) => {
    console.error('Build failed:');
    console.error(err);
    process.exit(1);
  });
