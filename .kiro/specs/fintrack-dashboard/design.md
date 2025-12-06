# Design Document

## Overview

Vault is a full-stack MERN application that provides personal finance management capabilities. The system consists of a Node.js/Express backend API with MongoDB for data persistence, and a React/Vite frontend with Tailwind CSS for the user interface. The architecture follows RESTful principles with JWT-based authentication protecting all financial data endpoints.

The backend implements a layered architecture with models, controllers, and routers. File parsing for bank statements uses rule-based keyword matching against a configurable CategoryRule collection. All financial calculations (budgets, CAGR, portfolio allocation) are performed server-side and returned as JSON optimized for chart rendering.

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (Vite)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Dashboard │  │Transactions│ │  Budget  │  │Portfolio │   │
│  │  Page    │  │   Page    │  │   Page   │  │   Page   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│         │              │              │              │       │
│         └──────────────┴──────────────┴──────────────┘       │
│                          │                                    │
│                    HTTP/JSON (JWT)                           │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                          │                                    │
│              Express.js Backend API                          │
│  ┌────────────────────────────────────────────────────┐     │
│  │         Authentication Middleware (JWT)            │     │
│  └────────────────────────────────────────────────────┘     │
│                          │                                    │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │  Auth    │Transaction│  Budget  │Portfolio │Subscription│ │
│  │Controller│Controller │Controller│Controller│Controller │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
│       │          │           │          │           │        │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │  User    │Transaction│  Budget  │Portfolio │Subscription│ │
│  │  Model   │  Model    │  Model   │  Model   │  Model    │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
│                          │                                    │
└──────────────────────────┼──────────────────────────────────┘
                           │
                    ┌──────┴──────┐
                    │   MongoDB   │
                    └─────────────┘
```

### Technology Stack

**Backend:**
- Node.js with Express.js for REST API
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt for password hashing
- multer for file uploads
- pdf-parse for PDF parsing
- csv-parser for CSV parsing

**Frontend:**
- React 18 with Vite
- React Router for navigation
- Tailwind CSS for styling
- Recharts or Chart.js for data visualization
- Axios for API calls

### Folder Structure

```
vault/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── transactionController.js
│   │   ├── budgetController.js
│   │   ├── subscriptionController.js
│   │   └── portfolioController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   ├── CategoryRule.js
│   │   ├── Budget.js
│   │   ├── Subscription.js
│   │   └── Portfolio.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── subscriptionRoutes.js
│   │   └── portfolioRoutes.js
│   ├── utils/
│   │   ├── fileParser.js
│   │   └── categorizer.js
│   ├── seeds/
│   │   └── categoryRules.js
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   └── charts/
│   │   │       ├── PieChart.jsx
│   │   │       ├── LineChart.jsx
│   │   │       └── BarChart.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── UploadStatement.jsx
│   │   │   ├── Transactions.jsx
│   │   │   ├── Budget.jsx
│   │   │   ├── Subscriptions.jsx
│   │   │   ├── Portfolio.jsx
│   │   │   └── Settings.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## Components and Interfaces

### Backend Components

#### Authentication Controller
- **register(req, res)**: Validates email/password, hashes password with bcrypt, creates User document
- **login(req, res)**: Validates credentials, generates JWT token with user ID payload
- **Middleware - authMiddleware(req, res, next)**: Verifies JWT token, attaches user ID to request object

#### Transaction Controller
- **uploadStatement(req, res)**: Receives file upload, delegates to fileParser, categorizes transactions, stores in database
- **getTransactions(req, res)**: Returns paginated transactions for authenticated user, sorted by date descending
- **getMonthlySummary(req, res)**: Computes aggregated spending data for specified month

#### Budget Controller
- **createBudget(req, res)**: Stores total and category-wise budget limits for user
- **getBudget(req, res)**: Returns budget with current spending, warning flags (80% threshold), exceeded flags

#### Subscription Controller
- **createSubscription(req, res)**: Stores subscription with calculated next renewal date
- **getSubscriptions(req, res)**: Returns all subscriptions ordered by next renewal date

#### Portfolio Controller
- **createInvestment(req, res)**: Stores investment entry with initial amount and current value
- **getPortfolio(req, res)**: Returns all investments with calculated gain/loss, CAGR, and allocation percentages

