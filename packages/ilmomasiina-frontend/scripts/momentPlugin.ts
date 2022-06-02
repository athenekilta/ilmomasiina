import { Plugin } from 'esbuild';
import { readFileSync } from 'fs';

type Options = {
  timezone: string;
};

/** Removes unnecessary timezones from moment-timezone data files. */
export default function momentPlugin({ timezone }: Options): Plugin {
  return {
    name: 'momentPlugin',
    setup({ onLoad }) {
      onLoad({
        filter: /data[\\/]packed[\\/]latest\.json/,
      }, (args) => {
        const original = JSON.parse(readFileSync(args.path).toString());
        const trimmed = {
          ...original,
          zones: original.zones.filter((zone: string) => zone.startsWith('UTC|') || zone.startsWith(`${timezone}|`)),
          links: original.links.filter((link: string) => link.endsWith('|UTC')),
          countries: original.countries.filter((country: string) => country.includes(timezone)),
        };
        if (!trimmed.zones.some((zone: string) => zone.startsWith(`${timezone}|`))) {
          return {
            errors: [{
              text: `Unable to find timezone ${timezone} in moment-timezone data file.`,
            }],
          };
        }
        return {
          contents: `module.exports = ${JSON.stringify(trimmed)};`,
        };
      });
    },
  };
}
