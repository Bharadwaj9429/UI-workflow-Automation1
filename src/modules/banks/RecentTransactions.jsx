import React from 'react';
import { Card, List, Skeleton, Button } from 'antd';
import { ExportOutlined } from '@ant-design/icons';

const RecentTransactions = ({ bankId }) => {
  // In a real implementation, this would fetch recent transactions for the bankId.
  // Using mock data for demonstration.
  const mockTransactions = [
    { id: 'txn_1', description: 'Online Purchase', amount: -59.99, date: '2023-10-27' },
    { id: 'txn_2', description: 'Salary Deposit', amount: 2500.00, date: '2023-10-26' },
    { id: 'txn_3', description: 'ATM Withdrawal', amount: -100.00, date: '2023-10-25' },
  ];

  const loading = false; // Set to true while fetching data

  return (
    <Card 
      title="Recent Transactions" 
      extra={<Button icon={<ExportOutlined />}>Export Recent</Button>}
    >
      <List
        itemLayout="horizontal"
        dataSource={mockTransactions}
        renderItem={(item) => (
          <List.Item>
            <Skeleton avatar title={false} loading={loading} active>
              <List.Item.Meta
                title={<a href={`/transactions/${item.id}`}>{item.description}</a>}
                description={item.date}
              />
              <div className={item.amount > 0 ? 'text-green-500' : 'text-red-500'}>
                {item.amount.toFixed(2)}
              </div>
            </Skeleton>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RecentTransactions;
