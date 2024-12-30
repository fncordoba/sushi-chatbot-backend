import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuItem } from './menu.schema';

@Injectable()
export class MenuService {
  constructor(@InjectModel(MenuItem.name) private readonly menuItemModel: Model<MenuItem>) {}

  async getMenu(): Promise<MenuItem[]> {
    return this.menuItemModel.find().exec();
  }

  async addMenuItem(item: Partial<MenuItem>): Promise<MenuItem> {
    const newItem = new this.menuItemModel(item);
    return newItem.save();
  }
}
