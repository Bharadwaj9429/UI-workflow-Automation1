import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, DatePicker, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { createInvoice, uploadInvoiceAttachment } from './httpServices';

const InvoiceCreate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [invoiceId, setInvoiceId] = useState(null);

  const onFinish = (values) => {
    createInvoice(values,
      (data) => {
        message.success('Invoice created successfully');
        setInvoiceId(data.id);
        if (fileList.length > 0) {
          const file = fileList[0].originFileObj;
          uploadInvoiceAttachment(data.id, file,
            () => message.success('Attachment uploaded successfully'),
            (err) => message.error(`Attachment upload failed: ${err}`)
          );
        }
        navigate('/invoices');
      },
      (error) => {
        message.error(`Invoice creation failed: ${error}`);
      }
    );
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const uploadProps = {
    onRemove: (file) => {
      setFileList((state) => {
        const index = state.indexOf(file);
        const newFileList = state.slice();
        newFileList.splice(index, 1);
        return newFileList;
      });
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };

  return (
    <div className="p-4 bg-[var(--bodyBg)] text-[var(--textWhite)]">
      <h2 className="text-2xl font-bold mb-4">Create Invoice</h2>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Invoice Number"
          name="invoiceNumber"
          rules={[{ required: true, message: 'Please input invoice number!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Client Name"
          name="clientName"
          rules={[{ required: true, message: 'Please input client name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: 'Please input amount!' }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          label="Due Date"
          name="dueDate"
          rules={[{ required: true, message: 'Please input due date!' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Attachment"
        >
          <Upload {...uploadProps} >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default InvoiceCreate;