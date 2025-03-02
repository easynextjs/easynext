import { Command, CommandRunner } from 'nest-commander';
import * as chalk from 'chalk';
import { writeToAuthConfigFile } from '@/util/config/files';
import { AuthConfig } from '@/global/config/auth.config';
import i18n from '@/util/i18n';
import output from '@/output-manager';

@Command({
  name: 'login',
  description: '토큰정보 로그인합니다',
  arguments: '<token>',
})
export class LoginCommand extends CommandRunner {
  constructor(private config: AuthConfig) {
    super();
  }

  async run(passedParams: string[]): Promise<void> {
    const [token] = passedParams;

    if (!token) {
      output.error(i18n.t('login.token_required'));
      console.error(chalk.yellow(i18n.t('create.login_usage')));
      process.exit(1);
    }

    try {
      console.log(chalk.blue(i18n.t('login.token_saved')));

      const result = await fetch(`https://easynext.org/api/premium/cli-login`, {
        method: 'POST',
        body: JSON.stringify({ token }),
      }).then((res) => res.json());

      if (!isValidResult(result) || !result?.success || !result?.access_token) {
        output.error(i18n.t('login.invalid_token'));
        process.exit(1);
      }

      writeToAuthConfigFile({ ...this.config, token: result.access_token });

      output.success(i18n.t('login.success'));
      console.log(
        chalk.green('아래 링크를 통해 프리미엄 이용 안내를 확인해주세요.'),
      );
      console.log(chalk.green('https://easynext.org/premium/guide'));
    } catch (error) {
      output.error('예상치 못한 오류가 발생했습니다:');
      console.error(error);
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
