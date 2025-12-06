# Implementation Plan

- [x] 1. Initialize project structure and dependencies





  - Create backend and frontend folders with separate package.json files
  - Install backend dependencies: express, mongoose, bcrypt, jsonwebtoken, multer, pdf-parse, csv-parser, cors, dotenv
  - Install frontend dependencies: react, react-router-dom, axios, recharts, tailwindcss
  - Set up Vite configuration for frontend
  - Set up Tailwind CSS configuration
  - Create folder structure for models, controllers, routes, middleware, utils, and seeds in backend
  - Create folder structure for components, pages, services, and context in frontend
  - _Requirements: 10.1, 10.3, 10.4_

- [x] 2. Set up MongoDB connection and environment configuration





  - Create database configuration file (backend/config/db.js)
  - Set up environment variables (.env file) for MongoDB URI, JWT secret, and port
  - Implement database connection logic with error handling
  - _Requirements: 10.3_

- [x] 3. Implement MongoDB models






  - [x] 3.1 Create User model with email, password, name fields and timestamps

    - Define Mongoose schema with validation rules
    - Add unique index on email field
    - _Requirements: 10.2, 1.1_

  - [x] 3.2 Create Transaction model with userId, date, description, amount, type, category, balance fields

    - Define schema with required validations
    - Add indexes on userId and date for query performance
    - _Requirements: 10.2, 2.4_
  - [x] 3.3 Create CategoryRule model with keyword, category, priority fields


    - Define schema with lowercase keyword transformation
    - Add index on keyword field
    - _Requirements: 10.2, 2.2_

  - [x] 3.4 Create Budget model with userId, month, totalBudget, categoryBudgets fields

    - Define schema with compound unique index on userId and month
    - _Requirements: 10.2, 4.1_
  - [x] 3.5 Create Subscription model with userId, name, amount, cycle, startDate, nextRenewalDate fields


    - Define schema with cycle enum validation
    - Add indexes on userId and nextRenewalDate
    - _Requirements: 10.2, 5.1_

  - [x] 3.6 Create Portfolio model with userId, investmentName, initialAmount, currentValue, investmentDate fields

    - Define schema with required validations
    - Add index on userId
    - _Requirements: 10.2, 6.1_

- [x] 4. Create authentication system





  - [x] 4.1 Implement authentication controller


    - Write register function with bcrypt password hashing
    - Write login function with JWT token generation
    - Add input validation for email and password
    - _Requirements: 1.1, 1.2, 1.3_
  - [ ]* 4.2 Write property test for password hashing
    - **Property 1: Password hashing on registration**
    - **Validates: Requirements 1.1**
  - [ ]* 4.3 Write property test for JWT generation
    - **Property 2: Valid login returns JWT**
    - **Validates: Requirements 1.2**
  - [ ]* 4.4 Write property test for invalid credentials
    - **Property 3: Invalid credentials rejected**
    - **Validates: Requirements 1.3**
  - [x] 4.5 Create authentication middleware


    - Implement JWT verification logic
    - Extract user ID from token and attach to request
    - Handle invalid/missing token errors
    - _Requirements: 8.1, 8.2, 8.3_
  - [ ]* 4.6 Write property test for JWT middleware
    - **Property 4: Valid JWT allows access**
    - **Property 5: Invalid JWT rejected**
    - **Validates: Requirements 8.1, 8.2, 8.3**
  - [x] 4.7 Create authentication routes


    - Define POST /auth/register route
    - Define POST /auth/login route
    - _Requirements: 1.4, 1.5_

