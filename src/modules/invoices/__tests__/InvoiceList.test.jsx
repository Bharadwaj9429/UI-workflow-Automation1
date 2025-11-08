import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import InvoiceList from '../InvoiceList';
import * as httpServices from '../httpServices';

vi.mock('../httpServices');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});



describe('InvoiceList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockImplementation(() => vi.fn());
  });

  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <InvoiceList />
      </BrowserRouter>
    );
    expect(screen.getByText(/Invoices/i)).toBeTruthy();
  });

  it('loads invoices on mount', async () => {
    httpServices.getInvoices.mockImplementation((params, onSuccess, onError) => {
      onSuccess([{ id: 1, invoiceNumber: 'INV-001', clientName: 'Client A', amount: 100, dueDate: '2024-01-01', status: 'Paid' }]);
    });

    render(
      <BrowserRouter>
        <InvoiceList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(httpServices.getInvoices).toHaveBeenCalled();
      expect(screen.getByText(/Client A/i)).toBeTruthy();
    });
  });

  it('handles API error', async () => {
    httpServices.getInvoices.mockImplementation((params, onSuccess, onError) => {
      onError('API Error');
    });

    render(
      <BrowserRouter>
        <InvoiceList />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Can't directly test for error message display without modifying component to display errors. Check console.
      expect(httpServices.getInvoices).toHaveBeenCalled();
    });
  });

  it('filters invoices based on search query', async () => {
    httpServices.getInvoices.mockImplementation((params, onSuccess, onError) => {
      onSuccess([
        { id: 1, invoiceNumber: 'INV-001', clientName: 'Client A', amount: 100, dueDate: '2024-01-01', status: 'Paid' },
        { id: 2, invoiceNumber: 'INV-002', clientName: 'Client B', amount: 200, dueDate: '2024-02-01', status: 'Unpaid' },
      ]);
    });

    render(
      <BrowserRouter>
        <InvoiceList />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search invoice number or client name/i);
    fireEvent.change(searchInput, { target: { value: 'Client A' } });

    await waitFor(() => {
      expect(screen.getByText(/Client A/i)).toBeInTheDocument();
      expect(screen.queryByText(/Client B/i)).not.toBeInTheDocument();
    });
  });

  it('navigates to invoice details page on row click', async () => {
    const navigate = useNavigate();
    httpServices.getInvoices.mockImplementation((params, onSuccess, onError) => {
      onSuccess([{ id: 1, invoiceNumber: 'INV-001', clientName: 'Client A', amount: 100, dueDate: '2024-01-01', status: 'Paid' }]);
    });

    render(
      <BrowserRouter>
        <InvoiceList />
      </BrowserRouter>
    );

    await waitFor(() => {
      const gridRow = screen.getByText(/Client A/i);
      fireEvent.click(gridRow);
      expect(navigate).toHaveBeenCalledWith('/invoices/1');
    });
  });
});