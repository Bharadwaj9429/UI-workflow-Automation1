import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { additionalModuleRoutes } from './routeConfig';
import NotFound from './shared/components/NotFound';
import { TaskRoutes } from '../../modules/tasks/routesConfig';

const AppRoutes = () => {
  return (
    <Routes>
      {additionalModuleRoutes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={<route.component />}
        />
      ))}
      {TaskRoutes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={<route.component />}
        />
      ))}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
