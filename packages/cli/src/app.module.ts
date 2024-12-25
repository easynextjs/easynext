import { Module } from '@nestjs/common';
import { commandModules } from './commands';
import { ConfigModule } from './global/config/config.module';

@Module({
  imports: [...commandModules, ConfigModule.forRootAsync()],
})
export class AppModule {}
