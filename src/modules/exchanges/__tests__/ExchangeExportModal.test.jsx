import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ExchangeExportModal from '../ExchangeExportModal';
import * as httpServices from '../httpServices';

vi.mock('../httpServices');

describe('ExchangeExportModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockOnClose = vi.fn();
  const mockSelectedExchanges = [{ id: 1, name: 'Coinbase' }, { id: 2, name: 'Kraken' }];

  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ExchangeExportModal visible={true} onClose={mockOnClose} selectedExchanges={mockSelectedExchanges} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Export Configuration/i)).toBeTruthy();
  });

  it('handles successful API call', async () => {
    httpServices.exportExchanges.mockImplementation((params, onSuccess, onError) => {
      onSuccess({ message: 'Export initiated successfully' });
    });

    render(
      <BrowserRouter>
        <ExchangeExportModal visible={true} onClose={mockOnClose} selectedExchanges={mockSelectedExchanges} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/Ok/i));

    await waitFor(() => {
      expect(httpServices.exportExchanges).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('handles API error', async () => {
    httpServices.exportExchanges.mockImplementation((params, onSuccess, onError) => {
      onError('API Error');
    });

    render(
      <BrowserRouter>
        <ExchangeExportModal visible={true} onClose={mockOnClose} selectedExchanges={mockSelectedExchanges} />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/Ok/i));

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeTruthy();
    });
  });
});