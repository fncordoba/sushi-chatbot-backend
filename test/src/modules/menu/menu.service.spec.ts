import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MenuService } from 'src/modules/menu/menu.service';
import { MenuRepository } from 'src/modules/menu/menu.repository';

describe('MenuService', () => {
  let service: MenuService;
  let repository: Partial<MenuRepository>;

  beforeEach(async () => {
    repository = {
      findAll: jest.fn(),
      create: jest.fn(),
      findByName: jest.fn(),
      updateQuantity: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        { provide: MenuRepository, useValue: repository },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateStock', () => {
    it('should throw an error if quantity is negative', async () => {
      await expect(service.updateStock('Sushi Roll', -1)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if menu item is not found', async () => {
      jest.spyOn(repository, 'findByName').mockResolvedValue(null);

      await expect(service.updateStock('Nonexistent', 10)).rejects.toThrow(NotFoundException);
    });

    it('should update the stock if valid', async () => {
      jest.spyOn(repository, 'findByName').mockResolvedValue({
        name: 'Sushi Roll',
        quantity: 10,
      } as any);

      jest.spyOn(repository, 'updateQuantity').mockResolvedValue({
        name: 'Sushi Roll',
        quantity: 20,
      } as any);

      const result = await service.updateStock('Sushi Roll', 20);

      expect(result.quantity).toBe(20);
    });
  });
});
