import * as mongoose from 'mongoose';
import { MenuItemSchema } from 'src/modules/menu/menu.schema';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sushi';

async function seedMenu() {
  await mongoose.connect(MONGO_URI);
  const MenuItem = mongoose.model('MenuItem', MenuItemSchema);

  const menuItems = [
    { name: 'Sushi Roll', price: 10, description: 'Delicious sushi roll', quantity: 20 },
    { name: 'Sashimi', price: 15, description: 'Fresh sliced fish', quantity: 10 },
    { name: 'Tempura', price: 12, description: 'Crispy fried shrimp', quantity: 15 },
  ];

  try {
    await MenuItem.deleteMany({});
    await MenuItem.insertMany(menuItems);
    console.log('Database seeded with menu items');
  } catch (err) {
    console.error('Error seeding menu:', err);
  } finally {
    mongoose.disconnect();
  }
}

seedMenu().catch((err) => {
  console.error(err);
  mongoose.disconnect();
});
