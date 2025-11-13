import { Request, Response } from 'express';
import * as customerProfileService from '../services/customerProfileService.js';

// GET /api/customer-profiles - Get all customer profiles
export const listProfiles = async (_req: Request, res: Response) => {
  try {
    const profiles = await customerProfileService.getAllProfiles();
    
    res.json({
      success: true,
      data: profiles,
      total: profiles.length
    });
  } catch (error: any) {
    console.error('Error in listProfiles:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: error.message || 'Failed to fetch customer profiles'
      }
    });
  }
};

// GET /api/customer-profiles/:clientId - Get single customer profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await customerProfileService.getProfileByClientId(req.params.clientId);
    
    if (!profile) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Customer profile not found'
        }
      });
      return;
    }
    
    res.json({
      success: true,
      data: profile
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: error.message
      }
    });
  }
};

// PUT /api/customer-profiles/:clientId - Update customer profile
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { kyc, amlo, totalAUM, suit, risk } = req.body;
    
    const profile = await customerProfileService.updateProfile(req.params.clientId, req.body);
    
    if (!profile) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Customer profile not found'
        }
      });
      return;
    }
    
    res.json({
      success: true,
      data: profile,
      message: 'Customer profile updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: error.message
      }
    });
  }
};
