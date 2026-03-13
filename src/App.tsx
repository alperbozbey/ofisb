/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import Customers from './pages/Customers';
import Transactions from './pages/Transactions';
import Cash from './pages/Cash';
import Reports from './pages/Reports';
import QuickSale from './pages/QuickSale';
import Products from './pages/Products';
import TechnicalService from './pages/TechnicalService';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'invoices':
        return <Invoices />;
      case 'customers':
        return <Customers />;
      case 'transactions':
        return <Transactions />;
      case 'cash':
        return <Cash />;
      case 'reports':
        return <Reports />;
      case 'quicksale':
        return <QuickSale />;
      case 'products':
        return <Products />;
      case 'technicalservice':
        return <TechnicalService />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <h2 className="text-2xl font-semibold mb-2">Çok Yakında</h2>
            <p>Bu sayfa henüz yapım aşamasındadır.</p>
          </div>
        );
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}
