import React from 'react';
import ExchangeExportModal from './ExchangeExportModal';
import ExchangeDetails from './ExchangeDetails';
import ExportHistory from './ExportHistory';

export const ExchangesRoutes = [
  { path: '/exchanges/export', component: ExchangeExportModal },
  { path: '/exchanges/:id', component: ExchangeDetails },
  { path: '/export-history', component: ExportHistory }
];