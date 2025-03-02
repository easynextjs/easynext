import { Command } from 'nest-commander';
import { AbstractCommand } from '../abstract.command';
import output from '@/output-manager';

@Command({
  name: 'sentry',
  description: 'Sentry 설정을 프로젝트에 추가합니다',
})
export class SentryCommand extends AbstractCommand {
  async run(): Promise<void> {
    output.info('Sentry 설정을 추가하려면 다음 명령어를 복사하여 실행하세요:');
    output.info('npx @sentry/wizard@latest -i nextjs');
  }
}
