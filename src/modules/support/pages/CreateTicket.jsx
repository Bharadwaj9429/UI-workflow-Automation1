import React, { useState } from 'react';
import { Form, Input, Select, Button, Upload, message, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import SupportService from '@/api/Service';

const { Option } = Select;
const { TextArea } = Input;

const CreateTicket = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      for (const key in values) {
        if (values[key] !== undefined && key !== 'attachment') {
          formData.append(key, values[key]);
        }
      }
      if (fileList.length > 0) {
        formData.append('attachment', fileList[0].originFileObj);
      }

      await SupportService.createTicket(formData);
      message.success('Ticket created successfully!');
      form.resetFields();
      setFileList([]);
      navigate('/support/tickets');
    } catch (error) {
      message.error('Failed to create ticket: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeUpload = () => {
    message.warning('Please use the upload button to attach your file.');
    return false; // Prevent Ant Design from uploading automatically
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-6">Create New Ticket</h1>
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            priority: 'medium',
            category: 'technical',
          }}
        >
          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: 'Please input the ticket subject!' }]}
          >
            <Input placeholder="Enter ticket subject" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input the ticket description!' }]}
          >
            <TextArea rows={4} placeholder="Describe your issue" />
          </Form.Item>

          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: 'Please select a priority!' }]}
          >
            <Select placeholder="Select priority">
              <Option value="low">Low</Option>
              <Option value="medium">Medium</Option>
              <Option value="high">High</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category!' }]}
          >
            <Select placeholder="Select category">
              <Option value="technical">Technical</Option>
              <Option value="billing">Billing</Option>
              <Option value="general">General</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="attachment"
            label="Attachment"
            valuePropName="fileList"
            getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
          >
            <Upload
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={handleUploadChange}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />} style={{ height: '40px' }}>Upload File</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
              style={{ backgroundColor: '#1890ff', height: '40px' }}
            >
              Create Ticket
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default CreateTicket;
