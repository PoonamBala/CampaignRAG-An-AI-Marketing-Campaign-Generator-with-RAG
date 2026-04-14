import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/campaigns`;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

/**
 * Generate a new campaign using RAG
 */
export const generateCampaign = async (campaignData) => {
  try {
    const response = await axios.post(`${API_URL}/generate`, campaignData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to generate campaign' };
  }
};

/**
 * Generate and compare campaign variants
 */
export const generateCampaignVariants = async (campaignData) => {
  try {
    const response = await axios.post(`${API_URL}/variants`, campaignData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to generate variants' };
  }
};

/**
 * Refine campaign based on feedback
 */
export const refineCampaign = async (campaignData, feedback, focusVariant) => {
  try {
    const response = await axios.post(
      `${API_URL}/refine`,
      {
        campaignData,
        feedback,
        focusVariant
      },
      {
        headers: getAuthHeader()
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to refine campaign' };
  }
};

/**
 * Export campaign in different formats
 */
export const exportCampaign = async (campaignData, format = 'json') => {
  try {
    const response = await axios.post(
      `${API_URL}/export`,
      {
        campaignData,
        format
      },
      {
        headers: getAuthHeader()
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to export campaign' };
  }
};

/**
 * Get all campaigns for the current user
 */
export const getCampaigns = async (status = null, limit = 10, skip = 0) => {
  try {
    const params = { limit, skip };
    if (status) {
      params.status = status;
    }

    const response = await axios.get(API_URL, {
      headers: getAuthHeader(),
      params
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch campaigns' };
  }
};

/**
 * Get a specific campaign by ID
 */
export const getCampaignById = async (campaignId) => {
  try {
    const response = await axios.get(`${API_URL}/${campaignId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch campaign' };
  }
};

/**
 * Update campaign (status, notes, performance)
 */
export const updateCampaign = async (campaignId, updateData) => {
  try {
    const response = await axios.patch(`${API_URL}/${campaignId}`, updateData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update campaign' };
  }
};

/**
 * Delete a campaign
 */
export const deleteCampaign = async (campaignId) => {
  try {
    const response = await axios.delete(`${API_URL}/${campaignId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete campaign' };
  }
};

/**
 * Get campaign statistics
 */
export const getCampaignStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch campaign statistics' };
  }
};
