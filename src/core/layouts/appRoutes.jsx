import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Import module routes
import { DashboardRoutes } from '../../modules/dashboard/routesConfig';
import { SampleRoutes } from '../../modules/sample/routesConfig';
import { InvoiceRoutes } from '../../modules/invoices/routesConfig';

const AppRoutes = () => {
  // Add new module routes here
  const additionalModuleRoutes = [
    ...DashboardRoutes,
    ...SampleRoutes,
    ...InvoiceRoutes,
  ];

  return (
    <Routes>
      {/* Core routes - no change needed here */}
      {/* Example: <Route path="/login" element={<Login />} /> */}

      {/* Dynamically rendered module routes */}
      {additionalModuleRoutes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={<route.component />}
        />
      ))}
    </Routes>
  );
};

export default AppRoutes;