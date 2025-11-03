import React from 'react';
import { Route } from 'react-router-dom';
import ExportHistory from './ExportHistory';

// Assuming other bank routes for List and Details already exist.
// This config adds the new route for export history.

const BanksRoutesConfig = [
  <Route key="export-history" path="banks/export-history" element={<ExportHistory />} />
];

export default BanksRoutesConfig;
