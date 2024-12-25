import { CommandRunner } from 'nest-commander';
import { Logger } from './logger';

export abstract class BasicCommand extends CommandRunner {
  constructor(protected readonly logger: Logger) {
    super();
  }

  abstract run(passedParam: string[]): Promise<void>;
}
