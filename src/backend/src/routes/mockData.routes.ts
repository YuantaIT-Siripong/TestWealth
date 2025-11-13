import { Router, Request, Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';

const router = Router();

// Helper to read mock data
const readMockData = (filename: string) => {
  try {
    // The npm script runs from project root, but backend process.cwd() is src/backend
    // So we need to go up to project root: ../../data/
    const dataPath = join(process.cwd(), '..', '..', 'data', filename);
    console.log('Reading mock data from:', dataPath);
    const data = JSON.parse(readFileSync(dataPath, 'utf-8'));
    console.log(`Successfully loaded ${data.length} records from ${filename}`);
    return data;
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
};

/**
 * @openapi
 * /api/clients:
 *   get:
 *     tags:
 *       - Mock Data
 *     summary: Get all clients
 *     description: Retrieve list of all clients (read-only mock data)
 *     responses:
 *       200:
 *         description: List of clients
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
 *                     $ref: '#/components/schemas/Client'
 */
router.get('/clients', (_req: Request, res: Response) => {
  const clients = readMockData('clients.json');
  res.json({ success: true, data: clients });
});

/**
 * @openapi
 * /api/employees:
 *   get:
 *     tags:
 *       - Mock Data
 *     summary: Get all employees
 *     description: Retrieve list of all employees (read-only mock data)
 *     responses:
 *       200:
 *         description: List of employees
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
 *                     $ref: '#/components/schemas/Employee'
 */
router.get('/employees', (_req: Request, res: Response) => {
  const employees = readMockData('employees.json');
  res.json({ success: true, data: employees });
});

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags:
 *       - Mock Data
 *     summary: Get all products
 *     description: Retrieve list of all investment products (read-only mock data)
 *     responses:
 *       200:
 *         description: List of products
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
 *                     $ref: '#/components/schemas/Product'
 */
router.get('/products', (_req: Request, res: Response) => {
  const products = readMockData('products.json');
  // Map productCode to id for consistency
  const mappedProducts = products.map((p: any) => ({
    ...p,
    id: p.productCode
  }));
  res.json({ success: true, data: mappedProducts });
});

/**
 * @openapi
 * /api/investments:
 *   get:
 *     tags:
 *       - Mock Data
 *     summary: Get all investments
 *     description: Retrieve list of all client investment profiles with KYC, AML/O, and suitability data (read-only mock data)
 *     responses:
 *       200:
 *         description: List of investments
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
 *                     $ref: '#/components/schemas/Investment'
 */
router.get('/investments', (_req: Request, res: Response) => {
  const investments = readMockData('investments.json');
  res.json({ success: true, data: investments });
});

/**
 * @openapi
 * /api/templates:
 *   get:
 *     tags:
 *       - Mock Data
 *     summary: Get all templates
 *     description: Retrieve list of all document templates (read-only mock data)
 *     responses:
 *       200:
 *         description: List of templates
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
 *                     $ref: '#/components/schemas/Template'
 */
router.get('/templates', (_req: Request, res: Response) => {
  const templates = readMockData('templates.json');
  res.json({ success: true, data: templates });
});

export default router;
