import { isError, errorToString, isErrnoException } from '@vercel/error-utils';

try {
  // Test to see if cwd has been deleted before
  // importing 3rd party packages that might need cwd.
  process.cwd();
} catch (err: unknown) {
  if (isError(err) && err.message.includes('uv_cwd')) {
    console.error('Error: The current working directory does not exist.');
    process.exit(1);
  }
}

import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';
import output from './output-manager';
import { hp } from './util/humanize-path';
import * as eh from './util/error-handler';

import { version as PACKAGE_VERSION } from '../package.json';

import { mkdirp } from 'fs-extra';
import getGlobalPathConfig from './util/config/global-path';
import * as configFiles from './util/config/files';
import { GlobalConfig } from './global/global-config';
import {
  defaultAuthConfig,
  defaultGlobalConfig,
} from './util/config/get-default';
import { AuthConfig } from './global/auth-config';

const EASYNEXT_DIR = getGlobalPathConfig();
const EASYNEXT_CONFIG_PATH = configFiles.getConfigFilePath();
const EASYNEXT_AUTH_CONFIG_PATH = configFiles.getAuthConfigFilePath();

async function main() {
  output.log(`EasyNext v${PACKAGE_VERSION}`);

  try {
    await mkdirp(EASYNEXT_DIR);
  } catch (err: unknown) {
    output.error(
      `An unexpected error occurred while trying to create the global directory "${hp(
        EASYNEXT_DIR,
      )}" ${errorToString(err)}`,
    );
    return 1;
  }

  let config: GlobalConfig;
  try {
    config = configFiles.readConfigFile();
  } catch (err: unknown) {
    if (isErrnoException(err) && err.code === 'ENOENT') {
      config = defaultGlobalConfig;
      try {
        configFiles.writeToConfigFile(config);
      } catch (err: unknown) {
        output.error(
          `An unexpected error occurred while trying to save the config to "${hp(
            EASYNEXT_CONFIG_PATH,
          )}" ${errorToString(err)}`,
        );
        return 1;
      }
    } else {
      output.error(
        `An unexpected error occurred while trying to read the config in "${hp(
          EASYNEXT_CONFIG_PATH,
        )}" ${errorToString(err)}`,
      );
      return 1;
    }
  }

  let authConfig: AuthConfig;
  try {
    authConfig = configFiles.readAuthConfigFile();
  } catch (err: unknown) {
    if (isErrnoException(err) && err.code === 'ENOENT') {
      authConfig = defaultAuthConfig;
      try {
        configFiles.writeToAuthConfigFile(authConfig);
      } catch (err: unknown) {
        output.error(
          `An unexpected error occurred while trying to write the auth config to "${hp(
            EASYNEXT_AUTH_CONFIG_PATH,
          )}" ${errorToString(err)}`,
        );
        return 1;
      }
    } else {
      output.error(
        `An unexpected error occurred while trying to read the auth config in "${hp(
          EASYNEXT_AUTH_CONFIG_PATH,
        )}" ${errorToString(err)}`,
      );
      return 1;
    }
  }

  await CommandFactory.run(AppModule);

  return 0;
}

process.on('unhandledRejection', eh.handleRejection);
process.on('uncaughtException', eh.handleUnexpected);

main().then((code) => {
  process.exitCode = code;
});
