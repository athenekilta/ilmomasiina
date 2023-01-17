import { Plugin } from 'esbuild';
import { readFileSync, statSync } from 'fs';
import { dirname, resolve } from 'path';

// find tsconfig
const tsconfigPath = resolve(__dirname, '..', 'tsconfig.json');

// parse relevant values from tsconfig
const tsconfig = JSON.parse(readFileSync(tsconfigPath).toString());
const basePath = resolve(dirname(tsconfigPath), tsconfig.compilerOptions?.baseUrl ?? '.');
const paths = Object.entries(tsconfig.compilerOptions?.paths ?? {});

// build regex patterns of paths
const patterns = paths.map(([pattern, targets]) => {
  // check for regex special characters
  const cleaned = pattern.replace(/\*$/, ''); // only one * allowed at end
  if (/[\\^$[\]{}()|*+?]/.test(cleaned)) throw new Error(`Can't handle tsconfig path with regex chars: ${pattern}`);
  // create regex
  return [
    new RegExp(`^${pattern.replace(/\*$/, '(.*)')}$`),
    targets as string[],
  ] as const;
});

// construct filter for plugin
const filter = new RegExp(
  paths
    .map(([pattern]) => `^${pattern.replace(/\*$/, '.*')}$`)
    .join('|'),
);

// https://www.typescriptlang.org/docs/handbook/module-resolution.html#how-typescript-resolves-modules
const suffixes = [
  '', '.ts', '.tsx', '.d.ts', '/index.ts', '/index.tsx', '/index.d.ts',
];

export default function tsconfigPathsResolverPlugin(): Plugin {
  return {
    name: 'tsconfig-paths-resolver',
    setup(build) {
      build.onResolve({ filter }, ({ path }) => {
        for (const [pattern, targets] of patterns) {
          const match = pattern.exec(path);
          if (match) {
            for (const target of targets) {
              // replace * with corresponding path
              const result = match.length > 1 ? target.replace(/\*$/, match[1]) : target;
              // try various extensions for the path
              for (const suffix of suffixes) {
                // build final path
                const resolved = resolve(basePath, result + suffix);
                // see if it resolves to a file
                try {
                  const stat = statSync(resolved);
                  if (stat.isFile()) {
                    return { path: resolved };
                  }
                } catch (err) { /* not found, ignore */ }
              }
            }
          }
        }
        // nothing found :(
        return undefined;
      });
    },
  };
}
