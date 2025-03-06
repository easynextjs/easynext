import { Command } from 'nest-commander';
import { AbstractCommand } from '../abstract.command';
import * as fs from 'fs';
import * as path from 'path';
import output from '../../output-manager';
import i18n from '@/util/i18n';

@Command({
  name: 'channelio',
  description: '채널톡 서비스 연동 코드를 Next.js 프로젝트에 추가합니다',
  aliases: ['channel', 'channeltalk'],
})
export class ChannelIOCommand extends AbstractCommand {
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

      // 채널톡 플러그인 키 입력 받기
      output.info('채널톡 플러그인 키를 입력해주세요:');
      const pluginKey = await this.promptForInput();

      if (!pluginKey || !pluginKey.trim()) {
        output.error(i18n.t('channeltalk.id_required'));
        return;
      }

      // 채널톡 스크립트 생성
      await this.createChanneltalkScript(cwd, pluginKey);

      output.success(i18n.t('channeltalk.success'));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      output.error(`${i18n.t('channeltalk.error')}: ${errorMessage}`);
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

  private async createChanneltalkScript(
    cwd: string,
    pluginKey: string,
  ): Promise<void> {
    // 1. src/third-parties 디렉토리에 Clarity.tsx 파일 생성
    const thirdPartiesDir = path.join(cwd, 'src', 'third-parties');
    if (!fs.existsSync(thirdPartiesDir)) {
      fs.mkdirSync(thirdPartiesDir, { recursive: true });
    }

    const channelioFilePath = path.join(thirdPartiesDir, 'Channelio.tsx');
    const channelioContent = `"use client";

import Script from "next/script";

export function ChannelIO() {
  return (
    <Script
      id="channel-io"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: \`
        
  (function(){var w=window;if(w.ChannelIO){return w.console.error("ChannelIO script included twice.");}var ch=function(){ch.c(arguments);};ch.q=[];ch.c=function(args){ch.q.push(args);};w.ChannelIO=ch;function l(){if(w.ChannelIOInitialized){return;}w.ChannelIOInitialized=true;var s=document.createElement("script");s.type="text/javascript";s.async=true;s.src="https://cdn.channel.io/plugin/ch-plugin-web.js";var x=document.getElementsByTagName("script")[0];if(x.parentNode){x.parentNode.insertBefore(s,x);}}if(document.readyState==="complete"){l();}else{w.addEventListener("DOMContentLoaded",l);w.addEventListener("load",l);}})();

  ChannelIO('boot', {
  "pluginKey": "${pluginKey}"
});
        \`,
      }}
    ></Script>
  );
}

`;

    fs.writeFileSync(channelioFilePath, channelioContent);
    output.info(`✅ src/third-parties/Channelio.tsx 파일이 생성되었습니다.`);

    // 2. app/layout.js 또는 app/layout.tsx 파일 수정
    const layoutTsxPath = path.join(cwd, 'src', 'app', 'layout.tsx');
    const layoutJsPath = path.join(cwd, 'src', 'app', 'layout.js');

    let layoutPath;
    if (fs.existsSync(layoutTsxPath)) {
      layoutPath = layoutTsxPath;
    } else if (fs.existsSync(layoutJsPath)) {
      layoutPath = layoutJsPath;
    } else {
      output.error(
        'src/app/layout.tsx 또는 src/app/layout.js 파일을 찾을 수 없습니다.',
      );
      return;
    }

    // 레이아웃 파일 읽기
    let layoutContent = fs.readFileSync(layoutPath, 'utf8');

    // 4. layout 파일에 ChannelTalk 컴포넌트 추가
    if (!layoutContent.includes('import { ChannelIO } from')) {
      // RootLayout 컴포넌트 찾기
      const rootLayoutRegex =
        /export\s+(?:default\s+)?(?:function\s+)?(?:const\s+)?RootLayout\s*(?:=\s*)?(?:\([^)]*\)\s*(?:=>)?\s*)?{/;
      const rootLayoutMatch = layoutContent.match(rootLayoutRegex);

      if (rootLayoutMatch) {
        // import 문 추가
        layoutContent = layoutContent.replace(
          /import/,
          "import { ChannelIO } from '@/third-parties/Channelio';\nimport",
        );

        // return 문 찾기
        const returnRegex = /return\s*\(\s*(?:<[^>]*>)?/;
        const returnMatch = layoutContent.match(returnRegex);

        if (returnMatch) {
          const returnIndex = returnMatch.index + returnMatch[0].length;

          // return 문 다음에 ChannelIO 컴포넌트 추가
          layoutContent =
            layoutContent.slice(0, returnIndex) +
            '\n      <ChannelIO />' +
            layoutContent.slice(returnIndex);
        } else {
          output.warn(
            'layout 파일에서 return 문을 찾을 수 없습니다. 수동으로 ChannelIO 컴포넌트를 추가해주세요.',
          );
        }
      } else {
        output.warn(
          'layout 파일에서 RootLayout 컴포넌트를 찾을 수 없습니다. 수동으로 ChannelIO 컴포넌트를 추가해주세요.',
        );
      }

      // 수정된 레이아웃 파일 저장
      fs.writeFileSync(layoutPath, layoutContent);
      output.info(`✅ ${path.basename(layoutPath)} 파일이 수정되었습니다.`);
    }
  }
}
