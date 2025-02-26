<div align="center">
  <a href="https://github.com/easynextjs">
    <picture>
      <img alt="EasyNext logo" src="https://i.ibb.co/3sL9b23/logo.png" height="128">
    </picture>
  </a>
  <h1>EasyNext</h1>

<a href="https://www.npmjs.com/package/@easynext/cli"><img alt="NPM version" src="https://img.shields.io/npm/v/%40easynext%2Fcli.svg?style=for-the-badge&labelColor=000000"></a>
<a href="https://github.com/easynextjs/easynext/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/npm/l/%40easynext%2Fcli.svg?style=for-the-badge&labelColor=000000"></a>

</div>

> Depends on Cursor, Vercel, shadcn-ui, tailwindcss, Supabase

Easiest way to start Next.js project ⚡️ [한글](https://github.com/easynextjs/easynext/blob/main/packages/cli/README.ko.md)

### With EasyNext, You can ...

Do all the things you need to do to start a Next.js project,<br/>
in your own language! (English, Korean)

- Create a Ready-to-use project
- Set up Google/Apple/Kakao/Naver Auth
- Set up and link Supabase
- Set up Google Sheet modules
- More to come... 👀

## Prerequisites

- Node.js 20+

## Installiation

```bash
# (recommended) use npm
$ npm install -g @easynext/cli

# if you are using yarn, pnpm
$ yarn global add @easynext/cli
$ pnpm add -g @easynext/cli
```

## Available commands

```bash
# Check tools installation
$ easynext doctor

# Set language
$ easynext lang <'ko' | 'en'>

# Create a new project
$ easynext create <project-name>

# Init supabase
$ easynext supabase
```

## Coming Soon Commands

```bash

# Set google auth
$ easynext auth google|apple|kakao|naver

# Init next-ui
$ easynext next-ui

# Add Google Sheet modules
$ easynext google-sheet
```

## License

[MIT](https://github.com/easynextjs/easynext/blob/main/LICENSE).
