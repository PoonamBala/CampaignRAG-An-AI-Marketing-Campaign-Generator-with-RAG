import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CampaignForm from '../components/CampaignForm';
import CampaignResult from '../components/CampaignResult';
import CampaignList from '../components/CampaignList';
import axios from 'axios';

const CampaignDashboard = () => {
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeView, setActiveView] = useState('generator'); // 'generator', 'history', 'full'
  const [selectedCampaignForDetail, setSelectedCampaignForDetail] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCampaignGenerated = (newCampaign) => {
    setCampaign(newCampaign);
    setActiveView('full');
  };

  const handleExport = async (format) => {
    if (!campaign) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/campaigns/export`,
        {
          campaignData: campaign.output,
          format
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        const content = response.data.campaign;
        const element = document.createElement('a');
        element.setAttribute(
          'href',
          'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
        );

        const filename = `campaign_${new Date().getTime()}.${format === 'json' ? 'json' : format === 'markdown' ? 'md' : 'csv'}`;
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export campaign');
    }
  };

  const handleSelectCampaign = (campaignItem) => {
    setSelectedCampaignForDetail(campaignItem);
    setActiveView('detail');
  };

  const handleBack = () => {
    setSelectedCampaignForDetail(null);
    setActiveView('generator');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                CampaignRAG
              </button>
              <nav className="hidden md:flex gap-6">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-600 font-medium hover:text-gray-900 transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => navigate('/campaigns')}
                  className="text-blue-600 font-medium border-b-2 border-blue-600"
                >
                  Campaign Generator
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 text-sm sm:text-base">Welcome, {user?.name}!</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 active:bg-red-800 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Campaign Generator</h1>
          <p className="text-blue-100">
            Use AI with RAG to generate data-driven marketing campaigns
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex gap-4">
          <button
            onClick={() => setActiveView('generator')}
            className={`px-6 py-4 font-medium border-b-2 transition-colors ${
              activeView === 'generator'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            ✨ Generate New
          </button>
          <button
            onClick={() => setActiveView('history')}
            className={`px-6 py-4 font-medium border-b-2 transition-colors ${
              activeView === 'history'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            📚 Campaign History
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Generator View */}
        {activeView === 'generator' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <CampaignForm onCampaignGenerated={handleCampaignGenerated} onLoading={setIsLoading} />
            </div>
            <div className="lg:col-span-2">
              {!campaign ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l-6-2m6 2l6-2m-6-10l6 2m-6-2l-6 2" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Ready to Generate
                  </h3>
                  <p className="text-gray-600">
                    Fill in the campaign details on the left and click "Generate Campaign" to create AI-powered marketing campaigns.
                  </p>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900">
                      💡 Tip: The more detail you provide about your objective, audience, and product, the better the generated campaigns will be!
                    </p>
                  </div>
                </div>
              ) : (
                <CampaignResult campaign={campaign} onExport={handleExport} />
              )}
            </div>
          </div>
        )}

        {/* History View */}
        {activeView === 'history' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign History</h2>
              <p className="text-gray-600">
                View and manage all your generated campaigns
              </p>
            </div>
            <CampaignList onSelectCampaign={handleSelectCampaign} />
          </div>
        )}

        {/* Detail View */}
        {activeView === 'detail' && selectedCampaignForDetail && (
          <div>
            <button
              onClick={handleBack}
              className="mb-4 flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to History
            </button>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Campaign Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Objective</p>
                  <p className="text-gray-900">{selectedCampaignForDetail.objective}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Product</p>
                    <p className="text-gray-900">{selectedCampaignForDetail.product}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Channel</p>
                    <p className="text-gray-900">{selectedCampaignForDetail.channel}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Recommended</p>
                    <p className="text-gray-900 capitalize">{selectedCampaignForDetail.recommendedVariant}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Created</p>
                  <p className="text-gray-900">
                    {new Date(selectedCampaignForDetail.createdAt).toLocaleDateString()} at{' '}
                    {new Date(selectedCampaignForDetail.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <span className="inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                    {selectedCampaignForDetail.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDashboard;
