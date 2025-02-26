import { isError } from '@vercel/error-utils';

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
import * as eh from './util/error-handler';

import { version as PACKAGE_VERSION } from '../package.json';
import output from './output-manager';

async function main() {
  output.info(`EasyNext CLI v${PACKAGE_VERSION}`);

  await CommandFactory.run(AppModule, output);

  return 0;
}

process.on('unhandledRejection', eh.handleRejection);
process.on('uncaughtException', eh.handleUnexpected);

const handleSigTerm = () => process.exit(0);

process.on('SIGINT', handleSigTerm);
process.on('SIGTERM', handleSigTerm);

main().then((code) => {
  process.exitCode = code;
});
