import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import TransactionExportModal from '../TransactionExportModal';

// Mocking httpServices to prevent actual API calls in tests
vi.mock('../httpServices', () => ({
  getBankAccountsForExport: vi.fn(),
  getTransactionTypesForExport: vi.fn(),
  requestTransactionExport: vi.fn(),
}));

describe('TransactionExportModal Component', () => {
  it('renders the modal title when visible', () => {
    render(
      <BrowserRouter>
        <TransactionExportModal visible={true} onCancel={() => {}} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Export Transactions/i)).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const { container } = render(
      <BrowserRouter>
        <TransactionExportModal visible={false} onCancel={() => {}} />
      </BrowserRouter>
    );
    expect(container.querySelector('.ant-modal-root')).toBe(null);
  });
});
