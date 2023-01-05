import { configureApi } from '../api';
import { configureRouter, RouterConfig } from './router';

export type { RouterConfig };

export interface IlmoConfig {
  /** Integrate with your client-side router. Necessary only if you use React components. */
  router?: RouterConfig;
  /** API base path. Defaults to /api. */
  api?: string;
  /** Time zone. Defaults to Europe/Helsinki. */
  timezone?: string;
}

let configuredTimezone = 'Europe/Helsinki';

export function configure(config: IlmoConfig) {
  if (config.api !== undefined) configureApi(config.api);
  if (config.router !== undefined) configureRouter(config.router);
  if (config.timezone !== undefined) configuredTimezone = config.timezone;
}

export function timezone() {
  return configuredTimezone;
}
