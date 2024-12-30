import * as mongoose from 'mongoose';
import { MenuItemSchema } from 'src/menu/menu.schema';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sushi';

async function seedDatabase() {
  await mongoose.connect(MONGO_URI);
  const MenuItem = mongoose.model('MenuItem', MenuItemSchema);

  const menuItems = [
    { name: 'Sushi Roll', price: 10, description: 'Delicious sushi roll' },
    { name: 'Sashimi', price: 15, description: 'Fresh sliced fish' },
    { name: 'Tempura', price: 12, description: 'Crispy fried shrimp' },
  ];

  await MenuItem.insertMany(menuItems);
  console.log('Database seeded with menu items');
  mongoose.disconnect();
}

seedDatabase().catch((err) => {
  console.error(err);
  mongoose.disconnect();
});
