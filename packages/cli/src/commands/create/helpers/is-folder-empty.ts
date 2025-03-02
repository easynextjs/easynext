import { lstatSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { green, blue } from 'chalk';
import i18n from '@/util/i18n';

export function isFolderEmpty(root: string, name: string): boolean {
  const validFiles = [
    '.DS_Store',
    '.git',
    '.gitattributes',
    '.gitignore',
    '.gitlab-ci.yml',
    '.hg',
    '.hgcheck',
    '.hgignore',
    '.idea',
    '.npmignore',
    '.travis.yml',
    'LICENSE',
    'Thumbs.db',
    'docs',
    'mkdocs.yml',
    'npm-debug.log',
    'yarn-debug.log',
    'yarn-error.log',
    'yarnrc.yml',
    '.yarn',
  ];

  const conflicts = readdirSync(root).filter(
    (file) =>
      !validFiles.includes(file) &&
      // Support IntelliJ IDEA-based editors
      !/\.iml$/.test(file),
  );

  if (conflicts.length > 0) {
    console.log(i18n.t('create.folder_conflict', green(name)));
    console.log();
    for (const file of conflicts) {
      try {
        const stats = lstatSync(join(root, file));
        if (stats.isDirectory()) {
          console.log(`  ${blue(file)}/`);
        } else {
          console.log(`  ${file}`);
        }
      } catch {
        console.log(`  ${file}`);
      }
    }
    console.log();
    console.log(i18n.t('create.folder_conflict_solution'));
    console.log();
    return false;
  }

  return true;
}
