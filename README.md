# Vault - Personal Finance Dashboard

A full-stack MERN application for personal finance management with manual transaction entry, expense tracking, budget management, subscription monitoring, and investment portfolio tracking.

## Overview

Vault is a comprehensive personal finance management system that helps users take control of their financial life. The application provides:

- **Manual Transaction Entry**: Add transactions manually with automatic categorization based on configurable keyword rules
- **Smart Categorization**: Configurable category rules that automatically classify transactions (e.g., "AMAZON" → Shopping, "UBER" → Transport)
- **Budget Management**: Set monthly budgets with automatic alerts when spending reaches 80% or exceeds limits
- **Subscription Tracking**: Monitor recurring expenses with renewal date tracking
- **Investment Portfolio**: Track investment performance with gain/loss calculations and CAGR (Compound Annual Growth Rate)
- **Visual Analytics**: Interactive charts and graphs showing spending patterns, trends, and financial health

The system uses JWT-based authentication to secure all financial data, with bcrypt password hashing for user security. All categorization and calculations are rule-based (no machine learning), making the system transparent and predictable.

## Project Structure

```
vault/
├── backend/          # Node.js/Express API
│   ├── config/       # Database configuration
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Authentication & error handling
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── utils/        # Categorization utilities
│   └── seeds/        # Database seed files
├── frontend/         # React/Vite application
│   └── src/
│       ├── components/  # Reusable UI components
│       │   ├── charts/  # Chart components (Pie, Line, Bar)
│       │   └── __tests__/  # Component tests
│       ├── pages/       # Page components
│       │   ├── Landing.jsx        # Landing page
│       │   ├── Login.jsx          # Login page
│       │   ├── Register.jsx       # Registration page
│       │   ├── Dashboard.jsx      # Main dashboard
│       │   ├── AddTransaction.jsx # Manual transaction entry
│       │   ├── Transactions.jsx   # Transaction list
│       │   ├── Budget.jsx         # Budget management
│       │   ├── Subscriptions.jsx  # Subscription tracking
│       │   ├── Portfolio.jsx      # Investment portfolio
│       │   └── Settings.jsx       # Settings & category rules
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

### Frontend
- React 18 with Vite
- React Router for navigation
- Tailwind CSS for styling
- Recharts for data visualization
- Axios for API calls

## Getting Started

### Quick Start with Demo User

Want to try Vault immediately without setting up? Use our demo user:

1. Make sure the backend and frontend are running (see setup instructions below)
2. Seed the demo user:
   ```bash
   cd backend
   node seeds/demoUser.js
   ```
3. Login with:
   - **Email:** `demo@vault.com`
   - **Password:** `demo123`

The demo account comes pre-loaded with:
- 40+ sample transactions
- Budget with category limits
- 4 active subscriptions
- 4 portfolio investments

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   
   Or on Windows:
   ```cmd
   copy .env.example .env
   ```

4. Update the `.env` file with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/vault
   JWT_SECRET=your_secure_jwt_secret_at_least_32_characters_long
   NODE_ENV=development
   ```

   **Important**: 
   - For `MONGODB_URI`: Use your local MongoDB connection string or MongoDB Atlas connection string
   - For `JWT_SECRET`: Generate a secure random string (at least 32 characters). You can use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - For production, set `NODE_ENV=production`

5. Seed the database with category rules:
   ```bash
   npm run seed
   ```
   
   This will populate the database with common keyword-to-category mappings such as:
   - Food: ZOMATO, SWIGGY, RESTAURANT, CAFE
   - Transport: UBER, OLA, RAPIDO, METRO
   - Shopping: AMAZON, FLIPKART, MYNTRA
   - Utilities: ELECTRICITY, WATER, GAS
   - And many more...

6. Start the development server:
   ```bash
   npm run dev
   ```

The backend API will be available at `http://localhost:5000`

**Troubleshooting**:
- If MongoDB connection fails, ensure MongoDB is running locally or your Atlas connection string is correct
- If port 5000 is in use, change the PORT in your `.env` file

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (if not already present):
   ```bash
   cp .env.example .env
   ```
   
   Or on Windows:
   ```cmd
   copy .env.example .env
   ```

