import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { initialProducts, initialUsers } from '../config/demoData.js';

dotenv.config();

const seedData = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
  const force = process.argv.includes('--force');

  console.log(`\x1b[34m[Seed Script] Connecting to MongoDB...\x1b[0m`);

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`\x1b[32m✔ MongoDB connected successfully for seeding.\x1b[0m`);

    // 1. Check existing products
    const productCount = await Product.countDocuments();
    if (productCount > 0 && !force) {
      console.log(`\x1b[33mℹ Database already has ${productCount} products. Skipping product seed to avoid overwriting existing data.\x1b[0m`);
      console.log(`\x1b[90m(Run "npm run seed -- --force" if you explicitly want to reseed)\x1b[0m`);
    } else {
      if (force) {
        console.log(`\x1b[33m⚠ Force flag provided. Clearing existing products...\x1b[0m`);
        await Product.deleteMany({});
      }
      await Product.insertMany(initialProducts);
      console.log(`\x1b[32m✔ Seeded ${initialProducts.length} demo products successfully.\x1b[0m`);
    }

    // 2. Check and seed demo users (Admin and Customer)
    for (const userData of initialUsers) {
      const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
      if (!existingUser) {
        // User model pre-save hook will hash the password
        await User.create(userData);
        console.log(`\x1b[32m✔ Created default ${userData.role} user: ${userData.email}\x1b[0m`);
      } else {
        console.log(`\x1b[90mℹ Default user ${userData.email} already exists.\x1b[0m`);
      }
    }

    console.log(`\n\x1b[32m✔ Seeding process completed successfully!\x1b[0m`);
    console.log(`\x1b[36mDemo Credentials:\x1b[0m`);
    console.log(`  Admin:    admin@store.com / admin123`);
    console.log(`  Customer: user@store.com  / user123`);

    process.exit(0);
  } catch (error) {
    console.error(`\x1b[31m✖ Error during seeding: ${error.message}\x1b[0m`);
    console.error(`\x1b[33mMake sure your MONGODB_URI in server/.env is valid and the database is accessible.\x1b[0m`);
    process.exit(1);
  }
};

seedData();
