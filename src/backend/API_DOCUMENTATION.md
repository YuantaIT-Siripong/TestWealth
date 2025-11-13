# WealthOps API Documentation

## Overview
This document provides information about the WealthOps API and its interactive Swagger documentation.

## Accessing the API Documentation

Once the backend server is running, you can access the interactive Swagger UI documentation at:

```
http://localhost:3000/api-docs
```

The Swagger UI provides:
- **Interactive API testing** - Try out API endpoints directly from the browser
- **Complete request/response schemas** - View all data models and their properties
- **Authentication information** - Details on how to authenticate requests (if applicable)
- **Example requests and responses** - Sample payloads for each endpoint

## API Endpoints

### Inquiries
Manage client investment inquiries:
- `GET /api/inquiries` - List all inquiries (with optional filters)
- `POST /api/inquiries` - Create a new inquiry
- `GET /api/inquiries/:id` - Get a specific inquiry
- `PUT /api/inquiries/:id` - Update an inquiry
- `DELETE /api/inquiries/:id` - Delete an inquiry
- `POST /api/inquiries/:id/convert` - Convert inquiry to offer

### Offers
Manage investment offers:
- `GET /api/offers` - List all offers (with optional filters)
- `POST /api/offers` - Create a new offer
- `GET /api/offers/:id` - Get a specific offer
- `PUT /api/offers/:id` - Update an offer
- `DELETE /api/offers/:id` - Delete an offer

### Mock Data (Read-Only)
Reference data endpoints:
- `GET /api/clients` - Get all clients
- `GET /api/employees` - Get all employees
- `GET /api/products` - Get all investment products
- `GET /api/investments` - Get all client investment profiles (KYC, suitability, AML/O data)
- `GET /api/templates` - Get all document templates

### Health Check
- `GET /health` - Server health check

## Key Data Models

### Inquiry
- **id**: Unique identifier (e.g., INQ-20251113-001)
- **source**: Channel origin (API, Web, Mobile, Email, Phone, Walk-in)
- **clientId**: Reference to client
- **productId**: Reference to product
- **requestedAmount**: Investment amount
- **status**: Draft, Pending, Converted, Rejected, Cancelled
- **additionalRemark**: Optional notes
- **createdBy**: User who created the inquiry
- **createdDate**: Creation timestamp
- **updatedDate**: Last update timestamp

### Offer
- **id**: Unique identifier (e.g., OFF-20251113-001)
- **inquiryId**: Optional reference to source inquiry
- **clientId**: Reference to client
- **productId**: Reference to product
- **investmentAmount**: Investment amount
- **expectedReturn**: Expected return percentage (e.g., "8-10%")
- **maturityDate**: Investment maturity date
- **proposalRemarks**: Proposal notes
- **status**: Proposal, Draft, Wait, Sent, Accepted, Confirmed, Rejected, Expired
- **kycStatus**: Pass or Fail
- **suitabilityStatus**: Pass or Fail
- **createdBy**: User who created the offer
- **createdDate, updatedDate, expiryDate**: Timestamps
- **sentDate, acceptedDate, approvedDate**: Optional workflow timestamps
- **acceptedBy, paymentMethod, otpVerified, approvedBy**: Acceptance/approval details

### Business Rules

#### Inquiry Status Transitions
- **Draft** → Pending, Cancelled
- **Pending** → Converted, Rejected, Cancelled
- **Converted, Rejected, Cancelled** → Terminal states (no further transitions)

#### Offer Status Workflow
- **Proposal** → Draft, Wait
- **Draft** → Wait
- **Wait** → Sent
- **Sent** → Accepted, Rejected, Expired
- **Accepted** → Confirmed
- **Confirmed, Rejected, Expired** → Terminal states

#### Suitability Rules
When converting an inquiry to an offer or creating an offer, the system validates:

1. **KYC Check**: Must have `kyc='Completed'` AND `amlo='Pass'`

2. **Suitability Check**: Client suitability must match product risk level:
   - **Conservative** clients → Can only invest in **Low** risk products
   - **Moderate** clients → Can invest in **Low** or **Medium** risk products
   - **Aggressive** clients → Can invest in any risk level (**Low**, **Medium**, **High**)

The `kycStatus` and `suitabilityStatus` fields are automatically calculated and stored with each offer.

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { /* optional additional details */ }
  }
}
```

## Testing the API

### Using Swagger UI
1. Navigate to `http://localhost:3000/api-docs`
2. Click on any endpoint to expand it
3. Click "Try it out" button
4. Fill in the required parameters
5. Click "Execute" to send the request
6. View the response below

### Using cURL
```bash
# List all inquiries
curl http://localhost:3000/api/inquiries

# Create a new inquiry
curl -X POST http://localhost:3000/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{
    "source": "Web",
    "clientId": "CLI-001",
    "productId": "PROD-001",
    "requestedAmount": 50000,
    "status": "Draft"
  }'

# Get a specific inquiry
curl http://localhost:3000/api/inquiries/INQ-20251113-001

# Convert inquiry to offer
curl -X POST http://localhost:3000/api/inquiries/INQ-20251113-001/convert
```

### Using Postman
1. Import the OpenAPI spec from `http://localhost:3000/api-docs-json`
2. All endpoints will be automatically available
3. Test each endpoint with the pre-configured schemas

## Development

### Adding New Endpoints

1. **Create the controller** in `src/controllers/`
2. **Add the route** in `src/routes/`
3. **Document with JSDoc** using OpenAPI annotations:

```typescript
/**
 * @openapi
 * /api/your-endpoint:
 *   get:
 *     tags:
 *       - YourTag
 *     summary: Brief description
 *     description: Detailed description
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YourSchema'
 */
router.get('/your-endpoint', yourController.yourMethod);
```

4. **Add schemas** in `src/config/swagger.config.ts` if needed

### Updating Documentation

1. Modify the JSDoc comments in route files
2. Update schemas in `swagger.config.ts`
3. Restart the server - changes will be automatically reflected

## Additional Resources

- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [JSDoc to OpenAPI](https://github.com/Surnet/swagger-jsdoc)

## Support

For questions or issues, please contact the WealthOps development team.