4. Update the `.env` file with your backend API URL:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
   
   **Note**: For production, update this to your deployed backend URL (e.g., `https://your-api.render.com`)

5. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173` (Vite's default port)

**Troubleshooting**:
- If you see CORS errors, ensure the backend is running and the `VITE_API_URL` is correct
- Clear browser cache if you experience stale data issues

## Features

- **User Authentication**: Secure registration and login with JWT
- **Landing Page**: Beautiful, modern landing page with feature showcase and testimonials
- **Manual Transaction Entry**: Add transactions manually with auto-categorization
- **Transaction Management**: View and categorize transactions with pagination
- **Budget Tracking**: Set budgets and receive alerts at 80% threshold
- **Subscription Monitoring**: Track recurring expenses and renewal dates
- **Portfolio Management**: Monitor investment performance with CAGR calculations
- **Category Rules Management**: Create, edit, and delete custom categorization rules
- **Visual Dashboard**: Interactive charts and graphs for financial insights
- **Demo User**: Quick start with pre-populated sample data

## API Endpoints

All endpoints except `/auth/register` and `/auth/login` require JWT authentication via the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

### Authentication

#### Register New User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": "64a1b2c3d4e5f6g7h8i9j0k1"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

### Transactions

#### Get Transactions
```http
GET /transactions?page=1&limit=20
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response (200 OK):**
```json
{
  "success": true,
  "transactions": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "date": "2024-12-01T00:00:00.000Z",
      "description": "AMAZON PURCHASE",
      "amount": 1299.00,
      "type": "debit",
      "category": "Shopping",
      "balance": 45000.00
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalTransactions": 45,
    "hasMore": true
  }
}
```

#### Get Monthly Summary
```http
GET /transactions/monthly-summary?month=2024-12
Authorization: Bearer <token>
```

**Query Parameters:**
- `month` (required): Month in YYYY-MM format

**Response (200 OK):**
```json
{
  "success": true,
  "summary": {
    "month": "2024-12",
    "totalSpending": 45000.00,
    "totalIncome": 80000.00,
    "categorySpending": {
      "Food": 8000.00,
      "Transport": 3000.00,
      "Shopping": 12000.00
    },
    "weekdaySpending": 30000.00,
    "weekendSpending": 15000.00,
    "monthOverMonthChange": 5.2
  }
}
```

---

### Budget

#### Create/Update Budget
```http
POST /budget
Authorization: Bearer <token>
Content-Type: application/json

{
  "month": "2024-12",
  "totalBudget": 50000,
  "categoryBudgets": [
    { "category": "Food", "limit": 10000 },
    { "category": "Transport", "limit": 5000 },
    { "category": "Shopping", "limit": 15000 }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Budget created successfully",
  "budgetId": "64a1b2c3d4e5f6g7h8i9j0k1"
}
```

#### Get Budget Status
```http
GET /budget?month=2024-12
Authorization: Bearer <token>
```

**Query Parameters:**
- `month` (optional): Month in YYYY-MM format (defaults to current month)

**Response (200 OK):**
```json
{
  "success": true,
  "budget": {
    "month": "2024-12",
    "totalBudget": 50000,
    "totalSpent": 45000,
    "categories": [
      {
        "category": "Food",
        "limit": 10000,
        "spent": 8500,
        "percentage": 85,
        "warning": true,
        "exceeded": false
      },
      {
        "category": "Shopping",
        "limit": 15000,
        "spent": 16000,
        "percentage": 106.67,
        "warning": false,
        "exceeded": true
      }
    ]
  }
}
```

---

### Subscriptions

#### Add Subscription
```http
POST /subscriptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Netflix",
  "amount": 799,
  "cycle": "monthly",
  "startDate": "2024-01-15"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Subscription added successfully",
  "subscription": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Netflix",
    "amount": 799,
    "cycle": "monthly",
    "startDate": "2024-01-15T00:00:00.000Z",
    "nextRenewalDate": "2025-01-15T00:00:00.000Z"
  }
}
```

