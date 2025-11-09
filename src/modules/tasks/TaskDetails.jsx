import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTask } from './httpServices';

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = () => {
    getTask(id,
      (data) => {
        setTask(data);
      },
      (error) => {
        console.error('Error loading task:', error);
      }
    );
  };

  if (!task) {
    return <div className="p-4 bg-[var(--bodyBg)] text-[var(--textWhite)]">Loading...</div>;
  }

  return (
    <div className="p-4 bg-[var(--bodyBg)] text-[var(--textWhite)]">
      <h1>Task Details</h1>
      <p>Title: {task.title}</p>
      <p>Description: {task.description}</p>
    </div>
  );
};

export default TaskDetails;
