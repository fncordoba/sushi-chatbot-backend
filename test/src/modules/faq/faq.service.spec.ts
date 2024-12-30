import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from 'src/cache/cache.service';
import { FAQRepository } from 'src/modules/faq/faq.repository';
import { FAQService } from 'src/modules/faq/faq.service';

describe('FAQService', () => {
  let service: FAQService;
  let repository: Partial<FAQRepository>;
  let cacheService: Partial<CacheService>;

  beforeEach(async () => {
    repository = {
      findOneByQuestion: jest.fn(),
      createFAQ: jest.fn(),
    };

    cacheService = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FAQService,
        { provide: FAQRepository, useValue: repository },
        { provide: CacheService, useValue: cacheService },
      ],
    }).compile();

    service = module.get<FAQService>(FAQService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findFAQ', () => {
    it('should return a cached answer if available', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue('Cached answer');

      const result = await service.findFAQ('Question?');

      expect(result).toBe('Cached answer');
      expect(cacheService.get).toHaveBeenCalledWith('Question?');
    });

    it('should return an answer from the database if not cached', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest.spyOn(repository, 'findOneByQuestion').mockResolvedValue({
        question: 'Question?',
        answer: 'Database answer',
      } as any);

      const result = await service.findFAQ('Question?');

      expect(result).toBe('Database answer');
      expect(repository.findOneByQuestion).toHaveBeenCalledWith('Question?');
    });

    it('should cache the answer retrieved from the database', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest.spyOn(repository, 'findOneByQuestion').mockResolvedValue({
        question: 'Question?',
        answer: 'Database answer',
      } as any);

      await service.findFAQ('Question?');

      expect(cacheService.set).toHaveBeenCalledWith('Question?', 'Database answer', 3600);
    });

    it('should return a default message if the question is not found', async () => {
      jest.spyOn(cacheService, 'get').mockResolvedValue(null);
      jest.spyOn(repository, 'findOneByQuestion').mockResolvedValue(null);

      const result = await service.findFAQ('Unknown Question?');

      expect(result).toBe('No tenemos respuesta para esa pregunta.');
    });
  });
});
