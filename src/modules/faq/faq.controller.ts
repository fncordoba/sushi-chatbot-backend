import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FAQService } from './faq.service';
import { FAQ } from './faq.schema';

@Controller('faq')
export class FAQController {
  constructor(private readonly faqService: FAQService) {}

  @Get()
  async getFAQ(@Query('question') question: string): Promise<string> {
    return this.faqService.findFAQ(question);
  }

  @Get('all')
  async getAllFAQs(): Promise<FAQ[]> {
    return this.faqService.getAllFAQs();
  }

  @Post()
  async addFAQ(@Body('question') question: string, @Body('answer') answer: string) {
    return this.faqService.addFAQ(question, answer);
  }
}
