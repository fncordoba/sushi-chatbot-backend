import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MenuRepository } from './menu.repository';
import { MenuItem } from './menu.schema';

@Injectable()
export class MenuService {
  constructor(private readonly menuRepository: MenuRepository) {}

  async getMenu(): Promise<MenuItem[]> {
    return this.menuRepository.findAll();
  }

  async addMenuItem(item: Partial<MenuItem>): Promise<MenuItem> {
    return this.menuRepository.create(item);
  }

  async updateStock(name: string, quantity: number): Promise<MenuItem> {
    if (quantity < 0) {
      throw new BadRequestException('La cantidad no puede ser negativa.');
    }

    const menuItem = await this.menuRepository.findByName(name);
    if (!menuItem) {
      throw new NotFoundException(`El producto "${name}" no se encuentra en el menú.`);
    }

    return this.menuRepository.updateQuantity(name, quantity);
  }
}
