import { Body, Controller, Get, Post } from '@nestjs/common';
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
}