#### File Parser Utility
- **parseFile(file)**: Detects file type (PDF/CSV), extracts transaction data
- **parsePDF(buffer)**: Uses pdf-parse to extract text, applies regex patterns to identify transaction rows
- **parseCSV(buffer)**: Uses csv-parser to read rows, maps columns to transaction fields

#### Categorizer Utility
- **categorizeTransaction(description)**: Queries CategoryRule collection, matches keywords (case-insensitive), returns category or "Uncategorized"

### Frontend Components

#### Pages
- **Login/Register**: Forms with email/password inputs, calls auth API, stores JWT in localStorage
- **Dashboard**: Displays summary cards, pie chart (category spending), line chart (monthly trends), bar chart (income vs expense)
- **UploadStatement**: File upload component, progress indicator, success/error messages
- **Transactions**: Paginated table with date, description, amount, category columns, filter/search capabilities
- **Budget**: Budget creation form, progress bars showing spending vs limits, warning/exceeded indicators
- **Subscriptions**: List of subscriptions with renewal dates, add subscription form
- **Portfolio**: Investment list with gain/loss and CAGR, add investment form, allocation pie chart
- **Settings**: User profile management, category rule configuration

#### Reusable Components
- **Navbar**: Logo, navigation links, user menu with logout
- **Sidebar**: Secondary navigation for different sections
- **Card**: Reusable container with title, value, and optional icon
- **FileUpload**: Drag-and-drop or click-to-upload interface with file type validation
- **Charts**: Wrapper components for Recharts/Chart.js with consistent styling

#### API Service
- **api.js**: Axios instance with base URL, JWT token interceptor, error handling interceptor

## Data Models

### User Model
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Model
```javascript
{
  userId: ObjectId (ref: User, required),
  date: Date (required),
  description: String (required),
  amount: Number (required),
  type: String (enum: ['debit', 'credit'], required),
  category: String (required),
  balance: Number (optional),
  createdAt: Date,
  updatedAt: Date
}
```
**Indexes**: userId, date (for efficient querying)

### CategoryRule Model
```javascript
{
  keyword: String (required, lowercase),
  category: String (required),
  priority: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```
**Indexes**: keyword (for fast lookup)

### Budget Model
```javascript
{
  userId: ObjectId (ref: User, required),
  month: String (format: 'YYYY-MM', required),
  totalBudget: Number (required),
  categoryBudgets: [{
    category: String,
    limit: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```
**Indexes**: userId + month (compound unique index)

### Subscription Model
```javascript
{
  userId: ObjectId (ref: User, required),
  name: String (required),
  amount: Number (required),
  cycle: String (enum: ['monthly', 'yearly'], required),
  startDate: Date (required),
  nextRenewalDate: Date (required),
  createdAt: Date,
  updatedAt: Date
}
```
**Indexes**: userId, nextRenewalDate

### Portfolio Model
```javascript
{
  userId: ObjectId (ref: User, required),
  investmentName: String (required),
  initialAmount: Number (required),
  currentValue: Number (required),
  investmentDate: Date (required),
  createdAt: Date,
  updatedAt: Date
}
```
**Indexes**: userId


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Authentication Properties

**Property 1: Password hashing on registration**
*For any* valid email and password combination, when a user registers, the stored password in the database should be a bcrypt hash and not the plaintext password.
**Validates: Requirements 1.1**

**Property 2: Valid login returns JWT**
*For any* registered user with correct credentials, the login endpoint should return a valid JWT token that can be decoded to extract the user ID.
**Validates: Requirements 1.2**

**Property 3: Invalid credentials rejected**
*For any* login attempt with incorrect email or password, the system should return an authentication error and not generate a token.
**Validates: Requirements 1.3**

**Property 4: Valid JWT allows access**
*For any* protected endpoint and valid JWT token, the request should proceed and the correct user identity should be extracted from the token.
**Validates: Requirements 8.1, 8.3**

**Property 5: Invalid JWT rejected**
*For any* protected endpoint and invalid or missing JWT token, the request should be rejected with an authentication error.
**Validates: Requirements 8.2**

