import http from 'http';
import app from '../src/server.js';
import { memoryStore } from '../src/config/memoryStore.js';

let server;
let baseUrl;

const startTestServer = () => {
  return new Promise((resolve) => {
    // Port 5055 for isolated testing
    const port = 5055;
    server = http.createServer(app);
    server.listen(port, () => {
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
};

const stopTestServer = () => {
  return new Promise((resolve) => {
    if (server) {
      server.close(resolve);
    } else {
      resolve();
    }
  });
};

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
};

const runTests = async () => {
  console.log(`\n==============================================`);
  console.log(`🧪 Running E-Commerce Backend Test Suite`);
  console.log(`==============================================\n`);

  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`  \x1b[32m✔ PASS\x1b[0m ${name}`);
      passed++;
    } catch (err) {
      console.error(`  \x1b[31m✖ FAIL\x1b[0m ${name}`);
      console.error(`    \x1b[31mError:\x1b[0m ${err.message}`);
      failed++;
    }
  };

  try {
    await memoryStore.init();
    await startTestServer();

    let adminToken = '';
    let customerToken = '';
    let testProductId = '';
    let createdOrderId = '';

    // Test 1: Health check
    await test('GET /api/health returns 200 and operational status', async () => {
      const res = await fetch(`${baseUrl}/api/health`);
      const data = await res.json();
      assert(res.status === 200, `Expected status 200, got ${res.status}`);
      assert(data.status === 'ok', 'Status must be ok');
      assert(data.database, 'Database info must be present');
    });

    // Test 2: Admin Login
    await test('POST /api/auth/login authenticates Admin user', async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@store.com',
          password: 'admin123'
        })
      });
      const data = await res.json();
      assert(res.status === 200, `Expected 200, got ${res.status}: ${data.message}`);
      assert(data.token, 'Token must be returned');
      assert(data.role === 'admin', 'Role must be admin');
      adminToken = data.token;
    });

    // Test 3: Customer Login
    await test('POST /api/auth/login authenticates Customer user', async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'user@store.com',
          password: 'user123'
        })
      });
      const data = await res.json();
      assert(res.status === 200, `Expected 200, got ${res.status}: ${data.message}`);
      assert(data.token, 'Token must be returned');
      assert(data.role === 'user', 'Role must be user');
      customerToken = data.token;
    });

    // Test 4: New User Registration
    await test('POST /api/auth/register creates new customer account', async () => {
      const randomEmail = `testuser_${Date.now()}@example.com`;
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Customer',
          email: randomEmail,
          password: 'password123'
        })
      });
      const data = await res.json();
      assert(res.status === 201, `Expected 201, got ${res.status}: ${data.message}`);
      assert(data.email === randomEmail.toLowerCase(), 'Email must match');
      assert(data.role === 'user', 'Default role must be user');
    });

    // Test 5: Fetch Products Catalog & Categories
    await test('GET /api/products returns product catalog and categories', async () => {
      const res = await fetch(`${baseUrl}/api/products`);
      const data = await res.json();
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(Array.isArray(data.products), 'Products must be an array');
      assert(data.products.length > 0, 'Products count must be greater than 0');
      assert(Array.isArray(data.categories), 'Categories must be an array');
      testProductId = data.products[0]._id;
    });

    // Test 6: Search & Category Filter
    await test('GET /api/products?search=Avocado filters catalog correctly', async () => {
      const res = await fetch(`${baseUrl}/api/products?search=Avocado`);
      const data = await res.json();
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(data.products.length >= 1, 'Should find at least 1 avocado product');
      assert(data.products[0].name.includes('Avocado'), 'Product name should include Avocado');
    });

    // Test 7: Non-Admin blocked from creating product (Authorization check)
    await test('POST /api/products rejects non-admin user with 403 Forbidden', async () => {
      const res = await fetch(`${baseUrl}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customerToken}`
        },
        body: JSON.stringify({
          name: 'Hacked Product',
          description: 'Should fail',
          price: 99.99,
          category: 'Bakery',
          stock: 5,
          imageUrl: 'https://example.com/test.jpg'
        })
      });
      assert(res.status === 403, `Expected 403 Forbidden, got ${res.status}`);
    });

    // Test 8: Admin creates new product
    await test('POST /api/products allows Admin to create product', async () => {
      const res = await fetch(`${baseUrl}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          name: 'Artisan Greek Olive Oil (500ml)',
          description: 'Extra virgin cold extracted Greek olive oil.',
          price: 12.99,
          category: 'Pantry',
          stock: 20,
          imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
          featured: true
        })
      });
      const data = await res.json();
      assert(res.status === 201, `Expected 201 Created, got ${res.status}: ${data.message}`);
      assert(data.name === 'Artisan Greek Olive Oil (500ml)', 'Product name must match');
    });

    // Test 9: Order creation with server-side price calculation
    await test('POST /api/orders calculates prices on server & decrements stock', async () => {
      const res = await fetch(`${baseUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customerToken}`
        },
        body: JSON.stringify({
          orderItems: [
            {
              product: testProductId,
              quantity: 2,
              // Attempting to send a tampered price: server MUST ignore this!
              price: 0.01
            }
          ],
          shippingAddress: {
            fullName: 'Jane Customer',
            address: '123 Market Street',
            city: 'Mumbai',
            postalCode: '400001',
            country: 'India',
            phone: '+91 9876543210'
          },
          paymentMethod: 'Cash On Delivery'
        })
      });
      const order = await res.json();
      assert(res.status === 201, `Expected 201, got ${res.status}: ${order.message}`);
      assert(order._id, 'Order must have an ID');
      // Server must calculate price using trusted DB price, not 0.01!
      assert(order.orderItems[0].price > 1.0, 'Server must have used true product price instead of client submitted fake price');
      assert(order.totalPrice > 0, 'Total price must be greater than 0');
      createdOrderId = order._id;
    });

    // Test 10: Customer can view their own orders
    await test('GET /api/orders/my-orders returns customer orders', async () => {
      const res = await fetch(`${baseUrl}/api/orders/my-orders`, {
        headers: { 'Authorization': `Bearer ${customerToken}` }
      });
      const orders = await res.json();
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(Array.isArray(orders), 'Orders must be an array');
      assert(orders.length >= 1, 'Should find at least 1 order for customer');
    });

    // Test 11: Admin can view all orders and update status
    await test('PUT /api/orders/:id/status allows Admin to transition order to Shipped', async () => {
      const res = await fetch(`${baseUrl}/api/orders/${createdOrderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          status: 'Shipped',
          note: 'Package handed over to courier partner'
        })
      });
      const updated = await res.json();
      assert(res.status === 200, `Expected 200, got ${res.status}: ${updated.message}`);
      assert(updated.status === 'Shipped', 'Order status must be updated to Shipped');
      assert(updated.statusHistory.some(h => h.status === 'Shipped'), 'Status history must record transition');
    });

  } finally {
    await stopTestServer();
  }

  console.log(`\n==============================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`==============================================\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runTests();
