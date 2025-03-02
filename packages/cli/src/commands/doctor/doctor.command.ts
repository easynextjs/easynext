import { Command } from 'nest-commander';
import { lt } from 'semver';
import { execSync } from 'child_process';
import { AbstractCommand } from '../abstract.command';
import output from '@/output-manager';
import i18n from '@/util/i18n';

@Command({ name: 'doctor', description: 'Check the health of the system' })
export class DoctorCommand extends AbstractCommand {
  async run() {
    output.info(i18n.t('doctor.checking'));

    this.checkNodeVersion();
    this.checkGitInstalled();
    this.checkVercelInstalled();
  }

  checkNodeVersion() {
    const nodeVersion = process.version;
    const requiredVersion = 'v20.10.0';

    if (lt(nodeVersion, requiredVersion)) {
      output.error(
        `${i18n.t('doctor.node_version')} ${nodeVersion} is not supported. Please upgrade to at least ${requiredVersion}.`,
      );
    } else {
      output.info(
        `✨ ${i18n.t('doctor.node_version')} ${nodeVersion} is supported.`,
      );
    }
  }

  checkGitInstalled() {
    try {
      execSync('git -v', { stdio: 'ignore' });

      output.info(`✨ ${i18n.t('doctor.git_version')} is installed.`);
    } catch {
      output.error('Git is not installed. Please install Git.');
    }
  }

  checkVercelInstalled() {
    try {
      execSync('vercel -v', { stdio: 'ignore' });

      output.info('✨ Vercel is installed.');
    } catch {
      output.error('Vercel is not installed. Please install Vercel.');
    }

    try {
      execSync('vercel whoami', { stdio: 'pipe' });

      output.info('✨ Vercel is authenticated.');
    } catch (error: unknown) {
      const noCredentials =
        error instanceof Error &&
        error.toString().includes('No existing credentials found.');

      if (noCredentials) {
        output.warn('🚧 Vercel is not authenticated. (type `vercel login`)');
      } else {
        output.error('🚨 Something went wrong ...');
      }
    }
  }
}
