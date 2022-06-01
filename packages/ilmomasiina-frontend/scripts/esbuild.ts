import { htmlPlugin } from '@craftamap/esbuild-plugin-html';
import { BuildOptions } from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const ENV = process.env.NODE_ENV || 'development';
if (!['development', 'production', 'test'].includes(ENV)) {
  console.error('NODE_ENV must be one of \'development\', \'production\', \'test\'');
  process.exit(1);
}

const PATH_PREFIX = process.env.PATH_PREFIX || '';
if (PATH_PREFIX.endsWith('/')) {
  console.error('PATH_PREFIX must omit the final /');
  process.exit(1);
}

function definitionsFromEnv(): Record<string, string> {
  const env = { // Globals defined in src/global.d.ts.
    DEV: ENV === 'development',
    PROD: ENV === 'production',
    TEST: ENV === 'test',
    COVERAGE: ENV === 'test',

    SENTRY_DSN: process.env.SENTRY_DSN || '',

    PREFIX_URL: PATH_PREFIX,
    API_URL: process.env.API_URL || '',
    BRANDING_HEADER_TITLE_TEXT: process.env.BRANDING_HEADER_TITLE_TEXT,
    BRANDING_FOOTER_GDPR_TEXT: process.env.BRANDING_FOOTER_GDPR_TEXT,
    BRANDING_FOOTER_GDPR_LINK: process.env.BRANDING_FOOTER_GDPR_LINK,
    BRANDING_FOOTER_HOME_TEXT: process.env.BRANDING_FOOTER_HOME_TEXT,
    BRANDING_FOOTER_HOME_LINK: process.env.BRANDING_FOOTER_HOME_LINK,
  };

  // Stringify values
  const config: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    config[key] = JSON.stringify(value);
  }

  return config;
}

/**
 * Esbuild build config
 *
 * Documentation: https://esbuild.github.io/api/
 */
const config: BuildOptions = {
  logLevel: 'info',
  entryPoints: ['src/index.tsx'],
  bundle: true,
  minify: true,
  metafile: true,
  plugins: [
    sassPlugin(),
    htmlPlugin({
      files: [
        {
          entryPoints: [
            'src/index.tsx',
          ],
          filename: 'index.html',
          htmlTemplate: readFileSync(resolve('src/index.html')).toString(),
          scriptLoading: 'module',
        },
      ],
    }),
  ],
  loader: {
    '.html': 'text',
    '.svg': 'dataurl',
  },
  outdir: 'build/',
  publicPath: `${PATH_PREFIX}/`,
  target: [
    'es2020',
    // "chrome58",
    // "firefox57",
    // "safari11",
    // "edge16",
  ],
  format: 'esm',
  splitting: true,
  define: definitionsFromEnv(),
  sourcemap: 'external',
  treeShaking: true,
};

export default config;
