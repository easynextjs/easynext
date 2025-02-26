import { Command, CommandRunner } from 'nest-commander';
import output from '../../output-manager';
import { initAuth } from './actions/init';
import { addIdpw } from './actions/idpw';
import { addKakao } from './actions/kakao';
import { assertRoot } from '@/util/check-root';

@Command({
  name: 'auth',
  description: 'Next-Auth 인증 설정',
  arguments: '[action]',
})
export class AuthCommand extends CommandRunner {
  async run(passedParam: string[]): Promise<void> {
    assertRoot();

    const action = passedParam[0] || 'init';

    switch (action) {
      case 'init':
        await initAuth();
        break;
      case 'idpw':
        await addIdpw();
        break;
      case 'kakao':
        await addKakao();
        break;
      default:
        output.error(`알 수 없는 액션: ${action}`);
        output.info('사용 가능한 액션: init, idpw, kakao');
        process.exit(1);
    }
  }
}
