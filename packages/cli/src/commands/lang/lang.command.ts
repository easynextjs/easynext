import { Command } from 'nest-commander';
import { AbstractCommand } from '../abstract.command';
import { Logger } from '@/global/logger';

@Command({ name: 'lang', description: 'Set language' })
export class LangCommand extends AbstractCommand {
  constructor(protected readonly logger: Logger) {
    super(logger);
  }

  async run() {
    this.logger.info('Lang is checking the system');
  }
}
