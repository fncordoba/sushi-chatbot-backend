import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FAQ } from './faq.schema';

@Injectable()
export class FAQRepository {
  private readonly logger = new Logger(FAQRepository.name);

  constructor(@InjectModel(FAQ.name) private readonly faqModel: Model<FAQ>) {}

  async findOneByQuestion(question: string): Promise<FAQ | null> {
    this.logger.log(`Searching FAQ for question: ${question}`);
    return this.faqModel.findOne({ question }).exec();
  }

  async createFAQ(question: string, answer: string): Promise<FAQ> {
    this.logger.log(`Creating FAQ with question: ${question}`);
    const newFAQ = new this.faqModel({ question, answer });
    return newFAQ.save();
  }

  async findAll(): Promise<FAQ[]> {
    this.logger.log('Retrieving all FAQs from the database');
    return this.faqModel.find().exec();
  }
}
