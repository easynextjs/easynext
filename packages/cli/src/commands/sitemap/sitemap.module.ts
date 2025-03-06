import { Module } from '@nestjs/common';
import { SitemapCommand } from './sitemap.command';

@Module({
  providers: [SitemapCommand],
})
export class SitemapModule {}
