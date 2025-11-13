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

// GET /api/clients
router.get('/clients', (_req: Request, res: Response) => {
  const clients = readMockData('clients.json');
  res.json({ success: true, data: clients });
});

// GET /api/employees
router.get('/employees', (_req: Request, res: Response) => {
  const employees = readMockData('employees.json');
  res.json({ success: true, data: employees });
});

// GET /api/products
router.get('/products', (_req: Request, res: Response) => {
  const products = readMockData('products.json');
  // Map productCode to id for consistency
  const mappedProducts = products.map((p: any) => ({
    ...p,
    id: p.productCode
  }));
  res.json({ success: true, data: mappedProducts });
});

// GET /api/investments
router.get('/investments', (_req: Request, res: Response) => {
  const investments = readMockData('investments.json');
  res.json({ success: true, data: investments });
});

// GET /api/templates
router.get('/templates', (_req: Request, res: Response) => {
  const templates = readMockData('templates.json');
  res.json({ success: true, data: templates });
});

export default router;