**Property 6: Public endpoints accessible**
*For any* request to /auth/register or /auth/login, the request should succeed without requiring a JWT token, while all other endpoints should require authentication.
**Validates: Requirements 8.4**

**Property 7: Error handling consistency**
*For any* error thrown in any route handler, the error handling middleware should catch it and return a consistent error response format with appropriate HTTP status code.
**Validates: Requirements 8.5**

### Transaction Processing Properties

**Property 8: File parsing extracts required fields**
*For any* valid PDF or CSV bank statement file, the parser should extract all transactions with date, description, amount, and type fields populated.
**Validates: Requirements 2.1**

**Property 9: Keyword categorization**
*For any* transaction description containing a keyword that matches a CategoryRule, the transaction should be assigned the category associated with that keyword (case-insensitive matching).
**Validates: Requirements 2.2**

**Property 10: Transaction-user linkage**
*For any* uploaded statement, all extracted transactions should be stored in the database with the userId field matching the authenticated user who uploaded the file.
**Validates: Requirements 2.4**

**Property 11: Transaction pagination and ordering**
*For any* user's transaction set, when requesting transactions with pagination parameters, the results should be ordered by date descending and respect the page size and offset.
**Validates: Requirements 3.1**

### Financial Calculation Properties

**Property 12: Monthly summary aggregation**
*For any* month and user, the monthly summary should compute total spending as the sum of all debit transactions, total income as the sum of all credit transactions, and category spending as the sum of debits grouped by category.
**Validates: Requirements 3.2**

**Property 13: Weekday vs weekend calculation**
*For any* set of transactions, the weekday spending should equal the sum of transactions on Monday-Friday, and weekend spending should equal the sum of transactions on Saturday-Sunday.
**Validates: Requirements 3.3**

**Property 14: Month-over-month change**
*For any* two consecutive months with transaction data, the month-over-month change percentage should equal ((current month spending - previous month spending) / previous month spending) * 100.
**Validates: Requirements 3.4**

**Property 15: Gain/loss calculation**
*For any* investment, the gain/loss should equal (current value - initial amount), with positive values indicating gains and negative values indicating losses.
**Validates: Requirements 6.2**

**Property 16: CAGR formula**
*For any* investment with a date in the past, the CAGR should be calculated as (currentValue / initialAmount)^(1 / years) - 1, where years is the time elapsed since the investment date.
**Validates: Requirements 6.3**

**Property 17: Portfolio allocation percentages**
*For any* user's portfolio, the sum of all allocation percentages should equal 100%, and each investment's allocation should equal (investment current value / total portfolio value) * 100.
**Validates: Requirements 6.4**

### Budget Management Properties

**Property 18: Budget storage completeness**
*For any* budget creation request, the stored Budget document should contain the totalBudget value and all category budget entries from the request.
**Validates: Requirements 4.1**

**Property 19: Budget spending calculation**
*For any* budget and current month, the spending calculation for each category should equal the sum of all debit transactions in that category for the current month.
**Validates: Requirements 4.2**

**Property 20: 80% warning threshold**
*For any* category budget, when current spending reaches or exceeds 80% of the limit but is less than 100%, the response should include a warning flag for that category.
**Validates: Requirements 4.3**

**Property 21: Budget exceeded detection**
*For any* category budget, when current spending exceeds 100% of the limit, the response should include an exceeded flag for that category.
**Validates: Requirements 4.4**

### Subscription Management Properties

**Property 22: Subscription storage completeness**
*For any* subscription creation request, the stored Subscription document should contain name, amount, cycle, and a calculated nextRenewalDate field.
**Validates: Requirements 5.1**

**Property 23: Subscription ordering**
*For any* user's subscription set, when requesting subscriptions, the results should be ordered by nextRenewalDate in ascending order (soonest renewal first).
**Validates: Requirements 5.2**

**Property 24: Next renewal date calculation**
*For any* subscription, if the cycle is 'monthly', the next renewal date should be one month after the start date; if 'yearly', it should be one year after the start date.
**Validates: Requirements 5.3**

### Dashboard Data Format Properties

**Property 25: Pie chart data format**
*For any* user's transactions, the dashboard should return category spending data as an array of objects with 'category' and 'amount' fields suitable for pie chart rendering.
**Validates: Requirements 7.1**

