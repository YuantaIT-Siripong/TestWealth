# GitHub Copilot Instructions for WealthOps Project

## Project Context
This is a wealth management application for handling inquiries and offers. Please read the main CONTEXT.md file for complete project details.

## Code Generation Guidelines

### General Principles
1. **TypeScript First**: Always use TypeScript for type safety
2. **Functional Components**: Use React functional components with hooks (if using React)
3. **Async/Await**: Use async/await instead of promises chains
4. **Error Handling**: Always include try-catch blocks for async operations
5. **Validation**: Validate all inputs according to business rules defined in CONTEXT.md

### Naming Conventions

#### Variables and Functions
- Use camelCase: `clientId`, `createInquiry()`
- Be descriptive: `inquiryList` not `list`, `handleSubmit` not `submit`
- Boolean variables: prefix with `is`, `has`, `should`: `isActive`, `hasPermission`

#### Types and Interfaces
- Use PascalCase: `Inquiry`, `OfferTemplate`
- Suffix interfaces with purpose if needed: `InquiryFormData`, `OfferResponse`

#### Files
- Components: PascalCase - `InquiryList.tsx`
- Utilities: camelCase - `validation.ts`
- Services: camelCase - `inquiryService.ts`

#### API Endpoints
- RESTful style: `/api/inquiries`, `/api/offers/:id`
- Actions as POST: `/api/offers/:id/approve`

### Data Models

Always reference these exact type definitions from CONTEXT.md:

```typescript
// Core entities requiring CRUD
type InquiryStatus = 'Draft' | 'Pending' | 'Converted' | 'Rejected' | 'Cancelled';
type OfferStatus = 'Proposal' | 'Draft' | 'Wait' | 'Sent' | 'Accepted' | 'Confirmed' | 'Rejected' | 'Expired';

// Supporting entities (mock data)
type KYCStatus = 'Completed' | 'Pending' | 'Expired' | 'Not Started';
type Suitability = 'Conservative' | 'Moderate' | 'Aggressive';
type RiskLevel = 'Low' | 'Medium' | 'High';
type AMLOStatus = 'Pass' | 'Pending' | 'Fail';
```

### Business Rules to Enforce

#### Inquiry Rules
```typescript
// 1. Status progression validation
function canUpdateInquiryStatus(current: InquiryStatus, next: InquiryStatus): boolean {
  const validTransitions = {
    'Draft': ['Pending', 'Cancelled'],
    'Pending': ['Converted', 'Rejected', 'Cancelled'],
    'Converted': [], // Terminal state
    'Rejected': [], // Terminal state
    'Cancelled': [] // Terminal state
  };
  return validTransitions[current]?.includes(next) ?? false;
}

// 2. Client validation before creating inquiry
function validateClientForInquiry(investment: Investment): boolean {
  return investment.kyc === 'Completed' && 
         investment.amlo === 'Pass';
}

// 3. Product and amount validation
function validateInquiryAmount(amount: number, product: Product): boolean {
  return amount >= product.minInvestment;
}
```

#### Offer Rules
```typescript
// 1. Suitability check
function validateSuitability(
  clientRisk: RiskLevel, 
  productRisk: RiskLevel,
  clientSuit: Suitability
): boolean {
  const suitabilityMap = {
    'Conservative': ['Low'],
    'Moderate': ['Low', 'Medium'],
    'Aggressive': ['Low', 'Medium', 'High']
  };
  return suitabilityMap[clientSuit]?.includes(productRisk) ?? false;
}

// 2. Investment limit validation
function validateInvestmentLimit(amount: number, totalAUM: number): boolean {
  return amount <= totalAUM;
}

// 3. Offer status progression
function canUpdateOfferStatus(current: OfferStatus, next: OfferStatus): boolean {
  const validTransitions = {
    'Proposal': ['Draft', 'Wait'],
    'Draft': ['Wait'],
    'Wait': ['Sent'],
    'Sent': ['Accepted', 'Rejected', 'Expired'],
    'Accepted': ['Confirmed'],
    'Confirmed': [], // Terminal state
    'Rejected': [], // Terminal state
    'Expired': [] // Terminal state
  };
  return validTransitions[current]?.includes(next) ?? false;
}
```