- [x] 5. Implement file parsing utilities





  - [x] 5.1 Create file parser utility


    - Implement PDF parsing with pdf-parse library
    - Implement CSV parsing with csv-parser library
    - Extract date, description, amount, type, and balance fields using regex patterns
    - _Requirements: 2.1_
  - [ ]* 5.2 Write property test for file parsing
    - **Property 8: File parsing extracts required fields**
    - **Validates: Requirements 2.1**
  - [x] 5.3 Create categorizer utility


    - Implement keyword matching against CategoryRule collection
    - Use case-insensitive matching
    - Return "Uncategorized" for no matches
    - _Requirements: 2.2, 2.3_
  - [ ]* 5.4 Write property test for categorization
    - **Property 9: Keyword categorization**
    - **Validates: Requirements 2.2**

- [x] 6. Implement transaction management





  - [x] 6.1 Create transaction controller


    - Implement uploadStatement function with multer file handling
    - Call file parser and categorizer utilities
    - Store transactions linked to authenticated user
    - Implement getTransactions function with pagination
    - Implement getMonthlySummary function with aggregation logic
    - _Requirements: 2.4, 2.5, 3.1, 3.2, 3.3, 3.4_
  - [ ]* 6.2 Write property test for transaction-user linkage
    - **Property 10: Transaction-user linkage**
    - **Validates: Requirements 2.4**
  - [ ]* 6.3 Write property test for pagination
    - **Property 11: Transaction pagination and ordering**
    - **Validates: Requirements 3.1**
  - [ ]* 6.4 Write property test for monthly summary
    - **Property 12: Monthly summary aggregation**
    - **Validates: Requirements 3.2**
  - [ ]* 6.5 Write property test for weekday/weekend calculation
    - **Property 13: Weekday vs weekend calculation**
    - **Validates: Requirements 3.3**
  - [ ]* 6.6 Write property test for month-over-month change
    - **Property 14: Month-over-month change**
    - **Validates: Requirements 3.4**
  - [x] 6.7 Create transaction routes


    - Define POST /upload/statement route with authentication middleware
    - Define GET /transactions route with authentication middleware
    - Define GET /transactions/monthly-summary route with authentication middleware
    - _Requirements: 2.5, 3.5, 3.6_

- [x] 7. Implement budget management




  - [x] 7.1 Create budget controller


    - Implement createBudget function to store budget data
    - Implement getBudget function with spending calculations
    - Add logic for 80% warning threshold detection
    - Add logic for exceeded budget detection
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - [ ]* 7.2 Write property test for budget storage
    - **Property 18: Budget storage completeness**
    - **Validates: Requirements 4.1**
  - [ ]* 7.3 Write property test for spending calculation
    - **Property 19: Budget spending calculation**
    - **Validates: Requirements 4.2**
  - [ ]* 7.4 Write property test for warning threshold
    - **Property 20: 80% warning threshold**
    - **Validates: Requirements 4.3**
  - [ ]* 7.5 Write property test for exceeded detection
    - **Property 21: Budget exceeded detection**
    - **Validates: Requirements 4.4**
  - [x] 7.6 Create budget routes


    - Define POST /budget route with authentication middleware
    - Define GET /budget route with authentication middleware
    - _Requirements: 4.5, 4.6_

- [x] 8. Implement subscription tracking









  - [x] 8.1 Create subscription controller


    - Implement createSubscription function with next renewal date calculation
    - Implement getSubscriptions function with ordering by renewal date
    - _Requirements: 5.1, 5.2, 5.3_
  - [ ]* 8.2 Write property test for subscription storage
    - **Property 22: Subscription storage completeness**
    - **Validates: Requirements 5.1**
  - [ ]* 8.3 Write property test for subscription ordering
    - **Property 23: Subscription ordering**
    - **Validates: Requirements 5.2**
  - [ ]* 8.4 Write property test for renewal date calculation
    - **Property 24: Next renewal date calculation**
    - **Validates: Requirements 5.3**
  - [x] 8.5 Create subscription routes








    - Define POST /subscriptions route with authentication middleware
    - Define GET /subscriptions route with authentication middleware
    - _Requirements: 5.4, 5.5_