#### Get All Subscriptions
```http
GET /subscriptions
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "subscriptions": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Netflix",
      "amount": 799,
      "cycle": "monthly",
      "nextRenewalDate": "2025-01-15T00:00:00.000Z"
    },
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
      "name": "Amazon Prime",
      "amount": 1499,
      "cycle": "yearly",
      "nextRenewalDate": "2025-03-20T00:00:00.000Z"
    }
  ]
}
```

---

### Portfolio

#### Add Investment
```http
POST /portfolio
Authorization: Bearer <token>
Content-Type: application/json

{
  "investmentName": "Mutual Fund - HDFC Equity",
  "initialAmount": 100000,
  "currentValue": 125000,
  "investmentDate": "2022-01-15"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Investment added successfully",
  "investmentId": "64a1b2c3d4e5f6g7h8i9j0k1"
}
```

#### Get Portfolio
```http
GET /portfolio
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "portfolio": {
    "totalValue": 325000,
    "totalInvested": 250000,
    "totalGain": 75000,
    "investments": [
      {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
        "investmentName": "Mutual Fund - HDFC Equity",
        "initialAmount": 100000,
        "currentValue": 125000,
        "investmentDate": "2022-01-15T00:00:00.000Z",
        "gain": 25000,
        "gainPercentage": 25.0,
        "cagr": 8.45,
        "allocation": 38.46
      },
      {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
        "investmentName": "Stocks - Tech Portfolio",
        "initialAmount": 150000,
        "currentValue": 200000,
        "investmentDate": "2021-06-10T00:00:00.000Z",
        "gain": 50000,
        "gainPercentage": 33.33,
        "cagr": 9.12,
        "allocation": 61.54
      }
    ]
  }
}
```

---

### Dashboard

#### Get Category Spending Data
```http
GET /dashboard/category-spending?month=2024-12
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    { "category": "Food", "amount": 8500 },
    { "category": "Transport", "amount": 3000 },
    { "category": "Shopping", "amount": 16000 },
    { "category": "Entertainment", "amount": 4500 }
  ]
}
```

#### Get Monthly Trends
```http
GET /dashboard/monthly-trends?months=6
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    { "month": "2024-07", "amount": 42000 },
    { "month": "2024-08", "amount": 38000 },
    { "month": "2024-09", "amount": 45000 },
    { "month": "2024-10", "amount": 41000 },
    { "month": "2024-11", "amount": 43000 },
    { "month": "2024-12", "amount": 45000 }
  ]
}
```

#### Get Income vs Expense Data
```http
GET /dashboard/income-expense?months=6
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "income": [
      { "month": "2024-07", "amount": 80000 },
      { "month": "2024-08", "amount": 80000 },
      { "month": "2024-09", "amount": 85000 }
    ],
    "expense": [
      { "month": "2024-07", "amount": 42000 },
      { "month": "2024-08", "amount": 38000 },
      { "month": "2024-09", "amount": 45000 }
    ]
  }
}
```

---

### Category Rules

#### Get All Category Rules
```http
GET /category-rules
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "keyword": "amazon",
      "category": "Shopping",
      "priority": 0
    },
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
      "keyword": "uber",
      "category": "Transport",
      "priority": 0
    }
  ]
}
```

#### Create Category Rule
```http
POST /category-rules
Authorization: Bearer <token>
Content-Type: application/json

{
  "keyword": "starbucks",
  "category": "Food",
  "priority": 0
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
    "keyword": "starbucks",
    "category": "Food",
    "priority": 0
  }
}
```

#### Update Category Rule
```http
PUT /category-rules/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "keyword": "starbucks",
  "category": "Entertainment",
  "priority": 1
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
    "keyword": "starbucks",
    "category": "Entertainment",
    "priority": 1
  }
}
```

#### Delete Category Rule
```http
DELETE /category-rules/:id
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Category rule deleted successfully"
}
```

---

### Manual Transactions

