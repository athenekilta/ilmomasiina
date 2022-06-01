import { build } from 'esbuild';

import config from './esbuild';

build(config)
  .catch((err) => {
    console.error('Build failed:');
    console.error(err);
    process.exit(1);
  });
