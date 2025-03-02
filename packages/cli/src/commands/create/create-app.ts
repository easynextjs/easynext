import { mkdirSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { cyan, green } from 'chalk';
import type { PackageManager } from './helpers/get-pkg-manager';
import { tryGitInit } from './helpers/git';
import { isFolderEmpty } from './helpers/is-folder-empty';
import { getOnline } from './helpers/is-online';
import { isWriteable } from './helpers/is-writeable';
import i18n from '@/util/i18n';

import type { TemplateType } from './templates';
import { installTemplate } from './templates';

export class DownloadError extends Error {}

export async function createApp({
  appPath,
  packageManager,
  skipInstall,
  turbopack,
  disableGit,
}: {
  appPath: string;
  packageManager: PackageManager;
  skipInstall: boolean;
  turbopack: boolean;
  disableGit?: boolean;
}): Promise<void> {
  const template: TemplateType = 'default';

  const root = resolve(appPath);

  if (!(await isWriteable(dirname(root)))) {
    console.error(i18n.t('create.not_writable'));
    console.error(i18n.t('create.no_permissions'));
    process.exit(1);
  }

  const appName = basename(root);

  mkdirSync(root, { recursive: true });
  if (!isFolderEmpty(root, appName)) {
    process.exit(1);
  }

  const useYarn = packageManager === 'yarn';
  const isOnline = !useYarn || (await getOnline());
  const originalDirectory = process.cwd();

  console.log(`${i18n.t('create.creating_app')} ${green(root)}.`);
  console.log();

  process.chdir(root);

  const hasPackageJson = false;

  await installTemplate({
    appName,
    root,
    template,
    packageManager,
    isOnline,
    skipInstall,
    turbopack,
  });

  if (disableGit) {
    console.log(i18n.t('create.skip_git'));
    console.log();
  } else if (tryGitInit(root)) {
    console.log(i18n.t('create.git_initialized'));
    console.log();
  }

  let cdpath: string;
  if (join(originalDirectory, appName) === appPath) {
    cdpath = appName;
  } else {
    cdpath = appPath;
  }

  console.log(
    `${green(i18n.t('info.success'))} ${i18n.t('create.success_created')} ${appName} ${i18n.t('create.success_at')} ${appPath}`,
  );

  if (hasPackageJson) {
    console.log(i18n.t('create.run_commands'));
    console.log();
    console.log(cyan(`  ${packageManager} ${useYarn ? '' : 'run '}dev`));
    console.log(`    ${i18n.t('create.run_dev')}`);
    console.log();
    console.log(cyan(`  ${packageManager} ${useYarn ? '' : 'run '}build`));
    console.log(`    ${i18n.t('create.run_build')}`);
    console.log();
    console.log(cyan(`  ${packageManager} start`));
    console.log(`    ${i18n.t('create.run_start')}`);
    console.log();
    console.log(i18n.t('create.suggest_begin'));
    console.log();
    console.log(cyan('  cd'), cdpath);
    console.log(`  ${cyan(`${packageManager} ${useYarn ? '' : 'run '}dev`)}`);
  }
  console.log();
}
