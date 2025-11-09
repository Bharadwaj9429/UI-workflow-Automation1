import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import TaskList from '../TaskList';
import * as httpServices from '../httpServices';

vi.mock('../httpServices');

describe('TaskList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <TaskList />
      </BrowserRouter>
    );
    expect(screen.getByText(/Task List/i)).toBeTruthy();
  });

  it('loads tasks on mount', async () => {
    httpServices.getTasks.mockImplementation((params, onSuccess, onError) => {
      onSuccess([{ id: 1, title: 'Test Task' }]);
    });

    render(
      <BrowserRouter>
        <TaskList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(httpServices.getTasks).toHaveBeenCalled();
    });

    expect(screen.getByText(/Test Task/i)).toBeTruthy();
  });

  it('handles API error', async () => {
    httpServices.getTasks.mockImplementation((params, onSuccess, onError) => {
      onError('API Error');
    });

    render(
      <BrowserRouter>
        <TaskList />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(httpServices.getTasks).toHaveBeenCalled();
    });
  });

  it('filters tasks based on search term', async () => {
    httpServices.getTasks.mockImplementation((params, onSuccess, onError) => {
      onSuccess([{ id: 1, title: 'Test Task' }]);
    });

    render(
      <BrowserRouter>
        <TaskList />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search tasks/i);
    fireEvent.change(searchInput, { target: { value: 'Test' } });
    fireEvent.keyDown(searchInput, { key: 'Enter' });

    await waitFor(() => {
      expect(httpServices.getTasks).toHaveBeenCalledWith({ searchTerm: 'Test' }, expect.any(Function), expect.any(Function));
    });
  });
});
