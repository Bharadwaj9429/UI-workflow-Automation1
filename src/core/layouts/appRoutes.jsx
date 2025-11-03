import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Assuming other module route configs are imported here
import PaymentsRoutesConfig from '../../modules/payments/routesConfig';
import BanksRoutesConfig from '../../modules/banks/routesConfig'; // <-- ADD THIS IMPORT

const AppLayout = React.lazy(() => import('./AppLayout'));

const AppRoutes = () => {
  // Assuming existing routes are defined here
  const existingAppRoutes = []; 
  
  const additionalModuleRoutes = [
    ...PaymentsRoutesConfig,
    ...BanksRoutesConfig, // <-- ADD THIS LINE
  ];

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" />} />
        {existingAppRoutes}
        {additionalModuleRoutes}
      </Route>
      {/* Add other top-level routes like Login, 404 etc. here */}
    </Routes>
  );
};

export default AppRoutes;
