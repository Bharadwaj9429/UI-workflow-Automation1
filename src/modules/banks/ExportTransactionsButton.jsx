import React, { useState } from 'react';
import { Button } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import TransactionExportModal from './TransactionExportModal';

/**
 * A button component that opens the Transaction Export Modal.
 * @param {object} props
 * @param {string[]} [props.preselectedBankIds=[]] - Array of bank IDs to pre-select in the modal.
 * @param {string} [props.label='Export Transactions'] - The text label for the button.
 * @param {boolean} [props.isQuickExport=false] - A flag to render a smaller button for details pages.
 */
const ExportTransactionsButton = ({ preselectedBankIds = [], label = 'Export Transactions', isQuickExport = false }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button
        type={isQuickExport ? 'default' : 'primary'}
        icon={<ExportOutlined />}
        onClick={showModal}
      >
        {isQuickExport ? 'Quick Export' : label}
      </Button>
      <TransactionExportModal
        visible={isModalVisible}
        onCancel={handleCancel}
        preselectedBankIds={preselectedBankIds}
      />
    </>
  );
};

export default ExportTransactionsButton;
