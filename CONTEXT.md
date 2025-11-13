# WealthOps - Inquiries and Offer Module Context

## Project Overview

This is a web application for managing wealth product inquiries and offers. The system allows administrators to receive inquiries from multiple sources (API, applications) and create offers back to clients, who can then confirm or reject these offers.

## Core Business Flow

1. **Inquiry Creation**: Inquiries are received from multiple sources (API, applications, manual entry)
2. **Inquiry Review**: Admin reviews the inquiry and client profile
3. **Offer Creation**: Admin creates an offer based on the inquiry
4. **Offer Approval**: Offer goes through internal approval process
5. **Client Confirmation**: Offer is sent to client for confirmation
6. **Final Processing**: Confirmed offers are processed

## Data Models

### 1. Offer Template
Used to standardize offer creation with pre-defined templates.

```typescript
interface OfferTemplate {
  templateId: string;        // Unique identifier (e.g., "TPL-001")
  name: string;              // Template name (e.g., "Standard Investment Offer")
  content: string;           // Template content with placeholders
  createdDate: Date;
  updatedDate: Date;
  isActive: boolean;
}
```

**Static Data**: Templates will be pre-configured and loaded from mockup data.

### 2. Client
Client profile information.

```typescript
interface Client {
  id: string;                // Unique identifier (e.g., "CLI-001")
  name: string;              // Full name
  email: string;             // Email address
  phone: string;             // Phone number
  status: 'Active' | 'Inactive' | 'Suspended';
  registrationDate: Date;
  lastActivityDate: Date;
}
```

**Static Data**: Client profiles will be loaded from mockup data (API simulation).

### 3. Employee
Employee/admin user information.

```typescript
interface Employee {
  id: string;                // Unique identifier (e.g., "EMP-001")
  name: string;              // Full name
  email: string;             // Email address
  role: 'Admin' | 'Manager' | 'Agent';
  department: string;
  isActive: boolean;
}
```

**Static Data**: Employee profiles will be loaded from mockup data (API simulation).

### 4. Investment Profile
Client's investment profile for suitability assessment.

```typescript
interface Investment {
  clientId: string;          // Reference to Client
  kyc: 'Completed' | 'Pending' | 'Expired' | 'Not Started';
  investment_group: 'Conservative' | 'Moderate' | 'Aggressive';  // Investment group classification
  risk: 'Low' | 'Medium' | 'High';  // Client risk level (used for suitability)
  amlo: 'Pass' | 'Pending' | 'Fail';  // Anti-Money Laundering
  totalAUM: number;          // Total Assets Under Management
  lastReviewDate: Date;
  nextReviewDate: Date;
}
```

**Static Data**: Investment profiles will be loaded from mockup data (API simulation).

### 5. Product
Financial product information.

```typescript
interface Product {
  productCode: string;       // Unique identifier (e.g., "PROD-001")
  name: string;              // Product name
  category: 'Fund' | 'Bond' | 'Equity' | 'Alternative';
  riskLevel: 'Low' | 'Medium' | 'High';
  minInvestment: number;
  expectedReturn: string;    // e.g., "5-7% p.a."
  maturityPeriod: string;    // e.g., "12 months"
  description: string;
  isActive: boolean;
}
```

**Static Data**: Product catalog will be loaded from mockup data (API simulation).

### 6. Inquiry (CRUD Required)
Client inquiries received from various sources.

```typescript
interface Inquiry {
  id: string;                // Auto-generated (e.g., "INQ-20231115-001")
  source: 'API' | 'Web' | 'Mobile' | 'Email' | 'Phone' | 'Walk-in';
  clientId: string;          // Reference to Client
  productId: string;         // Reference to Product
  status: 'Draft' | 'Pending' | 'Converted' | 'Rejected' | 'Cancelled';
  requestedAmount: number;
  additionalRemark: string;
  createdDate: Date;
  updatedDate: Date;
  createdBy: string;         // Employee ID
  assignedTo: string;        // Employee ID (assigned handler)
}
```

