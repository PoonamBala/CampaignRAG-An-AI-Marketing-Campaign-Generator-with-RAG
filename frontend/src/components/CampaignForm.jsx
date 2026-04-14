import React, { useState } from 'react';
import axios from 'axios';

const CampaignForm = ({ onCampaignGenerated, onLoading }) => {
  const [formData, setFormData] = useState({
    objective: '',
    channel: '',
    audience: '',
    product: '',
    tone: ''
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const { objective, channel, audience, product, tone } = formData;
    if (!objective.trim() || !channel.trim() || !audience.trim() || !product.trim() || !tone.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    onLoading?.(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/campaigns/generate`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        onCampaignGenerated(response.data.campaign);
        // Reset form
        setFormData({
          objective: '',
          channel: '',
          audience: '',
          product: '',
          tone: ''
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to generate campaign. Please try again.'
      );
      console.error('Campaign generation error:', err);
    } finally {
      setIsLoading(false);
      onLoading?.(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate Campaign</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Objective */}
        <div>
          <label htmlFor="objective" className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Objective *
          </label>
          <textarea
            id="objective"
            name="objective"
            value={formData.objective}
            onChange={handleChange}
            placeholder="e.g., Increase product trial signups by 50% and drive enterprise demos"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            rows="3"
            disabled={isLoading}
          />
          <p className="mt-1 text-sm text-gray-500">
            What do you want to achieve with this campaign?
          </p>
        </div>

        {/* Channel */}
        <div>
          <label htmlFor="channel" className="block text-sm font-medium text-gray-700 mb-2">
            Channel *
          </label>
          <input
            type="text"
            id="channel"
            name="channel"
            value={formData.channel}
            onChange={handleChange}
            placeholder="e.g., LinkedIn + Email, Instagram, TikTok, etc."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            disabled={isLoading}
          />
          <p className="mt-1 text-sm text-gray-500">
            Which channels will you use?
          </p>
        </div>

        {/* Audience */}
        <div>
          <label htmlFor="audience" className="block text-sm font-medium text-gray-700 mb-2">
            Target Audience *
          </label>
          <textarea
            id="audience"
            name="audience"
            value={formData.audience}
            onChange={handleChange}
            placeholder="e.g., Marketing directors and CMOs at mid-market B2B companies, 35-55 years old, tech-forward"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            rows="3"
            disabled={isLoading}
          />
          <p className="mt-1 text-sm text-gray-500">
            Describe your target audience in detail
          </p>
        </div>

        {/* Product */}
        <div>
          <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-2">
            Product/Service *
          </label>
          <textarea
            id="product"
            name="product"
            value={formData.product}
            onChange={handleChange}
            placeholder="e.g., AI-Powered Marketing Automation Platform"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            rows="2"
            disabled={isLoading}
          />
          <p className="mt-1 text-sm text-gray-500">
            What are you promoting?
          </p>
        </div>

        {/* Tone */}
        <div>
          <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Tone *
          </label>
          <input
            type="text"
            id="tone"
            name="tone"
            value={formData.tone}
            onChange={handleChange}
            placeholder="e.g., Professional, innovative, data-driven, trustworthy"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            disabled={isLoading}
          />
          <p className="mt-1 text-sm text-gray-500">
            What tone should the campaign have?
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Campaign...
            </span>
          ) : (
            'Generate Campaign'
          )}
        </button>
      </form>

      <p className="mt-4 text-xs text-gray-500">
        * All fields are required. The AI will use your uploaded documents to generate contextual, relevant campaigns.
      </p>
    </div>
  );
};

export default CampaignForm;
