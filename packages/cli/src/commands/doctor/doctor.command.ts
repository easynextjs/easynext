import { Command, CommandRunner } from 'nest-commander';
import { lt } from 'semver';
import { Logger } from '@/logger';
import { execSync } from 'child_process';

@Command({ name: 'doctor', description: 'Check the health of the system' })
export class DoctorCommand extends CommandRunner {
  constructor(private readonly logger: Logger) {
    super();
  }

  async run() {
    this.logger.info('Doctor is checking the system');

    this.checkNodeVersion();
    this.checkGitInstalled();
    this.checkVercelInstalled();
  }

  checkNodeVersion() {
    const nodeVersion = process.version;
    const requiredVersion = 'v20.10.0';

    if (lt(nodeVersion, requiredVersion)) {
      this.logger.error(
        `Node.js version ${nodeVersion} is not supported. Please upgrade to at least ${requiredVersion}.`,
      );
    } else {
      this.logger.info(`✨ Node.js version ${nodeVersion} is supported.`);
    }
  }

  checkGitInstalled() {
    try {
      execSync('git -v', { stdio: 'ignore' });

      this.logger.info('✨ Git is installed.');
    } catch {
      this.logger.error('Git is not installed. Please install Git.');
    }
  }

  checkVercelInstalled() {
    try {
      execSync('vercel -v', { stdio: 'ignore' });

      this.logger.info('✨ Vercel is installed.');
    } catch {
      this.logger.error('Vercel is not installed. Please install Vercel.');
    }

    try {
      execSync('vercel whoami', { stdio: 'pipe' });

      this.logger.info('✨ Vercel is authenticated.');
    } catch (error: unknown) {
      const noCredentials =
        error instanceof Error &&
        error.toString().includes('No existing credentials found.');

      if (noCredentials) {
        this.logger.warn(
          '🚧 Vercel is not authenticated. (type `vercel login`)',
        );
      } else {
        this.logger.error('🚨 Something went wrong ...');
      }
    }
  }
}
