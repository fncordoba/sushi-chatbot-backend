import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuItem } from './menu.schema';

@Injectable()
export class MenuRepository {
  private readonly logger = new Logger(MenuRepository.name);

  constructor(@InjectModel(MenuItem.name) private readonly menuItemModel: Model<MenuItem>) {}

  async findAll(): Promise<MenuItem[]> {
    this.logger.log('Retrieving all menu items');
    return this.menuItemModel.find().exec();
  }

  async create(item: Partial<MenuItem>): Promise<MenuItem> {
    this.logger.log(`Creating a new menu item: ${item.name}`);
    const newItem = new this.menuItemModel(item);
    return newItem.save();
  }

  async findByName(name: string): Promise<MenuItem | null> {
    this.logger.log(`Finding menu item by name: ${name}`);
    return this.menuItemModel.findOne({ name }).exec();
  }

  async updateQuantity(name: string, quantity: number): Promise<MenuItem> {
    this.logger.log(`Updating quantity of menu item: ${name} to ${quantity}`);
    return this.menuItemModel.findOneAndUpdate({ name }, { quantity }, { new: true }).exec();
  }
}
