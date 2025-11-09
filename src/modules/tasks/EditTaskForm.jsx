import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import { getTask, updateTask } from './httpServices';

const { Option } = Select;

const EditTaskForm = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [task, setTask] = useState(null);

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = () => {
    getTask(id,
      (data) => {
        setTask(data);
        form.setFieldsValue(data);
      },
      (error) => {
        console.error('Error loading task:', error);
      }
    );
  };

  const onFinish = (values) => {
    updateTask(id, values,
      (data) => {
        console.log('Task updated:', data);
      },
      (error) => {
        console.error('Error updating task:', error);
      }
    );
  };

  if (!task) {
    return <div className="p-4 bg-[var(--bodyBg)] text-[var(--textWhite)]">Loading...</div>;
  }

  return (
    <div className="p-4 bg-[var(--bodyBg)] text-[var(--textWhite)]">
      <h1>Edit Task</h1>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please enter title' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Assignee" name="assignee">
          <Input />
        </Form.Item>
        <Form.Item label="Status" name="status">
          <Select>
            <Option value="To Do">To Do</Option>
            <Option value="In Progress">In Progress</Option>
            <Option value="Review">Review</Option>
            <Option value="Completed">Completed</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Priority" name="priority">
          <Select>
            <Option value="High">High</Option>
            <Option value="Medium">Medium</Option>
            <Option value="Low">Low</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Due Date" name="dueDate">
          <DatePicker />
        </Form.Item>
        <Button type="primary" htmlType="submit">Update</Button>
      </Form>
    </div>
  );
};

export default EditTaskForm;
