# 📦 Smart Inventory & Order Management Server

A robust, high-performance backend system designed to handle complex inventory lifecycles, automated order processing, and real-time activity tracking. Built with **TypeScript**, **Node.js**, and **MongoDB**, this server serves as the backbone for the Sultan Bazar inventory ecosystem.

---

## 🚀 Core Features

### 🛡️ Secure Authentication
- **JWT-Powered**: Stateless authentication with encrypted tokens.
- **Role-Based Access (RBAC)**: Strict permission layers for `Admin` and `User` roles.
- **Secure Password Hashing**: Utilizing industry-standard encryption for user data.

### 📦 Advanced Inventory Management
- **Full CRUD Operations**: Manage products and categories with ease.
- **Stock Intelligence**: Automated low-stock detection with configurable `minStockThreshold`.
- **Category Hierarchy**: Logical grouping of products for optimized organization.

### 🛒 Order Processing & Revenue Tracking
- **Lifecycle Management**: Track orders from `Pending` → `Confirmed` → `Shipped` → `Delivered`.
- **Atomic Stock Management**: Real-time stock reduction upon order placement and restoration upon cancellation.
- **Revenue Analytics**: Automated calculation of daily and total revenue from delivered orders.

### 📜 Automated Activity Logging
- **System Instrumentation**: Every critical action (product creation, stock update, order status change) is automatically logged.
- **Polymorphic Metadata**: Logs are deeply linked to their respective entities for a full audit trail.

---

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) — Ensuring end-to-end type safety.
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose ODM](https://mongoosejs.com/)
- **Validation**: [Zod](https://zod.dev/) — Schema-based validation for all requests.
- **Error Handling**: Standardized global error middleware with specific handlers for Zod, Mongoose, and JWT errors.

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── config/             # Environment & Global Configs
│   ├── middlewares/        # Auth, Global Error, & Validation Middlewares
│   ├── modules/            # Domain-driven modules (Auth, Product, Order, Activity)
│   │   ├── activity/       # Audit trail tracking
│   │   ├── auth/           # User & Session management
│   │   ├── category/       # Product classification
│   │   ├── order/          # Transactional logic
│   │   └── product/        # Warehouse & Catalog management
│   └── routes/             # Centralized routing registry
└── server.ts               # Application entry point
```

---

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB instance (Local or Atlas)
- Git

### 1. Installation
```bash
git clone https://github.com/fl9mdasif/Smart-Inventory-Order-Management-System.git
cd Smart-Inventory-Order-Management-System
npm install 
```

### 2. Configuration
Create a `.env` file in the root directory:
```env
PORT=5000
DATABASE_URL=your_mongodb_uri
NODE_ENV=development
JWT_ACCESS_SECRET=your_secret_key
JWT_ACCESS_EXPIRES_IN=30d
BCRYPT_SALT_ROUNDS=12
```

### 3. Development
```bash
# Run in watch mode
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

---

## 📡 API Endpoints (Quick Reference)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Authenticate user & get token |
| `GET` | `/api/v1/products` | Retrieve all inventory items |
| `PATCH` | `/api/v1/orders/:id/status` | Update order lifecycle status |
| `GET` | `/api/v1/activities` | Fetch recent system activity logs |

---

*Built with precision for reliable inventory scaling.*00/api/v1

npm run dev
```

The client will be available at `http://localhost:3000` and the server at `http://localhost:5000`.

---

*Built with ❤️ for a seamless, natural shopping experience.* -->