#### Create Transaction Manually
```http
POST /transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2024-12-07",
  "description": "Coffee at Starbucks",
  "amount": 5.50,
  "type": "debit",
  "category": "Food"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "transaction": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "date": "2024-12-07T00:00:00.000Z",
    "description": "Coffee at Starbucks",
    "amount": 5.50,
    "type": "debit",
    "category": "Food",
    "userId": "64a1b2c3d4e5f6g7h8i9j0k0"
  }
}
```

**Note:** If `category` is omitted, the system will auto-categorize based on keyword matching.

## Seeding the Database

The application includes seed files to populate the database with sample data for quick start and testing.

### Seed Category Rules

Populate the database with common keyword-to-category mappings:

From the `backend/` directory:
```bash
npm run seed
```

Or directly with Node:
```bash
node seeds/categoryRules.js
```

### Seed Demo User (Optional)

Create a demo user with pre-populated sample data including transactions, budgets, subscriptions, and portfolio:

```bash
node seeds/demoUser.js
```

**Demo User Credentials:**
- Email: `demo@vault.com`
- Password: `demo123`

**What Gets Created:**
- Demo user account
- 40+ sample transactions across 3 months
- Monthly budget with category limits
- 4 active subscriptions (Netflix, Spotify, Amazon Prime, Gym)
- 4 portfolio investments with realistic returns

This is perfect for testing the application or showcasing features without manually entering data.

### What Gets Seeded

The seed file (`backend/seeds/categoryRules.js`) populates the `CategoryRule` collection with keyword-to-category mappings:

**Food & Dining:**
- Keywords: ZOMATO, SWIGGY, RESTAURANT, CAFE, DOMINOS, PIZZA, STARBUCKS, MCDONALD
- Category: Food

**Transport:**
- Keywords: UBER, OLA, RAPIDO, METRO, PETROL, FUEL, PARKING
- Category: Transport

**Shopping:**
- Keywords: AMAZON, FLIPKART, MYNTRA, AJIO, SHOPPING
- Category: Shopping

**Utilities:**
- Keywords: ELECTRICITY, WATER, GAS, INTERNET, BROADBAND, MOBILE, RECHARGE
- Category: Utilities

**Entertainment:**
- Keywords: NETFLIX, PRIME, HOTSTAR, SPOTIFY, MOVIE, CINEMA, BOOKMYSHOW
- Category: Entertainment

**Healthcare:**
- Keywords: PHARMACY, HOSPITAL, DOCTOR, MEDICAL, HEALTH
- Category: Healthcare

**Education:**
- Keywords: COURSE, UDEMY, COURSERA, BOOK, EDUCATION
- Category: Education

And more...

### Custom Category Rules

You can add custom category rules through the Settings page in the application, or by directly inserting documents into the `CategoryRule` collection:

```javascript
{
  keyword: "customkeyword",
  category: "Custom Category",
  priority: 0
}
```

**Note:** Keywords are automatically converted to lowercase for case-insensitive matching.

---

## Development

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon auto-reload
- `npm run seed` - Seed category rules into database
- `node seeds/demoUser.js` - Create demo user with sample data

### Frontend Scripts
- `npm run dev` - Start Vite development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks
- `npm run test` - Run test suite with Vitest

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

### Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `PORT` | Port number for the backend server | `5000` | Yes |
| `NODE_ENV` | Environment mode | `development` or `production` | Yes |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/vault` or `mongodb+srv://user:pass@cluster.mongodb.net/vault` | Yes |
| `JWT_SECRET` | Secret key for JWT token generation (min 32 chars) | `your_super_secret_jwt_key_at_least_32_characters` | Yes |
| `FRONTEND_URL` | Frontend URL for CORS (production only) | `https://your-frontend-domain.com` | No |

**Example `.env` file for development:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/vault
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

**Example `.env` file for production:**
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://vaultuser:securepassword@cluster0.mongodb.net/vault?retryWrites=true&w=majority
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
FRONTEND_URL=https://vault-finance.vercel.app
```

**Generating a secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory with the following variables:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` or `https://your-api.render.com` | Yes |

**Example `.env` file for development:**
```env
VITE_API_URL=http://localhost:5000
```

**Example `.env` file for production:**
```env
VITE_API_URL=https://vault-api.render.com
```

