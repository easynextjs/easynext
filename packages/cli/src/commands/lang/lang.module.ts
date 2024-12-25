import { Module } from '@nestjs/common';
import { LangCommand } from './lang.command';

@Module({
  providers: [LangCommand],
})
export class LangModule {}
