import { CommandFactory } from 'nest-commander';
import { AppModule } from './app.module';
import { Logger } from './logger';

import { version as PACKAGE_VERSION } from '../package.json';

async function bootstrap() {
  const logger = new Logger();

  console.log(`EasyNext v${PACKAGE_VERSION}`);

  await CommandFactory.run(AppModule, logger);
}
bootstrap();
