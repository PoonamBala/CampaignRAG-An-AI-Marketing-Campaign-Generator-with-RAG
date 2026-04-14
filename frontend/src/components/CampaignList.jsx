import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CampaignList = ({ onSelectCampaign }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCampaigns();
  }, [filter]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const params = {};
      if (filter !== 'all') {
        params.status = filter;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/campaigns`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params
        }
      );

      if (response.data.success) {
        setCampaigns(response.data.campaigns);
      }

      // Fetch stats
      fetchStats();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to fetch campaigns. Please try again.'
      );
      console.error('Error fetching campaigns:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/campaigns/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleDelete = async (campaignId) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/campaigns/${campaignId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
    } catch (err) {
      console.error('Error deleting campaign:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'executed':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Stats Section */}
      {stats && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-600">Total Campaigns</p>
            <p className="text-3xl font-bold text-blue-900">{stats.totalCampaigns}</p>
          </div>
          {stats.byStatus && Object.entries(stats.byStatus).map(([status, count]) => (
            <div key={status} className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
              <p className="text-sm font-medium text-purple-600 capitalize">{status}</p>
              <p className="text-3xl font-bold text-purple-900">{count}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {['draft', 'approved', 'scheduled', 'executed', 'archived'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && campaigns.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 text-lg">No campaigns yet</p>
          <p className="text-gray-400 text-sm">Generate your first campaign to get started</p>
        </div>
      )}

      {/* Campaign List */}
      {!isLoading && campaigns.length > 0 && (
        <div className="space-y-3">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
              onClick={() => onSelectCampaign?.(campaign)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {campaign.objective.substring(0, 60)}
                    {campaign.objective.length > 60 ? '...' : ''}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-sm text-gray-600">
                      📦 {campaign.product}
                    </span>
                    <span className="text-sm text-gray-600">
                      📡 {campaign.channel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      ⭐ {campaign.recommendedVariant}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(campaign.id);
                  }}
                  className="text-red-600 hover:text-red-800 font-medium text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignList;
