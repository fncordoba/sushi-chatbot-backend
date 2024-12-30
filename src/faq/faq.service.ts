import { Injectable, Logger } from '@nestjs/common';
import { FAQRepository } from './faq.repository';
import { CacheService } from '../cache/cache.service';
import { FAQ } from './faq.schema';

@Injectable()
export class FAQService {
  private readonly logger = new Logger(FAQService.name);

  constructor(
    private readonly faqRepository: FAQRepository,
    private readonly cacheService: CacheService,
  ) {}

  async findFAQ(question: string): Promise<string> {
    try {
      const cachedAnswer = await this.cacheService.get(question);
      if (cachedAnswer) {
        this.logger.log(`FAQ retrieved from cache for question: ${question}`);
        return cachedAnswer;
      }

      const faq = await this.faqRepository.findOneByQuestion(question);
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
      this.logger.log(`Adding new FAQ for question: ${question}`);
      return this.faqRepository.createFAQ(question, answer);
    } catch (error) {
      this.logger.error(`Error adding FAQ for question: ${question}`, error.stack);
      throw new Error('Hubo un error al guardar la pregunta frecuente. Por favor, intenta nuevamente.');
    }
  }

  async getAllFAQs(): Promise<FAQ[]> {
    try {
      this.logger.log('Retrieving all FAQs from the database');
      return this.faqRepository.findAll();
    } catch (error) {
      this.logger.error('Error retrieving all FAQs', error.stack);
      throw new Error('Hubo un error al obtener las preguntas frecuentes. Por favor, intenta nuevamente más tarde.');
    }
  }
}
