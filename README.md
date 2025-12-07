# Vault - Personal Finance Dashboard

A full-stack MERN application for personal finance management with manual transaction entry, expense tracking, budget management, subscription monitoring, and investment portfolio tracking.

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing
- 🏠 **Modern Landing Page** - Beautiful UI with feature showcase
- 💰 **Manual Transaction Entry** - Add transactions with auto-categorization
- 📊 **Visual Dashboard** - Interactive charts showing spending patterns
- 💳 **Budget Tracking** - Set limits with 80% warning alerts
- 🔄 **Subscription Monitoring** - Track recurring expenses and renewals
- 📈 **Portfolio Management** - Monitor investments with CAGR calculations
- 🏷️ **Category Rules** - Customizable keyword-based auto-categorization
- 🎯 **Demo User** - Pre-populated sample data for quick testing

## 🚀 Quick Start

### Demo User (Fastest Way)

```bash
# Start backend
cd backend
npm install
npm run seed                    # Seed category rules
node seeds/demoUser.js          # Create demo user

# Start frontend (in new terminal)
cd frontend
npm install
npm run dev
```

**Login:** `demo@vault.com` / `demo123`

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

## 📦 Installation

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env            # Configure your environment variables
npm run seed                    # Seed category rules
npm run dev                     # Start server on port 5000
```

**Environment Variables (.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vault
JWT_SECRET=your_secure_32_character_secret_key
NODE_ENV=development
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env            # Set VITE_API_URL=http://localhost:5000
npm run dev                     # Start on port 5173
```

## 🛠️ Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt  
**Frontend:** React 18, Vite, Tailwind CSS, Recharts, Axios, React Router

## 📁 Project Structure

```
vault/
├── backend/
│   ├── controllers/      # Route handlers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & error handling
│   ├── utils/           # Categorization logic
│   └── seeds/           # Database seeders
└── frontend/
    └── src/
        ├── components/  # Reusable UI components
        ├── pages/       # Page components
        ├── services/    # API service layer
        └── context/     # React context
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Transactions
- `GET /transactions` - Get paginated transactions
- `POST /transactions` - Create transaction manually
- `GET /transactions/monthly-summary` - Get monthly summary

### Budget
- `POST /budget` - Create/update budget
- `GET /budget` - Get budget status

### Subscriptions
- `POST /subscriptions` - Add subscription
- `GET /subscriptions` - Get all subscriptions

### Portfolio
- `POST /portfolio` - Add investment
- `GET /portfolio` - Get portfolio with calculations

### Dashboard
- `GET /dashboard/category-spending` - Category spending data
- `GET /dashboard/monthly-trends` - Monthly trends
- `GET /dashboard/income-expense` - Income vs expense

### Category Rules
- `GET /category-rules` - Get all rules
- `POST /category-rules` - Create rule
- `PUT /category-rules/:id` - Update rule
- `DELETE /category-rules/:id` - Delete rule

> **Note:** All endpoints except `/auth/register` and `/auth/login` require JWT authentication via `Authorization: Bearer <token>` header.

## 🎨 Key Features

### 1. Landing Page
Modern gradient design with animated background, feature showcase, testimonials, and dashboard preview.

### 2. Dashboard
Summary cards, pie chart (category spending), line chart (monthly trends), and bar chart (income vs expenses).

### 3. Manual Transaction Entry
Form with date picker, type selection, amount input, and optional category (or auto-categorize).

### 4. Transaction Management
Paginated table with search/filter, automatic categorization, and quick add access.

### 5. Budget Tracking
Monthly budgets with progress bars and color-coded indicators (green < 80%, yellow 80-100%, red > 100%).

### 6. Subscription Monitoring
List of recurring subscriptions sorted by renewal date with add/edit/delete functionality.

### 7. Investment Portfolio
Track investments with gain/loss, CAGR, and allocation pie chart.

### 8. Category Rules Management
CRUD interface for keyword-to-category mappings with priority-based matching.

### 9. Settings
User profile management and category rule configuration.

### 10. Authentication
Secure registration/login with JWT tokens and protected routes.

## 🌱 Seeding Data

### Category Rules
```bash
cd backend
npm run seed
```

Populates keywords like: AMAZON→Shopping, UBER→Transport, ZOMATO→Food, etc.

### Demo User
```bash
cd backend
node seeds/demoUser.js
```

Creates demo account with 40+ transactions, budgets, subscriptions, and portfolio items.

## 🧪 Testing

```bash
# Backend tests
cd backend
node test-all.js

# Frontend tests
cd frontend
npm run test
```

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick Options:**
- **Vercel + Render** - Frontend on Vercel, Backend on Render, MongoDB Atlas
- **Railway** - All-in-one deployment
- **DigitalOcean/AWS/Azure** - Full control

## 📝 Scripts

### Backend
- `npm start` - Production server
- `npm run dev` - Development with nodemon
- `npm run seed` - Seed category rules
- `node seeds/demoUser.js` - Create demo user

### Frontend
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview build
- `npm run test` - Run tests

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

ISC

---

**Made with ❤️ for better personal finance management**
