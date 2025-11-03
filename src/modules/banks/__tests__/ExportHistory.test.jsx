import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ExportHistory from '../ExportHistory';

vi.mock('../httpServices', () => ({
  getExportHistory: vi.fn((params, onSuccess) => onSuccess({ exports: [] })),
  downloadExportedFile: vi.fn(),
}));

describe('ExportHistory Component', () => {
  it('renders the history page title', () => {
    render(
      <BrowserRouter>
        <ExportHistory />
      </BrowserRouter>
    );
    expect(screen.getByText(/Transaction Export History/i)).toBeTruthy();
  });
});
