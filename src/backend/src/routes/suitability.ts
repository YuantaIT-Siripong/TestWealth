import express from 'express';
import { checkSuitability, getClientInvestmentGroup } from '../services/suitabilityService';

const router = express.Router();

/**
 * @swagger
 * /api/suitability/check:
 *   get:
 *     summary: Check if a client's risk level is suitable for a product
 *     description: |
 *       Validates suitability based on client risk level vs product risk level.
 *       Rule: Client risk level must be >= product risk level.
 *       Also checks KYC and AMLO status.
 *     tags: [Suitability]
 *     parameters:
 *       - in: query
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *         description: The client ID (e.g., CLI-001)
 *       - in: query
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID (e.g., PROD-001)
 *     responses:
 *       200:
 *         description: Suitability check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     isSuitable:
 *                       type: boolean
 *                       description: Whether the client is suitable for the product
 *                     clientRisk:
 *                       type: string
 *                       enum: [Low, Medium, High]
 *                       description: Client's risk level
 *                     productRisk:
 *                       type: string
 *                       enum: [Low, Medium, High]
 *                       description: Product's risk level
 *                     reason:
 *                       type: string
 *                       description: Explanation of the suitability result
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Server error
 */
router.get('/check', async (req, res) => {
  try {
    const { clientId, productId } = req.query;

    if (!clientId || !productId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_PARAMETERS',
          message: 'Both clientId and productId are required'
        }
      });
    }

    const result = await checkSuitability(
      clientId as string,
      productId as string
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in suitability check endpoint:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SUITABILITY_CHECK_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
});

/**
 * @swagger
 * /api/suitability/investment-group/{clientId}:
 *   get:
 *     summary: Get investment group for a client
 *     description: Returns the investment group (Conservative/Moderate/Aggressive) for a client
 *     tags: [Suitability]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *         description: The client ID (e.g., CLI-001)
 *     responses:
 *       200:
 *         description: Investment group retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     clientId:
 *                       type: string
 *                     investmentGroup:
 *                       type: string
 *                       enum: [Conservative, Moderate, Aggressive]
 *       404:
 *         description: Client not found
 *       500:
 *         description: Server error
 */
router.get('/investment-group/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const investmentGroup = await getClientInvestmentGroup(clientId);

    if (!investmentGroup) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CLIENT_NOT_FOUND',
          message: `Investment data not found for client ${clientId}`
        }
      });
    }

    res.json({
      success: true,
      data: {
        clientId,
        investmentGroup
      }
    });
  } catch (error) {
    console.error('Error getting investment group:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_INVESTMENT_GROUP_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
});

export default router;
