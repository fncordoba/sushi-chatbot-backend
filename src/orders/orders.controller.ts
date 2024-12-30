import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Order } from './order.schema';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @Body('customerName') customerName: string,
    @Body('customerPhone') customerPhone: string,
    @Body('items') items: { name: string; quantity: number }[],
  ): Promise<Order> {
    return this.ordersService.createOrder(customerName, customerPhone, items);
  }

  @Get(':id')
  async getOrderById(@Param('id') orderId: string): Promise<Order> {
    return this.ordersService.getOrderById(orderId);
  }

  @Get()
  async getAllOrders(): Promise<Order[]> {
    return this.ordersService.getAllOrders();
  }
}
