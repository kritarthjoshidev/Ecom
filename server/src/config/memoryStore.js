import bcrypt from 'bcryptjs';
import { initialProducts, initialUsers } from './demoData.js';

class MemoryStore {
  constructor() {
    this.users = [];
    this.products = [];
    this.orders = [];
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    // Hash passwords and seed users
    for (let i = 0; i < initialUsers.length; i++) {
      const u = initialUsers[i];
      const hashedPassword = await bcrypt.hash(u.password, 10);
      this.users.push({
        _id: `user_${i + 1}`,
        name: u.name,
        email: u.email.toLowerCase(),
        password: hashedPassword,
        role: u.role,
        createdAt: new Date().toISOString()
      });
    }

    // Seed products
    initialProducts.forEach((p, idx) => {
      this.products.push({
        _id: `prod_${idx + 1}`,
        ...p,
        createdAt: new Date().toISOString()
      });
    });

    // Seed one sample order for testing
    this.orders.push({
      _id: 'ord_demo_101',
      user: 'user_2', // Jane Customer
      orderItems: [
        {
          product: 'prod_1',
          name: this.products[0].name,
          quantity: 2,
          price: this.products[0].price,
          imageUrl: this.products[0].imageUrl
        },
        {
          product: 'prod_4',
          name: this.products[3].name,
          quantity: 1,
          price: this.products[3].price,
          imageUrl: this.products[3].imageUrl
        }
      ],
      shippingAddress: {
        fullName: 'Jane Customer',
        address: '742 Evergreen Terrace',
        city: 'Springfield',
        postalCode: '97477',
        country: 'United States',
        phone: '+1 555-0199'
      },
      paymentMethod: 'Cash On Delivery',
      itemsPrice: +(this.products[0].price * 2 + this.products[3].price).toFixed(2),
      taxPrice: +( (this.products[0].price * 2 + this.products[3].price) * 0.05 ).toFixed(2),
      shippingPrice: 0.0,
      totalPrice: +( (this.products[0].price * 2 + this.products[3].price) * 1.05 ).toFixed(2),
      isPaid: false,
      status: 'Processing',
      statusHistory: [
        { status: 'Pending', changedAt: new Date(Date.now() - 3600000).toISOString(), note: 'Order placed by customer' },
        { status: 'Processing', changedAt: new Date().toISOString(), note: 'Order confirmed and packing started' }
      ],
      createdAt: new Date(Date.now() - 3600000).toISOString()
    });

    this.initialized = true;
  }
}

export const memoryStore = new MemoryStore();
