import { Command } from 'nest-commander';
import { AbstractCommand } from '../abstract.command';
import { initSupabase } from './actions/init';
import output from '@/output-manager';
import { checkRoot } from '@/util/check-root';

@Command({
  name: 'supabase',
  description: 'Supabase 설정을 프로젝트에 추가합니다',
})
export class SupabaseCommand extends AbstractCommand {
  async run(passedParam: string[]): Promise<void> {
    // 1. package.json 확인
    if (!checkRoot()) {
      output.error(
        'package.json을 찾을 수 없습니다. 프로젝트 루트 디렉토리에서 실행해주세요.',
      );
      process.exit(1);
    }

    if (passedParam.length === 0) {
      initSupabase();
    } else if (passedParam[0] === 'init') {
      initSupabase();
    } else {
      output.error('지원하지 않는 명령어입니다.');
    }
  }
}
