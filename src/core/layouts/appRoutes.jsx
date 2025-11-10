import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { publicRoutes } from './publicRoutes';
import { privateRoutes } from './privateRoutes';

// Import module routes
import { ExchangesRoutes } from '~/modules/exchanges/routesConfig';

const AppRoutes = () => {
  // Add module routes here
  const additionalModuleRoutes = [
    ...ExchangesRoutes,
  ];

  return (
    <Routes>
      {publicRoutes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={<route.component />}
        />
      ))}

      {privateRoutes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={<route.component />}
        />
      ))}

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