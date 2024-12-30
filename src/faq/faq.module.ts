import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FAQ, FAQSchema } from './faq.schema';
import { FAQService } from './faq.service';
import { FAQController } from './faq.controller';
import { CacheService } from '../cache/cache.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: FAQ.name, schema: FAQSchema }])],
  controllers: [FAQController],
  providers: [FAQService, CacheService],
  exports: [FAQService],
})
export class FAQModule {}
