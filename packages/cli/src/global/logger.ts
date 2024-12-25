import { Injectable } from '@nestjs/common';
import * as chalk from 'chalk';

@Injectable()
export class Logger {
  base(message: any) {
    console.log(message);
  }

  info(message: any) {
    console.log(chalk.green(message));
  }

  error(message: any) {
    console.error(chalk.red(message));
  }

  warn(message: any) {
    console.warn(chalk.yellowBright(message));
  }

  log() {
    // ignore console.log
  }
}
