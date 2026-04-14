import React, { useState } from 'react';

const CampaignResult = ({ campaign, onExport }) => {
  const [activeTab, setActiveTab] = useState('brief');
  const [expandedVariant, setExpandedVariant] = useState(null);

  if (!campaign) {
    return null;
  }

  const { input, output, context } = campaign;
  const { campaignBrief, variants, recommended, additionalRecommendations, metadata } = output;

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low':
        return 'text-green-700 bg-green-50';
      case 'medium':
        return 'text-yellow-700 bg-yellow-50';
      case 'high':
        return 'text-red-700 bg-red-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  const getRiskBadgeColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Campaign Generated Successfully</h2>
        <p className="text-gray-600">
          Campaign created on {new Date(campaign.createdAt).toLocaleDateString()} at{' '}
          {new Date(campaign.createdAt).toLocaleTimeString()}
        </p>
      </div>

      {/* Input Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Campaign Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Objective</p>
            <p className="text-gray-900">{input.objective}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Product</p>
            <p className="text-gray-900">{input.product}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Channel</p>
            <p className="text-gray-900">{input.channel}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Tone</p>
            <p className="text-gray-900">{input.tone}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Audience: {input.audience}
        </p>
      </div>

      {/* Context Info */}
      {context && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-900">
            📚 RAG Context: {context.documentsRetrieved} source documents retrieved and used to inform this campaign
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('brief')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'brief'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Campaign Brief
        </button>
        <button
          onClick={() => setActiveTab('variants')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'variants'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Variants
        </button>
        <button
          onClick={() => setActiveTab('recommendation')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'recommendation'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Recommendation
        </button>
      </div>

      {/* Campaign Brief Tab */}
      {activeTab === 'brief' && (
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Campaign Brief</h3>
          <div className="space-y-4">
            <div>
              <p className="text-gray-700 leading-relaxed">{campaignBrief.description}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Key Messages</h4>
              <ul className="space-y-2">
                {campaignBrief.keyMessages.map((message, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mt-1 mr-2">•</span>
                    <span className="text-gray-700">{message}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Call to Action</h4>
              <p className="text-gray-700 text-lg italic">"{campaignBrief.callToAction}"</p>
            </div>
          </div>
        </div>
      )}

      {/* Variants Tab */}
      {activeTab === 'variants' && (
        <div className="mb-6 space-y-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Campaign Variants</h3>
          {Object.entries(variants).map(([variantKey, variant]) => {
            const isRecommended = recommended.variant === variantKey;
            const isExpanded = expandedVariant === variantKey;

            return (
              <div
                key={variantKey}
                className={`border rounded-lg overflow-hidden transition-all ${
                  isRecommended ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
                }`}
              >
                {/* Variant Header */}
                <button
                  onClick={() => setExpandedVariant(isExpanded ? null : variantKey)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    {isRecommended && (
                      <span className="inline-block mr-3 text-2xl">⭐</span>
                    )}
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 capitalize">{variantKey}</h4>
                      <p className="text-sm text-gray-600">{variant.headline}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskBadgeColor(variant.riskLevel)}`}>
                      {variant.riskLevel} Risk
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        isExpanded ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </button>

                {/* Variant Details */}
                {isExpanded && (
                  <div className="px-6 py-4 bg-white border-t border-gray-200 space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Headline</h5>
                      <p className="text-gray-700 text-lg">{variant.headline}</p>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Copy</h5>
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{variant.copy}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Tone</p>
                        <p className="text-gray-900">{variant.tone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Best For</p>
                        <p className="text-gray-900">{variant.bestFor}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Recommendation Tab */}
      {activeTab === 'recommendation' && (
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">AI Recommendation</h3>
          <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50 mb-6">
            <div className="flex items-center mb-4">
              <span className="text-4xl mr-4">⭐</span>
              <div>
                <h4 className="text-2xl font-bold text-blue-900 capitalize">{recommended.variant}</h4>
                <p className={`text-sm font-medium ${recommended.confidence === 'High' ? 'text-green-700' : 'text-yellow-700'}`}>
                  Confidence: {recommended.confidence}
                </p>
              </div>
            </div>
            <p className="text-blue-900 leading-relaxed">{recommended.reasoning}</p>
          </div>

          {/* Additional Recommendations */}
          {additionalRecommendations && additionalRecommendations.length > 0 && (
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">Additional Recommendations</h4>
              <div className="space-y-3">
                {additionalRecommendations.map((rec, index) => (
                  <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                    <span className="text-blue-600 mr-3 font-bold text-lg flex-shrink-0">{index + 1}.</span>
                    <p className="text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Meta Information */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <details className="cursor-pointer">
          <summary className="font-semibold text-gray-900 hover:text-blue-600">
            📊 Technical Details
          </summary>
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            {metadata && (
              <>
                <p>Model: {metadata.model}</p>
                <p>Processing Time: {metadata.processingTime?.toFixed(2) || 'N/A'}s</p>
                <p>Context Documents Retrieved: {metadata.tokensUsed || context?.documentsRetrieved || 0}</p>
                {metadata.retrievedDocuments && (
                  <div className="mt-2">
                    <p className="font-semibold text-gray-900">Source Documents:</p>
                    <ul className="list-disc list-inside mt-1">
                      {metadata.retrievedDocuments.map((doc, idx) => (
                        <li key={idx}>
                          {doc.filename} (relevance: {(doc.relevance * 100).toFixed(0)}%)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </details>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => onExport?.('markdown')}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          📄 Export as Markdown
        </button>
        <button
          onClick={() => onExport?.('json')}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ⚙️ Export as JSON
        </button>
        <button
          onClick={() => onExport?.('csv')}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          📊 Export as CSV
        </button>
      </div>
    </div>
  );
};

export default CampaignResult;
