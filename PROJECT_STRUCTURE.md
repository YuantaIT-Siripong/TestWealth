# Project Structure and Setup Guide

## Quick Start Guide

### Prerequisites
- Node.js v18+ and npm
- PostgreSQL 14+ (or MySQL 8+)
- Git
- Code editor with GitHub Copilot (VS Code recommended)

### Initial Setup Steps

```bash
# 1. Clone the repository
git clone <repository-url>
cd TestWealth

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your database credentials and configuration

# 4. Initialize database
npm run db:setup

# 5. Seed mock data
npm run db:seed

# 6. Start development server
npm run dev
```

## Recommended Project Structure

```
TestWealth/
├── .github/
│   ├── copilot-instructions.md    # GitHub Copilot instructions
│   └── workflows/                  # CI/CD workflows (optional)
│
├── src/
│   ├── backend/                    # Backend API
│   │   ├── config/
│   │   │   ├── database.ts        # Database configuration
│   │   │   └── environment.ts     # Environment variables
│   │   │
│   │   ├── controllers/
│   │   │   ├── inquiryController.ts
│   │   │   ├── offerController.ts
│   │   │   └── mockDataController.ts
│   │   │
│   │   ├── services/
│   │   │   ├── inquiryService.ts
│   │   │   ├── offerService.ts
│   │   │   ├── validationService.ts
│   │   │   └── mockDataService.ts
│   │   │
│   │   ├── models/
│   │   │   ├── inquiry.model.ts
│   │   │   ├── offer.model.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── validation.ts
│   │   │   └── errorHandler.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── inquiry.routes.ts
│   │   │   ├── offer.routes.ts
│   │   │   └── mockData.routes.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── logger.ts
│   │   │   ├── helpers.ts
│   │   │   └── constants.ts
│   │   │
│   │   └── server.ts               # Main server file
│   │
│   ├── frontend/                   # Frontend application
│   │   ├── public/
│   │   │   ├── index.html
│   │   │   └── favicon.ico
│   │   │
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── common/
│   │   │   │   │   ├── Layout.tsx
│   │   │   │   │   ├── Sidebar.tsx
│   │   │   │   │   ├── Header.tsx
│   │   │   │   │   ├── StatusBadge.tsx
│   │   │   │   │   ├── DataTable.tsx
│   │   │   │   │   ├── Modal.tsx
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Input.tsx
│   │   │   │   │   └── Select.tsx
│   │   │   │   │
│   │   │   │   ├── inquiry/
│   │   │   │   │   ├── InquiryList.tsx
│   │   │   │   │   ├── InquiryDetail.tsx
│   │   │   │   │   ├── InquiryForm.tsx
│   │   │   │   │   ├── InquiryFilters.tsx
│   │   │   │   │   └── InquiryDashboard.tsx
│   │   │   │   │
│   │   │   │   ├── offer/
│   │   │   │   │   ├── OfferList.tsx
│   │   │   │   │   ├── OfferDetail.tsx
│   │   │   │   │   ├── OfferForm.tsx
│   │   │   │   │   ├── OfferWizard.tsx
│   │   │   │   │   ├── OfferApproval.tsx
│   │   │   │   │   └── OfferDashboard.tsx
│   │   │   │   │
│   │   │   │   └── dashboard/
│   │   │   │       ├── Dashboard.tsx
│   │   │   │       ├── MetricCard.tsx
│   │   │   │       └── Chart.tsx
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── api.ts           # API client setup
│   │   │   │   ├── inquiryService.ts
│   │   │   │   ├── offerService.ts
│   │   │   │   └── mockDataService.ts
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useInquiries.ts
│   │   │   │   ├── useOffers.ts
│   │   │   │   ├── useClients.ts
│   │   │   │   └── useProducts.ts
│   │   │   │
│   │   │   ├── types/
│   │   │   │   ├── inquiry.ts
│   │   │   │   ├── offer.ts
│   │   │   │   ├── client.ts
│   │   │   │   ├── product.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── validation.ts
│   │   │   │   ├── formatting.ts
│   │   │   │   ├── constants.ts
│   │   │   │   └── helpers.ts
│   │   │   │
│   │   │   ├── styles/
│   │   │   │   └── index.css        # TailwindCSS imports
│   │   │   │
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   │
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   └── tailwind.config.js
│   │
│   └── shared/                     # Shared types and utilities
│       └── types/
│           ├── inquiry.ts
│           ├── offer.ts
│           └── index.ts
│
├── data/                           # Mock/Static data
│   ├── templates.json
│   ├── clients.json
│   ├── employees.json
│   ├── investments.json
│   └── products.json
│
├── database/
│   ├── migrations/                 # Database migrations
│   │   ├── 001_create_inquiries.sql
│   │   ├── 002_create_offers.sql
│   │   └── 003_create_audit_tables.sql
│   │
│   ├── seeds/                      # Seed data
│   │   ├── templates.sql
│   │   ├── clients.sql
│   │   └── products.sql
│   │
│   └── schema.sql                  # Complete schema
│
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── integration/
│   │   ├── api/
│   │   └── database/
│   │
│   └── e2e/
│       └── workflows/
│
├── docs/
│   ├── API.md                      # API documentation
│   ├── DATABASE.md                 # Database schema documentation
│   └── DEVELOPMENT.md              # Development guide
│
├── .env.example                    # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
├── CONTEXT.md                      # Project context (this file)
└── README.md
```

