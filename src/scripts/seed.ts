import * as mongoose from 'mongoose';
import { MenuItemSchema } from 'src/modules/menu/menu.schema';
import { FAQSchema } from 'src/modules/faq/faq.schema';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sushi';

async function seedDatabase() {
  await mongoose.connect(MONGO_URI);

  // Modelo de Menú
  const MenuItem = mongoose.model('MenuItem', MenuItemSchema);
  const menuItems = [
    { name: 'Sushi Roll', price: 10, description: 'Delicious sushi roll', quantity: 20 },
    { name: 'Sashimi', price: 15, description: 'Fresh sliced fish', quantity: 10 },
    { name: 'Tempura', price: 12, description: 'Crispy fried shrimp', quantity: 15 },
  ];

  // Modelo de FAQs
  const FAQ = mongoose.model('FAQ', FAQSchema);
  const faqs = [
    { question: '¿Están abiertos?', answer: 'Sí, estamos abiertos de 10:00 a 22:00.' },
    { question: '¿Hacen envíos?', answer: 'Sí, hacemos envíos a toda la ciudad.' },
    { question: '¿Cuáles son las formas de pago?', answer: 'Aceptamos efectivo, tarjetas y transferencias bancarias.' },
  ];

  try {
    await MenuItem.deleteMany({});
    await FAQ.deleteMany({});

    await MenuItem.insertMany(menuItems);
    console.log('Database seeded with menu items');

    await FAQ.insertMany(faqs);
    console.log('Database seeded with FAQs');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    mongoose.disconnect();
  }
}

seedDatabase().catch((err) => {
  console.error(err);
  mongoose.disconnect();
});
