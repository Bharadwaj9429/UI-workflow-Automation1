import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import CreateTaskForm from '../CreateTaskForm';
import * as httpServices from '../httpServices';

vi.mock('../httpServices');

describe('CreateTaskForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <CreateTaskForm />
      </BrowserRouter>
    );
    expect(screen.getByText(/Create Task/i)).toBeTruthy();
  });

  it('loads projects on mount', async () => {
    httpServices.getProjects.mockImplementation((onSuccess, onError) => {
      onSuccess([{ id: 1, name: 'Test Project' }]);
    });

    render(
      <BrowserRouter>
        <CreateTaskForm />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(httpServices.getProjects).toHaveBeenCalled();
    });
  });

  it('creates a task on form submit', async () => {
    httpServices.createTask.mockImplementation((values, onSuccess, onError) => {
      onSuccess({ id: 1, ...values });
    });

    httpServices.getProjects.mockImplementation((onSuccess, onError) => {
      onSuccess([]);
    });

    render(
      <BrowserRouter>
        <CreateTaskForm />
      </BrowserRouter>
    );

    const titleInput = screen.getByLabelText(/Title/i);
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });

    const submitButton = screen.getByText(/Create/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(httpServices.createTask).toHaveBeenCalled();
    });
  });

  it('handles API error on create task', async () => {
    httpServices.createTask.mockImplementation((values, onSuccess, onError) => {
      onError('API Error');
    });

     httpServices.getProjects.mockImplementation((onSuccess, onError) => {
      onSuccess([]);
    });

    render(
      <BrowserRouter>
        <CreateTaskForm />
      </BrowserRouter>
    );

    const titleInput = screen.getByLabelText(/Title/i);
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });

    const submitButton = screen.getByText(/Create/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(httpServices.createTask).toHaveBeenCalled();
    });
  });
});
