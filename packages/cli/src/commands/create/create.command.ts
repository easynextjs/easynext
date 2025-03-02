import { Command, Option } from 'nest-commander';
import { AbstractCommand } from '../abstract.command';
import { createApp } from './create-app';
import { getPkgManager } from './helpers/get-pkg-manager';
import { validateNpmName } from './helpers/validate-pkg';
import { basename, resolve } from 'path';
import { extract } from 'tar';
import axios from 'axios';
import { AuthConfig } from '@/global/config/auth.config';
import chalk, { bold } from 'chalk';
import output from '@/output-manager';
import { install } from './helpers/install';
import { getOnline } from './helpers/is-online';
import { writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import AdmZip from 'adm-zip';
import { isFolderEmpty } from './helpers/is-folder-empty';
import { mkdirSync } from 'fs';
import i18n from '@/util/i18n';

interface CreateCommandOptions {
  template?: string;
}

@Command({
  name: 'create',
  description: '새로운 Next.js 프로젝트를 생성합니다',
  arguments: '<project-name>',
})
export class CreateCommand extends AbstractCommand {
  constructor(private config: AuthConfig) {
    super();
  }

  async run(
    passedParam: string[],
    options?: CreateCommandOptions,
  ): Promise<void> {
    const projectPath = passedParam[0].trim();

    const appPath = resolve(projectPath);
    const appName = basename(appPath);

    const validation = validateNpmName(appName);
    if (validation.valid === false) {
      output.error(
        `${i18n.t('create.npm_naming_error')} ${chalk.red(
          `"${appName}"`,
        )} ${i18n.t('create.npm_naming_restrictions')}`,
      );

      validation.problems.forEach((p) =>
        output.error(`    ${chalk.red(bold('*'))} ${p}`),
      );

      throw new Error('Invalid project name');
    }

    if (options?.template == null) {
      await createApp({
        appPath,
        packageManager: 'npm',
        skipInstall: false,
        turbopack: true,
        disableGit: false,
      });

      output.success(i18n.t('create.success'));

      return;
    }

    // 템플릿을 명시한 경우

    const token = this.config.token;

    if (!token) {
      console.error(i18n.t('create.login_required'));
      console.error(chalk.yellow(i18n.t('create.login_usage')));
      process.exit(1);
    }

    // 2. Premium 권한 확인
    const result = await fetch(
      `https://easynext.org/api/premium/template-url`,
      {
        method: 'POST',
        body: JSON.stringify({
          token,
          template_name: options?.template,
        }),
      },
    ).then((res) => res.json());

    if (!isValidResult(result) || !result?.success || !result?.download_url) {
      console.error(i18n.t('create.template_error'));
      console.error(chalk.yellow(i18n.t('create.template_guide')));
      process.exit(1);
    }

    console.log(`${i18n.t('create.downloading')} ${result.download_url}`);

    // 4. 템플릿 다운로드
    try {
      const response = await axios.get(result.download_url, {
        responseType: 'arraybuffer',
      });

      const root = resolve(projectPath);
      const tempFile = join(tmpdir(), `template-${Date.now()}`);
      await writeFile(tempFile, Buffer.from(response.data));

      // Content-Type 헤더를 확인하거나 파일 시그니처를 검사하여 파일 형식 확인
      const isZip = this.isZipFile(response.data as ArrayBuffer);

      mkdirSync(root, { recursive: true });
      if (!isFolderEmpty(root, appName)) {
        process.exit(1);
      }

      if (isZip) {
        // ZIP 파일 처리
        const zip = new AdmZip(tempFile);
        zip.extractAllTo(root, true);
      } else {
        // TAR 파일 처리 시도
        try {
          await extract({
            file: tempFile,
            cwd: root,
          });
        } catch {
          throw new Error(i18n.t('create.unsupported_format'));
        }
      }

      process.chdir(root);

      // 기본 설정 진행
      const packageManager = getPkgManager();
      const isOnline = await getOnline();

      console.log(i18n.t('create.installing'));

      await install(packageManager, isOnline);

      output.success(
        `${i18n.t('create.template_success')} ${chalk.green(appName)}`,
      );
    } catch (error) {
      console.error(i18n.t('create.template_error'));
      console.error(error);
      process.exit(1);
    }
  }

  // ZIP 파일인지 확인하는 헬퍼 메서드
  private isZipFile(buffer: ArrayBuffer): boolean {
    const signature = Buffer.from(buffer).slice(0, 4);
    // ZIP 파일 시그니처: 50 4B 03 04
    return (
      signature[0] === 0x50 &&
      signature[1] === 0x4b &&
      signature[2] === 0x03 &&
      signature[3] === 0x04
    );
  }

  @Option({
    flags: '-t, --template [name]',
    description: '사용할 템플릿 이름',
  })
  parseTemplate(val: string): string {
    return val;
  }
}

function isValidResult(
  result: unknown,
): result is { success: boolean; download_url: string } {
  return (
    typeof result === 'object' &&
    result !== null &&
    'success' in result &&
    'download_url' in result &&
    typeof result.download_url === 'string'
  );
}
