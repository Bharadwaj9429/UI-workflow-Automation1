import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import KycVerificationFlow from '../KycVerificationFlow';

const mockStore = configureStore([]);

describe('KycVerificationFlow Component', () => {
  it('renders the first step on initial load', () => {
    const store = mockStore({ kyc: { status: 'Not Verified', loading: false, error: null } });
    store.dispatch = vi.fn();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <KycVerificationFlow />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Personal Details')).toBeTruthy();
    expect(screen.getByText(/Full Legal First Name/i)).toBeTruthy();
  });
});
