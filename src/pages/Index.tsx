
import React from 'react';
import { AppProvider } from '@/context/AppContext';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Landing from '@/pages/Landing';
import Pricing from '@/pages/Pricing';
import Login from '@/pages/Login';
import CreatorPanel from '@/pages/CreatorPanel';
import { Route, Routes } from 'react-router-dom';
import Stock from '@/pages/Stock';
import Ventes from '@/pages/Ventes';
import Caisse from '@/pages/Caisse';
import Rapports from '@/pages/Rapports';
import Admin from '@/pages/Admin';

const Index: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={
        <AppProvider>
          <Layout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/creator-panel" element={<CreatorPanel />} />
              <Route path="/stock" element={<Stock />} />
              <Route path="/ventes" element={<Ventes />} />
              <Route path="/caisse" element={<Caisse />} />
              <Route path="/rapports" element={<Rapports />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Layout>
        </AppProvider>
      } />
    </Routes>
  );
};

export default Index;