**CRUD Operations**:
- **Create**: Receive new inquiry (manual or API)
- **Read**: View inquiry details, list inquiries with filters
- **Update**: Update inquiry status, add remarks, assign to employee
- **Delete**: Soft delete (mark as cancelled)

**Business Rules**:
- Status can only progress: Draft → Pending → Converted/Rejected
- Cannot delete inquiries that have offers
- Must validate client KYC status before converting
- Requested amount must be within product min/max limits

### 7. Offer (CRUD Required)
Offers created in response to inquiries.

```typescript
interface Offer {
  id: string;                // Auto-generated (e.g., "OFF-20231115-001")
  inquiryId: string;         // Reference to Inquiry
  clientId: string;          // Reference to Client
  productId: string;         // Reference to Product
  investmentAmount: number;
  expectedReturn: string;    // e.g., "6.5% p.a."
  maturityDate: Date;
  additionalRemarks: string;
  status: 'Proposal' | 'Draft' | 'Wait' | 'Sent' | 'Accepted' | 'Confirmed' | 'Rejected' | 'Expired';
  finalApprovalFlag: boolean;
  createdDate: Date;
  updatedDate: Date;
  createdBy: string;         // Employee ID
  approvedBy: string;        // Employee ID
  sentDate: Date;
  responseDate: Date;
  expiryDate: Date;
}
```

**CRUD Operations**:
- **Create**: Create offer from inquiry
- **Read**: View offer details, list offers with filters
- **Update**: Update offer details, change status, add approvals
- **Delete**: Soft delete (mark as cancelled) - only for Draft status

**Business Rules**:
- One inquiry can have multiple offers (revised offers)
- Only one offer can be in "Sent" or "Accepted" status per inquiry
- Cannot edit offer after "Sent" status (must create new version)
- Must check investment profile suitability before creating offer
- Investment amount must match client's AUM and risk profile
- Offer expires after 30 days if not responded
- Final approval required before sending to client

## Module Breakdown

### 1. Inquiry Module
**Features**:
- Inquiry list with filtering (status, date, source, client, product)
- Inquiry detail view
- Create new inquiry (manual)
- Edit inquiry (Draft/Pending status only)
- Assign inquiry to employee
- Add remarks/notes
- Convert inquiry to offer
- View related offers
- Dashboard metrics (total, by status, by source)

**Views**:
- List View: Table with pagination, sorting, filtering
- Detail View: Full inquiry information + actions
- Create/Edit Form: Multi-step or single form
- Dashboard: Charts and statistics

### 2. Offer Module
**Features**:
- Offer list with filtering (status, date, client, product)
- Offer detail view
- Create offer from inquiry
- Edit offer (Draft/Proposal status only)
- Submit for approval
- Approve/reject offer
- Send offer to client
- Track client response
- View offer history
- Dashboard metrics (total, by status, conversion rate)

**Views**:
- List View: Table with pagination, sorting, filtering
- Detail View: Full offer information + actions + timeline
- Create/Edit Form: Step-by-step wizard
- Approval View: Review and approve/reject
- Dashboard: Charts and statistics

## User Roles and Permissions

### Admin
- Full access to all inquiries and offers
- Can create, edit, approve, and delete
- Can assign inquiries to other employees
- Can view all analytics and reports

### Manager
- Can view all inquiries and offers
- Can approve offers
- Can edit assigned inquiries/offers
- Can view analytics

### Agent
- Can view assigned inquiries and offers
- Can create and edit Draft status items
- Cannot approve or delete
- Limited analytics access

## Workflow States

### Inquiry Workflow
```
[New Inquiry] → Draft → Pending → Converted/Rejected/Cancelled
                  ↓         ↓
              (Edit)    (Create Offer)
```

### Offer Workflow
```
[Create from Inquiry] → Proposal/Draft → Wait/Sent → Accepted/Confirmed
                             ↓              ↓              ↓
                         (Edit)      (Send to Client)  (Process)
                             ↓
                      (Approval Required)
                             ↓
                      Rejected/Expired
```

## Validation Rules

