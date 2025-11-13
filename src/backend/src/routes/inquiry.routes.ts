import { Router } from 'express';
import * as inquiryController from '../controllers/inquiryController.js';

const router = Router();

// GET /api/inquiries - List all inquiries
router.get('/', inquiryController.listInquiries);

// POST /api/inquiries - Create new inquiry
router.post('/', inquiryController.createInquiry);

// GET /api/inquiries/:id - Get single inquiry
router.get('/:id', inquiryController.getInquiry);

// PUT /api/inquiries/:id - Update inquiry
router.put('/:id', inquiryController.updateInquiry);

// DELETE /api/inquiries/:id - Delete inquiry
router.delete('/:id', inquiryController.deleteInquiry);

// POST /api/inquiries/:id/convert - Convert inquiry to offer
router.post('/:id/convert', inquiryController.convertToOffer);

export default router;
