import { Command } from 'nest-commander';
import { AbstractCommand } from '../abstract.command';
import { initSupabase } from './actions/init';
import output from '@/output-manager';
import { assertRoot } from '@/util/check-root';
import i18n from '@/util/i18n';

@Command({
  name: 'supabase',
  description: 'Supabase 설정을 프로젝트에 추가합니다',
})
export class SupabaseCommand extends AbstractCommand {
  async run(passedParam: string[]): Promise<void> {
    assertRoot();

    if (passedParam.length === 0) {
      await initSupabase();
    } else if (passedParam[0] === 'init') {
      await initSupabase();
    } else {
      output.error('지원하지 않는 명령어입니다.');
    }
  }
}
