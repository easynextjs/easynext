import { Module } from '@nestjs/common';
import { commandModules } from './commands';
import { LoggerModule } from './logger';

@Module({
  imports: [...commandModules, LoggerModule],
})
export class AppModule {}
