# Requirements Document

## Introduction

Vault is a personal finance dashboard application built on the MERN stack (MongoDB, Express, React, Node.js). The system enables users to manage their finances through bank statement uploads, expense tracking, budget management, subscription monitoring, and investment portfolio tracking. All categorization and analysis use rule-based logic without machine learning.

## Glossary

- **Vault System**: The complete MERN stack application including backend API and frontend dashboard
- **User**: An authenticated individual using the FinTrack System
- **Transaction**: A financial record extracted from bank statements containing date, description, amount, and category
- **Category Rule**: A keyword-to-category mapping used for automatic transaction categorization
- **Budget**: A spending limit set by the User for total or category-specific expenses
- **Subscription**: A recurring expense tracked by the User with renewal information
- **Portfolio Entry**: A manually entered investment record with current and initial values
- **JWT**: JSON Web Token used for authentication
- **CAGR**: Compound Annual Growth Rate calculated as (current/initial)^(1/years) - 1

## Requirements

### Requirement 1

**User Story:** As a new user, I want to register and login securely, so that I can access my personal financial data.

#### Acceptance Criteria

1. WHEN a user submits registration data with email and password, THE Vault System SHALL hash the password using bcrypt and create a new User record
2. WHEN a user submits valid login credentials, THE Vault System SHALL generate a JWT token and return it to the User
3. WHEN a user submits invalid login credentials, THE Vault System SHALL reject the request and return an authentication error
4. THE Vault System SHALL provide registration endpoint at /auth/register
5. THE Vault System SHALL provide login endpoint at /auth/login

### Requirement 2

**User Story:** As a user, I want to upload my bank statements, so that my transactions are automatically extracted and categorized.

#### Acceptance Criteria

1. WHEN a user uploads a PDF or CSV bank statement file, THE Vault System SHALL parse the file and extract date, description, debit/credit amount, and optional balance fields
2. WHEN a transaction description is parsed, THE Vault System SHALL match keywords against Category Rule records and assign the appropriate category
3. WHEN no Category Rule matches a transaction description, THE Vault System SHALL assign a default "Uncategorized" category
4. WHEN transactions are extracted, THE Vault System SHALL store each Transaction record in the database linked to the User
5. THE Vault System SHALL provide upload endpoint at POST /upload/statement

### Requirement 3

**User Story:** As a user, I want to view my transactions and monthly summaries, so that I can understand my spending patterns.

#### Acceptance Criteria

1. WHEN a user requests their transactions, THE Vault System SHALL return paginated Transaction records ordered by date
2. WHEN a user requests monthly summary, THE Vault System SHALL compute total spending, income, and spending grouped by category for the specified month
3. WHEN computing monthly summary, THE Vault System SHALL calculate weekday versus weekend spending totals
4. WHEN computing monthly summary, THE Vault System SHALL calculate month-over-month spending change as a percentage
5. THE Vault System SHALL provide transaction retrieval endpoint at GET /transactions
6. THE Vault System SHALL provide monthly summary endpoint at GET /transactions/monthly-summary

### Requirement 4

**User Story:** As a user, I want to set budgets for my spending, so that I can control my expenses and receive alerts.

#### Acceptance Criteria

1. WHEN a user creates a budget, THE Vault System SHALL store total monthly budget and category-wise budget limits
2. WHEN a user requests budget status, THE Vault System SHALL calculate current spending against each budget limit
3. WHEN current spending reaches 80% of a category budget, THE Vault System SHALL include a warning flag in the response
4. WHEN current spending exceeds any budget limit, THE Vault System SHALL include an exceeded flag in the response
5. THE Vault System SHALL provide budget creation endpoint at POST /budget
6. THE Vault System SHALL provide budget retrieval endpoint at GET /budget

### Requirement 5

**User Story:** As a user, I want to track my recurring subscriptions, so that I can monitor renewal dates and costs.

#### Acceptance Criteria

1. WHEN a user adds a subscription, THE Vault System SHALL store name, amount, cycle (monthly/yearly), and next renewal date
2. WHEN a user requests subscriptions, THE Vault System SHALL return all Subscription records ordered by next renewal date
3. WHEN calculating next renewal date, THE Vault System SHALL compute the date based on cycle type and current date
4. THE Vault System SHALL provide subscription creation endpoint at POST /subscriptions
5. THE Vault System SHALL provide subscription retrieval endpoint at GET /subscriptions

### Requirement 6

**User Story:** As a user, I want to manually track my investments, so that I can monitor portfolio performance and returns.

#### Acceptance Criteria

1. WHEN a user adds an investment, THE Vault System SHALL store investment name, amount invested, current value, and date
2. WHEN a user requests portfolio data, THE Vault System SHALL calculate gain/loss as (current value - initial amount)
3. WHEN calculating CAGR, THE Vault System SHALL use the formula (current/initial)^(1/years) - 1 where years is computed from the investment date
4. WHEN a user requests portfolio data, THE Vault System SHALL calculate portfolio allocation as percentage of total portfolio value for each investment
5. THE Vault System SHALL provide portfolio creation endpoint at POST /portfolio
6. THE Vault System SHALL provide portfolio retrieval endpoint at GET /portfolio

### Requirement 7

**User Story:** As a user, I want to view visual dashboards of my finances, so that I can quickly understand my financial health.

#### Acceptance Criteria

1. WHEN the dashboard loads, THE Vault System SHALL provide data formatted for pie charts showing spending by category
2. WHEN the dashboard loads, THE Vault System SHALL provide data formatted for line graphs showing monthly spending trends
3. WHEN the dashboard loads, THE Vault System SHALL provide data formatted for bar charts comparing income versus expenses
4. WHEN dashboard data is requested, THE Vault System SHALL return JSON responses optimized for chart rendering
5. THE Vault System SHALL compute total monthly spending, income summary, and category breakdowns for dashboard display

### Requirement 8

**User Story:** As a system administrator, I want all sensitive routes protected, so that unauthorized users cannot access financial data.

#### Acceptance Criteria

1. WHEN a request is made to any protected endpoint, THE Vault System SHALL verify the JWT token in the authorization header
2. WHEN a JWT token is invalid or missing, THE Vault System SHALL reject the request with an authentication error
3. WHEN a JWT token is valid, THE Vault System SHALL extract the User identity and allow the request to proceed
4. THE Vault System SHALL apply authentication middleware to all endpoints except /auth/register and /auth/login
5. WHEN an error occurs in any route, THE Vault System SHALL handle it with error handling middleware and return appropriate error responses

### Requirement 9

**User Story:** As a user, I want a clean and modern interface, so that I can easily navigate and use the application.

#### Acceptance Criteria

1. THE Vault System SHALL provide a navigation bar component for accessing different pages
2. THE Vault System SHALL provide a sidebar component for secondary navigation
3. THE Vault System SHALL use Tailwind CSS for styling with a modern fintech aesthetic
4. THE Vault System SHALL provide pages for Login, Register, Dashboard, Upload Statement, Transactions, Budget, Subscriptions, Portfolio, and Settings
5. THE Vault System SHALL provide reusable card components for displaying financial information

### Requirement 10

**User Story:** As a developer, I want the codebase well-organized, so that the application is maintainable and scalable.

#### Acceptance Criteria

1. THE Vault System SHALL organize backend code using controllers and routers architecture
2. THE Vault System SHALL define MongoDB models for User, Transaction, CategoryRule, Budget, Subscription, and Portfolio
3. THE Vault System SHALL store configuration in environment variables
4. THE Vault System SHALL maintain separate folders for backend and frontend code
5. THE Vault System SHALL include a seed file for initializing Category Rule records with common keyword mappings
