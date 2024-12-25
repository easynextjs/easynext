import { CommandRunner } from 'nest-commander';

export abstract class AbstractCommand extends CommandRunner {
  abstract run(passedParam: string[]): Promise<void>;
}
