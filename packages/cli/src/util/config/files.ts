import { join } from 'path';
import loadJSON from 'load-json-file';
import writeJSON from 'write-json-file';
import getGlobalPathConfig from './global-path';
import highlight from '../output/highlight';
import { isErrnoException } from '@vercel/error-utils';

import output from '@/output-manager';
import { GlobalConfig } from '@/global/config/global.config';
import { AuthConfig } from '@/global/config/auth.config';

const EASYNEXT_DIR = getGlobalPathConfig();
const CONFIG_FILE_PATH = join(EASYNEXT_DIR, 'config.json');
const AUTH_CONFIG_FILE_PATH = join(EASYNEXT_DIR, 'auth.json');

// reads "global config" file atomically
export const readConfigFile = (): GlobalConfig => {
  return loadJSON.sync(CONFIG_FILE_PATH);
};

// writes whatever's in `stuff` to "global config" file, atomically
export const writeToConfigFile = (stuff: GlobalConfig): void => {
  try {
    return writeJSON.sync(CONFIG_FILE_PATH, stuff, { indent: 2 });
  } catch (err: unknown) {
    if (isErrnoException(err)) {
      if (isErrnoException(err) && err.code === 'EPERM') {
        output.error(
          `Not able to create ${highlight(
            CONFIG_FILE_PATH,
          )} (operation not permitted).`,
        );
        process.exit(1);
      } else if (err.code === 'EBADF') {
        output.error(
          `Not able to create ${highlight(
            CONFIG_FILE_PATH,
          )} (bad file descriptor).`,
        );
        process.exit(1);
      }
    }

    throw err;
  }
};

// reads "auth config" file atomically
export const readAuthConfigFile = (): AuthConfig => {
  const config = loadJSON.sync(AUTH_CONFIG_FILE_PATH);
  return config;
};

export const writeToAuthConfigFile = (authConfig: AuthConfig) => {
  if (authConfig.skipWrite) {
    return;
  }
  try {
    return writeJSON.sync(AUTH_CONFIG_FILE_PATH, authConfig, {
      indent: 2,
      mode: 0o600,
    });
  } catch (err: unknown) {
    if (isErrnoException(err)) {
      if (err.code === 'EPERM') {
        output.error(
          `Not able to create ${highlight(
            AUTH_CONFIG_FILE_PATH,
          )} (operation not permitted).`,
        );
        process.exit(1);
      } else if (err.code === 'EBADF') {
        output.error(
          `Not able to create ${highlight(
            AUTH_CONFIG_FILE_PATH,
          )} (bad file descriptor).`,
        );
        process.exit(1);
      }
    }

    throw err;
  }
};

export function getConfigFilePath() {
  return CONFIG_FILE_PATH;
}

export function getAuthConfigFilePath() {
  return AUTH_CONFIG_FILE_PATH;
}
