import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BrowserRouter, useParams, useNavigate } from 'react-router-dom';
import InvoiceDetails from '../InvoiceDetails';
import * as httpServices from '../httpServices';
import { message } from 'antd';

vi.mock('../httpServices');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
  };
});
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn()
    }
  };
});

describe('InvoiceDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useParams.mockReturnValue({ id: '1' });
    useNavigate.mockImplementation(() => vi.fn());
    message.success.mockImplementation(() => {});
    message.error.mockImplementation(() => {});
  });

  it('renders without crashing', () => {
    httpServices.getInvoice.mockImplementation((id, onSuccess, onError) => {
        onSuccess({ id: '1', invoiceNumber: 'INV-001', clientName: 'Client A', amount: 100, dueDate: '2024-01-01' });
    });

    render(
      <BrowserRouter>
        <InvoiceDetails />
      </BrowserRouter>
    );
    expect(screen.getByText(/Invoice Details/i)).toBeTruthy();
  });

  it('loads invoice details on mount', async () => {
    httpServices.getInvoice.mockImplementation((id, onSuccess, onError) => {
      onSuccess({ id: '1', invoiceNumber: 'INV-001', clientName: 'Client A', amount: 100, dueDate: '2024-01-01' });
    });

    render(
      <BrowserRouter>
        <InvoiceDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(httpServices.getInvoice).toHaveBeenCalledWith('1', expect.any(Function), expect.any(Function));
      expect(screen.getByDisplayValue(/INV-001/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/Client A/i)).toBeInTheDocument();
    });
  });

  it('updates invoice details on form submission', async () => {
    const navigate = useNavigate();
    httpServices.getInvoice.mockImplementation((id, onSuccess, onError) => {
        onSuccess({ id: '1', invoiceNumber: 'INV-001', clientName: 'Client A', amount: 100, dueDate: '2024-01-01' });
    });
    httpServices.updateInvoice.mockImplementation((id, data, onSuccess, onError) => {
      onSuccess({ id: '1', ...data });
    });

    render(
      <BrowserRouter>
        <InvoiceDetails />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Invoice Number/i), { target: { value: 'INV-002' } });
    fireEvent.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() => {
      expect(httpServices.updateInvoice).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          invoiceNumber: 'INV-002',
        }),
        expect.any(Function),
        expect.any(Function)
      );
      expect(message.success).toHaveBeenCalledWith('Invoice updated successfully');
      expect(navigate).toHaveBeenCalledWith('/invoices');
    });
  });

  it('handles update invoice API error', async () => {
    httpServices.getInvoice.mockImplementation((id, onSuccess, onError) => {
      onSuccess({ id: '1', invoiceNumber: 'INV-001', clientName: 'Client A', amount: 100, dueDate: '2024-01-01' });
    });
    httpServices.updateInvoice.mockImplementation((id, data, onSuccess, onError) => {
      onError('API Error');
    });

    render(
      <BrowserRouter>
        <InvoiceDetails />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Invoice Number/i), { target: { value: 'INV-002' } });
    fireEvent.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() => {
      expect(httpServices.updateInvoice).toHaveBeenCalled();
      expect(message.error).toHaveBeenCalledWith('Invoice update failed: API Error');
    });
  });
});