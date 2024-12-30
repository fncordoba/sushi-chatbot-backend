import * as readline from 'readline';
import axios from 'axios';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const chatbotApi = 'http://localhost:3000/chatbot/message';

async function sendMessageToChatbot(message: string): Promise<void> {
  try {
    const response = await axios.post(chatbotApi, { message });
    console.log(`🤖 Chatbot: ${response.data}`);
  } catch (error) {
    console.error('Error communicating with chatbot:', error.response?.data || error.message);
  }
}

function startChat() {
  console.log('💬 Bienvenido al chatbot. Escribe tu mensaje:');

  rl.on('line', async (input) => {
    if (input.toLowerCase() === 'salir') {
      console.log('👋 ¡Adiós!');
      rl.close();
      process.exit(0);
    } else {
      await sendMessageToChatbot(input);
      console.log('💬:');
    }
  });
}

startChat();
