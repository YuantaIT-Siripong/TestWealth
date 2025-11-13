import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WealthOps API Documentation',
      version: '1.0.0',
      description: 'Comprehensive API documentation for the WealthOps wealth management application',
      contact: {
        name: 'WealthOps Team',
        email: 'support@wealthops.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Inquiries',
        description: 'Client inquiry management endpoints',
      },
      {
        name: 'Offers',
        description: 'Investment offer management endpoints',
      },
      {
        name: 'Mock Data',
        description: 'Read-only endpoints for reference data (clients, products, templates, etc.)',
      },
      {
        name: 'Health',
        description: 'Server health check endpoints',
      },
    ],
    components: {
      schemas: {
        // Inquiry Schemas
        InquiryStatus: {
          type: 'string',
          enum: ['Draft', 'Pending', 'Converted', 'Rejected', 'Cancelled'],
          description: 'Status of the inquiry',
        },
        InquirySource: {
          type: 'string',
          enum: ['API', 'Web', 'Mobile', 'Email', 'Phone', 'Walk-in'],
          description: 'Source channel of the inquiry',
        },
        Inquiry: {
          type: 'object',
          required: ['id', 'source', 'clientId', 'productId', 'requestedAmount', 'status', 'createdBy', 'createdDate', 'updatedDate'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique inquiry identifier',
              example: 'INQ-20251113-001',
            },
            source: {
              $ref: '#/components/schemas/InquirySource',
            },
            clientId: {
              type: 'string',
              description: 'Client identifier',
              example: 'CLI-001',
            },
            productId: {
              type: 'string',
              description: 'Product identifier',
              example: 'PROD-001',
            },
            requestedAmount: {
              type: 'number',
              description: 'Investment amount requested',
              example: 50000,
            },
            additionalRemark: {
              type: 'string',
              description: 'Additional remarks or notes',
              example: 'Client interested in long-term investment',
            },
            status: {
              $ref: '#/components/schemas/InquiryStatus',
            },
            createdBy: {
              type: 'string',
              description: 'User who created the inquiry',
              example: 'admin',
            },
            createdDate: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedDate: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        CreateInquiryRequest: {
          type: 'object',
          required: ['source', 'clientId', 'productId', 'requestedAmount', 'status'],
          properties: {
            source: {
              $ref: '#/components/schemas/InquirySource',
            },
            clientId: {
              type: 'string',
              example: 'CLI-001',
            },
            productId: {
              type: 'string',
              example: 'PROD-001',
            },
            requestedAmount: {
              type: 'number',
              example: 50000,
            },
            additionalRemark: {
              type: 'string',
              example: 'Client interested in conservative investment',
            },
            status: {
              $ref: '#/components/schemas/InquiryStatus',
            },
          },
        },
        UpdateInquiryRequest: {
          type: 'object',
          properties: {
            source: {
              $ref: '#/components/schemas/InquirySource',
            },
            clientId: {
              type: 'string',
            },
            productId: {
              type: 'string',
            },
            requestedAmount: {
              type: 'number',
            },
            additionalRemark: {
              type: 'string',
            },
            status: {
              $ref: '#/components/schemas/InquiryStatus',
            },
          },
        },

        // Offer Schemas
        OfferStatus: {
          type: 'string',
          enum: ['Proposal', 'Draft', 'Wait', 'Sent', 'Accepted', 'Confirmed', 'Rejected', 'Expired'],
          description: 'Status of the offer',
        },
        CheckStatus: {
          type: 'string',
          enum: ['Pass', 'Fail'],
          description: 'Result of KYC or suitability check',
        },
        Offer: {
          type: 'object',
          required: ['id', 'clientId', 'productId', 'investmentAmount', 'expectedReturn', 'maturityDate', 'proposalRemarks', 'status', 'createdBy', 'kycStatus', 'suitabilityStatus', 'createdDate', 'updatedDate', 'expiryDate'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique offer identifier',
              example: 'OFF-20251113-001',
            },
            inquiryId: {
              type: 'string',
              description: 'Related inquiry ID (if converted from inquiry)',
              example: 'INQ-20251113-001',
            },
            clientId: {
              type: 'string',
              description: 'Client identifier',
              example: 'CLI-001',
            },
            productId: {
              type: 'string',
              description: 'Product identifier',
              example: 'PROD-001',
            },
            investmentAmount: {
              type: 'number',
              description: 'Investment amount',
              example: 50000,
            },
            expectedReturn: {
              type: 'string',
              description: 'Expected return percentage',
              example: '8-10%',
            },
            maturityDate: {
              type: 'string',
              format: 'date-time',
              description: 'Investment maturity date',
            },
            proposalRemarks: {
              type: 'string',
              description: 'Proposal remarks',
              example: 'Suitable for long-term investment goals',
            },
            status: {
              $ref: '#/components/schemas/OfferStatus',
            },
            createdBy: {
              type: 'string',
              description: 'User who created the offer',
              example: 'admin',
            },
            kycStatus: {
              $ref: '#/components/schemas/CheckStatus',
            },
            suitabilityStatus: {
              $ref: '#/components/schemas/CheckStatus',
            },
            createdDate: {
              type: 'string',
              format: 'date-time',
            },
            updatedDate: {
              type: 'string',
              format: 'date-time',
            },
            expiryDate: {
              type: 'string',
              format: 'date-time',
            },
            sentDate: {
              type: 'string',
              format: 'date-time',
            },
            acceptedDate: {
              type: 'string',
              format: 'date-time',
            },
            approvedDate: {
              type: 'string',
              format: 'date-time',
            },
            acceptedBy: {
              type: 'string',
            },
            paymentMethod: {
              type: 'string',
            },
            otpVerified: {
              type: 'boolean',
            },
            approvedBy: {
              type: 'string',
            },
          },
        },
        CreateOfferRequest: {
          type: 'object',
          required: ['clientId', 'productId', 'investmentAmount', 'expectedReturn', 'maturityDate', 'proposalRemarks', 'status'],
          properties: {
            clientId: {
              type: 'string',
              example: 'CLI-001',
            },
            productId: {
              type: 'string',
              example: 'PROD-001',
            },
            investmentAmount: {
              type: 'number',
              example: 50000,
            },
            expectedReturn: {
              type: 'string',
              example: '8-10%',
            },
            maturityDate: {
              type: 'string',
              format: 'date',
              example: '2026-11-13',
            },
            proposalRemarks: {
              type: 'string',
              example: 'Recommended for long-term growth',
            },
            status: {
              $ref: '#/components/schemas/OfferStatus',
            },
          },
        },
        UpdateOfferRequest: {
          type: 'object',
          properties: {
            investmentAmount: {
              type: 'number',
            },
            expectedReturn: {
              type: 'string',
            },
            maturityDate: {
              type: 'string',
              format: 'date',
            },
            proposalRemarks: {
              type: 'string',
            },
            status: {
              $ref: '#/components/schemas/OfferStatus',
            },
          },
        },

        // Client Schema
        Client: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'CLI-001',
            },
            name: {
              type: 'string',
              example: 'John Smith',
            },
            cif: {
              type: 'string',
              example: 'CIF123456',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john.smith@email.com',
            },
            phone: {
              type: 'string',
              example: '+66-2-123-4567',
            },
            address: {
              type: 'string',
              example: '123 Business District, Bangkok 10500',
            },
          },
        },

        // Product Schema
        RiskLevel: {
          type: 'string',
          enum: ['Low', 'Medium', 'High'],
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'PROD-001',
            },
            name: {
              type: 'string',
              example: 'Growth Fund A',
            },
            category: {
              type: 'string',
              example: 'Fund',
            },
            riskLevel: {
              $ref: '#/components/schemas/RiskLevel',
            },
            expectedReturn: {
              type: 'string',
              example: '8-10%',
            },
            minInvestment: {
              type: 'number',
              example: 10000,
            },
            description: {
              type: 'string',
              example: 'Diversified equity fund for long-term growth',
            },
          },
        },

        // Investment Schema
        KYCStatus: {
          type: 'string',
          enum: ['Completed', 'Pending', 'Expired', 'Not Started'],
        },
        Suitability: {
          type: 'string',
          enum: ['Conservative', 'Moderate', 'Aggressive'],
        },
        AMLOStatus: {
          type: 'string',
          enum: ['Pass', 'Pending', 'Fail'],
        },
        Investment: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'INV-001',
            },
            clientId: {
              type: 'string',
              example: 'CLI-001',
            },
            clientName: {
              type: 'string',
              example: 'John Smith',
            },
            kyc: {
              $ref: '#/components/schemas/KYCStatus',
            },
            amlo: {
              $ref: '#/components/schemas/AMLOStatus',
            },
            totalAUM: {
              type: 'number',
              description: 'Total Assets Under Management',
              example: 5000000,
            },
            suit: {
              $ref: '#/components/schemas/Suitability',
            },
            risk: {
              $ref: '#/components/schemas/RiskLevel',
            },
            lastReviewDate: {
              type: 'string',
              format: 'date',
              nullable: true,
            },
            nextReviewDate: {
              type: 'string',
              format: 'date',
              nullable: true,
            },
          },
        },

        // Template Schema
        Template: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'TPL-001',
            },
            name: {
              type: 'string',
              example: 'Standard Investment Proposal',
            },
            category: {
              type: 'string',
              example: 'Investment',
            },
            description: {
              type: 'string',
              example: 'Standard template for investment proposals',
            },
            createdDate: {
              type: 'string',
              format: 'date-time',
            },
            updatedDate: {
              type: 'string',
              format: 'date-time',
            },
          },
        },

        // Employee Schema
        Employee: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'EMP-001',
            },
            name: {
              type: 'string',
              example: 'Sarah Johnson',
            },
            position: {
              type: 'string',
              example: 'Relationship Manager',
            },
            department: {
              type: 'string',
              example: 'Sales',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'sarah.j@wealthops.com',
            },
          },
        },

        // Response Schemas
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
            message: {
              type: 'string',
              example: 'Operation successful',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  example: 'VALIDATION_ERROR',
                },
                message: {
                  type: 'string',
                  example: 'Invalid input data',
                },
                details: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: 'Bad Request - Invalid input',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
        ServerError: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);