### Inquiry Validation
1. Client must have valid KYC status
2. Client must have completed AMLO check (Pass status)
3. Product must be active
4. Requested amount ≥ Product minimum investment
5. Client suitability must match product risk level

### Offer Validation
1. All inquiry validations must pass
2. Investment amount must be ≥ Product minimum
3. Investment amount must be ≤ Client total AUM
4. Product risk level must match Client risk tolerance
5. Maturity date must be in the future
6. Expected return must be within product guidelines
7. Final approval must be obtained before sending

## API Endpoints (To Be Implemented)

### Inquiry Endpoints
```
GET    /api/inquiries              - List inquiries
GET    /api/inquiries/:id          - Get inquiry details
POST   /api/inquiries              - Create inquiry
PUT    /api/inquiries/:id          - Update inquiry
DELETE /api/inquiries/:id          - Delete inquiry (soft)
GET    /api/inquiries/:id/offers   - Get offers for inquiry
POST   /api/inquiries/:id/convert  - Convert to offer
```

### Offer Endpoints
```
GET    /api/offers                 - List offers
GET    /api/offers/:id             - Get offer details
POST   /api/offers                 - Create offer
PUT    /api/offers/:id             - Update offer
DELETE /api/offers/:id             - Delete offer (soft)
POST   /api/offers/:id/approve     - Approve offer
POST   /api/offers/:id/send        - Send to client
POST   /api/offers/:id/respond     - Client response
```

### Supporting Data Endpoints (Mock/Static)
```
GET    /api/templates              - List templates
GET    /api/clients                - List clients
GET    /api/clients/:id            - Get client details
GET    /api/clients/:id/investment - Get investment profile
GET    /api/employees              - List employees
GET    /api/products               - List products
```

## Database Schema

### Tables Required
1. **inquiries** - Store inquiry records
2. **offers** - Store offer records
3. **inquiry_history** - Audit trail for inquiries
4. **offer_history** - Audit trail for offers

### Reference Data (Static/Mock)
5. **templates** - Offer templates
6. **clients** - Client profiles
7. **employees** - Employee/user profiles
8. **investments** - Investment profiles
9. **products** - Product catalog

## Technology Stack Recommendations

### Frontend
- **Framework**: React or Vue.js
- **UI Library**: TailwindCSS (as used in prototype)
- **State Management**: Redux/Zustand or Vuex/Pinia
- **Form Handling**: React Hook Form or VeeValidate
- **API Client**: Axios or Fetch API
- **Icons**: Lucide React (as used in prototype)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js or Fastify
- **Database**: PostgreSQL or MySQL
- **ORM**: Prisma or TypeORM
- **Authentication**: JWT
- **Validation**: Joi or Zod

### Development Tools
- **TypeScript**: For type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Testing framework
- **Docker**: Containerization

## Mock Data Structure

Create JSON files for static data:

### `data/templates.json`
```json
[
  {
    "templateId": "TPL-001",
    "name": "Standard Investment Offer",
    "content": "Dear {{clientName}}, ...",
    "isActive": true
  }
]
```

### `data/clients.json`
```json
[
  {
    "id": "CLI-001",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "status": "Active"
  }
]
```

### `data/products.json`
```json
[
  {
    "productCode": "PROD-001",
    "name": "Growth Fund A",
    "category": "Fund",
    "riskLevel": "Medium",
    "minInvestment": 10000,
    "isActive": true
  }
]
```

## Next Steps for Implementation

1. Set up project structure
2. Initialize Node.js/TypeScript project
3. Create database schema
4. Implement mock data services
5. Build API endpoints
6. Develop frontend components
7. Implement authentication
8. Add validation and error handling
9. Create tests
10. Deploy application

## GitHub Copilot Usage Tips

When using GitHub Copilot:
1. Reference this CONTEXT.md file
2. Use clear, descriptive function and variable names
3. Add comments describing business rules
4. Follow the defined data models strictly
5. Implement validation as specified
6. Use TypeScript for type safety
7. Follow the API endpoint naming conventions
8. Maintain consistent code style
