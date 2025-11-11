# WealthOps - Inquiries and Offer Management System

A comprehensive web application for managing wealth product inquiries and offers, designed to streamline the process from inquiry receipt to offer confirmation.

## 🎯 Project Overview

WealthOps is a specialized module for handling client inquiries and creating investment offers. The system enables administrators to:
- Receive and manage inquiries from multiple sources (API, Web, Mobile, Email, Phone, Walk-in)
- Create personalized investment offers based on client profiles and suitability
- Track offer approval and client responses
- Maintain complete audit trails

## 📋 Key Features

### Inquiry Management
- ✅ Create inquiries from multiple sources
- ✅ Assign inquiries to team members
- ✅ Track inquiry status (Draft, Pending, Converted, Rejected, Cancelled)
- ✅ Validate client eligibility (KYC, AMLO)
- ✅ Filter and search inquiries
- ✅ View inquiry history and audit trail

### Offer Management
- ✅ Create offers from inquiries
- ✅ Multi-stage offer workflow (Proposal → Draft → Wait → Sent → Accepted/Confirmed)
- ✅ Suitability assessment
- ✅ Approval workflow
- ✅ Automated expiry tracking (30 days)
- ✅ Offer templates
- ✅ Complete offer history

### Supporting Modules (Mock Data)
- 📊 Client profiles
- 👥 Employee management
- 💼 Investment profiles (KYC, Suitability, Risk, AMLO)
- 📦 Product catalog
- 📝 Offer templates

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  - Inquiry Module  - Offer Module  - Dashboard          │
└─────────────────────────────────────────────────────────┘
                          ↓ REST API
┌─────────────────────────────────────────────────────────┐
│                  Backend (Node.js/Express)               │
│  - Inquiry Service  - Offer Service  - Mock Data        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Database (PostgreSQL)                  │
│  - Inquiries  - Offers  - Audit Tables                  │
└─────────────────────────────────────────────────────────┘
```

## 📁 Repository Structure

```
TestWealth/
├── .github/
│   └── copilot-instructions.md    # GitHub Copilot context and patterns
├── data/                           # Mock/static data
│   ├── templates.json
│   ├── clients.json
│   ├── employees.json
│   ├── investments.json
│   └── products.json
├── raw_html/                       # HTML prototype
│   └── WealthOps_Full.html
├── CONTEXT.md                      # Complete project context
├── PROJECT_STRUCTURE.md            # Detailed structure guide
├── DATABASE.md                     # Database schema documentation
├── API.md                          # API specification
└── README.md                       # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- PostgreSQL 14+ (or MySQL 8+)
- npm or yarn
- Git

### Quick Start (Will be implemented)

