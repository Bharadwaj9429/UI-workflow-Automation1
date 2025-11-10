import React, { useState } from 'react';
import { Modal, Form, DatePicker, Select, Checkbox, Button } from 'antd';
import { exportExchanges } from './httpServices';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ExchangeExportModal = ({ visible, onClose, selectedExchanges }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = () => {
    form.validateFields().then(values => {
      setLoading(true);
      const params = {
        ...values,
        exchangeIds: values.exchanges || selectedExchanges,
        dateRange: values.dateRange ? [values.dateRange[0].format('YYYY-MM-DD'), values.dateRange[1].format('YYYY-MM-DD')] : null,
      };

      exportExchanges(
        params,
        (data) => {
          setLoading(false);
          onClose();
          console.log('Export initiated:', data);
          // Optionally trigger a download or display a success message
        },
        (error) => {
          setLoading(false);
          console.error('Export failed:', error);
          // Display an error message to the user
        }
      );
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleCancel = () => {
    onClose();
  };

  const dataTypes = [
    { label: 'Trades', value: 'trades' },
    { label: 'Open Orders', value: 'openOrders' },
    { label: 'Order History', value: 'orderHistory' },
    { label: 'Deposits', value: 'deposits' },
    { label: 'Withdrawals', value: 'withdrawals' },
    { label: 'Fees', value: 'fees' },
    { label: 'Wallet Balances', value: 'walletBalances' },
  ];

  return (
    <Modal
      title="Export Configuration"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="dateRange" label="Select Date Range">
          <RangePicker />
        </Form.Item>
        <Form.Item name="format" label="Choose Export Format" initialValue="csv">
          <Select>
            <Option value="csv">CSV (Recommended for Tax)</Option>
            <Option value="xlsx">Excel (XLSX) (Recommended for Tax)</Option>
            <Option value="pdf">PDF</Option>
          </Select>
        </Form.Item>
        <Form.Item name="dataTypes" label="Select Data Types">
          <Checkbox.Group options={dataTypes} />
        </Form.Item>
        <Form.Item name="exchanges" label="Select Exchanges">
          <Checkbox.Group options={selectedExchanges?.map(ex => ({ label: ex.name, value: ex.id }))} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExchangeExportModal;