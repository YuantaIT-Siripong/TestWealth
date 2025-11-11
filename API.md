# API Specification

## Base URL
```
Development: http://localhost:3000/api
Production: https://api.wealthops.example.com/api
```

## Authentication
All endpoints require JWT authentication (except public endpoints).

```
Authorization: Bearer <jwt_token>
```

## Standard Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": { /* optional additional details */ }
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalPages": 5,
    "totalItems": 95
  }
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Request validation failed |
| UNAUTHORIZED | 401 | Authentication required |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource conflict (e.g., duplicate) |
| BUSINESS_RULE_VIOLATION | 422 | Business rule validation failed |
| INTERNAL_ERROR | 500 | Internal server error |

---

## Inquiry Endpoints

### List Inquiries
Get a paginated list of inquiries with optional filters.

**Endpoint:** `GET /api/inquiries`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| pageSize | integer | No | Items per page (default: 20, max: 100) |
| status | string | No | Filter by status |
| source | string | No | Filter by source |
| clientId | string | No | Filter by client ID |
| productId | string | No | Filter by product ID |
| assignedTo | string | No | Filter by assigned employee |
| dateFrom | date | No | Filter from date (YYYY-MM-DD) |
| dateTo | date | No | Filter to date (YYYY-MM-DD) |
| sortBy | string | No | Sort field (default: createdAt) |
| sortOrder | string | No | Sort order: asc or desc (default: desc) |

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "INQ-20231115-001",
      "source": "Web",
      "clientId": "CLI-001",
      "clientName": "John Doe",
      "productId": "PROD-001",
      "productName": "Growth Fund A",
      "status": "Pending",
      "requestedAmount": 50000,
      "additionalRemark": "Interested in long-term growth",
      "createdBy": "EMP-001",
      "createdByName": "Admin User",
      "assignedTo": "EMP-002",
      "assignedToName": "Agent Smith",
      "createdAt": "2023-11-15T10:30:00Z",
      "updatedAt": "2023-11-15T14:20:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalPages": 3,
    "totalItems": 45
  }
}
```

---

### Get Inquiry Details
Get detailed information about a specific inquiry.

**Endpoint:** `GET /api/inquiries/:id`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Inquiry ID |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "INQ-20231115-001",
    "source": "Web",
    "client": {
      "id": "CLI-001",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "status": "Active"
    },
    "product": {
      "productCode": "PROD-001",
      "name": "Growth Fund A",
      "category": "Fund",
      "riskLevel": "Medium",
      "minInvestment": 10000
    },
    "investment": {
      "kyc": "Completed",
      "suit": "Moderate",
      "risk": "Medium",
      "amlo": "Pass",
      "totalAUM": 500000
    },
    "status": "Pending",
    "requestedAmount": 50000,
    "additionalRemark": "Interested in long-term growth",
    "createdBy": "EMP-001",
    "createdByName": "Admin User",
    "assignedTo": "EMP-002",
    "assignedToName": "Agent Smith",
    "createdAt": "2023-11-15T10:30:00Z",
    "updatedAt": "2023-11-15T14:20:00Z",
    "offers": [
      {
        "id": "OFF-20231115-001",
        "status": "Sent",
        "investmentAmount": 50000,
        "createdAt": "2023-11-15T15:00:00Z"
      }
    ],
    "history": [
      {
        "fieldName": "status",
        "oldValue": "Draft",
        "newValue": "Pending",
        "changedBy": "Admin User",
        "changedAt": "2023-11-15T14:20:00Z"
      }
    ]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Inquiry not found"
  }
}
```

---

### Create Inquiry
Create a new inquiry.

**Endpoint:** `POST /api/inquiries`

**Request Body:**
```json
{
  "source": "Web",
  "clientId": "CLI-001",
  "productId": "PROD-001",
  "requestedAmount": 50000,
  "additionalRemark": "Interested in long-term growth",
  "status": "Draft",
  "assignedTo": "EMP-002"
}
```

