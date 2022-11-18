import { configureApi } from '../api';
import { configureRouter, RouterConfig } from './router';

export type { RouterConfig };

export interface IlmoConfig {
  router: RouterConfig;
  api: string;
  timezone: string;
}

let configuredTimezone = 'Europe/Helsinki';

export function configure(config: IlmoConfig) {
  configureApi(config.api);
  configureRouter(config.router);
  configuredTimezone = config.timezone;
}

export function timezone() {
  return configuredTimezone;
}