**Important Notes:**
- Never commit `.env` files to version control (they're in `.gitignore`)
- Use `.env.example` files as templates
- For production deployments, set environment variables through your hosting platform's dashboard
- Vite requires environment variables to be prefixed with `VITE_` to be exposed to the client

## Key Features & Screenshots

### 1. Landing Page
- Modern, gradient-based design with animated background
- Feature showcase with icons and descriptions
- User testimonials section
- Dashboard preview mockup
- Responsive navigation and mobile-friendly layout
- Call-to-action buttons for registration

### 2. Dashboard Overview
The main dashboard provides a comprehensive view of your financial health with:
- Summary cards showing total spending, income, and balance
- Pie chart visualizing spending by category
- Line chart showing monthly spending trends over time
- Bar chart comparing income vs expenses

### 3. Manual Transaction Entry
- Add transactions manually through a dedicated form
- Date picker with validation (cannot select future dates)
- Type selection (Income/Expense)
- Amount input with currency symbol
- Optional category selection or auto-categorization
- Real-time form validation with error messages
- Success confirmation and automatic redirect

### 4. Transaction Management
- Paginated table view of all transactions
- Columns: Date, Description, Amount, Category, Balance
- Search and filter capabilities
- Automatic categorization based on keyword rules
- Clean, modern table design with Tailwind CSS
- Quick access to add new transactions

### 5. Budget Tracking
- Create monthly budgets with total and category-wise limits
- Visual progress bars showing spending vs budget
- Color-coded indicators:
  - Green: Under 80% of budget
  - Yellow: 80-100% of budget (warning)
  - Red: Over 100% of budget (exceeded)
- Real-time budget status updates

### 6. Subscription Monitoring
- List of all recurring subscriptions
- Shows next renewal date prominently
- Supports monthly and yearly cycles
- Add/edit/delete subscription functionality
- Sorted by upcoming renewal dates

### 7. Investment Portfolio
- Track multiple investments with initial and current values
- Automatic gain/loss calculations
- CAGR (Compound Annual Growth Rate) for each investment
- Portfolio allocation pie chart
- Total portfolio value and performance metrics

### 8. Category Rules Management
- View all existing category rules in a table
- Create new keyword-to-category mappings
- Edit existing rules (keyword, category, priority)
- Delete rules that are no longer needed
- Priority-based rule matching for overlapping keywords
- Real-time updates to categorization logic

### 9. Settings & Customization
- User profile management
- Category rule configuration interface
- Add custom keywords for automatic categorization
- Edit or delete existing category rules
- Manage account preferences

### 10. Authentication
- Secure registration with email validation
- Login with JWT token-based authentication
- Password hashing with bcrypt
- Protected routes requiring authentication
- Automatic token refresh and logout

**Note:** Screenshots can be added to a `/screenshots` directory in the repository. Recommended screenshots:
- `landing.png` - Landing page with hero section
- `dashboard.png` - Main dashboard with charts
- `add-transaction.png` - Manual transaction entry form
- `transactions.png` - Transaction list view
- `budget.png` - Budget tracking with progress bars
- `subscriptions.png` - Subscription list
- `portfolio.png` - Investment portfolio view
- `category-rules.png` - Category rules management
- `settings.png` - Settings page
- `login.png` - Login page
- `register.png` - Registration page

---

## Testing

### Backend Tests
The backend includes test files for various components:
- `test-server.js` - Server initialization tests
- `test-category-rules.js` - Category rule matching tests
- `test-dashboard.js` - Dashboard data formatting tests
- `test-portfolio.js` - Portfolio calculation tests
- `test-subscription.js` - Subscription logic tests
- `test-error-handler.js` - Error handling middleware tests
- `test-all.js` - Comprehensive test suite

Run tests:
```bash
cd backend
node test-all.js
```

### Frontend Tests
The frontend includes tests for React components:
- `AuthContext.test.jsx` - Authentication context tests
- `ProtectedRoute.test.jsx` - Route protection tests

Run tests:
```bash
cd frontend
npm run test
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment-related questions

---

## License

ISC