**Property 26: Line chart data format**
*For any* user's transaction history, the dashboard should return monthly spending trends as an array of objects with 'month' and 'amount' fields suitable for line chart rendering.
**Validates: Requirements 7.2**

**Property 27: Bar chart data format**
*For any* user's transactions, the dashboard should return income vs expense data as an object with 'income' and 'expense' arrays containing monthly values suitable for bar chart rendering.
**Validates: Requirements 7.3**

## Error Handling

### Backend Error Handling

**Error Handling Middleware:**
- Catches all errors thrown in route handlers and controllers
- Distinguishes between operational errors (validation, authentication) and programming errors
- Returns consistent JSON error responses: `{ success: false, message: string, error?: details }`
- Sets appropriate HTTP status codes (400 for validation, 401 for auth, 404 for not found, 500 for server errors)

**Validation Errors:**
- Email format validation on registration
- Password strength requirements (minimum 6 characters)
- Required field validation on all POST requests
- File type validation (only PDF/CSV allowed for uploads)
- Date format validation for transactions and investments

**Authentication Errors:**
- Invalid credentials (401)
- Missing JWT token (401)
- Expired JWT token (401)
- Invalid JWT signature (401)

**Database Errors:**
- Duplicate email on registration (409 Conflict)
- Document not found (404)
- Connection errors (500)

**File Processing Errors:**
- Unsupported file format (400)
- Corrupted file (400)
- File too large (413)
- Parsing errors (400)

### Frontend Error Handling

**API Error Handling:**
- Axios interceptor catches all API errors
- Displays user-friendly error messages via toast notifications
- Redirects to login on 401 errors
- Logs errors to console in development mode

**Form Validation:**
- Client-side validation before API calls
- Real-time validation feedback on input fields
- Prevents submission of invalid data

**File Upload Errors:**
- File size validation (max 10MB)
- File type validation before upload
- Progress indicator with cancel capability
- Clear error messages for upload failures

## Testing Strategy

### Unit Testing

**Backend Unit Tests:**
- Model validation tests for each Mongoose schema
- Controller function tests with mocked database calls
- Utility function tests (fileParser, categorizer)
- Middleware tests (authMiddleware, errorHandler)
- Route integration tests for each endpoint

**Frontend Unit Tests:**
- Component rendering tests with React Testing Library
- Form validation logic tests
- API service function tests with mocked axios
- Context provider tests (AuthContext)
- Utility function tests

**Testing Tools:**
- Backend: Jest with supertest for API testing
- Frontend: Vitest with React Testing Library
- Coverage target: 80% for critical paths

### Property-Based Testing

**Property-Based Testing Library:**
- Backend: fast-check (JavaScript property-based testing library)
- Each property test should run a minimum of 100 iterations

**Property Test Implementation:**
- Each correctness property from this design document must be implemented as a property-based test
- Each test must be tagged with a comment in this format: `// Feature: fintrack-dashboard, Property X: [property description]`
- Tests should use smart generators that constrain inputs to valid ranges
- Tests should avoid mocking where possible to test real behavior

**Generator Strategy:**
- User generator: random emails, passwords meeting requirements
- Transaction generator: random dates, descriptions with/without keywords, amounts, types
- Budget generator: random total budgets, category budgets with realistic limits
- Investment generator: random amounts, dates in the past, current values
- Subscription generator: random names, amounts, cycles, start dates

**Property Test Organization:**
- Co-locate property tests with unit tests in `__tests__` directories
- Group related properties in the same test file
- Use descriptive test names that reference the property number

### Integration Testing

**API Integration Tests:**
- End-to-end flows: register → login → upload statement → view dashboard
- Authentication flow: protected routes require valid JWT
- File upload flow: upload → parse → categorize → store
- Budget alert flow: create budget → add transactions → check warnings

**Database Integration:**
- Use MongoDB Memory Server for isolated test database
- Seed test data before each test suite
- Clean up after each test

### Manual Testing Checklist

- User registration and login flows
- File upload with sample PDF and CSV files
- Dashboard chart rendering with various data sets
- Budget warning and exceeded indicators
- Subscription renewal date calculations
- Portfolio CAGR calculations with different time periods
- Responsive design on mobile, tablet, and desktop
- Error message display for various error conditions

