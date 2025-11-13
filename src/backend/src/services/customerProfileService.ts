import path from 'path';
import { fileURLToPath } from 'url';
import { readFile, writeFile } from 'fs/promises';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INVESTMENTS_FILE = path.join(__dirname, '../../../../data/investments.json');

export interface Investment {
  id: string;
  clientId: string;
  clientName: string;
  kyc: 'Completed' | 'Pending' | 'Expired' | 'Not Started';
  amlo: 'Pass' | 'Pending' | 'Fail';
  totalAUM: number;
  investment_group: 'Conservative' | 'Moderate' | 'Aggressive';
  risk: 'Low' | 'Medium' | 'High';
}

// Get all customer profiles
export async function getAllProfiles(): Promise<Investment[]> {
  try {
    const data = await readFile(INVESTMENTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    logger.error(`Error reading investments file: ${error.message}`);
    throw new Error('Failed to read customer profiles');
  }
}

// Get customer profile by client ID
export async function getProfileByClientId(clientId: string): Promise<Investment | null> {
  try {
    const profiles = await getAllProfiles();
    return profiles.find(p => p.clientId === clientId) || null;
  } catch (error: any) {
    logger.error(`Error fetching profile for client ${clientId}: ${error.message}`);
    throw error;
  }
}

// Update customer profile
export async function updateProfile(
  clientId: string,
  updates: Partial<Investment>
): Promise<Investment | null> {
  try {
    const profiles = await getAllProfiles();
    const index = profiles.findIndex(p => p.clientId === clientId);
    
    if (index === -1) {
      return null;
    }
    
    // Update the profile
    profiles[index] = {
      ...profiles[index],
      ...updates,
      clientId // Ensure clientId cannot be changed
    };
    
    // Write back to file
    await writeFile(INVESTMENTS_FILE, JSON.stringify(profiles, null, 2), 'utf-8');
    
    logger.info(`Updated customer profile for client ${clientId}`);
    return profiles[index];
  } catch (error: any) {
    logger.error(`Error updating profile for client ${clientId}: ${error.message}`);
    throw new Error('Failed to update customer profile');
  }
}
