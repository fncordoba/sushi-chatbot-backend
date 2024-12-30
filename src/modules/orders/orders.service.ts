import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { Order } from './order.schema';
import { CreateOrderItemDto } from './dto/item.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private readonly ordersRepository: OrdersRepository) {}

  async createOrder(customerName: string, customerPhone: string, items: CreateOrderItemDto[]): Promise<Order> {
    for (const item of items) {
      const menuItem = await this.ordersRepository.findMenuItemByName(item.name);
      if (!menuItem) {
        throw new BadRequestException(`El producto "${item.name}" no existe en el menú.`);
      }

      if (menuItem.quantity < item.quantity) {
        throw new BadRequestException(
          `No hay suficiente stock para "${item.name}". Stock disponible: ${menuItem.quantity}.`,
        );
      }
    }

    for (const item of items) {
      await this.ordersRepository.updateMenuItemQuantity(item.name, item.quantity);
    }

    const newOrder = {
      customerName,
      customerPhone,
      items,
    };
    this.logger.log(`Creating new order for customer: ${customerName}`);
    return this.ordersRepository.createOrder(newOrder);
  }

  async getOrderById(orderId: string): Promise<Order> {
    try {
      this.logger.log(`Retrieving order with ID: ${orderId}`);
      return this.ordersRepository.findOrderById(orderId);
    } catch (error) {
      this.logger.error(`Error retrieving order with ID: ${orderId}`, error.stack);
      throw new Error('Hubo un error al obtener la orden. Por favor, verifica el ID.');
    }
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      this.logger.log('Retrieving all orders');
      return this.ordersRepository.findAllOrders();
    } catch (error) {
      this.logger.error('Error retrieving all orders', error.stack);
      throw new Error('Hubo un error al obtener las órdenes. Por favor, intenta nuevamente.');
    }
  }
}