```bash
# Clone the repository
git clone https://github.com/YuantaIT-Siripong/TestWealth.git
cd TestWealth

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Set up database
npm run db:setup
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

## 📖 Documentation

Comprehensive documentation is available in the following files:

### For Developers
- **[CONTEXT.md](CONTEXT.md)** - Complete project context, data models, and business rules
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Project structure, setup guide, and development workflow
- **[DATABASE.md](DATABASE.md)** - Database schema, relationships, and queries
- **[API.md](API.md)** - Complete API specification with examples

### For GitHub Copilot
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** - Coding patterns, conventions, and best practices

## 🎯 Data Models

### Core Entities (CRUD Operations)

#### Inquiry
```typescript
interface Inquiry {
  id: string;                    // INQ-YYYYMMDD-XXX
  source: 'API' | 'Web' | 'Mobile' | 'Email' | 'Phone' | 'Walk-in';
  clientId: string;
  productId: string;
  status: 'Draft' | 'Pending' | 'Converted' | 'Rejected' | 'Cancelled';
  requestedAmount: number;
  additionalRemark: string;
  createdBy: string;
  assignedTo: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Offer
```typescript
interface Offer {
  id: string;                    // OFF-YYYYMMDD-XXX
  inquiryId: string;
  clientId: string;
  productId: string;
  investmentAmount: number;
  expectedReturn: string;
  maturityDate: Date;
  additionalRemarks: string;
  status: 'Proposal' | 'Draft' | 'Wait' | 'Sent' | 'Accepted' | 'Confirmed' | 'Rejected' | 'Expired';
  finalApprovalFlag: boolean;
  createdBy: string;
  approvedBy: string;
  sentDate: Date;
  responseDate: Date;
  expiryDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Reference Entities (Mock Data)
- Client
- Employee
- Investment Profile
- Product
- Offer Template

## 🔒 Business Rules

### Inquiry Validation
1. Client must have completed KYC
2. Client must pass AMLO check
3. Product must be active
4. Requested amount must be ≥ product minimum investment
5. Client suitability must match product risk level

### Offer Validation
1. Investment amount must be ≥ product minimum
2. Investment amount must be ≤ client's total AUM
3. Product risk must match client's risk tolerance
4. Maturity date must be in the future
5. Final approval required before sending to client
6. Offers expire 30 days after being sent

### Workflow Rules
- Inquiries: Draft → Pending → Converted/Rejected
- Offers: Proposal → Draft → Wait → Sent → Accepted → Confirmed
- Cannot edit inquiries in Converted/Rejected status
- Cannot edit offers after Sent status (must create new version)
- One inquiry can have multiple offers (revisions)

## 🛠️ Technology Stack

### Planned Implementation
- **Frontend**: React with TypeScript, TailwindCSS
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **ORM**: Prisma or TypeORM
- **Validation**: Zod
- **Authentication**: JWT
- **Testing**: Jest, React Testing Library

## 👥 User Roles

### Admin
- Full access to all features
- Can approve offers
- Can assign inquiries
- View all analytics

### Manager
- View all inquiries and offers
- Approve offers
- Edit assigned items
- View analytics

### Agent
- View assigned inquiries/offers
- Create and edit Draft items
- Limited analytics access

## 📊 API Endpoints

### Inquiries
- `GET /api/inquiries` - List inquiries with filters
- `GET /api/inquiries/:id` - Get inquiry details
- `POST /api/inquiries` - Create inquiry
- `PUT /api/inquiries/:id` - Update inquiry
- `DELETE /api/inquiries/:id` - Delete inquiry (soft)
- `POST /api/inquiries/:id/convert` - Convert to offer

### Offers
- `GET /api/offers` - List offers with filters
- `GET /api/offers/:id` - Get offer details
- `POST /api/offers` - Create offer
- `PUT /api/offers/:id` - Update offer
- `DELETE /api/offers/:id` - Delete offer (soft)
- `POST /api/offers/:id/approve` - Approve offer
- `POST /api/offers/:id/send` - Send to client
- `POST /api/offers/:id/respond` - Record client response

### Mock Data
- `GET /api/templates` - List templates
- `GET /api/clients` - List clients
- `GET /api/clients/:id/investment` - Get investment profile
- `GET /api/employees` - List employees
- `GET /api/products` - List products

See [API.md](API.md) for complete API documentation.

## 🎨 UI/UX

The prototype HTML (`raw_html/WealthOps_Full.html`) demonstrates the desired UI:
- Clean, modern interface using TailwindCSS
- Responsive design
- Sidebar navigation
- Data tables with filtering and sorting
- Modal dialogs for create/edit operations
- Status badges with color coding
- Dashboard with metrics

## 📝 Development with GitHub Copilot

This project is optimized for use with GitHub Copilot:

1. **Read the context**: Open `CONTEXT.md` while coding
2. **Follow patterns**: Reference `.github/copilot-instructions.md`
3. **Use types**: All TypeScript interfaces are defined
4. **Business rules**: Validation functions are documented
5. **API format**: Standard response formats provided

Example prompts for Copilot:
```typescript
// Create a service function to fetch all inquiries with optional filters
// Should return SuccessResponse<Inquiry[]> or ErrorResponse
// Include status, clientId, and date range filters

// Create a React component for the inquiry list
// Include filtering, sorting, and pagination
// Use the DataTable component pattern from common components
```

## 🧪 Testing Strategy

- **Unit Tests**: Services, utilities, validation
- **Integration Tests**: API endpoints, database operations
- **E2E Tests**: Critical workflows (inquiry → offer → approval)

## 🔐 Security Considerations

- JWT authentication for all endpoints
- Role-based access control
- Input validation using Zod
- SQL injection prevention (ORM)
- XSS protection
- CORS configuration
- Rate limiting
- Audit trails for all changes

## 📈 Future Enhancements

- Email notifications for offer status changes
- SMS notifications for clients
- Document generation (PDF offers)
- Advanced analytics and reporting
- Bulk import of inquiries
- Integration with external CRM systems
- Mobile app for agents
- Real-time updates using WebSockets

## 🤝 Contributing

This is a private project. For questions or suggestions, please contact the project owner.

## 📄 License

Proprietary - All rights reserved

## 👤 Contact

**Project Owner**: Siripong (YuantaIT)
**Repository**: https://github.com/YuantaIT-Siripong/TestWealth

---

## 📚 Additional Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Express.js Documentation](https://expressjs.com/)

---

**Status**: 📋 Planning & Documentation Phase

The project is currently in the planning phase with comprehensive documentation and context prepared for implementation using GitHub Copilot and modern development practices.