**Validation Rules:**
- `source`: Required, must be one of: API, Web, Mobile, Email, Phone, Walk-in
- `clientId`: Required, must exist
- `productId`: Required, must exist and be active
- `requestedAmount`: Required, must be > 0 and >= product minimum investment
- `status`: Optional, defaults to 'Draft'
- Client must have KYC = 'Completed' and AMLO = 'Pass'

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "INQ-20231115-002",
    "source": "Web",
    "clientId": "CLI-001",
    "productId": "PROD-001",
    "status": "Draft",
    "requestedAmount": 50000,
    "additionalRemark": "Interested in long-term growth",
    "createdBy": "EMP-001",
    "assignedTo": "EMP-002",
    "createdAt": "2023-11-15T16:00:00Z",
    "updatedAt": "2023-11-15T16:00:00Z"
  },
  "message": "Inquiry created successfully"
}
```

**Error Response (422):**
```json
{
  "success": false,
  "error": {
    "code": "BUSINESS_RULE_VIOLATION",
    "message": "Client KYC must be completed before creating inquiry",
    "details": {
      "field": "clientId",
      "currentKYC": "Pending"
    }
  }
}
```

---

### Update Inquiry
Update an existing inquiry.

**Endpoint:** `PUT /api/inquiries/:id`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Inquiry ID |

**Request Body:**
```json
{
  "status": "Pending",
  "requestedAmount": 55000,
  "additionalRemark": "Updated requirements",
  "assignedTo": "EMP-003"
}
```

**Validation Rules:**
- Can only update inquiries in 'Draft' or 'Pending' status
- Status transitions must follow allowed paths: Draft → Pending → Converted/Rejected/Cancelled
- Cannot change clientId or productId after creation

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "INQ-20231115-001",
    "status": "Pending",
    "requestedAmount": 55000,
    "additionalRemark": "Updated requirements",
    "assignedTo": "EMP-003",
    "updatedAt": "2023-11-15T17:00:00Z"
  },
  "message": "Inquiry updated successfully"
}
```

**Error Response (422):**
```json
{
  "success": false,
  "error": {
    "code": "BUSINESS_RULE_VIOLATION",
    "message": "Cannot update inquiry in Converted status"
  }
}
```

---

### Delete Inquiry
Soft delete an inquiry (mark as cancelled).

**Endpoint:** `DELETE /api/inquiries/:id`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Inquiry ID |

**Validation Rules:**
- Cannot delete inquiries that have active offers (status: Sent, Accepted, Confirmed)
- Only marks as cancelled (soft delete)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Inquiry deleted successfully"
}
```

**Error Response (422):**
```json
{
  "success": false,
  "error": {
    "code": "BUSINESS_RULE_VIOLATION",
    "message": "Cannot delete inquiry with active offers"
  }
}
```

---

### Get Inquiry Offers
Get all offers associated with an inquiry.

**Endpoint:** `GET /api/inquiries/:id/offers`

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "OFF-20231115-001",
      "status": "Sent",
      "investmentAmount": 50000,
      "expectedReturn": "6.5% p.a.",
      "maturityDate": "2024-11-15",
      "finalApprovalFlag": true,
      "createdAt": "2023-11-15T15:00:00Z"
    }
  ]
}
```

---

### Convert Inquiry to Offer
Convert an inquiry into an offer.

**Endpoint:** `POST /api/inquiries/:id/convert`

**Request Body:**
```json
{
  "investmentAmount": 50000,
  "expectedReturn": "6.5% p.a.",
  "maturityDate": "2024-11-15",
  "additionalRemarks": "Standard terms apply"
}
```

