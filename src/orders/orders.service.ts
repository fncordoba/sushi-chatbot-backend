import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './order.schema';
import { MenuItem } from 'src/menu/menu.schema';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(MenuItem.name) private readonly menuItemModel: Model<MenuItem>,
  ) {}

  async createOrder(customerName: string, customerPhone: string, items: { name: string; quantity: number }[]): Promise<Order> {
    for (const item of items) {
      const menuItem = await this.menuItemModel.findOne({ name: item.name }).exec();
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
      await this.menuItemModel.updateOne(
        { name: item.name },
        { $inc: { quantity: -item.quantity } },
      ).exec();
    }

    const newOrder = new this.orderModel({ customerName, customerPhone, items });
    this.logger.log(`Creating new order for customer: ${customerName}`);
    return newOrder.save();
  }

  async getOrderById(orderId: string): Promise<Order> {
    try {
      this.logger.log(`Retrieving order with ID: ${orderId}`);
      return this.orderModel.findById(orderId).exec();
    } catch (error) {
      this.logger.error(`Error retrieving order with ID: ${orderId}`, error.stack);
      throw new Error('Hubo un error al obtener la orden. Por favor, verifica el ID.');
    }
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      this.logger.log('Retrieving all orders');
      return this.orderModel.find().exec();
    } catch (error) {
      this.logger.error('Error retrieving all orders', error.stack);
      throw new Error('Hubo un error al obtener las órdenes. Por favor, intenta nuevamente.');
    }
  }
}
