import { Request, Response } from 'express';
import * as offerService from '../services/offerService.js';

// GET /api/offers
export const listOffers = async (req: Request, res: Response) => {
  try {
    const offers = await offerService.getAllOffers();
    res.json({ success: true, data: offers, total: offers.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } });
  }
};

// GET /api/offers/:id
export const getOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const offer = await offerService.getOfferById(req.params.id);
    if (!offer) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Offer not found' } });
      return;
    }
    res.json({ success: true, data: offer });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'FETCH_ERROR', message: error.message } });
  }
};

// POST /api/offers
export const createOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const offer = await offerService.createOffer(req.body);
    res.status(201).json({ success: true, data: offer, message: 'Offer created successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'CREATE_ERROR', message: error.message } });
  }
};

// PUT /api/offers/:id
export const updateOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const offer = await offerService.updateOffer(req.params.id, req.body);
    if (!offer) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Offer not found' } });
      return;
    }
    res.json({ success: true, data: offer, message: 'Offer updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'UPDATE_ERROR', message: error.message } });
  }
};

// DELETE /api/offers/:id
export const deleteOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const success = await offerService.deleteOffer(req.params.id);
    if (!success) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Offer not found' } });
      return;
    }
    res.json({ success: true, message: 'Offer deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'DELETE_ERROR', message: error.message } });
  }
};
