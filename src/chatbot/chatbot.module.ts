import { Module } from '@nestjs/common';
import { MenuModule } from '../menu/menu.module';
import { FAQModule } from '../faq/faq.module';
import { OrdersModule } from '../orders/orders.module';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';

@Module({
  imports: [MenuModule, FAQModule, OrdersModule],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}
