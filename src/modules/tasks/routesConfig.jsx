import React from 'react';
import TaskDashboard from './TaskDashboard';
import TaskList from './TaskList';
import TaskDetails from './TaskDetails';
import CreateTaskForm from './CreateTaskForm';
import EditTaskForm from './EditTaskForm';

export const TaskRoutes = [
  { path: '/tasks', component: TaskList },
  { path: '/tasks/dashboard', component: TaskDashboard },
  { path: '/tasks/create', component: CreateTaskForm },
  { path: '/tasks/:id', component: TaskDetails },
  { path: '/tasks/:id/edit', component: EditTaskForm },
];
