import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'antd';
import ExchangeExportModal from './ExchangeExportModal';
import { Grid, Column } from '@progress/kendo-react-grid';

const ExchangeDetails = () => {
  const { id } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [recentTrades, setRecentTrades] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  // Placeholder for data fetching - replace with actual API calls
  useEffect(() => {
    // Fetch recent trades and orders for the exchange with the given ID
    // Example:
    const fetchRecentData = async () => {
        setRecentTrades([
            { id: 1, symbol: 'BTC/USD', type: 'Buy', amount: 0.01, price: 60000 },
            { id: 2, symbol: 'ETH/USD', type: 'Sell', amount: 0.1, price: 3000 }
        ]);

        setRecentOrders([
            { id: 1, symbol: 'BTC/USD', type: 'Buy', amount: 0.005, price: 55000, status: 'Open' },
            { id: 2, symbol: 'ETH/USD', type: 'Sell', amount: 0.05, price: 3200, status: 'Filled' }
        ]);
    };

    fetchRecentData();
  }, [id]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleExportRecentTrades = () => {
    // Implement export logic for recent trades data (e.g., CSV download)
    console.log('Exporting recent trades...');
  };

  return (
    <div className="p-4 bg-[var(--bodyBg)] text-[var(--textWhite)]">
      <h2 className="text-2xl font-bold mb-4">Exchange Details - ID: {id}</h2>

      <Button type="primary" onClick={showModal} className="mb-4">Quick Export</Button>

      <ExchangeExportModal visible={isModalVisible} onClose={handleCancel} selectedExchanges={[{ id: id, name: `Exchange ${id}` }]} />

      {/* Placeholder for portfolio summary charts */}
      <div className="mb-4">
        <h3>Portfolio Summary</h3>
        {/* Add your charting library component here */}
        <p>Asset allocation pie chart will be displayed here.</p>
      </div>

      {/* Recent Trades */}
      <div className="mb-4">
        <h3>Recent Trades</h3>
        <Grid data={recentTrades}>
          <Column field="symbol" title="Symbol" />
          <Column field="type" title="Type" />
          <Column field="amount" title="Amount" />
          <Column field="price" title="Price" />
        </Grid>
        <Button onClick={handleExportRecentTrades}>Export Recent Trades</Button>
      </div>

      {/* Recent Orders */}
      <div>
        <h3>Recent Orders</h3>
        <Grid data={recentOrders}>
          <Column field="symbol" title="Symbol" />
          <Column field="type" title="Type" />
          <Column field="amount" title="Amount" />
          <Column field="price" title="Price" />
          <Column field="status" title="Status" />
        </Grid>
      </div>
    </div>
  );
};

export default ExchangeDetails;