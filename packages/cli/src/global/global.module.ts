import { Global, Module } from '@nestjs/common';
import { Logger } from './logger';

const providers = [Logger];

@Global()
@Module({
  providers: providers,
  exports: providers,
})
export class GlobalModule {}
