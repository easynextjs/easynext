import { Module } from '@nestjs/common';
import { SentryCommand } from './sentry.command';

@Module({
  providers: [SentryCommand],
})
export class SentryModule {}
