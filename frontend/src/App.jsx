import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import CampaignDashboard from './pages/CampaignDashboard';
import { PrivateRoute } from './components/PrivateRoute';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/campaigns"
            element={
              <PrivateRoute>
                <CampaignDashboard />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/campaigns" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
