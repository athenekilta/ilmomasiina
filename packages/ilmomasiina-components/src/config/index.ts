import { configurePaths, IlmoPaths } from './paths';
import { configureRouter, RouterConfig } from './router';

export interface IlmoConfig {
  router: RouterConfig;
  paths: IlmoPaths;
  timezone: string;
}

let configuredTimezone = 'Europe/Helsinki';

export function configure(config: IlmoConfig) {
  configurePaths(config.paths);
  configureRouter(config.router);
  configuredTimezone = config.timezone;
}

export function timezone() {
  return configuredTimezone;
}
