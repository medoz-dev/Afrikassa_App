
import React from 'react';
import { AppProvider } from '@/context/AppContext';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import { Route, Routes } from 'react-router-dom';
import Stock from '@/pages/Stock';
import Ventes from '@/pages/Ventes';
import Caisse from '@/pages/Caisse';
import Rapports from '@/pages/Rapports';

const Index: React.FC = () => {
  return (
    <AppProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/ventes" element={<Ventes />} />
          <Route path="/caisse" element={<Caisse />} />
          <Route path="/rapports" element={<Rapports />} />
        </Routes>
      </Layout>
    </AppProvider>
  );
};

export default Index;
