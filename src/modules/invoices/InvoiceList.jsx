import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Column } from '@progress/kendo-react-grid';
import { Input } from 'antd';
import { getInvoices } from './httpServices';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = () => {
    getInvoices({},
      (data) => {
        setInvoices(data);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRowClick = (e) => {
    navigate(`/invoices/${e.dataItem.id}`);
  };

  return (
    <div className="p-4 bg-[var(--bodyBg)] text-[var(--textWhite)]">
      <h2 className="text-2xl font-bold mb-4">Invoices</h2>
      <Input
        placeholder="Search invoice number or client name"
        onChange={handleSearch}
        className="mb-4"
      />
      <button onClick={() => navigate('/invoices/create')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">Create Invoice</button>
      <Grid data={filteredInvoices} onRowClick={handleRowClick}>
        <Column field="invoiceNumber" title="Invoice Number" />
        <Column field="clientName" title="Client Name" />
        <Column field="amount" title="Amount" />
        <Column field="dueDate" title="Due Date" />
        <Column field="status" title="Status" />
      </Grid>
    </div>
  );
};

export default InvoiceList;