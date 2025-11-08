import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import InvoiceCreate from '../InvoiceCreate';
import * as httpServices from '../httpServices';
import { message } from 'antd';

vi.mock('../httpServices');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
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

describe('InvoiceCreate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockImplementation(() => vi.fn());
    message.success.mockImplementation(() => {});
    message.error.mockImplementation(() => {});
  });

  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <InvoiceCreate />
      </BrowserRouter>
    );
    expect(screen.getByText(/Create Invoice/i)).toBeTruthy();
  });

  it('creates an invoice on form submission', async () => {
    const navigate = useNavigate();
    httpServices.createInvoice.mockImplementation((data, onSuccess, onError) => {
      onSuccess({ id: 1, ...data });
    });
    httpServices.uploadInvoiceAttachment.mockImplementation((id, file, onSuccess, onError) => {
      onSuccess();
    });

    render(
      <BrowserRouter>
        <InvoiceCreate />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Invoice Number/i), { target: { value: 'INV-001' } });
    fireEvent.change(screen.getByLabelText(/Client Name/i), { target: { value: 'Client A' } });
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '100' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(httpServices.createInvoice).toHaveBeenCalledWith(
        expect.objectContaining({
          invoiceNumber: 'INV-001',
          clientName: 'Client A',
          amount: '100',
        }),
        expect.any(Function),
        expect.any(Function)
      );
      expect(message.success).toHaveBeenCalledWith('Invoice created successfully');
      expect(navigate).toHaveBeenCalledWith('/invoices');
    });
  });

  it('handles create invoice API error', async () => {
    httpServices.createInvoice.mockImplementation((data, onSuccess, onError) => {
      onError('API Error');
    });

    render(
      <BrowserRouter>
        <InvoiceCreate />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Invoice Number/i), { target: { value: 'INV-001' } });
    fireEvent.change(screen.getByLabelText(/Client Name/i), { target: { value: 'Client A' } });
    fireEvent.change(screen.getByLabelText(/Amount/i), { target: { value: '100' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(httpServices.createInvoice).toHaveBeenCalled();
      expect(message.error).toHaveBeenCalledWith('Invoice creation failed: API Error');
    });
  });
});