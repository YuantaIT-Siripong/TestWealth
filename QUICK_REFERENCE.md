# Quick Reference Guide

## 📚 Documentation Files Overview

| File | Purpose | Use When |
|------|---------|----------|
| **CONTEXT.md** | Complete project context with data models and business rules | Understanding the project, defining features, implementing business logic |
| **.github/copilot-instructions.md** | GitHub Copilot coding patterns and conventions | Writing code with Copilot, implementing components/services |
| **PROJECT_STRUCTURE.md** | Project setup and development workflow | Setting up project, organizing files, configuring tools |
| **DATABASE.md** | Database schema and SQL | Creating database, writing migrations, querying data |
| **API.md** | API endpoints specification | Implementing API endpoints, testing APIs, frontend integration |
| **README.md** | Project overview and quick start | Onboarding, understanding features, getting started |
| **VALIDATION.md** | Implementation roadmap and next steps | Planning sprints, tracking progress, validating completeness |

## 🎯 Core Entities Quick Reference

### Inquiry (CRUD Required)
```typescript
{
  id: "INQ-20231115-001",
  source: "Web" | "API" | "Mobile" | "Email" | "Phone" | "Walk-in",
  clientId: "CLI-001",
  productId: "PROD-001",
  status: "Draft" | "Pending" | "Converted" | "Rejected" | "Cancelled",
  requestedAmount: 50000,
  additionalRemark: "...",
  createdBy: "EMP-001",
  assignedTo: "EMP-002"
}
```

### Offer (CRUD Required)
```typescript
{
  id: "OFF-20231115-001",
  inquiryId: "INQ-20231115-001",
  clientId: "CLI-001",
  productId: "PROD-001",
  investmentAmount: 50000,
  expectedReturn: "6.5% p.a.",
  maturityDate: "2024-11-15",
  status: "Proposal" | "Draft" | "Wait" | "Sent" | "Accepted" | "Confirmed" | "Rejected" | "Expired",
  finalApprovalFlag: true,
  createdBy: "EMP-001",
  approvedBy: "EMP-002"
}
```

## 🔄 Workflows Quick Reference

### Inquiry Workflow
```
Create (Draft) → Review (Pending) → Convert/Reject/Cancel
```

### Offer Workflow
```
Create (Proposal) → Edit (Draft) → Approve (Wait) → Send (Sent) → Response (Accepted/Rejected) → Finalize (Confirmed)
```

## 🔒 Key Validation Rules

### Creating Inquiry
1. ✓ Client KYC = "Completed"
2. ✓ Client AMLO = "Pass"
3. ✓ Product isActive = true
4. ✓ requestedAmount >= product.minInvestment

### Creating Offer
1. ✓ All inquiry validations pass
2. ✓ investmentAmount >= product.minInvestment
3. ✓ investmentAmount <= client.totalAUM
4. ✓ Product risk matches client suitability
5. ✓ maturityDate is in future

## 📁 Mock Data Files

| File | Records | Description |
|------|---------|-------------|
| `data/templates.json` | 3 | Offer letter templates |
| `data/clients.json` | 10 | Client profiles (Active/Inactive) |
| `data/employees.json` | 8 | Employee profiles (Admin/Manager/Agent) |
| `data/investments.json` | 10 | Investment profiles with KYC/risk data |
| `data/products.json` | 11 | Financial products (10 active, 1 inactive) |

## 🌐 API Endpoints Quick List

### Inquiries
- `GET /api/inquiries` - List with filters
- `GET /api/inquiries/:id` - Get details
- `POST /api/inquiries` - Create
- `PUT /api/inquiries/:id` - Update
- `DELETE /api/inquiries/:id` - Delete (soft)
- `POST /api/inquiries/:id/convert` - Convert to offer

### Offers
- `GET /api/offers` - List with filters
- `GET /api/offers/:id` - Get details
- `POST /api/offers` - Create
- `PUT /api/offers/:id` - Update
- `DELETE /api/offers/:id` - Delete (soft)
- `POST /api/offers/:id/approve` - Approve
- `POST /api/offers/:id/send` - Send to client
- `POST /api/offers/:id/respond` - Client response

### Mock Data
- `GET /api/templates` - List templates
- `GET /api/clients` - List clients
- `GET /api/clients/:id/investment` - Investment profile
- `GET /api/employees` - List employees
- `GET /api/products` - List products

## 🛠️ Common Copilot Prompts

### Backend Service
```typescript
// Create a service to fetch inquiries with filters
// Accept status, clientId, dateFrom, dateTo parameters
// Return SuccessResponse<Inquiry[]> or ErrorResponse
// Include pagination support with page and pageSize
```

