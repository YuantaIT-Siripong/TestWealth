import type { Offer, OfferStatus, Inquiry, Investment } from '@shared/types';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { FileStorage } from '../utils/fileStorage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// File-based storage for offers
const storage = new FileStorage<Offer>('offers.json');
let offerCounter = 1;

// Read investments data
const readInvestments = (): Investment[] => {
  const dataPath = join(__dirname, '../../../../data/investments.json');
  const data = readFileSync(dataPath, 'utf-8');
  return JSON.parse(data);
};

// Generate offer ID in format: OFF-YYYYMMDD-XXX
const generateOfferId = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const sequence = String(offerCounter++).padStart(3, '0');
  
  return `OFF-${year}${month}${day}-${sequence}`;
};

// Validate KYC & Suitability from investment data
const validateKYCAndSuitability = (clientId: string, productRiskLevel: string): {
  kycStatus: 'Pass' | 'Fail';
  suitabilityStatus: 'Pass' | 'Fail';
} => {
  try {
    const investments = readInvestments();
    const investment = investments.find(inv => inv.clientId === clientId);
    
    if (!investment) {
      return { kycStatus: 'Fail', suitabilityStatus: 'Fail' };
    }

    // KYC check: Both KYC and AMLO must pass
    const kycStatus = (investment.kyc === 'Completed' && investment.amlo === 'Pass') ? 'Pass' : 'Fail';
    
    // Suitability check: Match client risk profile with product
    const suitabilityMap: Record<string, string[]> = {
      'Conservative': ['Low'],
      'Moderate': ['Low', 'Medium'],
      'Aggressive': ['Low', 'Medium', 'High']
    };
    
    const allowedRisks = suitabilityMap[investment.suit] || [];
    const suitabilityStatus = allowedRisks.includes(productRiskLevel) ? 'Pass' : 'Fail';
    
    return { kycStatus, suitabilityStatus };
  } catch (error) {
    return { kycStatus: 'Fail', suitabilityStatus: 'Fail' };
  }
};

// Get all offers with optional filters
export const getAllOffers = async (filters?: {
  status?: OfferStatus;
  clientId?: string;
  createdBy?: string;
}) => {
  const offers = await storage.read();
  let filtered = [...offers];

  if (filters?.status) {
    filtered = filtered.filter(o => o.status === filters.status);
  }

  if (filters?.clientId) {
    filtered = filtered.filter(o => o.clientId === filters.clientId);
  }

  if (filters?.createdBy) {
    filtered = filtered.filter(o => o.createdBy === filters.createdBy);
  }

  return filtered;
};

// Get offer by ID
export const getOfferById = async (id: string) => {
  return await storage.findOne(o => o.id === id);
};

// Create offer from inquiry
export const createOfferFromInquiry = async (inquiry: Inquiry, productRiskLevel: string = 'Medium'): Promise<Offer> => {
  const now = new Date();
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30); // 30 days expiry
  
  // Validate KYC & Suitability
  const { kycStatus, suitabilityStatus } = validateKYCAndSuitability(inquiry.clientId, productRiskLevel);
  
  const offer: Offer = {
    id: generateOfferId(),
    inquiryId: inquiry.id,
    clientId: inquiry.clientId,
    productId: inquiry.productId,
    investmentAmount: inquiry.requestedAmount,
    expectedReturn: '0% p.a.', // Default, will be updated in proposal
    maturityDate: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()), // 1 year default
    proposalRemarks: inquiry.additionalRemark || '',
    status: 'Proposal',
    createdBy: inquiry.createdBy,
    
    // KYC & Suitability
    kycStatus,
    suitabilityStatus,
    
    createdDate: now,
    updatedDate: now,
    expiryDate,
  };

  return await storage.create(offer);
};

// Create a new offer (manual)
export const createOffer = async (data: Omit<Offer, 'id' | 'createdDate' | 'updatedDate'>): Promise<Offer> => {
  const now = new Date();
  
  const offer: Offer = {
    ...data,
    id: generateOfferId(),
    createdDate: now,
    updatedDate: now,
  };

  return await storage.create(offer);
};

// Update offer
export const updateOffer = async (id: string, updates: Partial<Offer>) => {
  const offer = await storage.findOne(o => o.id === id);
  
  if (!offer) {
    return null;
  }

  // Validate status transition if status is being updated
  if (updates.status && !canUpdateStatus(offer.status, updates.status)) {
    throw new Error(`Invalid status transition from ${offer.status} to ${updates.status}`);
  }

  const updatedOffer: Offer = {
    ...offer,
    ...updates,
    updatedDate: new Date(),
  };

  return await storage.update(o => o.id === id, updatedOffer);
};

// Delete offer (soft delete by setting status to Rejected)
export const deleteOffer = async (id: string) => {
  const offer = await getOfferById(id);
  
  if (!offer) {
    return null;
  }

  return await updateOffer(id, { status: 'Rejected' });
};

// Send offer to client (simulates email sending)
export const sendToClient = async (id: string) => {
  const offer = await getOfferById(id);
  
  if (!offer) {
    return null;
  }

  if (offer.status !== 'Wait') {
    throw new Error('Only offers in Wait status can be sent to client');
  }

  // Check if KYC & Suitability passed
  if (offer.kycStatus !== 'Pass' || offer.suitabilityStatus !== 'Pass') {
    throw new Error('Cannot send offer: KYC or Suitability check failed');
  }

  // Simulate: Generate unique token, send email, update status
  return await updateOffer(id, {
    status: 'Sent',
    sentDate: new Date(),
  });
};

// Client accepts offer (simulates client acceptance via email link)
export const acceptOffer = async (id: string, clientId: string, paymentMethod: string) => {
  const offer = await getOfferById(id);
  
  if (!offer) {
    return null;
  }

  if (offer.status !== 'Sent') {
    throw new Error('Only sent offers can be accepted');
  }

  // Verify it's the correct client
  if (offer.clientId !== clientId) {
    throw new Error('Client ID mismatch');
  }

  return await updateOffer(id, {
    status: 'Accepted',
    acceptedDate: new Date(),
    acceptedBy: clientId,
    paymentMethod,
    otpVerified: true, // Simulate OTP verification
  });
};

// Final approval and confirm order
export const confirmOrder = async (id: string, approvedBy: string) => {
  const offer = await getOfferById(id);
  
  if (!offer) {
    return null;
  }

  if (offer.status !== 'Accepted') {
    throw new Error('Only accepted offers can be confirmed');
  }

  // Validate all prerequisites
  if (offer.kycStatus !== 'Pass') {
    throw new Error('Cannot confirm: KYC check failed');
  }

  if (offer.suitabilityStatus !== 'Pass') {
    throw new Error('Cannot confirm: Suitability check failed');
  }

  if (!offer.acceptedBy) {
    throw new Error('Cannot confirm: Client has not accepted the offer');
  }

  return await updateOffer(id, {
    status: 'Confirmed',
    approvedBy,
    approvedDate: new Date(),
  });
};

// Validate status transition
export const canUpdateStatus = (currentStatus: OfferStatus, newStatus: OfferStatus): boolean => {
  const validTransitions: Record<OfferStatus, OfferStatus[]> = {
    'Proposal': ['Draft', 'Wait', 'Rejected'],
    'Draft': ['Wait', 'Rejected'],
    'Wait': ['Sent', 'Rejected'],
    'Sent': ['Accepted', 'Rejected', 'Expired'],
    'Accepted': ['Confirmed', 'Rejected'],
    'Confirmed': [],
    'Rejected': [],
    'Expired': []
  };

  return validTransitions[currentStatus]?.includes(newStatus) ?? false;
};
