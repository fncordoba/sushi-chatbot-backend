import * as mongoose from 'mongoose';
import { FAQSchema } from 'src/modules/faq/faq.schema';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sushi';

async function seedFaqs() {
  await mongoose.connect(MONGO_URI);
  const FAQ = mongoose.model('FAQ', FAQSchema);

  const faqs = [
    { question: '¿Están abiertos?', answer: 'Sí, estamos abiertos de 10:00 a 22:00.' },
    { question: '¿Hacen envíos?', answer: 'Sí, hacemos envíos a toda la ciudad.' },
    { question: '¿Cuáles son las formas de pago?', answer: 'Aceptamos efectivo, tarjetas y transferencias bancarias.' },
  ];

  try {
    await FAQ.deleteMany({});
    await FAQ.insertMany(faqs);
    console.log('Database seeded with FAQs');
  } catch (err) {
    console.error('Error seeding FAQs:', err);
  } finally {
    mongoose.disconnect();
  }
}

seedFaqs().catch((err) => {
  console.error(err);
  mongoose.disconnect();
});
