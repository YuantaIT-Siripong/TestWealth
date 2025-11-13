import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define types locally to avoid import issues
type KYCStatus = 'Completed' | 'Pending' | 'Expired' | 'Not Started';
type Suitability = 'Conservative' | 'Moderate' | 'Aggressive';
type RiskLevel = 'Low' | 'Medium' | 'High';
type AMLOStatus = 'Pass' | 'Pending' | 'Fail';

interface Investment {
  clientId: string;
  kyc: KYCStatus;
  amlo: AMLOStatus;
  totalAUM: number;
  investment_group: Suitability;
  risk: RiskLevel;
  lastReviewDate?: string | null;
  nextReviewDate?: string | null;
}

interface Product {
  productCode: string;
  name: string;
  category: string;
  riskLevel: RiskLevel;
  expectedReturn: string;
  minInvestment: number;
  description: string;
}

const INVESTMENTS_PATH = path.join(__dirname, '../../../../data/investments.json');
const PRODUCTS_PATH = path.join(__dirname, '../../../../data/products.json');

async function readInvestments(): Promise<Investment[]> {
  const data = await readFile(INVESTMENTS_PATH, 'utf-8');
  return JSON.parse(data);
}

async function readProducts(): Promise<Product[]> {
  const data = await readFile(PRODUCTS_PATH, 'utf-8');
  return JSON.parse(data);
}

/**
 * Map risk levels to numeric values for comparison
 */
const riskLevelValue: Record<RiskLevel, number> = {
  'Low': 1,
  'Medium': 2,
  'High': 3
};

/**
 * Check if a client's risk level is suitable for a product
 * Rule: Client risk level must be >= product risk level
 * Example: Medium risk client can buy Low/Medium products but not High
 */
export async function checkSuitability(
  clientId: string,
  productId: string
): Promise<{
  isSuitable: boolean;
  clientRisk: RiskLevel | null;
  productRisk: RiskLevel | null;
  reason: string;
}> {
  try {
    // Get investment data for client
    const investments = await readInvestments();
    const investment = investments.find((inv: Investment) => inv.clientId === clientId);

    if (!investment) {
      return {
        isSuitable: false,
        clientRisk: null,
        productRisk: null,
        reason: `Investment data not found for client ${clientId}`
      };
    }

    // Get product data
    const products = await readProducts();
    const product = products.find((prod: Product) => prod.productCode === productId);

    if (!product) {
      return {
        isSuitable: false,
        clientRisk: investment.risk,
        productRisk: null,
        reason: `Product not found: ${productId}`
      };
    }

    // Check KYC and AMLO status first
    if (investment.kyc !== 'Completed') {
      return {
        isSuitable: false,
        clientRisk: investment.risk,
        productRisk: product.riskLevel,
        reason: `KYC not completed for client (status: ${investment.kyc})`
      };
    }

    if (investment.amlo !== 'Pass') {
      return {
        isSuitable: false,
        clientRisk: investment.risk,
        productRisk: product.riskLevel,
        reason: `AMLO check not passed for client (status: ${investment.amlo})`
      };
    }

    // Compare risk levels
    const clientRiskValue = riskLevelValue[investment.risk];
    const productRiskValue = riskLevelValue[product.riskLevel];

    const isSuitable = clientRiskValue >= productRiskValue;

    return {
      isSuitable,
      clientRisk: investment.risk,
      productRisk: product.riskLevel,
      reason: isSuitable
        ? `Client risk level (${investment.risk}) is suitable for product risk level (${product.riskLevel})`
        : `Client risk level (${investment.risk}) is too low for product risk level (${product.riskLevel}). Client can only invest in products with risk level up to ${investment.risk}.`
    };
  } catch (error) {
    console.error('Error checking suitability:', error);
    return {
      isSuitable: false,
      clientRisk: null,
      productRisk: null,
      reason: `Error checking suitability: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Get investment group for a client
 */
export async function getClientInvestmentGroup(clientId: string): Promise<string | null> {
  try {
    const investments = await readInvestments();
    const investment = investments.find((inv: Investment) => inv.clientId === clientId);
    return investment?.investment_group || null;
  } catch (error) {
    console.error('Error getting client investment group:', error);
    return null;
  }
}
