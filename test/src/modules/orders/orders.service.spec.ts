import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { OrdersService } from 'src/modules/orders/orders.service';
import { OrdersRepository } from 'src/modules/orders/orders.repository';

describe('OrdersService', () => {
  let service: OrdersService;
  let repository: Partial<OrdersRepository>;

  beforeEach(async () => {
    repository = {
      findMenuItemByName: jest.fn(),
      updateMenuItemQuantity: jest.fn(),
      createOrder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: OrdersRepository, useValue: repository },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should throw an error if a menu item is not found', async () => {
      jest.spyOn(repository, 'findMenuItemByName').mockResolvedValue(null);

      await expect(
        service.createOrder('John', '123456', [{ name: 'Nonexistent', quantity: 1 }]),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if the stock is insufficient', async () => {
      jest.spyOn(repository, 'findMenuItemByName').mockResolvedValue({
        name: 'Sushi Roll',
        quantity: 1,
      } as any);

      await expect(
        service.createOrder('John', '123456', [{ name: 'Sushi Roll', quantity: 2 }]),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create an order if all conditions are met', async () => {
      jest.spyOn(repository, 'findMenuItemByName').mockResolvedValue({
        name: 'Sushi Roll',
        quantity: 10,
      } as any);

      jest.spyOn(repository, 'createOrder').mockResolvedValue({
        customerName: 'John',
        customerPhone: '123456',
        items: [{ name: 'Sushi Roll', quantity: 2 }],
      } as any);

      const result = await service.createOrder('John', '123456', [{ name: 'Sushi Roll', quantity: 2 }]);

      expect(result).toEqual({
        customerName: 'John',
        customerPhone: '123456',
        items: [{ name: 'Sushi Roll', quantity: 2 }],
      });
    });
  });
});