### API Response Format

Always use this consistent format:

```typescript
// Success response
interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// Error response
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// Example usage
async function createInquiry(data: Inquiry): Promise<SuccessResponse<Inquiry> | ErrorResponse> {
  try {
    // validation
    // creation logic
    return {
      success: true,
      data: createdInquiry,
      message: 'Inquiry created successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'INQUIRY_CREATE_FAILED',
        message: error.message
      }
    };
  }
}
```

### Component Structure (React)

```typescript
// Example: InquiryList.tsx
import React, { useState, useEffect } from 'react';
import { Inquiry, InquiryStatus } from '../types';
import { inquiryService } from '../services/inquiryService';

interface InquiryListProps {
  statusFilter?: InquiryStatus;
  onInquirySelect?: (inquiry: Inquiry) => void;
}

export const InquiryList: React.FC<InquiryListProps> = ({ 
  statusFilter, 
  onInquirySelect 
}) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInquiries();
  }, [statusFilter]);

  const loadInquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await inquiryService.getInquiries({ status: statusFilter });
      if (response.success) {
        setInquiries(response.data);
      } else {
        setError(response.error.message);
      }
    } catch (err) {
      setError('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  // Rest of component...
  return (
    <div className="inquiry-list">
      {/* Component JSX */}
    </div>
  );
};
```

### Service Layer Pattern

