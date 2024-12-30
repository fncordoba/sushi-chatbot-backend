import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FAQ, FAQSchema } from './faq.schema';
import { FAQService } from './faq.service';
import { FAQController } from './faq.controller';
import { CacheService } from '../cache/cache.service';
import { FAQRepository } from './faq.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: FAQ.name, schema: FAQSchema }])],
  controllers: [FAQController],
  providers: [FAQService, FAQRepository, CacheService],
  exports: [FAQService],
})
export class FAQModule {}
