import { Injectable, Logger } from '@nestjs/common';
import { MenuService } from '../menu/menu.service';
import { FAQService } from '../faq/faq.service';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
  private sessions: Record<string, { context: string }> = {};

  constructor(
    private readonly menuService: MenuService,
    private readonly faqService: FAQService,
    private readonly ordersService: OrdersService,
  ) {}

  async processMessage(message: string, sessionId: string): Promise<string> {
    this.logger.log(`Session ${sessionId}: Received message: ${message}`);
  
    // Inicializar sesión si no existe
    if (!this.sessions[sessionId]) {
      this.sessions[sessionId] = { context: '' };
    }
  
    const session = this.sessions[sessionId];
  
    // Resetear el contexto si no hay flujo pendiente
    if (!session.context || session.context === 'completed') {
      session.context = '';
      if (message.toLowerCase().includes('menú') || message.toLowerCase().includes('menu')) {
        const menuItems = await this.menuService.getMenu();
        return `Aquí tienes nuestro menú:\n${menuItems.map((item) => `${item.name}: $${item.price}`).join('\n')}`;
      }
  
      if (message.toLowerCase().includes('orden') || message.toLowerCase().includes('pedido')) {
        session.context = 'order';
        return 'Por favor, dime tu nombre, teléfono e ítems en el formato: Nombre; Teléfono; Item1:Cantidad, Item2:Cantidad.';
      }
  
      if (message.toLowerCase().includes('pregunta')) {
        session.context = 'faq';
        return 'Por favor, escribe tu pregunta específica.';
      }
  
      return 'Lo siento, no entendí tu mensaje. Puedes pedir el "menú", realizar una "orden" o hacer una "pregunta".';
    }
  
    // Flujo de Pedidos
    if (session.context === 'order') {
      try {
        const [name, phone, itemsText] = message.split(';');
        if (!name || !phone || !itemsText) {
          return 'Formato inválido. Por favor, usa: Nombre; Teléfono; Item1:Cantidad, Item2:Cantidad.';
        }
        const items = itemsText.split(',').map((itemText) => {
          const [itemName, quantity] = itemText.split(':');
          return { name: itemName.trim(), quantity: parseInt(quantity.trim(), 10) };
        });
        const order = await this.ordersService.createOrder(name.trim(), phone.trim(), items);
        session.context = 'completed';
        return `Tu orden ha sido creada exitosamente. El ID de tu orden es: ${order._id}`;
      } catch (error) {
        return error.message || 'Hubo un error al procesar tu orden. Intenta nuevamente.';
      }
    }
  
    // Flujo de Preguntas Frecuentes
    if (session.context === 'faq') {
      const faqResponse = await this.faqService.findFAQ(message);
      session.context = 'completed';
      return faqResponse;
    }
  
    // Si el contexto no coincide, resetear
    session.context = '';
    return 'Lo siento, no entendí tu mensaje.';
  }
  
}
