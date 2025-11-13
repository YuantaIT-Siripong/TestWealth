import { Request, Response } from 'express';
import * as inquiryService from '../services/inquiryService.js';

// GET /api/inquiries
export const listInquiries = async (req: Request, res: Response) => {
  try {
    const inquiries = await inquiryService.getAllInquiries();
    res.json({ success: true, data: inquiries, total: inquiries.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } });
  }
};

// GET /api/inquiries/:id
export const getInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const inquiry = await inquiryService.getInquiryById(req.params.id);
    if (!inquiry) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Inquiry not found' } });
      return;
    }
    res.json({ success: true, data: inquiry });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } });
  }
};

// POST /api/inquiries
export const createInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const inquiry = await inquiryService.createInquiry(req.body);
    res.status(201).json({ success: true, data: inquiry, message: 'Inquiry created successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'CREATE_ERROR', message: error.message } });
  }
};

// PUT /api/inquiries/:id
export const updateInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const inquiry = await inquiryService.updateInquiry(req.params.id, req.body);
    if (!inquiry) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Inquiry not found' } });
      return;
    }
    res.json({ success: true, data: inquiry, message: 'Inquiry updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'UPDATE_ERROR', message: error.message } });
  }
};

// DELETE /api/inquiries/:id
export const deleteInquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const success = await inquiryService.deleteInquiry(req.params.id);
    if (!success) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Inquiry not found' } });
      return;
    }
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'DELETE_ERROR', message: error.message } });
  }
};

// POST /api/inquiries/:id/convert
export const convertToOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const offer = await inquiryService.convertInquiryToOffer(req.params.id);
    if (!offer) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Inquiry not found' } });
      return;
    }
    res.status(201).json({ success: true, data: offer, message: 'Inquiry converted to offer successfully' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: { code: 'CONVERT_ERROR', message: error.message } });
  }
};
