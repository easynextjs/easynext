import { Command } from 'nest-commander';
import { AbstractCommand } from '../abstract.command';
import output from '@/output-manager';

@Command({ name: 'lang', description: 'Set language' })
export class LangCommand extends AbstractCommand {
  async run() {
    output.log('Lang is checking the system');
  }
}
