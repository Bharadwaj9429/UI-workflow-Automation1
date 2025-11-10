import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ExportHistory from '../ExportHistory';
import * as httpServices from '../httpServices';

vi.mock('../httpServices');

describe('ExportHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ExportHistory />
      </BrowserRouter>
    );
    expect(screen.getByText(/Export History/i)).toBeTruthy();
  });

  it('loads and displays export history', async () => {
    const mockExportHistoryData = [
      { id: 1, timestamp: '2024-01-01', format: 'CSV', parameters: 'Trades' },
      { id: 2, timestamp: '2024-01-02', format: 'PDF', parameters: 'Deposits' },
    ];

    httpServices.getExportHistory.mockImplementation((params, onSuccess, onError) => {
      onSuccess(mockExportHistoryData);
    });

    render(
      <BrowserRouter>
        <ExportHistory />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(httpServices.getExportHistory).toHaveBeenCalled();
    });

    await waitFor(() => {
        expect(screen.getByText(/2024-01-01/i)).toBeInTheDocument();
        expect(screen.getByText(/2024-01-02/i)).toBeInTheDocument();
    });
  });

  it('handles API error', async () => {
    httpServices.getExportHistory.mockImplementation((params, onSuccess, onError) => {
      onError('API Error');
    });

    render(
      <BrowserRouter>
        <ExportHistory />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeTruthy();
    });
  });
});