## Package.json Scripts

Recommended npm scripts:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "nodemon src/backend/server.ts",
    "dev:frontend": "cd src/frontend && vite",
    "build": "npm run build:backend && npm run build:frontend",
    "build:backend": "tsc -p src/backend/tsconfig.json",
    "build:frontend": "cd src/frontend && vite build",
    "start": "node dist/backend/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,json}\"",
    "db:setup": "node scripts/setup-database.js",
    "db:migrate": "node scripts/run-migrations.js",
    "db:seed": "node scripts/seed-data.js",
    "db:reset": "npm run db:setup && npm run db:migrate && npm run db:seed"
  }
}
```

## Dependencies

### Backend Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "pg": "^8.11.3",
    "zod": "^3.22.4",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.20",
    "@types/node": "^20.9.0",
    "@types/pg": "^8.10.7",
    "typescript": "^5.2.2",
    "nodemon": "^3.0.1",
    "ts-node": "^10.9.1"
  }
}
```

### Frontend Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.18.0",
    "axios": "^1.6.0",
    "zustand": "^4.4.6",
    "react-hook-form": "^7.48.2",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.2",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.292.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.3.5",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "typescript": "^5.2.2"
  }
}
```

## Environment Variables

`.env.example`:
```env
# Server Configuration
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wealthops
DB_USER=postgres
DB_PASSWORD=your_password

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Application Settings
DEFAULT_PAGE_SIZE=20
MAX_PAGE_SIZE=100
OFFER_EXPIRY_DAYS=30

# Feature Flags
ENABLE_MOCK_DATA=true
ENABLE_API_LOGGING=true
```

## Development Workflow

### 1. Creating a New Feature

```bash
# Create a feature branch
git checkout -b feature/inquiry-list

# Make changes following the context guidelines
# Use GitHub Copilot to generate code

# Test your changes
npm test

# Commit with clear messages
git commit -m "feat: implement inquiry list component"

# Push to remote
git push origin feature/inquiry-list
```

### 2. Using GitHub Copilot Effectively

1. **Open CONTEXT.md** in your editor while coding
2. **Add comments** describing what you want to implement
3. **Reference types** from the data models
4. **Let Copilot suggest** based on context
5. **Review and adjust** generated code

Example:
```typescript
// Create a service function to fetch all inquiries with optional filters
// Should return SuccessResponse<Inquiry[]> or ErrorResponse
// Include status, clientId, and date range filters
// Use fetch API with proper error handling
```

### 3. Testing Strategy

- **Unit Tests**: Services, utilities, validation functions
- **Integration Tests**: API endpoints, database operations
- **E2E Tests**: Critical user workflows (create inquiry → create offer → approve)

### 4. Code Review Checklist

- [ ] Follows TypeScript types from CONTEXT.md
- [ ] Implements business rules correctly
- [ ] Includes proper error handling
- [ ] Has appropriate validation
- [ ] Includes tests for new functionality
- [ ] Uses consistent naming conventions
- [ ] TailwindCSS classes match prototype style
- [ ] API responses follow standard format
- [ ] No sensitive data exposure
- [ ] Comments for complex business logic

## Database Setup

### PostgreSQL Schema

```sql
-- See database/schema.sql for complete schema
-- Key tables:
-- 1. inquiries (CRUD operations)
-- 2. offers (CRUD operations)
-- 3. inquiry_history (audit trail)
-- 4. offer_history (audit trail)
-- 5. templates (static/mock)
-- 6. clients (static/mock)
-- 7. employees (static/mock)
-- 8. investments (static/mock)
-- 9. products (static/mock)
```

### Migration Strategy

1. Create migration files in `database/migrations/`
2. Use sequential numbering: `001_`, `002_`, etc.
3. Run migrations: `npm run db:migrate`
4. Seed data: `npm run db:seed`

## Deployment Considerations

### Development
- Local PostgreSQL instance
- Hot reload for frontend and backend
- Mock data enabled

### Staging
- Hosted database (e.g., Railway, Supabase)
- Environment-specific configuration
- Test data seeded

### Production
- Production database with backups
- Environment variables secured
- Mock data disabled
- Logging and monitoring enabled

## Additional Resources

- TailwindCSS Documentation: https://tailwindcss.com/docs
- React Documentation: https://react.dev
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Zod Validation: https://zod.dev

## Support and Maintenance

For questions about the project structure or implementation:
1. Review CONTEXT.md for business rules
2. Check .github/copilot-instructions.md for coding patterns
3. Refer to API.md for endpoint specifications
4. See DATABASE.md for schema details

Remember: This project focuses on **Inquiries and Offers CRUD** operations. All other entities (templates, clients, employees, investments, products) use **mock/static data**.
