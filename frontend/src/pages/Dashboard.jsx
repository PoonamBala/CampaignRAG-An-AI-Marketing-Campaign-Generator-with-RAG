import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-blue-600">CampaignRAG</h1>
              <div className="hidden md:flex gap-6">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => navigate('/campaigns')}
                  className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
                >
                  Campaign Generator
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">Welcome, {user?.name}!</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 active:bg-red-800 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to CampaignRAG</h2>
          <p className="text-xl text-gray-600 mb-8">
            AI-Powered Marketing Campaign Generator with Retrieval-Augmented Generation
          </p>
          <button
            onClick={() => navigate('/campaigns')}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-lg transition-colors inline-block"
          >
            Get Started → Generate Your First Campaign
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Campaign Generator */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/campaigns')}>
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Campaign Generator</h3>
            <p className="text-gray-600 mb-4">
              Create AI-powered marketing campaigns tailored to your audience and objectives. Get 3 variants to choose from.
            </p>
            <button className="text-blue-600 font-semibold hover:text-blue-800">
              Launch Generator →
            </button>
          </div>

          {/* Card 2: RAG Context */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">RAG Context</h3>
            <p className="text-gray-600 mb-4">
              Upload your brand documents, past campaigns, and performance data. The AI uses this context to generate relevant, personalized campaigns.
            </p>
            <span className="text-gray-500 text-sm">Upload documents in campaign settings</span>
          </div>

          {/* Card 3: Campaign History */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/campaigns')}>
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Campaign History</h3>
            <p className="text-gray-600 mb-4">
              Track and manage all your generated campaigns. View performance metrics and refine campaigns based on feedback.
            </p>
            <button className="text-blue-600 font-semibold hover:text-blue-800">
              View Campaigns →
            </button>
          </div>

          {/* Card 4: 3 Variants */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">3 Campaign Variants</h3>
            <p className="text-gray-600 mb-4">
              Every campaign includes Safe, Aggressive, and Creative variants with different risk profiles and messaging approaches.
            </p>
            <span className="text-gray-500 text-sm">AI recommends the best variant for you</span>
          </div>

          {/* Card 5: Export Options */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📥</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Export Formats</h3>
            <p className="text-gray-600 mb-4">
              Export campaigns as JSON, Markdown, or CSV for easy integration with your marketing tools and workflows.
            </p>
            <span className="text-gray-500 text-sm">Perfect for sharing and collaboration</span>
          </div>

          {/* Card 6: Smart Recommendations */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Smart Recommendations</h3>
            <p className="text-gray-600 mb-4">
              AI analyzes your context and recommends the best campaign variant with detailed reasoning based on your audience data.
            </p>
            <span className="text-gray-500 text-sm">Data-driven decision making</span>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-lg p-12 mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-blue-600">
                1
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Upload Context</h4>
              <p className="text-gray-600 text-sm">
                Upload your brand documents, past campaigns, and audience insights
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-blue-600">
                2
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Fill Form</h4>
              <p className="text-gray-600 text-sm">
                Provide campaign objective, channel, audience, product, and tone
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-blue-600">
                3
              </div>
              <h4 className="font-bold text-gray-900 mb-2">AI Generates</h4>
              <p className="text-gray-600 text-sm">
                AI uses RAG to retrieve context and generate 3 campaign variants
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-blue-600">
                4
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Review & Export</h4>
              <p className="text-gray-600 text-sm">
                Review recommendations and export in your preferred format
              </p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-12 text-white">
          <h3 className="text-3xl font-bold mb-8 text-center">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">🧠</div>
              <div>
                <h4 className="font-bold mb-2">RAG-Powered Generation</h4>
                <p className="text-blue-100">
                  Retrieves relevant context from your documents before generating campaigns
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">🎨</div>
              <div>
                <h4 className="font-bold mb-2">3 Campaign Variants</h4>
                <p className="text-blue-100">
                  Safe, Aggressive, and Creative approaches for different risk profiles
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">📚</div>
              <div>
                <h4 className="font-bold mb-2">Context-Aware</h4>
                <p className="text-blue-100">
                  Uses brand guidelines, past campaigns, and performance data
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">⭐</div>
              <div>
                <h4 className="font-bold mb-2">AI Recommendations</h4>
                <p className="text-blue-100">
                  Get intelligent recommendations based on your context and audience
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
