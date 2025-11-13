import type { Inquiry, InquiryStatus } from '@shared/types';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { FileStorage } from '../utils/fileStorage.js';
import * as offerService from './offerService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// File-based storage for inquiries
const storage = new FileStorage<Inquiry>('inquiries.json');

// Generate inquiry ID in format: INQ-YYYYMMDD-XXX
const generateInquiryId = async (): Promise<string> => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const datePrefix = `INQ-${year}${month}${day}`;
  
  // Read existing inquiries to find the highest sequence number for today
  const existingInquiries = await storage.read();
  const todayInquiries = existingInquiries.filter(inq => inq.id.startsWith(datePrefix));
  
  let maxSequence = 0;
  todayInquiries.forEach(inq => {
    const match = inq.id.match(/INQ-\d{8}-(\d{3})/);
    if (match) {
      const sequence = parseInt(match[1], 10);
      if (sequence > maxSequence) {
        maxSequence = sequence;
      }
    }
  });
  
  const nextSequence = String(maxSequence + 1).padStart(3, '0');
  return `${datePrefix}-${nextSequence}`;
};

// Get all inquiries with optional filters
export const getAllInquiries = async (filters?: {
  status?: InquiryStatus;
  clientId?: string;
  source?: string;
}) => {
  const inquiries = await storage.read();
  let filtered = [...inquiries];

  if (filters?.status) {
    filtered = filtered.filter(i => i.status === filters.status);
  }

  if (filters?.clientId) {
    filtered = filtered.filter(i => i.clientId === filters.clientId);
  }

  if (filters?.source) {
    filtered = filtered.filter(i => i.source === filters.source);
  }

  return filtered;
};

// Get inquiry by ID
export const getInquiryById = async (id: string) => {
  return await storage.findOne(i => i.id === id);
};

// Create a new inquiry
export const createInquiry = async (data: Omit<Inquiry, 'id' | 'createdDate' | 'updatedDate'>): Promise<Inquiry> => {
  const now = new Date();
  
  const inquiry: Inquiry = {
    ...data,
    id: await generateInquiryId(),
    status: data.status || 'Draft',
    createdDate: now,
    updatedDate: now,
  };

  return await storage.create(inquiry);
};

// Update inquiry
export const updateInquiry = async (id: string, updates: Partial<Inquiry>) => {
  const inquiry = await storage.findOne(i => i.id === id);
  
  if (!inquiry) {
    return null;
  }

  // Validate status transition if status is being updated
  if (updates.status && !canUpdateStatus(inquiry.status, updates.status)) {
    throw new Error(`Invalid status transition from ${inquiry.status} to ${updates.status}`);
  }

  const updatedInquiry: Inquiry = {
    ...inquiry,
    ...updates,
    updatedDate: new Date(),
  };

  return await storage.update(i => i.id === id, updatedInquiry);
};

// Delete inquiry
export const deleteInquiry = async (id: string) => {
  return await storage.delete(i => i.id === id);
};

// Convert inquiry to offer
export const convertInquiryToOffer = async (id: string) => {
  const inquiry = await getInquiryById(id);
  
  if (!inquiry) {
    return null;
  }

  if (inquiry.status !== 'Pending') {
    throw new Error('Only pending inquiries can be converted to offers');
  }

  // Create offer from inquiry
  const offer = await offerService.createOfferFromInquiry(inquiry);
  
  // Update inquiry status to Converted
  await updateInquiry(id, { status: 'Converted' });
  
  return offer;
};

// Validate status transition
export const canUpdateStatus = (currentStatus: InquiryStatus, newStatus: InquiryStatus): boolean => {
  // Terminal states cannot be changed
  const terminalStates: InquiryStatus[] = ['Converted', 'Rejected', 'Cancelled'];
  if (terminalStates.includes(currentStatus)) {
    return false;
  }

  // Allow free changes between Draft and Pending
  if ((currentStatus === 'Draft' || currentStatus === 'Pending') && 
      (newStatus === 'Draft' || newStatus === 'Pending')) {
    return true;
  }

  // Allow changing to terminal states from Draft or Pending
  const validTransitions: Record<InquiryStatus, InquiryStatus[]> = {
    'Draft': ['Pending', 'Cancelled'],
    'Pending': ['Draft', 'Converted', 'Rejected', 'Cancelled'],
    'Converted': [],
    'Rejected': [],
    'Cancelled': []
  };

  return validTransitions[currentStatus]?.includes(newStatus) ?? false;
};