```typescript
// Example: inquiryService.ts
import { Inquiry, InquiryStatus } from '../types';

interface InquiryFilters {
  status?: InquiryStatus;
  clientId?: string;
  source?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export const inquiryService = {
  async getInquiries(filters?: InquiryFilters) {
    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.clientId) queryParams.append('clientId', filters.clientId);
    
    const response = await fetch(`/api/inquiries?${queryParams}`);
    return response.json();
  },

  async getInquiry(id: string) {
    const response = await fetch(`/api/inquiries/${id}`);
    return response.json();
  },

  async createInquiry(inquiry: Omit<Inquiry, 'id' | 'createdDate' | 'updatedDate'>) {
    const response = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry)
    });
    return response.json();
  },

  async updateInquiry(id: string, updates: Partial<Inquiry>) {
    const response = await fetch(`/api/inquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return response.json();
  },

  async deleteInquiry(id: string) {
    const response = await fetch(`/api/inquiries/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  async convertToOffer(id: string) {
    const response = await fetch(`/api/inquiries/${id}/convert`, {
      method: 'POST'
    });
    return response.json();
  }
};
```

### Mock Data Service Pattern

```typescript
// Example: mockDataService.ts
import templatesData from '../data/templates.json';
import clientsData from '../data/clients.json';
import productsData from '../data/products.json';

export const mockDataService = {
  async getTemplates() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      success: true,
      data: templatesData
    };
  },

  async getClients() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      success: true,
      data: clientsData
    };
  },

  async getClient(id: string) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const client = clientsData.find(c => c.id === id);
    if (!client) {
      return {
        success: false,
        error: { code: 'NOT_FOUND', message: 'Client not found' }
      };
    }
    return {
      success: true,
      data: client
    };
  },

  // Similar patterns for other mock data...
};
```

### Form Validation Pattern

```typescript
// Example: inquiryValidation.ts
import { z } from 'zod';

export const inquirySchema = z.object({
  source: z.enum(['API', 'Web', 'Mobile', 'Email', 'Phone', 'Walk-in']),
  clientId: z.string().min(1, 'Client is required'),
  productId: z.string().min(1, 'Product is required'),
  requestedAmount: z.number()
    .positive('Amount must be positive')
    .min(1000, 'Minimum investment is 1000'),
  additionalRemark: z.string().optional(),
  status: z.enum(['Draft', 'Pending', 'Converted', 'Rejected', 'Cancelled'])
});

export type InquiryFormData = z.infer<typeof inquirySchema>;

// Usage in component
const handleSubmit = async (formData: InquiryFormData) => {
  try {
    const validated = inquirySchema.parse(formData);
    // Proceed with submission
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      console.error(error.errors);
    }
  }
};
```

### Testing Patterns

```typescript
// Example: inquiryService.test.ts
import { describe, it, expect, vi } from 'vitest';
import { inquiryService } from './inquiryService';

describe('inquiryService', () => {
  describe('getInquiries', () => {
    it('should fetch inquiries with filters', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            success: true,
            data: [{ id: 'INQ-001', status: 'Pending' }]
          })
        })
      ) as any;

      const result = await inquiryService.getInquiries({ status: 'Pending' });
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].status).toBe('Pending');
    });
  });

  describe('createInquiry', () => {
    it('should create a new inquiry', async () => {
      const newInquiry = {
        source: 'Web' as const,
        clientId: 'CLI-001',
        productId: 'PROD-001',
        requestedAmount: 50000,
        status: 'Draft' as const
      };

      global.fetch = vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            success: true,
            data: { id: 'INQ-002', ...newInquiry }
          })
        })
      ) as any;

      const result = await inquiryService.createInquiry(newInquiry);
      
      expect(result.success).toBe(true);
      expect(result.data.id).toBeDefined();
    });
  });
});
```

### UI Component Patterns (TailwindCSS)

Follow the design system from the prototype HTML:

```tsx
// Example: Status badge component
interface StatusBadgeProps {
  status: InquiryStatus | OfferStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusColors = {
    'Draft': 'bg-gray-100 text-gray-800',
    'Pending': 'bg-amber-100 text-amber-800',
    'Converted': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Cancelled': 'bg-gray-100 text-gray-600',
    'Proposal': 'bg-blue-100 text-blue-800',
    'Wait': 'bg-amber-100 text-amber-800',
    'Sent': 'bg-blue-100 text-blue-800',
    'Accepted': 'bg-green-100 text-green-800',
    'Confirmed': 'bg-green-100 text-green-900',
    'Expired': 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
      {status}
    </span>
  );
};
```

## Important Reminders

1. **Always validate** business rules before state changes
2. **Never expose** sensitive data in API responses
3. **Always handle errors** gracefully with user-friendly messages
4. **Use TypeScript** strictly - no `any` types unless absolutely necessary
5. **Follow REST conventions** for API endpoints
6. **Keep components small** - single responsibility principle
7. **Write tests** for business logic and services
8. **Document complex logic** with clear comments
9. **Use mock data** for templates, clients, employees, investments, and products
10. **Implement CRUD only** for Inquiries and Offers

## File Organization

```
src/
├── components/
│   ├── common/          # Reusable components
│   │   ├── StatusBadge.tsx
│   │   ├── DataTable.tsx
│   │   └── Modal.tsx
│   ├── inquiry/         # Inquiry module components
│   │   ├── InquiryList.tsx
│   │   ├── InquiryDetail.tsx
│   │   ├── InquiryForm.tsx
│   │   └── InquiryDashboard.tsx
│   └── offer/           # Offer module components
│       ├── OfferList.tsx
│       ├── OfferDetail.tsx
│       ├── OfferForm.tsx
│       └── OfferDashboard.tsx
├── services/
│   ├── inquiryService.ts
│   ├── offerService.ts
│   └── mockDataService.ts
├── types/
│   ├── inquiry.ts
│   ├── offer.ts
│   └── index.ts
├── utils/
│   ├── validation.ts
│   ├── formatting.ts
│   └── constants.ts
├── hooks/
│   ├── useInquiries.ts
│   └── useOffers.ts
└── data/               # Mock/static data
    ├── templates.json
    ├── clients.json
    ├── employees.json
    ├── investments.json
    └── products.json
```

When generating code, always consider the context from CONTEXT.md and follow these patterns consistently.
