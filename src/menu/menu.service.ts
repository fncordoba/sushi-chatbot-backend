import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async updateStock(name: string, quantity: number): Promise<MenuItem> {
    if (quantity < 0) {
      throw new BadRequestException('La cantidad no puede ser negativa.');
    }

    const menuItem = await this.menuItemModel.findOne({ name }).exec();
    if (!menuItem) {
      throw new NotFoundException(`El producto "${name}" no se encuentra en el menú.`);
    }

    menuItem.quantity = quantity;
    return menuItem.save();
  }
}
