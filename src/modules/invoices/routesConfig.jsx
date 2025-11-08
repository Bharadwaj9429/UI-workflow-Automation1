import React from 'react';
import InvoiceList from './InvoiceList';
import InvoiceCreate from './InvoiceCreate';
import InvoiceDetails from './InvoiceDetails';

export const InvoiceRoutes = [
  {
    path: '/invoices',
    component: InvoiceList,
  },
  {
    path: '/invoices/create',
    component: InvoiceCreate,
  },
  {
    path: '/invoices/:id',
    component: InvoiceDetails,
  },
];