- [x] 9. Implement portfolio tracking




  - [x] 9.1 Create portfolio controller


    - Implement createInvestment function to store investment data
    - Implement getPortfolio function with gain/loss calculation
    - Add CAGR calculation using formula (current/initial)^(1/years) - 1
    - Add portfolio allocation percentage calculation
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  - [ ]* 9.2 Write property test for gain/loss calculation
    - **Property 15: Gain/loss calculation**
    - **Validates: Requirements 6.2**
  - [ ]* 9.3 Write property test for CAGR formula
    - **Property 16: CAGR formula**
    - **Validates: Requirements 6.3**
  - [ ]* 9.4 Write property test for portfolio allocation
    - **Property 17: Portfolio allocation percentages**
    - **Validates: Requirements 6.4**
  - [x] 9.5 Create portfolio routes


    - Define POST /portfolio route with authentication middleware
    - Define GET /portfolio route with authentication middleware
    - _Requirements: 6.5, 6.6_

- [x] 10. Implement dashboard data endpoints




  - [x] 10.1 Create dashboard controller


    - Implement function to format category spending for pie charts
    - Implement function to format monthly trends for line charts
    - Implement function to format income vs expense for bar charts
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  - [ ]* 10.2 Write property test for pie chart format
    - **Property 25: Pie chart data format**
    - **Validates: Requirements 7.1**
  - [ ]* 10.3 Write property test for line chart format
    - **Property 26: Line chart data format**
    - **Validates: Requirements 7.2**
  - [ ]* 10.4 Write property test for bar chart format
    - **Property 27: Bar chart data format**
    - **Validates: Requirements 7.3**
  - [x] 10.5 Create dashboard routes


    - Define GET /dashboard/category-spending route with authentication middleware
    - Define GET /dashboard/monthly-trends route with authentication middleware
    - Define GET /dashboard/income-expense route with authentication middleware

- [x] 11. Implement error handling middleware





  - Create global error handler middleware
  - Implement consistent error response format
  - Add specific handlers for validation, authentication, and database errors
  - _Requirements: 8.5_
  - [ ]* 11.1 Write property test for error handling
    - **Property 7: Error handling consistency**
    - **Validates: Requirements 8.5**

- [x] 12. Create category rules seed file




  - Create seed script with common keyword-to-category mappings
  - Include keywords for Food (ZOMATO, SWIGGY), Transport (UBER, OLA), Shopping (AMAZON, FLIPKART), etc.
  - Add script to package.json for easy execution
  - _Requirements: 10.5_

- [x] 13. Set up Express server





  - Create main server.js file
  - Configure middleware (cors, express.json, express.urlencoded)
  - Register all route handlers
  - Apply error handling middleware
  - Start server on configured port
  - _Requirements: 8.4_
  - [ ]* 13.1 Write property test for public endpoint access
    - **Property 6: Public endpoints accessible**
    - **Validates: Requirements 8.4**

- [x] 14. Checkpoint - Ensure all backend tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 15. Implement frontend authentication context





  - Create AuthContext with login, logout, and user state
  - Implement token storage in localStorage
  - Create ProtectedRoute component for route guarding
  - _Requirements: 1.1, 1.2_

- [x] 16. Create API service layer





  - Create axios instance with base URL configuration
  - Add request interceptor to attach JWT token
  - Add response interceptor for error handling
  - Create API functions for all backend endpoints
  - _Requirements: 1.2, 8.1_

- [x] 17. Implement authentication pages




  - [x] 17.1 Create Login page


    - Build form with email and password inputs
    - Add form validation
    - Call login API and store token
    - Redirect to dashboard on success
    - _Requirements: 1.2, 9.4_
  - [x] 17.2 Create Register page


    - Build form with email, password, and name inputs
    - Add form validation
    - Call register API
    - Redirect to login on success
    - _Requirements: 1.1, 9.4_

