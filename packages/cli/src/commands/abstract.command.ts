import { CommandRunner } from 'nest-commander';
import { Logger } from '@/global/logger';

export abstract class AbstractCommand extends CommandRunner {
  constructor(protected readonly logger: Logger) {
    super();
  }

  abstract run(passedParam: string[]): Promise<void>;
}
