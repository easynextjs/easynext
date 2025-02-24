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
import { rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import AdmZip from 'adm-zip';
import { readdir, rename } from 'fs/promises';

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
        `Could not create a project called ${chalk.red(
          `"${appName}"`,
        )} because of npm naming restrictions:`,
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

      output.success('Project created successfully');

      return;
    }

    // 템플릿을 명시한 경우

    const token = this.config.token;

    if (!token) {
      console.error('Error: 로그인이 필요합니다. 로그인해주세요.');
      console.error(chalk.yellow('사용법: easynext login <token>'));
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
      console.error('Error: 템플릿 다운로드 중 오류가 발생했습니다.');
      console.error(chalk.yellow('안내: https://easynext.org/premium/guide'));
      process.exit(1);
    }

    console.log(`Downloading template from ${result.download_url}`);

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

      // 임시 디렉토리에 먼저 압축 해제
      const tempExtractDir = join(tmpdir(), `extract-${Date.now()}`);

      if (isZip) {
        // ZIP 파일 처리
        const zip = new AdmZip(tempFile);
        zip.extractAllTo(tempExtractDir, true);
      } else {
        // TAR 파일 처리 시도
        try {
          await extract({
            file: tempFile,
            cwd: tempExtractDir,
          });
        } catch {
          throw new Error('지원하지 않는 템플릿 파일 형식입니다.');
        }
      }

      // 압축 해제된 첫 번째 디렉토리를 찾아서 appName으로 이동
      const extractedFiles = await readdir(tempExtractDir);
      const templateDir = join(tempExtractDir, extractedFiles[0]);
      await rename(templateDir, root);

      // 임시 디렉토리 삭제
      await rm(tempExtractDir, { recursive: true, force: true });

      process.chdir(root);

      // 기본 설정 진행
      const packageManager = getPkgManager();
      const isOnline = await getOnline();
      await install(packageManager, isOnline);

      output.success('템플릿이 성공적으로 설치되었습니다.');
    } catch (error) {
      console.error('Error: 템플릿 다운로드 중 오류가 발생했습니다.');
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
