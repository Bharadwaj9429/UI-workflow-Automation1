import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { createTask, getProjects, uploadFile } from './httpServices';

const { Option } = Select;

const CreateTaskForm = () => {
  const [form] = Form.useForm();
  const [projects, setProjects] = useState([]);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    getProjects(
      (data) => {
        setProjects(data);
      },
      (error) => {
        console.error('Error loading projects:', error);
      }
    );
  };

  const onFinish = (values) => {
    createTask(values,
      (data) => {
        console.log('Task created:', data);
        form.resetFields();
        setFileList([]);
      },
      (error) => {
        console.error('Error creating task:', error);
      }
    );
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    uploadFile(formData,
      () => {
        console.log('File uploaded successfully');
      },
      (error) => {
        console.error('File upload failed:', error);
      });
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    beforeUpload: (file) => {
      handleUpload(file);
      return false;
    },
    onChange: handleUploadChange,
    fileList: fileList,
  };

  return (
    <div className="p-4 bg-[var(--bodyBg)] text-[var(--textWhite)]">
      <h1>Create Task</h1>
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
        <Form.Item label="Project" name="project">
          <Select>
            {projects.map(project => (
              <Option key={project.id} value={project.id}>{project.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Attachment" name="attachment" valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload.Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
          </Upload.Dragger>
        </Form.Item>
        <Button type="primary" htmlType="submit">Create</Button>
      </Form>
    </div>
  );
};

export default CreateTaskForm;
