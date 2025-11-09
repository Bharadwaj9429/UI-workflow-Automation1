import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BrowserRouter, useParams } from 'react-router-dom';
import TaskDetails from '../TaskDetails';
import * as httpServices from '../httpServices';

vi.mock('../httpServices');
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useParams: vi.fn(),
}));

describe('TaskDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useParams.mockReturnValue({ id: '1' });
  });

  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <TaskDetails />
      </BrowserRouter>
    );
    expect(screen.getByText(/Loading.../i)).toBeTruthy();
  });

  it('loads task details on mount', async () => {
    httpServices.getTask.mockImplementation((id, onSuccess, onError) => {
      onSuccess({ id: 1, title: 'Test Task', description: 'Test Description' });
    });

    render(
      <BrowserRouter>
        <TaskDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(httpServices.getTask).toHaveBeenCalledWith('1', expect.any(Function), expect.any(Function));
    });

    expect(screen.getByText(/Title: Test Task/i)).toBeTruthy();
    expect(screen.getByText(/Description: Test Description/i)).toBeTruthy();
  });

  it('handles API error', async () => {
    httpServices.getTask.mockImplementation((id, onSuccess, onError) => {
      onError('API Error');
    });

    render(
      <BrowserRouter>
        <TaskDetails />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(httpServices.getTask).toHaveBeenCalled();
    });
  });
});
