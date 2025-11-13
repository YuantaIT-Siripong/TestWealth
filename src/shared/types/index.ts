// Inquiry types
export type InquiryStatus = 'Draft' | 'Pending' | 'Converted' | 'Rejected' | 'Cancelled';
export type InquirySource = 'API' | 'Web' | 'Mobile' | 'Email' | 'Phone' | 'Walk-in';

export interface Inquiry {
  id: string;
  source: InquirySource;
  clientId: string;
  productId: string;
  requestedAmount: number;
  additionalRemark?: string;
  status: InquiryStatus;
  createdBy: string;
  createdDate: Date;
  updatedDate: Date;
}

// Offer types
export type OfferStatus = 'Proposal' | 'Draft' | 'Wait' | 'Sent' | 'Accepted' | 'Confirmed' | 'Rejected' | 'Expired';

export interface Offer {
  id: string;
  inquiryId?: string;
  clientId: string;
  productId: string;
  investmentAmount: number;
  expectedReturn: string;
  maturityDate: Date;
  proposalRemarks: string;
  status: OfferStatus;
  createdBy: string;
  
  // KYC & Suitability
  kycStatus: 'Pass' | 'Fail';
  suitabilityStatus: 'Pass' | 'Fail';
  
  // Dates
  createdDate: Date;
  updatedDate: Date;
  expiryDate: Date;
  sentDate?: Date;
  acceptedDate?: Date;
  approvedDate?: Date;
  
  // Acceptance fields
  acceptedBy?: string;
  paymentMethod?: string;
  otpVerified?: boolean;
  approvedBy?: string;
}

// Customer Profile / Investment types
export type KYCStatus = 'Completed' | 'Pending' | 'Expired' | 'Not Started';
export type Suitability = 'Conservative' | 'Moderate' | 'Aggressive';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type AMLOStatus = 'Pass' | 'Pending' | 'Fail';

export interface Investment {
  id?: string;
  clientId: string;
  clientName?: string;
  kyc: KYCStatus;
  amlo: AMLOStatus;
  totalAUM: number;
  suit: Suitability;
  risk: RiskLevel;
  lastReviewDate?: string | null;
  nextReviewDate?: string | null;
}

// Template types
export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  createdDate: string;
  updatedDate: string;
}

// Client types
export interface Client {
  id: string;
  name: string;
  cif?: string;
  email: string;
  phone: string;
  address: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  category: string;
  riskLevel: RiskLevel;
  expectedReturn: string;
  minInvestment: number;
  description: string;
}

// Employee types
export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
}
