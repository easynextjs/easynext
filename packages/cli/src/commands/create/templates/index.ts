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
  mode,
  tailwind,
  eslint,
  skipInstall,
  turbopack,
}: InstallTemplateArgs) => {
  console.log(bold(`Using ${packageManager}.`));

  /**
   * Copy the template files to the target directory.
   */
  console.log('\nInitializing project with template:', template, '\n');
  const templatePath = path.join(__dirname, template);
  const copySource = ['**'];
  if (!eslint) copySource.push('!eslint.config.mjs');
  if (!tailwind)
    copySource.push(
      mode == 'ts' ? 'tailwind.config.ts' : '!tailwind.config.mjs',
      '!postcss.config.mjs',
    );

  await copy(copySource, root, {
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
    },
    devDependencies: {},
  };

  /**
   * TypeScript projects will have type definitions and other devDependencies.
   */
  if (mode === 'ts') {
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      typescript: '^5',
      '@types/node': '^20',
      '@types/react': '^19',
      '@types/react-dom': '^19',
    };
  }

  /* Add Tailwind CSS dependencies. */
  if (tailwind) {
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      postcss: '^8',
      tailwindcss: '^3.4.1',
    };
  }

  /* Default ESLint dependencies. */
  if (eslint) {
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      eslint: '^9',
      'eslint-config-next': version,
      // TODO: Remove @eslint/eslintrc once eslint-config-next is pure Flat config
      '@eslint/eslintrc': '^3',
    };
  }

  const devDeps = Object.keys(packageJson.devDependencies).length;
  if (!devDeps) delete packageJson.devDependencies;

  await fs.writeFile(
    path.join(root, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL,
  );

  if (skipInstall) return;

  console.log('\nInstalling dependencies:');
  for (const dependency in packageJson.dependencies)
    console.log(`- ${cyan(dependency)}`);

  if (devDeps) {
    console.log('\nInstalling devDependencies:');
    for (const dependency in packageJson.devDependencies)
      console.log(`- ${cyan(dependency)}`);
  }

  console.log();

  await install(packageManager, isOnline);
};

export * from './types';
