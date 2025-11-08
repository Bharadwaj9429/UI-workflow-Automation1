import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, DatePicker, message } from 'antd';
import { getInvoice, updateInvoice } from './httpServices';

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    loadInvoice();
  }, [id]);

  const loadInvoice = () => {
    getInvoice(id,
      (data) => {
        setInvoice(data);
        form.setFieldsValue(data);
      },
      (error) => {
        message.error(`Failed to load invoice: ${error}`);
      }
    );
  };

  const onFinish = (values) => {
    updateInvoice(id, values,
      (data) => {
        message.success('Invoice updated successfully');
        navigate('/invoices');
      },
      (error) => {
        message.error(`Invoice update failed: ${error}`);
      }
    );
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  if (!invoice) {
    return <div className="p-4 bg-[var(--bodyBg)] text-[var(--textWhite)]">Loading...</div>;
  }

  return (
    <div className="p-4 bg-[var(--bodyBg)] text-[var(--textWhite)]">
      <h2 className="text-2xl font-bold mb-4">Invoice Details</h2>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={invoice}
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

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default InvoiceDetails;