import { basename, resolve } from 'node:path';
import { Command } from 'nest-commander';
import { AbstractCommand } from '../abstract.command';
import { GlobalConfig } from '@/global/config/global.config';
import { createApp } from './create-app';
import output from '@/output-manager';
import { validateNpmName } from './helpers/validate-pkg';
import { bold, red } from 'chalk';

@Command({
  name: 'create',
  description: 'Create a new project',
  arguments: '<directory>',
})
export class CreateCommand extends AbstractCommand {
  constructor(private config: GlobalConfig) {
    super();
  }

  async run(passedParam: string[]) {
    const projectPath = passedParam[0].trim();

    const appPath = resolve(projectPath);
    const appName = basename(appPath);

    const validation = validateNpmName(appName);
    if (validation.valid === false) {
      output.error(
        `Could not create a project called ${red(
          `"${appName}"`,
        )} because of npm naming restrictions:`,
      );

      validation.problems.forEach((p) =>
        output.error(`    ${red(bold('*'))} ${p}`),
      );

      throw new Error('Invalid project name');
    }

    await createApp({
      appPath,
      packageManager: 'npm',
      tailwind: true,
      eslint: true,
      skipInstall: false,
      turbopack: true,
      disableGit: false,
    });

    output.success('Project created successfully');
  }
}
