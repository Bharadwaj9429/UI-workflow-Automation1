import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import KycStatusBadge from '../KycStatusBadge';

const mockStore = configureStore([]);

describe('KycStatusBadge Component', () => {
  it('renders with Not Verified status and shows button', () => {
    const store = mockStore({
      kyc: { status: 'Not Verified', loading: false, error: null },
    });
    store.dispatch = vi.fn();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <KycStatusBadge />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Not Verified')).toBeTruthy();
    expect(screen.getByText('Start Verification')).toBeTruthy();
  });

  it('renders with Verified status and hides button', () => {
    const store = mockStore({
      kyc: { status: 'Verified', loading: false, error: null },
    });
    store.dispatch = vi.fn();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <KycStatusBadge />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Verified')).toBeTruthy();
    expect(screen.queryByText('Start Verification')).toBeNull();
  });
});
