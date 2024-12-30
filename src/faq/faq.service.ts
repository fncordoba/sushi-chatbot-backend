import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FAQ } from './faq.schema';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class FAQService {
  private readonly logger = new Logger(FAQService.name);

  constructor(
    @InjectModel(FAQ.name) private readonly faqModel: Model<FAQ>,
    private readonly cacheService: CacheService,
  ) {}

  async findFAQ(question: string): Promise<string> {
    try {
      // Intenta obtener la respuesta desde Redis
      const cachedAnswer = await this.cacheService.get(question);
      if (cachedAnswer) {
        this.logger.log(`FAQ retrieved from cache for question: ${question}`);
        return cachedAnswer;
      }

      // Busca la respuesta en MongoDB
      const faq = await this.faqModel.findOne({ question }).exec();
      if (faq) {
        await this.cacheService.set(question, faq.answer, 3600);
        this.logger.log(`FAQ retrieved from database and cached for question: ${question}`);
        return faq.answer;
      }

      this.logger.warn(`FAQ not found for question: ${question}`);
      return 'No tenemos respuesta para esa pregunta.';
    } catch (error) {
      this.logger.error(`Error retrieving FAQ for question: ${question}`, error.stack);
      throw new Error('Hubo un error al procesar tu solicitud. Por favor, intenta nuevamente más tarde.');
    }
  }

  async addFAQ(question: string, answer: string): Promise<FAQ> {
    try {
      const newFAQ = new this.faqModel({ question, answer });
      this.logger.log(`Adding new FAQ for question: ${question}`);
      return newFAQ.save();
    } catch (error) {
      this.logger.error(`Error adding FAQ for question: ${question}`, error.stack);
      throw new Error('Hubo un error al guardar la pregunta frecuente. Por favor, intenta nuevamente.');
    }
  }

  async getAllFAQs(): Promise<FAQ[]> {
    try {
      this.logger.log('Retrieving all FAQs from the database');
      return this.faqModel.find().exec();
    } catch (error) {
      this.logger.error('Error retrieving all FAQs', error.stack);
      throw new Error('Hubo un error al obtener las preguntas frecuentes. Por favor, intenta nuevamente más tarde.');
    }
  }  
}
