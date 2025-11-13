import { Router } from 'express';
import * as offerController from '../controllers/offerController.js';

const router = Router();

// GET /api/offers - List all offers
router.get('/', offerController.listOffers);

// POST /api/offers - Create new offer
router.post('/', offerController.createOffer);

// GET /api/offers/:id - Get single offer
router.get('/:id', offerController.getOffer);

// PUT /api/offers/:id - Update offer
router.put('/:id', offerController.updateOffer);

// DELETE /api/offers/:id - Delete offer
router.delete('/:id', offerController.deleteOffer);

export default router;
