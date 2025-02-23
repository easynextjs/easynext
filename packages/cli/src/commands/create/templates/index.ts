import { install } from '../helpers/install';
import { copy } from '../helpers/copy';

import os from 'os';
import fs from 'fs/promises';
import path from 'path';
import { cyan, bold } from 'chalk';

import { InstallTemplateArgs } from './types';

const nextVersion = '15.1.0';
// Do not rename or format. sync-react script relies on this line.
// prettier-ignore
const nextjsReactPeerVersion = "^19.0.0";

export const SRC_DIR_NAMES = ['app', 'pages', 'styles'];

/**
 * Install a Next.js internal template to a given `root` directory.
 */
export const installTemplate = async ({
  appName,
  root,
  packageManager,
  isOnline,
  template,
  skipInstall,
  turbopack,
}: InstallTemplateArgs) => {
  console.log(bold(`Using ${packageManager}.`));

  /**
   * Copy the template files to the target directory.
   */
  console.log('\nInitializing project with template:', template, '\n');
  const templatePath = path.join(__dirname, template);

  await copy(['**'], root, {
    parents: true,
    cwd: templatePath,
    rename(name) {
      switch (name) {
        case 'gitignore':
        case 'cursorrules':
        case 'cursorignore': {
          return `.${name}`;
        }
        // README.md is ignored by webpack-asset-relocator-loader used by ncc:
        // https://github.com/vercel/webpack-asset-relocator-loader/blob/e9308683d47ff507253e37c9bcbb99474603192b/src/asset-relocator.js#L227
        case 'README-template.md': {
          return 'README.md';
        }
        default: {
          return name;
        }
      }
    },
  });

  // const tsconfigFile = path.join(root, 'tsconfig.json');
  // await fs.writeFile(
  //   tsconfigFile,
  //   (await fs.readFile(tsconfigFile, 'utf8'))
  //     .replace(
  //       `"@/*": ["./*"]`,
  //       srcDir ? `"@/*": ["./src/*"]` : `"@/*": ["./*"]`,
  //     )
  //     .replace(`"@/*":`, `"${importAlias}":`),
  // );

  // update import alias in any files if not using the default
  // if (importAlias !== '@/*') {
  //   const files = await glob('**/*', {
  //     cwd: root,
  //     dot: true,
  //     stats: false,
  //     // We don't want to modify compiler options in [ts/js]config.json
  //     // and none of the files in the .git folder
  //     // TODO: Refactor this to be an allowlist, rather than a denylist,
  //     // to avoid corrupting files that weren't intended to be replaced

  //     ignore: [
  //       'tsconfig.json',
  //       'jsconfig.json',
  //       '.git/**/*',
  //       '**/fonts/**',
  //       '**/favicon.ico',
  //     ],
  //   });
  //   const writeSema = new Sema(8, { capacity: files.length });
  //   await Promise.all(
  //     files.map(async (file) => {
  //       await writeSema.acquire();
  //       const filePath = path.join(root, file);
  //       if ((await fs.stat(filePath)).isFile()) {
  //         await fs.writeFile(
  //           filePath,
  //           (await fs.readFile(filePath, 'utf8')).replace(
  //             `@/`,
  //             `${importAlias.replace(/\*/g, '')}`,
  //           ),
  //         );
  //       }
  //       writeSema.release();
  //     }),
  //   );
  // }

  /** Copy the version from package.json or override for tests. */
  const version = process.env.NEXT_PRIVATE_TEST_VERSION ?? nextVersion;

  /** Create a package.json for the new project and write it to disk. */
  const packageJson: any = {
    name: appName,
    version: '0.1.0',
    private: true,
    scripts: {
      dev: `next dev${turbopack ? ' --turbopack' : ''}`,
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    },
    /**
     * Default dependencies.
     */
    dependencies: {
      react: nextjsReactPeerVersion,
      'react-dom': nextjsReactPeerVersion,
      next: version,
      'next-themes': '^0.4.3',
    },
    devDependencies: {
      /* TypeScript dependencies */
      typescript: '^5',
      '@types/node': '^20',
      '@types/react': '^19',
      '@types/react-dom': '^19',

      /* Default ESLint dependencies. */
      eslint: '^9',
      'eslint-config-next': version,
      // TODO: Remove @eslint/eslintrc once eslint-config-next is pure Flat config
      '@eslint/eslintrc': '^3',
    },
  };

  addDependencies(packageJson);

  await fs.writeFile(
    path.join(root, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL,
  );

  if (skipInstall) return;

  console.log('\nInstalling dependencies:');
  for (const dependency in packageJson.dependencies)
    console.log(`- ${cyan(dependency)}`);

  console.log('\nInstalling devDependencies:');
  for (const dependency in packageJson.devDependencies)
    console.log(`- ${cyan(dependency)}`);

  console.log();

  await install(packageManager, isOnline);
};

export * from './types';

function addDependencies(packageJson: any) {
  // tailwindcss
  packageJson.devDependencies = {
    ...packageJson.devDependencies,
    postcss: '^8',
    tailwindcss: '^3.4.1',
  };

  // shadcn-ui, tailwindcss
  packageJson.dependencies = {
    ...packageJson.dependencies,
    '@radix-ui/react-accordion': '^1.2.3',
    '@radix-ui/react-avatar': '^1.1.2',
    '@radix-ui/react-checkbox': '^1.1.1',
    '@radix-ui/react-dialog': '^1.1.4',
    '@radix-ui/react-dropdown-menu': '^2.1.1',
    '@radix-ui/react-label': '^2.1.0',
    '@radix-ui/react-select': '^2.1.4',
    '@radix-ui/react-separator': '^1.1.1',
    '@radix-ui/react-slot': '^1.1.0',
    '@radix-ui/react-toast': '^1.2.6',
    autoprefixer: '10.4.20',
    'class-variance-authority': '^0.7.0',
    clsx: '^2.1.1',
  };
  packageJson.devDependencies = {
    ...packageJson.devDependencies,
    'tailwind-merge': '^2.5.2',
    'tailwindcss-animate': '^1.0.7',
    '@tailwindcss/typography': '^0.5.10',
  };

  // useful dependencies
  packageJson.dependencies = {
    ...packageJson.dependencies,
    '@hookform/resolvers': '^4',
    'react-use': '^17',
    'ts-pattern': '^5',
    'es-toolkit': '^1',
    'lucide-react': '^0.469.0',
    zod: '^3',
    zustand: '^4',
    'date-fns': '^4',
    'react-hook-form': '^7',
    '@tanstack/react-query': '^5',
    'framer-motion': '^11',
    axios: '^1.7.9',
  };
}