- [x] 18. Create reusable UI components





  - [x] 18.1 Create Navbar component


    - Add logo and navigation links
    - Add user menu with logout button
    - Style with Tailwind CSS
    - _Requirements: 9.1_
  - [x] 18.2 Create Sidebar component


    - Add navigation links for all pages
    - Add active state styling
    - Make responsive for mobile
    - _Requirements: 9.2_
  - [x] 18.3 Create Card component


    - Accept title, value, and icon props
    - Style with Tailwind CSS for modern look
    - _Requirements: 9.5_
  - [x] 18.4 Create FileUpload component


    - Implement drag-and-drop functionality
    - Add file type validation
    - Show upload progress
    - Display success/error messages
    - _Requirements: 2.1_

- [x] 19. Create chart components





  - [x] 19.1 Create PieChart component


    - Use Recharts library
    - Accept data prop with category and amount fields
    - Style with consistent colors
    - _Requirements: 7.1_

  - [x] 19.2 Create LineChart component

    - Use Recharts library
    - Accept data prop with month and amount fields
    - Add axis labels and tooltips
    - _Requirements: 7.2_
  - [x] 19.3 Create BarChart component


    - Use Recharts library
    - Accept data prop with income and expense arrays
    - Use different colors for income vs expense
    - _Requirements: 7.3_

- [x] 20. Implement Dashboard page





  - Fetch dashboard data from API on mount
  - Display summary cards for total spending, income, and balance
  - Render PieChart for category spending
  - Render LineChart for monthly trends
  - Render BarChart for income vs expense
  - Add loading and error states
  - _Requirements: 7.1, 7.2, 7.3, 9.4_

- [x] 21. Implement Upload Statement page




  - Use FileUpload component
  - Call upload API with selected file
  - Show success message and redirect to transactions
  - Handle upload errors
  - _Requirements: 2.1, 2.5, 9.4_

- [x] 22. Implement Transactions page





  - Fetch transactions from API with pagination
  - Display transactions in a table with date, description, amount, category columns
  - Add pagination controls
  - Add filter/search functionality
  - Style with Tailwind CSS
  - _Requirements: 3.1, 9.4_


- [x] 23. Implement Budget page




  - [x] 23.1 Create budget creation form


    - Add inputs for total budget and category budgets
    - Call create budget API
    - _Requirements: 4.1, 9.4_
  - [x] 23.2 Display budget status


    - Fetch budget data from API
    - Show progress bars for each category
    - Display warning indicators at 80% threshold
    - Display exceeded indicators above 100%
    - _Requirements: 4.2, 4.3, 4.4, 9.4_

- [x] 24. Implement Subscriptions page





  - Create form to add new subscriptions
  - Fetch and display subscriptions list ordered by renewal date
  - Show next renewal date prominently
  - Add edit and delete functionality
  - _Requirements: 5.1, 5.2, 5.3, 9.4_

- [x] 25. Implement Portfolio page





  - Create form to add new investments
  - Fetch and display portfolio data
  - Show gain/loss for each investment
  - Display CAGR percentage
  - Render allocation pie chart
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 9.4_

- [x] 26. Implement Settings page





  - Create user profile section
  - Add category rule management interface
  - Allow users to add/edit/delete category rules
  - _Requirements: 9.4_

- [x] 27. Set up routing




  - Configure React Router with all page routes
  - Apply ProtectedRoute wrapper to authenticated pages
  - Set up redirect from root to dashboard for authenticated users
  - _Requirements: 9.4_

- [x] 28. Add responsive design





  - Ensure all pages work on mobile, tablet, and desktop
  - Make navigation responsive with mobile menu
  - Test all components at different breakpoints
  - _Requirements: 9.3_

- [x] 29. Final Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [ ] 30. Create setup documentation
  - Write README with project overview
  - Document environment variable requirements
  - Add installation instructions for backend and frontend
  - Document how to run seed file
  - Add API endpoint documentation
  - Include screenshots of key features
