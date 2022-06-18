import fs from 'fs';
import path from 'path';

/** Gets a boolean from the environment as true/false or 0/1. */
export function envBoolean(name: string, defaultValue?: boolean) {
  const value = process.env[name] ?? defaultValue;
  if (value === true || value === 'true' || value === '1') {
    return true;
  }
  if (value === false || value === 'false' || value === '0') {
    return false;
  }
  throw new Error(`Env variable ${name} must be 'true', 'false', '0' or '1'`);
}

/** Gets a string from the environment, only accepting given values. */
export function envEnum<V extends string | null>(name: string, values: readonly V[], defaultValue?: V) {
  const value = process.env[name] ?? defaultValue;
  if (values.includes(value as V)) {
    return value as V;
  }
  throw new Error(`Env variable ${name} must be one of ${values.map((val) => `'${val}'`).join(', ')}`);
}

/** Gets and parses and integer from the environment. */
export function envInteger(name: string, defaultValue: null): number | null;
export function envInteger(name: string, defaultValue?: number): number;
export function envInteger(name: string, defaultValue?: number | null) {
  const value = process.env[name];
  if (value === undefined && defaultValue !== undefined) {
    return defaultValue;
  }
  const number = parseInt(value as string);
  if (Number.isSafeInteger(number)) {
    return number;
  }
  throw new Error(`Env variable ${name} must be a valid number`);
}

/** Gets a string from the environment. */
export function envString(name: string, defaultValue: null): string | null;
export function envString(name: string, defaultValue?: string): string;
export function envString(name: string, defaultValue?: string | null) {
  const value = process.env[name] ?? defaultValue;
  if (value !== undefined) {
    return value;
  }
  throw new Error(`Env variable ${name} must be set`);
}

/**
 * Gets the location of the compiled frontend files from the environment or the default of 'frontend'.
 * Returns null if the environment variable is set but empty, or if the variable is unset and the default
 * directory does not exist.
 */
export function frontendFilesPath(): string | null {
  const envValue = process.env.FRONTEND_FILES_PATH;

  // Empty value disables frontend serving
  if (envValue === '') {
    return null;
  }

  // See if the given or default paths exist
  const frontendPath = path.resolve(envValue ?? 'frontend');
  if (fs.existsSync(frontendPath) && fs.statSync(frontendPath).isDirectory()) {
    return frontendPath;
  }

  if (envValue) {
    throw new Error(
      `Env variable FRONTEND_FILES_PATH is invalid: ${envValue} does not exist or is not a directory`,
    );
  }

  return null;
}
