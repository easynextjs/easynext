import { Module } from '@nestjs/common';
import { CreateCommand } from './create.command';

@Module({
  providers: [CreateCommand],
})
export class CreateModule {}
