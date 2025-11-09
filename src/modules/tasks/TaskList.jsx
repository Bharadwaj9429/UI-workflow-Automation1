import React, { useState, useEffect } from 'react';
import { Grid, Column } from '@progress/kendo-react-grid';
import { Input } from 'antd';
import { getTasks } from './httpServices';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    getTasks({ searchTerm: searchTerm },
      (data) => {
        setTasks(data);
      },
      (error) => {
        console.error('Error loading tasks:', error);
      }
    );
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  useEffect(() => {
    loadTasks();
  }, [searchTerm]);

  return (
    <div className="p-4 bg-[var(--bodyBg)] text-[var(--textWhite)]">
      <h1>Task List</h1>
      <Input.Search placeholder="Search tasks" onSearch={handleSearch} enterButton />
      <Grid data={tasks}>
        <Column field="title" title="Title" />
        <Column field="assignee" title="Assignee" />
        <Column field="status" title="Status" />
        <Column field="priority" title="Priority" />
        <Column field="dueDate" title="Due Date" />
        <Column field="project" title="Project" />
      </Grid>
    </div>
  );
};

export default TaskList;
