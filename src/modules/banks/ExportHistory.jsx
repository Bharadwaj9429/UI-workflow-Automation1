import React, { useState, useEffect, useCallback } from 'react';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { process } from '@progress/kendo-data-query';
import { Button, Tag, notification } from 'antd';
import { DownloadOutlined, RedoOutlined } from '@ant-design/icons';
import { getExportHistory, downloadExportedFile } from './httpServices';
import fileSaver from 'file-saver';

const ExportHistory = () => {
  const [history, setHistory] = useState([]);
  const [dataState, setDataState] = useState({ skip: 0, take: 10 });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    setLoading(true);
    getExportHistory({}, 
      (data) => {
        setHistory(data.exports || []);
        setLoading(false);
      },
      (error) => {
        notification.error({ message: 'Failed to fetch export history', description: error });
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDownload = (fileId, fileName) => {
    notification.info({ message: 'Download Started', description: `Your file ${fileName} is being prepared.` });
    downloadExportedFile(fileId, 
      (response) => {
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        fileSaver.saveAs(blob, fileName);
      },
      (error) => {
        notification.error({ message: 'Download Failed', description: error });
      }
    );
  };

  const dataResult = process(history, dataState);

  const StatusCell = (props) => {
    const status = props.dataItem.status;
    let color;
    switch (status.toLowerCase()) {
      case 'completed': color = 'green'; break;
      case 'processing': color = 'blue'; break;
      case 'failed': color = 'red'; break;
      default: color = 'default';
    }
    return <td><Tag color={color}>{status.toUpperCase()}</Tag></td>;
  };

  const ActionsCell = (props) => {
    const { id, status, fileName } = props.dataItem;
    return (
      <td>
        {status.toLowerCase() === 'completed' && (
          <Button
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(id, fileName)}
            size="small"
          >
            Download
          </Button>
        )}
      </td>
    );
  };

  return (
    <div className="p-4 bg-[var(--bodyBg)] text-[var(--textWhite)]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Transaction Export History</h1>
        <Button icon={<RedoOutlined />} onClick={fetchData} loading={loading}>Refresh</Button>
      </div>
      <Grid
        style={{ height: 'calc(100vh - 200px)' }}
        data={dataResult}
        {...dataState}
        onDataStateChange={(e) => setDataState(e.dataState)}
        sortable
        pageable
        filterable
      >
        <Column field="createdAt" title="Date Requested" format="{0:yyyy-MM-dd HH:mm}" width="200px" />
        <Column field="format" title="Format" width="100px" />
        <Column field="status" title="Status" width="120px" cell={StatusCell} />
        <Column field="parameters.dateRange" title="Date Range" />
        <Column field="parameters.requestedBy" title="Requested By" />
        <Column title="Actions" width="150px" cell={ActionsCell} />
      </Grid>
    </div>
  );
};

export default ExportHistory;
