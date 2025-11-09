import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import TaskDashboard from '../TaskDashboard';


describe('TaskDashboard', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <TaskDashboard />
      </BrowserRouter>
    );
    expect(screen.getByText(/Task Dashboard/i)).toBeTruthy();
  });
});
