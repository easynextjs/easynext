import { Command } from 'nest-commander';
import { AbstractCommand } from '../abstract.command';
import output from '@/output-manager';
import i18n from '@/util/i18n';

@Command({
  name: 'sentry',
  description: 'Sentry 설정을 프로젝트에 추가합니다',
})
export class SentryCommand extends AbstractCommand {
  async run(): Promise<void> {
    output.info(i18n.t('sentry.installing'));
    output.info('npx @sentry/wizard@latest -i nextjs');
  }
}
