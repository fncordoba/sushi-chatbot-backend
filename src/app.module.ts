import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenuModule } from './modules/menu/menu.module';
import { FAQModule } from './modules/faq/faq.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ChatbotModule } from './modules/chatbot/chatbot.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Conexión a MongoDB
    MongooseModule.forRoot(process.env.MONGO_URI),
    // Modules
    MenuModule,
    FAQModule,
    OrdersModule,
    ChatbotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