### React Component
```typescript
// Create InquiryList component
// Display inquiries in a table with columns: ID, Client, Product, Status, Amount, Date
// Include filters for status and date range
// Add pagination controls
// Handle loading and error states
```

### Validation Function
```typescript
// Create validation function for inquiry creation
// Check client KYC is Completed
// Check client AMLO is Pass
// Check product is active
// Check requested amount >= product minimum
// Return validation errors array or null if valid
```

### API Route
```typescript
// Create Express route for GET /api/inquiries
// Support query parameters: status, clientId, dateFrom, dateTo, page, pageSize
// Call inquiryService.getInquiries()
// Return standard SuccessResponse or ErrorResponse
// Include error handling middleware
```

## 💡 Tips for Using GitHub Copilot

1. **Open Reference Files**: Keep CONTEXT.md open while coding
2. **Write Comments First**: Describe what you need before writing code
3. **Be Specific**: Include details about types, validation, error handling
4. **Reference Patterns**: Mention "following the pattern in copilot-instructions.md"
5. **One Feature at a Time**: Break complex features into smaller pieces
6. **Review Generated Code**: Always understand and verify suggestions
7. **Use Type Safety**: Leverage TypeScript types from CONTEXT.md

## 🚀 Getting Started Steps

1. **Read Documentation**
   - [ ] Read CONTEXT.md to understand the project
   - [ ] Review VALIDATION.md for next steps
   - [ ] Check PROJECT_STRUCTURE.md for setup

2. **Set Up Environment**
   - [ ] Initialize Node.js project
   - [ ] Install dependencies
   - [ ] Set up TypeScript
   - [ ] Configure database

3. **Start Coding with Copilot**
   - [ ] Open .github/copilot-instructions.md
   - [ ] Start with mock data services (easiest)
   - [ ] Implement Inquiry module
   - [ ] Implement Offer module
   - [ ] Build frontend components

4. **Test and Iterate**
   - [ ] Write tests for each feature
   - [ ] Test business rules
   - [ ] Test API endpoints
   - [ ] Test UI workflows

## 📋 Status Enums

### InquiryStatus
- `Draft` - Initial state, editable
- `Pending` - Under review
- `Converted` - Converted to offer (terminal)
- `Rejected` - Rejected (terminal)
- `Cancelled` - Cancelled (terminal)

### OfferStatus
- `Proposal` - Initial creation, editable
- `Draft` - Being drafted, editable
- `Wait` - Waiting to be sent
- `Sent` - Sent to client
- `Accepted` - Client accepted
- `Confirmed` - Final confirmation (terminal)
- `Rejected` - Client rejected (terminal)
- `Expired` - Offer expired (terminal)

### KYCStatus
- `Completed` - KYC completed
- `Pending` - KYC in progress
- `Expired` - KYC expired
- `Not Started` - KYC not started

### Suitability
- `Conservative` - Can invest in Low risk only
- `Moderate` - Can invest in Low, Medium risk
- `Aggressive` - Can invest in Low, Medium, High risk

### RiskLevel
- `Low` - Conservative products
- `Medium` - Balanced products
- `High` - Aggressive products

### AMLOStatus
- `Pass` - AMLO check passed
- `Pending` - AMLO check in progress
- `Fail` - AMLO check failed

## 🎨 UI Component List

### Common Components
- Layout (Sidebar + Header)
- DataTable
- Modal
- Button
- Input
- Select
- StatusBadge
- Loading/Error states

### Inquiry Components
- InquiryList
- InquiryDetail
- InquiryForm
- InquiryFilters
- InquiryDashboard

### Offer Components
- OfferList
- OfferDetail
- OfferForm
- OfferWizard
- OfferApproval
- OfferDashboard

## 🔐 User Roles & Permissions

| Role | View All | Create | Edit | Approve | Delete |
|------|----------|--------|------|---------|--------|
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Manager** | ✅ | ✅ | ✅ (assigned) | ✅ | ❌ |
| **Agent** | ❌ (assigned only) | ✅ | ✅ (Draft only) | ❌ | ❌ |

## 📞 Need Help?

- **Business Rules**: Check CONTEXT.md section "Business Rules"
- **API Format**: Check API.md for endpoint details
- **Database Schema**: Check DATABASE.md for table structure
- **Coding Patterns**: Check .github/copilot-instructions.md
- **Setup Help**: Check PROJECT_STRUCTURE.md
- **Implementation Steps**: Check VALIDATION.md

---

**Quick Links:**
- [Full Context](CONTEXT.md)
- [Copilot Guide](.github/copilot-instructions.md)
- [API Spec](API.md)
- [Database Schema](DATABASE.md)
- [Project Structure](PROJECT_STRUCTURE.md)
- [Next Steps](VALIDATION.md)
