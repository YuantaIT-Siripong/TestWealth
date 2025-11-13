import { Router } from 'express';
import * as offerController from '../controllers/offerController.js';

const router = Router();

/**
 * @openapi
 * /api/offers:
 *   get:
 *     tags:
 *       - Offers
 *     summary: List all offers
 *     description: Retrieve a list of all investment offers with optional filtering
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/OfferStatus'
 *         description: Filter by offer status
 *       - in: query
 *         name: clientId
 *         schema:
 *           type: string
 *         description: Filter by client ID
 *     responses:
 *       200:
 *         description: List of offers retrieved successfully
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
 *                     $ref: '#/components/schemas/Offer'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/', offerController.listOffers);

/**
 * @openapi
 * /api/offers:
 *   post:
 *     tags:
 *       - Offers
 *     summary: Create new offer
 *     description: Create a new investment offer with automatic KYC and suitability validation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOfferRequest'
 *     responses:
 *       201:
 *         description: Offer created successfully
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
 *                   example: Offer created successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post('/', offerController.createOffer);

/**
 * @openapi
 * /api/offers/{id}:
 *   get:
 *     tags:
 *       - Offers
 *     summary: Get single offer
 *     description: Retrieve details of a specific offer by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Offer ID
 *         example: OFF-20251113-001
 *     responses:
 *       200:
 *         description: Offer retrieved successfully
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
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/:id', offerController.getOffer);

/**
 * @openapi
 * /api/offers/{id}:
 *   put:
 *     tags:
 *       - Offers
 *     summary: Update offer
 *     description: Update an existing investment offer. Can update details, status, and acceptance information.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Offer ID
 *         example: OFF-20251113-001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOfferRequest'
 *     responses:
 *       200:
 *         description: Offer updated successfully
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
 *                   example: Offer updated successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.put('/:id', offerController.updateOffer);

/**
 * @openapi
 * /api/offers/{id}:
 *   delete:
 *     tags:
 *       - Offers
 *     summary: Delete offer
 *     description: Delete an existing investment offer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Offer ID
 *         example: OFF-20251113-001
 *     responses:
 *       200:
 *         description: Offer deleted successfully
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
 *                   example: Offer deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.delete('/:id', offerController.deleteOffer);

export default router;
