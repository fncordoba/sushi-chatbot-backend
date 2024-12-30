import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './order.schema';
import { MenuItem } from 'src/menu/menu.schema';

@Injectable()
export class OrdersRepository {
  private readonly logger = new Logger(OrdersRepository.name);

  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(MenuItem.name) private readonly menuItemModel: Model<MenuItem>,
  ) {}

  async createOrder(data: Partial<Order>): Promise<Order> {
    this.logger.log('Creating a new order');
    const newOrder = new this.orderModel(data);
    return newOrder.save();
  }

  async findOrderById(orderId: string): Promise<Order | null> {
    this.logger.log(`Finding order with ID: ${orderId}`);
    return this.orderModel.findById(orderId).exec();
  }

  async findAllOrders(): Promise<Order[]> {
    this.logger.log('Retrieving all orders');
    return this.orderModel.find().exec();
  }

  async findMenuItemByName(name: string): Promise<MenuItem | null> {
    this.logger.log(`Finding menu item with name: ${name}`);
    return this.menuItemModel.findOne({ name }).exec();
  }

  async updateMenuItemQuantity(name: string, quantity: number): Promise<void> {
    this.logger.log(`Updating menu item quantity for: ${name}, decrementing by: ${quantity}`);
    await this.menuItemModel.updateOne(
      { name },
      { $inc: { quantity: -quantity } },
    ).exec();
  }
}
