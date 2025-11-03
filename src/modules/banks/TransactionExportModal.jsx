import React, { useState, useEffect } from 'react';
import { Modal, Form, DatePicker, Select, Button, Spin, notification } from 'antd';
import { requestTransactionExport, getBankAccountsForExport, getTransactionTypesForExport } from './httpServices';

const { RangePicker } = DatePicker;
const { Option } = Select;

const EXPORT_FORMATS = ['CSV', 'PDF', 'Excel'];

const TransactionExportModal = ({ visible, onCancel, preselectedBankIds = [] }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [transactionTypes, setTransactionTypes] = useState([]);

  useEffect(() => {
    if (visible) {
      // Fetch data for selectors when modal becomes visible
      getBankAccountsForExport(
        (data) => setBankAccounts(data.accounts || []),
        (error) => notification.error({ message: 'Error fetching banks', description: error })
      );
      getTransactionTypesForExport(
        (data) => setTransactionTypes(data.types || []),
        (error) => notification.error({ message: 'Error fetching transaction types', description: error })
      );
      // Set pre-selected bank accounts if provided
      form.setFieldsValue({ bankAccountIds: preselectedBankIds });
    }
  }, [visible, preselectedBankIds, form]);

  const handleExport = (values) => {
    setLoading(true);
    const params = {
      ...values,
      fromDate: values.dateRange[0].toISOString(),
      toDate: values.dateRange[1].toISOString(),
    };
    delete params.dateRange;

    requestTransactionExport(params, 
      (response) => {
        setLoading(false);
        notification.success({
          message: 'Export Started',
          description: 'Your transaction export is being processed. You will be notified by email when it is ready.',
        });
        form.resetFields();
        onCancel();
      },
      (error) => {
        setLoading(false);
        notification.error({ message: 'Export Failed', description: error });
      }
    );
  };

  return (
    <Modal
      title="Export Transactions"
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      width={600}
    >
      <Spin spinning={loading} tip="Processing Export Request...">
        <Form form={form} layout="vertical" onFinish={handleExport} className="mt-6">
          <Form.Item name="dateRange" label="Select Date Range" rules={[{ required: true, message: 'Please select a date range!' }]}>
            <RangePicker className="w-full" />
          </Form.Item>

          <Form.Item name="format" label="Choose Export Format" rules={[{ required: true, message: 'Please select an export format!' }]}>
            <Select placeholder="Select format">
              {EXPORT_FORMATS.map(format => <Option key={format} value={format.toLowerCase()}>{format}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item name="transactionTypeIds" label="Select Transaction Types (optional)">
            <Select mode="multiple" allowClear placeholder="All transaction types">
              {transactionTypes.map(type => <Option key={type.id} value={type.id}>{type.name}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item name="bankAccountIds" label="Select Bank Accounts" rules={[{ required: true, message: 'Please select at least one bank account!' }]}>
            <Select mode="multiple" allowClear placeholder="Select bank accounts to include">
              {bankAccounts.map(account => <Option key={account.id} value={account.id}>{account.name} - {account.accountNumber}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item className="text-right">
            <Button onClick={onCancel} className="mr-2">Cancel</Button>
            <Button type="primary" htmlType="submit">Request Export</Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default TransactionExportModal;
