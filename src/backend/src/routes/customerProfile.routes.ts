import { Router } from 'express';
import * as customerProfileController from '../controllers/customerProfileController.js';

const router = Router();

// GET /api/customer-profiles - List all customer profiles
router.get('/', customerProfileController.listProfiles);

// GET /api/customer-profiles/:clientId - Get single customer profile
router.get('/:clientId', customerProfileController.getProfile);

// PUT /api/customer-profiles/:clientId - Update customer profile
router.put('/:clientId', customerProfileController.updateProfile);

export default router;
