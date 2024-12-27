<div align="center">
  <a href="https://github.com/easynextjs">
    <picture>
      <img alt="EasyNext 로고" src="https://i.ibb.co/3sL9b23/logo.png" height="128">
    </picture>
  </a>
  <h1>EasyNext</h1>

<a href="https://www.npmjs.com/package/@easynext/cli"><img alt="NPM 버전" src="https://img.shields.io/npm/v/%40easynext%2Fcli.svg?style=for-the-badge&labelColor=000000"></a>
<a href="https://github.com/easynextjs/easynext/blob/main/LICENSE"><img alt="라이선스" src="https://img.shields.io/npm/l/%40easynext%2Fcli.svg?style=for-the-badge&labelColor=000000"></a>

</div>

> Cursor, Vercel, next-ui, Supabase 사용을 가정합니다.

가장 쉽게 시작할 수 있는 Next.js ⚡️

### EasyNext의 장점

Next.js 프로젝트에 필요한 모든 설정을 쉽게 할 수 있습니다.<br/>
모두 한국어로 사용할 수 있어요!

- 필수 세팅이 포함된 프로젝트 생성
- 구글/애플/카카오/네이버 인증 설정
- Supabase 설정 및 연동
- Google Sheet 모듈 설정
- 더 많은 기능 추가 예정 👀

## 설치

```bash
# (권장) npm 사용 시
$ npm install -g @easynext/cli

# 혹시라도 yarn, pnpm을 사용하고 있다면
$ yarn global add @easynext/cli
$ pnpm add -g @easynext/cli
```

## 사용 가능한 명령어

```bash
# 설치된 툴 확인
$ easynext doctor

# 언어 설정
$ easynext lang <'ko' | 'en'>
```

## 곧 추가될 명령어

```bash
# 새 프로젝트 생성
$ easynext create <project-name>

# 로그인 기능 추가 (구글, 애플, 카카오, 네이버)
$ easynext auth google|apple|kakao|naver

# next-ui 사용 설정
$ easynext next-ui

# supabase 사용 설정
$ easynext supabase

# Google Sheet 연동 설정
$ easynext google-sheet
```

## 라이선스

[MIT](https://github.com/easynextjs/easynext/blob/main/LICENSE).
