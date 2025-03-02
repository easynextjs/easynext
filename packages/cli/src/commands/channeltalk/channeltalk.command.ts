import { Command } from 'nest-commander';
import { AbstractCommand } from '../abstract.command';
import * as fs from 'fs';
import * as path from 'path';
import output from '../../output-manager';
import i18n from '@/util/i18n';

@Command({
  name: 'channeltalk',
  description: '채널톡 서비스 연동 코드를 Next.js 프로젝트에 추가합니다',
  aliases: ['channel'],
})
export class ChanneltalkCommand extends AbstractCommand {
  async run(): Promise<void> {
    try {
      // 현재 작업 디렉토리
      const cwd = process.cwd();

      // app 디렉토리 확인
      const appDir = path.join(cwd, 'app');
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
    // 1. app 디렉토리에 channeltalk.ts 파일 생성
    const channeltalkFilePath = path.join(cwd, 'app', 'channeltalk.ts');
    const channeltalkContent = `'use client';

// 채널톡 타입 정의
declare global {
  interface Window {
    ChannelIO?: {
      c?: (...args: any[]) => void;
      q?: any[];
      boot?: (settings: ChannelIOBootSettings) => void;
    };
    ChannelIOInitialized?: boolean;
  }
}

export interface ChannelIOBootSettings {
  pluginKey: string;
  memberId?: string;
  profile?: {
    name?: string;
    email?: string;
    mobileNumber?: string;
    avatarUrl?: string;
    [key: string]: any;
  };
  trackDefaultEvent?: boolean;
  hideChannelButtonOnBoot?: boolean;
  language?: string;
  zIndex?: number;
  [key: string]: any;
}

export interface ChannelIOApiMethods {
  shutdown: () => void;
  showMessenger: () => void;
  hideMessenger: () => void;
  openChat: (chatId?: string | number, message?: string) => void;
  track: (eventName: string, eventProperty?: object) => void;
  onShowMessenger: (callback: () => void) => void;
  onHideMessenger: (callback: () => void) => void;
  onBadgeChanged: (callback: (unread: number) => void) => void;
  onChatCreated: (callback: (chatId: string | number) => void) => void;
  onFollowUpChanged: (callback: (followUp: boolean) => void) => void;
  onUrlClicked: (callback: (url: string) => void) => void;
  clearCallbacks: () => void;
  updateUser: (userInfo: { [key: string]: any }) => void;
  addTags: (tags: string[]) => void;
  removeTags: (tags: string[]) => void;
  setPage: (page: string) => void;
  resetPage: () => void;
  showChannelButton: () => void;
  hideChannelButton: () => void;
}

// 채널톡 플러그인 키
export const CHANNEL_PLUGIN_KEY = '${pluginKey}';

// 채널톡 초기화
export const bootChannelTalk = (settings?: Partial<ChannelIOBootSettings>) => {
  if (typeof window === 'undefined') return;

  // 이미 초기화된 경우 중복 실행 방지
  if (window.ChannelIOInitialized) return;

  const channelSettings: ChannelIOBootSettings = {
    pluginKey: CHANNEL_PLUGIN_KEY,
    ...settings,
  };

  const loadChannelIO = () => {
    if (window.ChannelIO) {
      window.ChannelIO.boot(channelSettings);
    } else {
      window.ChannelIO = {
        c: (...args: any[]) => {
          (window.ChannelIO?.q || []).push(args);
        },
        q: [],
      };
      
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      }
    }
    
    window.ChannelIOInitialized = true;
  };

  if (document.readyState === 'complete') {
    loadChannelIO();
  } else {
    window.addEventListener('DOMContentLoaded', loadChannelIO);
    window.addEventListener('load', loadChannelIO);
  }
};

// 채널톡 API 호출 함수
export const channelTalk = (): ChannelIOApiMethods | undefined => {
  if (typeof window === 'undefined' || !window.ChannelIO) return undefined;

  return {
    shutdown: () => window.ChannelIO?.c?.('shutdown'),
    showMessenger: () => window.ChannelIO?.c?.('showMessenger'),
    hideMessenger: () => window.ChannelIO?.c?.('hideMessenger'),
    openChat: (chatId, message) => window.ChannelIO?.c?.('openChat', chatId, message),
    track: (eventName, eventProperty) => window.ChannelIO?.c?.('track', eventName, eventProperty),
    onShowMessenger: (callback) => window.ChannelIO?.c?.('onShowMessenger', callback),
    onHideMessenger: (callback) => window.ChannelIO?.c?.('onHideMessenger', callback),
    onBadgeChanged: (callback) => window.ChannelIO?.c?.('onBadgeChanged', callback),
    onChatCreated: (callback) => window.ChannelIO?.c?.('onChatCreated', callback),
    onFollowUpChanged: (callback) => window.ChannelIO?.c?.('onFollowUpChanged', callback),
    onUrlClicked: (callback) => window.ChannelIO?.c?.('onUrlClicked', callback),
    clearCallbacks: () => window.ChannelIO?.c?.('clearCallbacks'),
    updateUser: (userInfo) => window.ChannelIO?.c?.('updateUser', userInfo),
    addTags: (tags) => window.ChannelIO?.c?.('addTags', tags),
    removeTags: (tags) => window.ChannelIO?.c?.('removeTags', tags),
    setPage: (page) => window.ChannelIO?.c?.('setPage', page),
    resetPage: () => window.ChannelIO?.c?.('resetPage'),
    showChannelButton: () => window.ChannelIO?.c?.('showChannelButton'),
    hideChannelButton: () => window.ChannelIO?.c?.('hideChannelButton'),
  };
};
`;

    fs.writeFileSync(channeltalkFilePath, channeltalkContent);
    output.info(`✅ app/channeltalk.ts 파일이 생성되었습니다.`);

    // 2. app/layout.js 또는 app/layout.tsx 파일 수정
    const layoutTsxPath = path.join(cwd, 'app', 'layout.tsx');
    const layoutJsPath = path.join(cwd, 'app', 'layout.js');

    let layoutPath;
    if (fs.existsSync(layoutTsxPath)) {
      layoutPath = layoutTsxPath;
    } else if (fs.existsSync(layoutJsPath)) {
      layoutPath = layoutJsPath;
    } else {
      output.error(
        'app/layout.tsx 또는 app/layout.js 파일을 찾을 수 없습니다.',
      );
      return;
    }

    // 레이아웃 파일 읽기
    let layoutContent = fs.readFileSync(layoutPath, 'utf8');

    // 3. ChannelTalk 초기화 컴포넌트 생성
    const channelTalkComponentPath = path.join(cwd, 'app', 'components');

    // components 디렉토리가 없으면 생성
    if (!fs.existsSync(channelTalkComponentPath)) {
      fs.mkdirSync(channelTalkComponentPath, { recursive: true });
    }

    const channelTalkComponentFilePath = path.join(
      channelTalkComponentPath,
      'ChannelTalk.tsx',
    );
    const channelTalkComponentContent = `'use client';

import { useEffect } from 'react';
import { bootChannelTalk } from '../channeltalk';

interface ChannelTalkProps {
  memberId?: string;
  profile?: {
    name?: string;
    email?: string;
    [key: string]: any;
  };
}

export default function ChannelTalk({ memberId, profile }: ChannelTalkProps) {
  useEffect(() => {
    bootChannelTalk({
      memberId,
      profile,
    });
  }, [memberId, profile]);

  return null;
}
`;

    fs.writeFileSync(channelTalkComponentFilePath, channelTalkComponentContent);
    output.info(`✅ app/components/ChannelTalk.tsx 파일이 생성되었습니다.`);

    // 4. layout 파일에 ChannelTalk 컴포넌트 추가
    if (!layoutContent.includes('import ChannelTalk from')) {
      // RootLayout 컴포넌트 찾기
      const rootLayoutRegex =
        /export\s+(?:default\s+)?(?:function\s+)?(?:const\s+)?RootLayout\s*(?:=\s*)?(?:\([^)]*\)\s*(?:=>)?\s*)?{/;
      const rootLayoutMatch = layoutContent.match(rootLayoutRegex);

      if (rootLayoutMatch) {
        // import 문 추가
        layoutContent = layoutContent.replace(
          /import/,
          "import ChannelTalk from './components/ChannelTalk';\nimport",
        );

        // return 문 찾기
        const returnRegex = /return\s*\(\s*(?:<[^>]*>)?/;
        const returnMatch = layoutContent.match(returnRegex);

        if (returnMatch) {
          const returnIndex = returnMatch.index + returnMatch[0].length;

          // return 문 다음에 ChannelTalk 컴포넌트 추가
          layoutContent =
            layoutContent.slice(0, returnIndex) +
            '\n      <ChannelTalk />' +
            layoutContent.slice(returnIndex);
        } else {
          output.warn(
            'layout 파일에서 return 문을 찾을 수 없습니다. 수동으로 ChannelTalk 컴포넌트를 추가해주세요.',
          );
        }
      } else {
        output.warn(
          'layout 파일에서 RootLayout 컴포넌트를 찾을 수 없습니다. 수동으로 ChannelTalk 컴포넌트를 추가해주세요.',
        );
      }

      // 수정된 레이아웃 파일 저장
      fs.writeFileSync(layoutPath, layoutContent);
      output.info(`✅ ${path.basename(layoutPath)} 파일이 수정되었습니다.`);
    }

    // 5. README.md 파일에 사용법 추가
    const readmePath = path.join(cwd, 'README.md');
    if (fs.existsSync(readmePath)) {
      let readmeContent = fs.readFileSync(readmePath, 'utf8');

      const channelTalkUsageContent = `
## 채널톡 사용법

이 프로젝트는 채널톡이 설정되어 있습니다. 플러그인 키: \`${pluginKey}\`

### 기본 설정
채널톡은 자동으로 초기화됩니다.

### 사용자 정보 설정
사용자 정보를 설정하려면 다음과 같이 사용하세요:

\`\`\`jsx
// 페이지 또는 컴포넌트에서
import ChannelTalk from './app/components/ChannelTalk';

// 사용자 정보와 함께 렌더링
<ChannelTalk 
  memberId="사용자ID" 
  profile={{
    name: "사용자 이름",
    email: "user@example.com"
  }} 
/>
\`\`\`

### 채널톡 API 사용
채널톡 API를 사용하려면 다음과 같이 사용하세요:

\`\`\`javascript
import { channelTalk } from './app/channeltalk';

// 채팅창 열기
channelTalk()?.showMessenger();

// 이벤트 추적
channelTalk()?.track('button_click', { 
  name: '로그인_버튼' 
});

// 사용자 정보 업데이트
channelTalk()?.updateUser({
  name: '홍길동',
  email: 'user@example.com'
});
\`\`\`
`;

      readmeContent += channelTalkUsageContent;
      fs.writeFileSync(readmePath, readmeContent);
      output.info('✅ README.md 파일에 채널톡 사용법이 추가되었습니다.');
    }
  }
}
