import { isError, errorToString } from '@vercel/error-utils';

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
import { Logger } from './global/logger';
import { hp } from './util/humanize-path';
import * as eh from './util/error-handler';

import { version as PACKAGE_VERSION } from '../package.json';

import getGlobalPathConfig from './util/config/global-path';
import { mkdirp } from 'fs-extra';

const EASYNEXT_DIR = getGlobalPathConfig();

async function main() {
  const logger = new Logger();

  logger.base(`EasyNext v${PACKAGE_VERSION}`);

  try {
    await mkdirp(EASYNEXT_DIR);
  } catch (err: unknown) {
    logger.error(
      `An unexpected error occurred while trying to create the global directory "${hp(
        EASYNEXT_DIR,
      )}" ${errorToString(err)}`,
    );
    return 1;
  }

  await CommandFactory.run(AppModule, logger);

  return 0;
}

process.on('unhandledRejection', eh.handleRejection);
process.on('uncaughtException', eh.handleUnexpected);

main().then((code) => {
  process.exitCode = code;
});
