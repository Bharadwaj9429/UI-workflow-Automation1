import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ExportTransactionsButton from '../ExportTransactionsButton';

describe('ExportTransactionsButton Component', () => {
  it('renders the button with default label', () => {
    render(
      <BrowserRouter>
        <ExportTransactionsButton />
      </BrowserRouter>
    );
    expect(screen.getByText(/Export Transactions/i)).toBeTruthy();
  });

  it('opens the modal on click', () => {
    render(
      <BrowserRouter>
        <ExportTransactionsButton />
      </BrowserRouter>
    );
    
    const button = screen.getByText(/Export Transactions/i);
    fireEvent.click(button);
    
    expect(screen.getByText(/Select Date Range/i)).toBeTruthy();
  });
});
