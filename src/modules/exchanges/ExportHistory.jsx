import React, { useState, useEffect } from 'react';
import { getExportHistory } from './httpServices';
import { Grid, Column } from '@progress/kendo-react-grid';

const ExportHistory = () => {
  const [exportHistory, setExportHistory] = useState([]);

  useEffect(() => {
    loadExportHistory();
  }, []);

  const loadExportHistory = () => {
    getExportHistory(
      {},
      (data) => {
        setExportHistory(data);
      },
      (error) => {
        console.error('Error loading export history:', error);
      }
    );
  };

  const handleDownload = (reportId) => {
    // Implement download logic here (e.g., trigger a file download)
    console.log(`Downloading report with ID: ${reportId}`);
  };

  return (
    <div className="p-4 bg-[var(--bodyBg)] text-[var(--textWhite)]">
      <h2 className="text-2xl font-bold mb-4">Export History</h2>
      <Grid data={exportHistory}>
        <Column field="timestamp" title="Timestamp" />
        <Column field="format" title="Format" />
        <Column field="parameters" title="Parameters" />
        <Column
          field="id"
          title="Download"
          cell={(props) => (
            <td>
              <button onClick={() => handleDownload(props.dataItem.id)}>Download</button>
            </td>
          )}
        />
      </Grid>
    </div>
  );
};

export default ExportHistory;