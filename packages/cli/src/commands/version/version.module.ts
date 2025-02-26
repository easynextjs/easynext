import { Module } from '@nestjs/common';
import { VersionCommand } from './version.command';

@Module({
  providers: [VersionCommand],
})
export class VersionModule {}
