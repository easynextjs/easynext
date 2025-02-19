import { Command, CommandRunner } from 'nest-commander';
import * as chalk from 'chalk';
import { GlobalConfig } from '@/global/config/global.config';
import { writeToAuthConfigFile } from '@/util/config/files';

@Command({
  name: 'login',
  description: '토큰정보 로그인합니다',
  arguments: '<token>',
})
export class LoginCommand extends CommandRunner {
  constructor(private config: GlobalConfig) {
    super();
  }

  async run(passedParams: string[]): Promise<void> {
    const [token] = passedParams;

    if (!token) {
      console.error(chalk.red('토큰 정보를 입력해주세요.'));
      console.error(chalk.yellow('사용법: easynext login <token>'));
      process.exit(1);
    }

    try {
      console.log(chalk.blue('로그인 정보 확인중...'));

      const result = await fetch(`https://easynext.org/api/premium/cli-login`, {
        method: 'POST',
        body: JSON.stringify({ token }),
      }).then((res) => res.json());

      if (!isValidResult(result) || !result?.success || !result?.access_token) {
        console.error(
          chalk.red('로그인 실패:'),
          '알 수 없는 오류가 발생했습니다.',
        );
        process.exit(1);
      }

      writeToAuthConfigFile({ ...this.config, token: result.access_token });

      console.log(chalk.green('로그인 성공!'));
      console.log(chalk.green('프리미엄 이용권 활성화 완료!'));
    } catch (error) {
      console.error(chalk.red('예상치 못한 오류가 발생했습니다:'), error);
      process.exit(1);
    }
  }
}

function isValidResult(
  result: unknown,
): result is { success: boolean; access_token: string } {
  return (
    typeof result === 'object' &&
    result !== null &&
    'success' in result &&
    'access_token' in result &&
    typeof result.access_token === 'string'
  );
}
