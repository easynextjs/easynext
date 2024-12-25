import { Global, Module } from '@nestjs/common';

const providers = [];

@Global()
@Module({
  providers: providers,
  exports: providers,
})
export class GlobalModule {}
