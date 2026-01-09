import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import { AppProvider } from './context/AppContext';

import CustomerPayments from './pages/CustomerPayments';
import MarketExpenses from './pages/MarketExpenses';
import Pigmi from './pages/Pigmi';
import Employees from './pages/Employees';
import Reports from './pages/Reports';

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="payments" element={<CustomerPayments />} />
          <Route path="market" element={<MarketExpenses />} />
          <Route path="pigmi" element={<Pigmi />} />
          <Route path="employees" element={<Employees />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </AppProvider>
  );
}
