import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BrowserRouter, useParams } from 'react-router-dom';
import ExchangeDetails from '../ExchangeDetails';

// Mock useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

describe('ExchangeDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useParams.mockReturnValue({ id: '123' });
  });

  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <ExchangeDetails />
      </BrowserRouter>
    );
    expect(screen.getByText(/Exchange Details - ID: 123/i)).toBeTruthy();
  });

  it('opens the export modal when the Quick Export button is clicked', () => {
    render(
      <BrowserRouter>
        <ExchangeDetails />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/Quick Export/i));

    // Check if the modal title is rendered (a basic check to see if modal is open)
    expect(screen.getByText(/Export Configuration/i)).toBeInTheDocument();
  });

  // Add more tests for other functionalities like exporting recent trades
});