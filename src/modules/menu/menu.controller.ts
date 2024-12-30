import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuItem } from './menu.schema';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getMenu(): Promise<MenuItem[]> {
    return this.menuService.getMenu();
  }

  @Post()
  async addMenuItem(@Body() item: Partial<MenuItem>): Promise<MenuItem> {
    return this.menuService.addMenuItem(item);
  }

  @Patch('update-stock')
  async updateStock(
    @Body('name') name: string,
    @Body('quantity') quantity: number,
  ): Promise<MenuItem> {
    return this.menuService.updateStock(name, quantity);
  }
}
