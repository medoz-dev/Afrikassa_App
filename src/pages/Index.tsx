
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { AppProvider } from '@/context/AppContext';
import Layout from '@/components/layout/Layout';
import Landing from './Landing';
import Login from './Login';
import Dashboard from './Dashboard';
import Stock from './Stock';
import Caisse from './Caisse';
import Ventes from './Ventes';
import Rapports from './Rapports';
import Admin from './Admin';
import CreatorPanel from './CreatorPanel';
import ClientsList from './ClientsList';
import Pricing from './Pricing';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const CreatorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isCreator } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (!isCreator) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/stock" 
        element={
          <PrivateRoute>
            <Layout>
              <Stock />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/caisse" 
        element={
          <PrivateRoute>
            <Layout>
              <Caisse />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/ventes" 
        element={
          <PrivateRoute>
            <Layout>
              <Ventes />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/rapports" 
        element={
          <PrivateRoute>
            <Layout>
              <Rapports />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <PrivateRoute>
            <Layout>
              <Admin />
            </Layout>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/creator-panel" 
        element={
          <CreatorRoute>
            <Layout>
              <CreatorPanel />
            </Layout>
          </CreatorRoute>
        } 
      />
      <Route 
        path="/clients-list" 
        element={
          <CreatorRoute>
            <Layout>
              <ClientsList />
            </Layout>
          </CreatorRoute>
        } 
      />
    </Routes>
  );
};

const Index: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
};

export default Index;
