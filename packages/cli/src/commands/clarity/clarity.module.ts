import { Module } from '@nestjs/common';
import { ClarityCommand } from './clarity.command';

@Module({
  providers: [ClarityCommand],
})
export class ClarityModule {}
