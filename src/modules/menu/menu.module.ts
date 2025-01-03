import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MenuItem, MenuItemSchema } from './menu.schema';
import { MenuRepository } from './menu.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: MenuItem.name, schema: MenuItemSchema }])],
  controllers: [MenuController],
  providers: [MenuService, MenuRepository],
  exports: [MenuService]
})
export class MenuModule {}
