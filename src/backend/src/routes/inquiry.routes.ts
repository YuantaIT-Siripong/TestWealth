import { Router } from 'express';
import * as inquiryController from '../controllers/inquiryController.js';

const router = Router();

/**
 * @openapi
 * /api/inquiries:
 *   get:
 *     tags:
 *       - Inquiries
 *     summary: List all inquiries
 *     description: Retrieve a list of all client inquiries with optional filtering
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/InquiryStatus'
 *         description: Filter by inquiry status
 *       - in: query
 *         name: clientId
 *         schema:
 *           type: string
 *         description: Filter by client ID
 *     responses:
 *       200:
 *         description: List of inquiries retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Inquiry'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', inquiryController.listInquiries);

/**
 * @openapi
 * /api/inquiries:
 *   post:
 *     tags:
 *       - Inquiries
 *     summary: Create new inquiry
 *     description: Create a new client inquiry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInquiryRequest'
 *     responses:
 *       201:
 *         description: Inquiry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Inquiry'
 *                 message:
 *                   type: string
 *                   example: Inquiry created successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', inquiryController.createInquiry);

/**
 * @openapi
 * /api/inquiries/{id}:
 *   get:
 *     tags:
 *       - Inquiries
 *     summary: Get single inquiry
 *     description: Retrieve details of a specific inquiry by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Inquiry ID
 *         example: INQ-20251113-001
 *     responses:
 *       200:
 *         description: Inquiry retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Inquiry'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', inquiryController.getInquiry);

/**
 * @openapi
 * /api/inquiries/{id}:
 *   put:
 *     tags:
 *       - Inquiries
 *     summary: Update inquiry
 *     description: Update an existing inquiry
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Inquiry ID
 *         example: INQ-20251113-001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateInquiryRequest'
 *     responses:
 *       200:
 *         description: Inquiry updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Inquiry'
 *                 message:
 *                   type: string
 *                   example: Inquiry updated successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id', inquiryController.updateInquiry);

/**
 * @openapi
 * /api/inquiries/{id}:
 *   delete:
 *     tags:
 *       - Inquiries
 *     summary: Delete inquiry
 *     description: Delete an existing inquiry
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Inquiry ID
 *         example: INQ-20251113-001
 *     responses:
 *       200:
 *         description: Inquiry deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Inquiry deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', inquiryController.deleteInquiry);

/**
 * @openapi
 * /api/inquiries/{id}/convert:
 *   post:
 *     tags:
 *       - Inquiries
 *     summary: Convert inquiry to offer
 *     description: Convert an inquiry to an investment offer with KYC and suitability validation
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Inquiry ID
 *         example: INQ-20251113-001
 *     responses:
 *       201:
 *         description: Inquiry converted to offer successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Offer'
 *                 message:
 *                   type: string
 *                   example: Inquiry converted to offer successfully
 *       400:
 *         description: Conversion failed due to validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/:id/convert', inquiryController.convertToOffer);

export default router;
