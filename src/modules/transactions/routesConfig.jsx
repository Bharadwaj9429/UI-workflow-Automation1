import React from 'react';
import TransactionExport from './TransactionExport';

const transactionRoutes = [
  {
    path: '/transactions/export',
    element: <TransactionExport />,
  },
  // Add other transaction-related routes here
];

export default transactionRoutes;
