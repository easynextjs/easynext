import { Command } from 'nest-commander';
import { AbstractCommand } from '../abstract.command';
import * as fs from 'fs';
import * as path from 'path';
import output from '../../output-manager';
import { execSync } from 'child_process';

@Command({
  name: 'sitemap',
  description: 'next-sitemap 설정 파일을 생성하고 설치합니다.',
})
export class SitemapCommand extends AbstractCommand {
  async run(): Promise<void> {
    try {
      // 현재 작업 디렉토리
      const cwd = process.cwd();

      // app 디렉토리 확인
      const appDir = path.join(cwd, 'src', 'app');
      if (!fs.existsSync(appDir)) {
        output.error(
          'Next.js app 디렉토리를 찾을 수 없습니다. Next.js 프로젝트 루트 디렉토리에서 실행해주세요.',
        );
        return;
      }

      // 배포 URL 입력 받기
      output.info('배포할 URL을 입력해주세요 (예: https://example.com):');
      const productionUrl = await this.promptForInput();

      if (!productionUrl || !productionUrl.trim()) {
        output.error('배포 URL이 필요합니다.');
        return;
      }

      // 1. next-sitemap 패키지 설치
      await this.installNextSitemap(cwd);

      // 2. next-sitemap.config.js 파일 생성
      await this.createNextSitemapConfig(cwd, productionUrl);

      // 3. package.json에 postbuild 스크립트 추가
      await this.addPostBuildScript(cwd);

      output.success('next-sitemap 설정이 완료되었습니다.');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      output.error(`sitemap 설정 중 오류가 발생했습니다: ${errorMessage}`);
    }
  }

  private async promptForInput(): Promise<string> {
    return new Promise((resolve) => {
      process.stdin.resume();
      process.stdin.setEncoding('utf8');

      process.stdin.on('data', (data) => {
        process.stdin.pause();
        resolve(data.toString().trim());
      });
    });
  }

  private async installNextSitemap(cwd: string): Promise<void> {
    try {
      output.info('next-sitemap 패키지를 설치하는 중...');

      // 패키지 매니저 확인 (yarn.lock 또는 package-lock.json)
      const hasYarnLock = fs.existsSync(path.join(cwd, 'yarn.lock'));
      const hasPnpmLock = fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'));

      let installCommand = '';

      if (hasYarnLock) {
        installCommand = 'yarn add next-sitemap --dev';
      } else if (hasPnpmLock) {
        installCommand = 'pnpm add next-sitemap --save-dev';
      } else {
        // npm이 기본값
        installCommand = 'npm install next-sitemap --save-dev';
      }

      execSync(installCommand, { cwd, stdio: 'inherit' });
      output.success('next-sitemap 패키지가 설치되었습니다.');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
      throw new Error(
        `next-sitemap 설치 중 오류가 발생했습니다: ${errorMessage}`,
      );
    }
  }

  private async createNextSitemapConfig(
    cwd: string,
    siteUrl: string,
  ): Promise<void> {
    try {
      output.info('next-sitemap.config.js 파일을 생성하는 중...');

      const configContent = `/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: '${siteUrl}',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  outDir: './public',
  // 추가 설정을 원하시면 아래 주석을 해제하고 수정하세요
  // changefreq: 'daily',
  // priority: 0.7,
  // sitemapSize: 5000,
  // exclude: ['/protected-page', '/private-page'],
  // alternateRefs: [
  //   {
  //     href: 'https://es.example.com',
  //     hreflang: 'es',
  //   },
  // ],
};
`;

      fs.writeFileSync(path.join(cwd, 'next-sitemap.config.js'), configContent);
      output.success('next-sitemap.config.js 파일이 생성되었습니다.');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
      throw new Error(
        `next-sitemap.config.js 생성 중 오류가 발생했습니다: ${errorMessage}`,
      );
    }
  }

  private async addPostBuildScript(cwd: string): Promise<void> {
    try {
      output.info('package.json에 postbuild 스크립트를 추가하는 중...');

      const packageJsonPath = path.join(cwd, 'package.json');

      if (!fs.existsSync(packageJsonPath)) {
        throw new Error('package.json 파일을 찾을 수 없습니다.');
      }

      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

      if (!packageJson.scripts) {
        packageJson.scripts = {};
      }

      // postbuild 스크립트 추가
      packageJson.scripts.postbuild = 'next-sitemap';

      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      output.success('package.json에 postbuild 스크립트가 추가되었습니다.');

      // README.md에 사용법 추가
      this.updateReadme(cwd);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
      throw new Error(
        `postbuild 스크립트 추가 중 오류가 발생했습니다: ${errorMessage}`,
      );
    }
  }

  private updateReadme(cwd: string): void {
    try {
      const readmePath = path.join(cwd, 'README.md');

      if (fs.existsSync(readmePath)) {
        let readmeContent = fs.readFileSync(readmePath, 'utf8');

        const sitemapUsageContent = `
## Sitemap 사용법

이 프로젝트는 next-sitemap이 설정되어 있습니다.

- \`next build\` 명령어 실행 후 자동으로 sitemap.xml과 robots.txt 파일이 생성됩니다.
- 설정 파일은 프로젝트 루트의 \`next-sitemap.config.js\`에 있습니다.
- 생성된 파일은 \`public\` 디렉토리에 저장됩니다.

추가 설정이 필요한 경우 \`next-sitemap.config.js\` 파일을 수정하세요.
자세한 내용은 [next-sitemap 공식 문서](https://github.com/iamvishnusankar/next-sitemap)를 참조하세요.
`;

        if (!readmeContent.includes('## Sitemap 사용법')) {
          readmeContent += sitemapUsageContent;
          fs.writeFileSync(readmePath, readmeContent);
          output.info('README.md 파일에 Sitemap 사용법이 추가되었습니다.');
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
      output.warn(`README.md 업데이트 중 오류가 발생했습니다: ${errorMessage}`);
    }
  }
}
