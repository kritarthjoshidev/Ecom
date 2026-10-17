# FreshMart — Full-Stack E-Commerce Web Application

A modern, responsive, beginner-friendly yet production-ready full-stack E-Commerce web application built with **React**, **Vite**, **Tailwind CSS**, **Node.js**, **Express**, and **MongoDB with Mongoose**.

---

## 📸 Key Interfaces & Inspirations
- **Storefront & Product Catalog:** Inspired by *Day 30 — Grocery E-commerce UI by Vedant Mehra on Dribbble*. Features category pill filters, live keyword search, dynamic quantity stepper on cards, and detailed product modal.
- **Admin Dashboard:** Inspired by *CommerceO - Shadcn eCommerce Admin Dashboard Template*. Includes overview KPI cards (Revenue, Orders, Catalog, Pending), Product CRUD table, and Orders management table with live status updates.
- **Order Tracking:** Inspired by *Clean Order Tracking Dashboard by Kenny Howell on Dribbble*. Interactive 4-step milestone timeline (*Order Placed* → *Processing* → *In Transit* → *Delivered*), destination details, and itemized receipts.

---

## 🛠️ Tech Stack Architecture

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Vite + Tailwind CSS | Responsive, accessible light-theme UI with Plus Jakarta Sans typography and Lucide icons |
| **Backend** | Node.js + Express (ES Modules) | RESTful API architecture with CORS, request logging, and structured error handling |
| **Database** | MongoDB with Mongoose | Relational schemas for Users, Products, and Orders with timestamps and indexing |
| **Authentication** | JWT + Bcrypt.js | Stateless bearer tokens, salted password hashing, and role-based authorization |
| **Offline Fallback** | In-Memory Data Store | Gracefully runs offline/without Atlas so all features can be evaluated instantly |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v24)
- **npm** v10+

### 2. Setup & Installation
Clone or navigate to the project directory:
```bash
cd ecommerce-app
```

Install server and client dependencies:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Environment Configuration
The project comes preconfigured with `.env.example`. Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=super_secret_jwt_key_antigravity_ecommerce_2026
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```
> **Note on MongoDB Atlas:** To connect to a live MongoDB Atlas cluster, simply paste your connection string (e.g., `mongodb+srv://<user>:<password>@cluster0.mongodb.net/ecommerce?retryWrites=true&w=majority`) into `server/.env`.
> If MongoDB is not yet configured, the server automatically runs in **In-Memory Demo Mode** so you can test all features immediately without any setup hurdles!

### 4. Database Seeding (Idempotent)
To seed demo products and default user accounts into MongoDB:
```bash
cd server
npm run seed
```
> The seed script is strictly idempotent: it skips insertion if records already exist to protect real data. To force reseed, pass the flag: `npm run seed -- --force`.

### 5. Running the Application
In two separate terminals:

**Terminal 1 — Backend API:**
```bash
cd server
npm run dev
# Starts backend at http://localhost:5000
```

**Terminal 2 — Frontend App:**
```bash
cd client
npm run dev
# Starts Vite client at http://localhost:5173
```

---

## 👥 Demo Credentials (1-Click Login Available)

For evaluator convenience, the login modal includes **1-Click Quick Fill** buttons:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@store.com` | `admin123` | Product CRUD (Create, Edit, Delete), Order status updates, Store KPIs |
| **Customer** | `user@store.com` | `user123` | Browse catalog, Add to Cart, Checkout, View personal orders & tracking |

---

## 🔒 Security & Data Integrity Highlights

1. **Trusted Server Price Calculation:**
   - The client never dictates the final order price or subtotal.
   - When an order is submitted (`POST /api/orders`), the backend looks up each product in the database by ID, verifies available stock, fetches the trusted price, and recalculates the subtotal, taxes (5%), and shipping costs.
2. **Inventory Stock Management:**
   - Decrements product stock count atomically upon order placement and prevents purchases exceeding inventory.
3. **Role-Based Access Control (RBAC):**
   - Protected endpoints require `Bearer <JWT_TOKEN>`.
   - Admin routes (`POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`, `GET /api/orders`, `PUT /api/orders/:id/status`) strictly enforce `adminOnly` middleware.
4. **IDOR & Order Ownership Protection:**
   - Regular users can only fetch and view their own orders (`/api/orders/my-orders`).
   - Access to `/api/orders/:id` verifies `order.user === req.user._id` unless the requester is an Admin.

---

## 🧪 Automated Backend Tests

The project includes an automated integration test suite that tests all endpoints and security constraints:

```bash
cd server
npm test
```

### Test Suite Coverage (11 Tests Passed):
- `GET /api/health` — API health check and operational status.
- `POST /api/auth/login` — Admin authentication and JWT token issuance.
- `POST /api/auth/login` — Customer authentication and JWT token issuance.
- `POST /api/auth/register` — New customer registration with bcrypt password hashing.
- `GET /api/products` — Product catalog and distinct category listing.
- `GET /api/products?search=...` — Live catalog search and category filtering.
- `POST /api/products` — **Authorization Check:** Non-admin blocked with `403 Forbidden`.
- `POST /api/products` — **Admin CRUD:** Admin successfully creates product.
- `POST /api/orders` — **Security Check:** Server calculates true total from DB and ignores tampered client prices.
- `GET /api/orders/my-orders` — **Ownership Check:** Customer retrieves only their own orders.
- `PUT /api/orders/:id/status` — **Admin Management:** Admin updates status to *Shipped* with audit log.

---

## 📁 Project Structure

```
ecommerce-app/
├── package.json               # Root scripts
├── .gitignore                 # Excludes .env, node_modules, dist
├── .env.example               # Root environment template
├── README.md                  # Comprehensive setup and API guide
├── server/                    # Node.js + Express Backend
│   ├── package.json
│   ├── .env.example
│   ├── .env
│   ├── src/
│   │   ├── config/            # DB connection & fallback store
│   │   ├── models/            # Mongoose Schemas (User, Product, Order)
│   │   ├── middleware/        # JWT auth, RBAC, error handling
│   │   ├── controllers/       # Auth, Product, and Order business logic
│   │   ├── routes/            # Express router modules
│   │   ├── scripts/           # Idempotent seed script
│   │   └── server.js          # Express app entry point
│   └── tests/
│       └── api.test.js        # Automated API test suite
└── client/                    # React 19 + Vite Frontend
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js     # Custom color tokens & shadows
    ├── index.html             # Plus Jakarta Sans & SEO meta
    └── src/
        ├── index.css          # Tailwind directives & micro-animations
        ├── main.jsx           # Providers wrapping
        ├── App.jsx            # App root & modal management
        ├── context/           # AuthContext & CartContext
        ├── services/          # Fetch API client
        ├── components/        # Navbar, ProductCard, CartDrawer, etc.
        └── pages/             # StorePage, MyOrdersPage, AdminDashboard
```

---

## ⚡ Remaining Limitations & Next Steps
- **Payment Gateway:** Currently uses Cash On Delivery (COD) and Direct Demo simulated checkout. Can be connected to Stripe or Razorpay webhooks in future iterations.
- **Image Uploads:** Currently uses high-definition Unsplash URLs. Can be extended with AWS S3 or Cloudinary for direct file uploads.
