import React from 'react';
import { Card, Skeleton } from 'antd';

const TransactionSummaryCharts = ({ bankId }) => {
  // In a real implementation, this component would fetch data for the given bankId
  // and render charts using a library like Recharts or Chart.js.
  // For now, it's a placeholder.

  return (
    <Card title="Transaction Summary">
      <p className="text-center p-8 text-gray-500">
        Transaction summary charts will be displayed here.
      </p>
      <Skeleton active />
    </Card>
  );
};

export default TransactionSummaryCharts;
