# Vault - Personal Finance Dashboard

A full-stack MERN application for personal finance management with bank statement uploads, expense tracking, budget management, subscription monitoring, and investment portfolio tracking.

## Project Structure

```
vault/
├── backend/          # Node.js/Express API
│   ├── config/       # Database configuration
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Authentication & error handling
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── utils/        # File parsing & categorization utilities
│   └── seeds/        # Database seed files
├── frontend/         # React/Vite application
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Page components
│       ├── services/    # API service layer
│       └── context/     # React context providers
└── README.md
```

## Technology Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- bcrypt for password hashing
- multer for file uploads
- pdf-parse & csv-parser for statement processing

### Frontend
- React 18 with Vite
- React Router for navigation
- Tailwind CSS for styling
- Recharts for data visualization
- Axios for API calls

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your configuration:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/vault
   JWT_SECRET=your_secure_jwt_secret
   NODE_ENV=development
   ```

4. Install dependencies (already done):
   ```bash
   npm install
   ```

5. Seed the database with category rules:
   ```bash
   npm run seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies (already done):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## Features

- **User Authentication**: Secure registration and login with JWT
- **Bank Statement Upload**: Parse PDF/CSV statements automatically
- **Transaction Management**: View and categorize transactions
- **Budget Tracking**: Set budgets and receive alerts at 80% threshold
- **Subscription Monitoring**: Track recurring expenses and renewal dates
- **Portfolio Management**: Monitor investment performance with CAGR calculations
- **Visual Dashboard**: Charts and graphs for financial insights

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Transactions
- `POST /upload/statement` - Upload bank statement
- `GET /transactions` - Get paginated transactions
- `GET /transactions/monthly-summary` - Get monthly summary

### Budget
- `POST /budget` - Create/update budget
- `GET /budget` - Get budget with spending status

### Subscriptions
- `POST /subscriptions` - Add subscription
- `GET /subscriptions` - Get all subscriptions

### Portfolio
- `POST /portfolio` - Add investment
- `GET /portfolio` - Get portfolio with calculations

### Dashboard
- `GET /dashboard/category-spending` - Category spending data
- `GET /dashboard/monthly-trends` - Monthly trends data
- `GET /dashboard/income-expense` - Income vs expense data

## Development

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run seed` - Seed category rules

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

### Quick Deployment Options

1. **Vercel + Render** (Recommended for beginners)
   - Frontend: Deploy to Vercel
   - Backend: Deploy to Render
   - Database: MongoDB Atlas (free tier)

2. **Railway** (All-in-one solution)
   - Deploy both frontend and backend
   - Automatic HTTPS and domains

3. **DigitalOcean/AWS/Azure** (Production-grade)
   - Full control over infrastructure
   - Scalable and customizable

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions.

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-domain.com
```

## License

ISC
