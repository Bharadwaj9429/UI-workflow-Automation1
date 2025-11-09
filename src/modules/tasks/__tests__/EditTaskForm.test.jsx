import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BrowserRouter, useParams } from 'react-router-dom';
import EditTaskForm from '../EditTaskForm';
import * as httpServices from '../httpServices';

vi.mock('../httpServices');
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useParams: vi.fn(),
}));

describe('EditTaskForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useParams.mockReturnValue({ id: '1' });
  });

  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <EditTaskForm />
      </BrowserRouter>
    );
    expect(screen.getByText(/Loading.../i)).toBeTruthy();
  });

  it('loads task details on mount and populates the form', async () => {
    httpServices.getTask.mockImplementation((id, onSuccess, onError) => {
      onSuccess({ id: 1, title: 'Test Task', description: 'Test Description' });
    });

    render(
      <BrowserRouter>
        <EditTaskForm />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(httpServices.getTask).toHaveBeenCalledWith('1', expect.any(Function), expect.any(Function));
    });

    expect(screen.getByDisplayValue(/Test Task/i)).toBeTruthy();
    expect(screen.getByDisplayValue(/Test Description/i)).toBeTruthy();
  });

  it('updates a task on form submit', async () => {
    httpServices.getTask.mockImplementation((id, onSuccess, onError) => {
      onSuccess({ id: 1, title: 'Test Task', description: 'Test Description' });
    });
    httpServices.updateTask.mockImplementation((id, values, onSuccess, onError) => {
      onSuccess({ id: 1, ...values });
    });

    render(
      <BrowserRouter>
        <EditTaskForm />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(httpServices.getTask).toHaveBeenCalled();
    });

    const titleInput = screen.getByLabelText(/Title/i);
    fireEvent.change(titleInput, { target: { value: 'Updated Task' } });

    const submitButton = screen.getByText(/Update/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(httpServices.updateTask).toHaveBeenCalledWith('1', expect.anything(), expect.any(Function), expect.any(Function));
    });
  });

  it('handles API error on update task', async () => {
     httpServices.getTask.mockImplementation((id, onSuccess, onError) => {
      onSuccess({ id: 1, title: 'Test Task', description: 'Test Description' });
    });

    httpServices.updateTask.mockImplementation((id, values, onSuccess, onError) => {
      onError('API Error');
    });

    render(
      <BrowserRouter>
        <EditTaskForm />
      </BrowserRouter>
    );

     await waitFor(() => {
      expect(httpServices.getTask).toHaveBeenCalled();
    });

    const titleInput = screen.getByLabelText(/Title/i);
    fireEvent.change(titleInput, { target: { value: 'Updated Task' } });

    const submitButton = screen.getByText(/Update/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(httpServices.updateTask).toHaveBeenCalled();
    });
  });
});
