import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('message')
  async handleMessage(
    @Body('message') message: string,
    @Body('sessionId') sessionId: string,
  ): Promise<string> {
    return this.chatbotService.processMessage(message, sessionId);
  }
}
