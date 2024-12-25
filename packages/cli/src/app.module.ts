import { Module } from '@nestjs/common';
import { commandModules } from './commands';
import { GlobalModule } from './global/global.module';

@Module({
  imports: [...commandModules, GlobalModule],
})
export class AppModule {}
