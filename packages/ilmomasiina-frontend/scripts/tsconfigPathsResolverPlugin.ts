import { Plugin } from 'esbuild';
import { readFileSync, statSync } from 'fs';
import { dirname, resolve } from 'path';

type TSConfigPaths = Record<string, string[]>;

type TSConfig = {
  compilerOptions?: {
    baseUrl?: string;
    paths?: TSConfigPaths;
  };
};

export type ReferencesResolverOptions = {
  /** Path to tsconfig.json file. */
  tsconfigPath?: string;
  /** Base URL as specified in tsconfig `compilerOptions.baseUrl`. Overrides value from tsconfig. */
  baseUrl?: string;
  /** Path mappings as specified in tsconfig `compilerOptions.paths`. Overrides value from tsconfig. */
  paths?: TSConfigPaths;
};

/* eslint-disable no-param-reassign */

function computePaths({
  tsconfigPath,
  baseUrl,
  paths,
}: ReferencesResolverOptions) {
  if (tsconfigPath) {
    // parse relevant values from tsconfig
    const tsconfig = JSON.parse(readFileSync(tsconfigPath).toString()) as TSConfig;
    baseUrl ||= resolve(dirname(tsconfigPath), tsconfig.compilerOptions?.baseUrl ?? '.');
    paths ||= tsconfig.compilerOptions?.paths ?? {};
  }

  if (!baseUrl) throw new Error('No baseUrl given or found in tsconfig.');
  if (!paths) throw new Error('No paths given or found in tsconfig.');

  // build regex patterns of paths
  const patterns = Object.entries(paths).map(([pattern, targets]) => {
    // check for regex special characters
    const cleaned = pattern.replace(/\*$/, ''); // only one * allowed at end
    if (/[\\^$[\]{}()|*+?]/.test(cleaned)) throw new Error(`Can't handle tsconfig path with regex chars: ${pattern}`);
    // create regex
    return [
      new RegExp(`^${pattern.replace(/\*$/, '(.*)')}$`),
      targets,
    ] as const;
  });

  // construct filter for plugin
  const filter = new RegExp(
    Object.keys(paths)
      .map((pattern) => `^${pattern.replace(/\*$/, '.*')}$`)
      .join('|'),
  );

  return { baseUrl, patterns, filter };
}

// https://www.typescriptlang.org/docs/handbook/module-resolution.html#how-typescript-resolves-modules
const suffixes = [
  '', '.ts', '.tsx', '.d.ts', '/index.ts', '/index.tsx', '/index.d.ts',
];

export default function tsconfigPathsResolverPlugin(options: ReferencesResolverOptions): Plugin {
  const { baseUrl, patterns, filter } = computePaths(options);

  return {
    name: 'references-resolver',
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
                const resolved = resolve(baseUrl, result + suffix);
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