**Validation Rules:**
- Inquiry must be in 'Pending' status
- All suitability checks must pass
- Investment amount must be <= client's total AUM

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "offerId": "OFF-20231115-002",
    "inquiryId": "INQ-20231115-001"
  },
  "message": "Inquiry converted to offer successfully"
}
```

---

## Offer Endpoints

### List Offers
Get a paginated list of offers with optional filters.

**Endpoint:** `GET /api/offers`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| pageSize | integer | No | Items per page (default: 20, max: 100) |
| status | string | No | Filter by status |
| clientId | string | No | Filter by client ID |
| productId | string | No | Filter by product ID |
| inquiryId | string | No | Filter by inquiry ID |
| dateFrom | date | No | Filter from date (YYYY-MM-DD) |
| dateTo | date | No | Filter to date (YYYY-MM-DD) |
| sortBy | string | No | Sort field (default: createdAt) |
| sortOrder | string | No | Sort order: asc or desc (default: desc) |

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "OFF-20231115-001",
      "inquiryId": "INQ-20231115-001",
      "clientId": "CLI-001",
      "clientName": "John Doe",
      "productId": "PROD-001",
      "productName": "Growth Fund A",
      "status": "Sent",
      "investmentAmount": 50000,
      "expectedReturn": "6.5% p.a.",
      "maturityDate": "2024-11-15",
      "finalApprovalFlag": true,
      "createdBy": "EMP-001",
      "approvedBy": "EMP-002",
      "sentDate": "2023-11-15T15:00:00Z",
      "expiryDate": "2023-12-15",
      "createdAt": "2023-11-15T14:00:00Z",
      "updatedAt": "2023-11-15T15:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalPages": 2,
    "totalItems": 28
  }
}
```

---

### Get Offer Details
Get detailed information about a specific offer.

**Endpoint:** `GET /api/offers/:id`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "OFF-20231115-001",
    "inquiry": {
      "id": "INQ-20231115-001",
      "source": "Web",
      "requestedAmount": 50000
    },
    "client": {
      "id": "CLI-001",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "product": {
      "productCode": "PROD-001",
      "name": "Growth Fund A",
      "riskLevel": "Medium"
    },
    "status": "Sent",
    "investmentAmount": 50000,
    "expectedReturn": "6.5% p.a.",
    "maturityDate": "2024-11-15",
    "additionalRemarks": "Standard terms apply",
    "finalApprovalFlag": true,
    "createdBy": "EMP-001",
    "createdByName": "Admin User",
    "approvedBy": "EMP-002",
    "approvedByName": "Manager One",
    "sentDate": "2023-11-15T15:00:00Z",
    "expiryDate": "2023-12-15",
    "createdAt": "2023-11-15T14:00:00Z",
    "updatedAt": "2023-11-15T15:00:00Z",
    "history": [
      {
        "fieldName": "status",
        "oldValue": "Draft",
        "newValue": "Sent",
        "changedBy": "Admin User",
        "changedAt": "2023-11-15T15:00:00Z"
      }
    ]
  }
}
```

---

### Create Offer
Create a new offer.

**Endpoint:** `POST /api/offers`

**Request Body:**
```json
{
  "inquiryId": "INQ-20231115-001",
  "clientId": "CLI-001",
  "productId": "PROD-001",
  "investmentAmount": 50000,
  "expectedReturn": "6.5% p.a.",
  "maturityDate": "2024-11-15",
  "additionalRemarks": "Standard terms apply"
}
```

**Validation Rules:**
- Inquiry must exist and be in 'Pending' status
- Investment amount must be >= product minimum
- Investment amount must be <= client's total AUM
- Product risk must match client's suitability
- Maturity date must be in the future

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "OFF-20231115-002",
    "inquiryId": "INQ-20231115-001",
    "status": "Proposal",
    "investmentAmount": 50000,
    "createdAt": "2023-11-15T16:00:00Z"
  },
  "message": "Offer created successfully"
}
```

---

### Update Offer
Update an existing offer.

**Endpoint:** `PUT /api/offers/:id`

**Request Body:**
```json
{
  "investmentAmount": 55000,
  "expectedReturn": "7% p.a.",
  "additionalRemarks": "Updated terms"
}
```

**Validation Rules:**
- Can only update offers in 'Proposal' or 'Draft' status
- Cannot update after 'Sent' status (must create new offer)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "OFF-20231115-001",
    "investmentAmount": 55000,
    "expectedReturn": "7% p.a.",
    "updatedAt": "2023-11-15T17:00:00Z"
  },
  "message": "Offer updated successfully"
}
```

---

### Delete Offer
Soft delete an offer (only for Draft status).

**Endpoint:** `DELETE /api/offers/:id`

**Validation Rules:**
- Can only delete offers in 'Draft' or 'Proposal' status

**Success Response (200):**
```json
{
  "success": true,
  "message": "Offer deleted successfully"
}
```

---

### Approve Offer
Approve an offer for sending to client.

**Endpoint:** `POST /api/offers/:id/approve`

**Request Body:**
```json
{
  "remarks": "Approved with standard terms"
}
```

**Validation Rules:**
- Offer must be in 'Wait' status
- User must have Manager or Admin role

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "OFF-20231115-001",
    "status": "Wait",
    "finalApprovalFlag": true,
    "approvedBy": "EMP-002"
  },
  "message": "Offer approved successfully"
}
```

---

### Send Offer to Client
Send approved offer to client.

**Endpoint:** `POST /api/offers/:id/send`

**Validation Rules:**
- Offer must be in 'Wait' status
- Final approval flag must be true

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "OFF-20231115-001",
    "status": "Sent",
    "sentDate": "2023-11-15T18:00:00Z",
    "expiryDate": "2023-12-15"
  },
  "message": "Offer sent to client successfully"
}
```

---

### Client Response to Offer
Record client's response to an offer.

**Endpoint:** `POST /api/offers/:id/respond`

**Request Body:**
```json
{
  "response": "Accepted",
  "remarks": "Client confirmed via email"
}
```

**Validation Rules:**
- Offer must be in 'Sent' status
- Response must be 'Accepted' or 'Rejected'

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "OFF-20231115-001",
    "status": "Accepted",
    "responseDate": "2023-11-16T10:00:00Z"
  },
  "message": "Offer response recorded successfully"
}
```

---

## Mock Data Endpoints

### List Templates
Get all offer templates.

**Endpoint:** `GET /api/templates`

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "templateId": "TPL-001",
      "name": "Standard Investment Offer",
      "content": "Dear {{clientName}}, ...",
      "isActive": true
    }
  ]
}
```

---

### List Clients
Get all clients.

**Endpoint:** `GET /api/clients`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status | string | No | Filter by status |

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "CLI-001",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "status": "Active"
    }
  ]
}
```

---

### Get Client Details
Get specific client with investment profile.

**Endpoint:** `GET /api/clients/:id`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "CLI-001",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "status": "Active",
    "registrationDate": "2023-01-15T00:00:00Z"
  }
}
```

---

### Get Client Investment Profile
Get client's investment profile.

**Endpoint:** `GET /api/clients/:id/investment`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "clientId": "CLI-001",
    "kyc": "Completed",
    "suit": "Moderate",
    "risk": "Medium",
    "amlo": "Pass",
    "totalAUM": 500000,
    "lastReviewDate": "2023-10-15",
    "nextReviewDate": "2024-10-15"
  }
}
```

---

### List Employees
Get all employees.

**Endpoint:** `GET /api/employees`

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "EMP-001",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "Admin",
      "department": "Management",
      "isActive": true
    }
  ]
}
```

---

### List Products
Get all products.

**Endpoint:** `GET /api/products`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category | string | No | Filter by category |
| riskLevel | string | No | Filter by risk level |
| isActive | boolean | No | Filter by active status |

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "productCode": "PROD-001",
      "name": "Growth Fund A",
      "category": "Fund",
      "riskLevel": "Medium",
      "minInvestment": 10000,
      "expectedReturn": "5-7% p.a.",
      "maturityPeriod": "12 months",
      "isActive": true
    }
  ]
}
```

---

## Rate Limiting

- **Authenticated requests**: 1000 requests per hour per user
- **Unauthenticated requests**: 100 requests per hour per IP

Rate limit headers included in responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1699999999
```

## Versioning

API versioning through URL path:
```
/api/v1/inquiries
/api/v2/inquiries
```

Current version: v1 (default when version not specified)

---

**Note**: All mock data endpoints (templates, clients, employees, investments, products) return static data and do not support CREATE, UPDATE, or DELETE operations in this version.
