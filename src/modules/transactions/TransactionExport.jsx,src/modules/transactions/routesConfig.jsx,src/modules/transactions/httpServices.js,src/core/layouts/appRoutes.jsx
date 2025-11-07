import React, { useState, useEffect, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast, Toaster } from 'react-hot-toast';
import { FiDownload, FiFileText, FiGrid, FiBarChart2, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { getBankAccounts, getTransactionTypes, startExport, getExportStatus, getExportHistory, downloadExportFile } from './httpServices';

import 'react-datepicker/dist/react-datepicker.css';

// NOTE: This component assumes a CSS module is available for styling.
// Create a TransactionExport.css file and import it like this:
// import styles from './TransactionExport.css';

// --- Reusable Progress Indicator ---
const ProgressIndicator = ({ progress, status }) => (
    <div className="progress-indicator">
        <p>Status: <strong>{status}</strong></p>
        <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <p>{progress}% complete</p>
    </div>
);

// --- Export Options Modal Component ---
export const ExportOptionsModal = ({ isOpen, onClose, preselectedBankIds = [] }) => {
    const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
    const [endDate, setEndDate] = useState(new Date());
    const [format, setFormat] = useState('CSV');
    const [availableAccounts, setAvailableAccounts] = useState([]);
    const [selectedAccounts, setSelectedAccounts] = useState(new Set(preselectedBankIds));
    const [availableTypes, setAvailableTypes] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState(new Set());

    const [isExporting, setIsExporting] = useState(false);
    const [exportJobId, setExportJobId] = useState(null);
    const [exportProgress, setExportProgress] = useState(0);
    const [exportStatus, setExportStatus] = useState('Initializing');

    useEffect(() => {
        if (isOpen) {
            getBankAccounts().then(setAvailableAccounts);
            getTransactionTypes().then(setAvailableTypes);
            setSelectedAccounts(new Set(preselectedBankIds));
        }
    }, [isOpen, preselectedBankIds]);

    useEffect(() => {
        if (!exportJobId) return;

        const interval = setInterval(async () => {
            const statusData = await getExportStatus(exportJobId);
            setExportProgress(statusData.progress);
            setExportStatus(statusData.status);
            if (statusData.status === 'Completed' || statusData.status === 'Failed') {
                clearInterval(interval);
                if(statusData.status === 'Completed') {
                    toast.success('Export is ready for download!');
                } else {
                    toast.error('Export failed. Please try again.');
                }
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [exportJobId]);

    const handleAccountToggle = (accountId) => {
        setSelectedAccounts(prev => {
            const next = new Set(prev);
            if (next.has(accountId)) {
                next.delete(accountId);
            } else {
                next.add(accountId);
            }
            return next;
        });
    };

    const handleTypeToggle = (type) => {
        setSelectedTypes(prev => {
            const next = new Set(prev);
            if (next.has(type)) {
                next.delete(type);
            } else {
                next.add(type);
            }
            return next;
        });
    };

    const handleExport = async () => {
        if (selectedAccounts.size === 0) {
            toast.error('Please select at least one bank account.');
            return;
        }

        const params = {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            format,
            accountIds: Array.from(selectedAccounts),
            transactionTypes: Array.from(selectedTypes),
        };

        setIsExporting(true);
        setExportStatus('Starting...');
        setExportProgress(0);
        toast.loading('Starting export process...');

        try {
            const { jobId } = await startExport(params);
            setExportJobId(jobId);
            toast.dismiss();
            toast.success(`Export process started! Job ID: ${jobId}`);
        } catch (error) {
            toast.dismiss();
            toast.error('Failed to start export.');
            setIsExporting(false);
        }
    };
    
    const resetAndClose = () => {
        setIsExporting(false);
        setExportJobId(null);
        setExportProgress(0);
        setExportStatus('Initializing');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-button" onClick={resetAndClose}>&times;</button>
                <h2>Export Transactions</h2>

                {isExporting ? (
                    <div className="export-progress-view">
                        <h3>Export in Progress</h3>
                        <ProgressIndicator progress={exportProgress} status={exportStatus} />
                        {exportStatus === 'Completed' && <p>You will receive an email shortly. You can also download it from the Export History.</p>}
                        <button onClick={resetAndClose} className="button-primary">Close</button>
                    </div>
                ) : (
                    <div className="export-form-view">
                        <div className="form-group">
                            <label>Date Range</label>
                            <div className="date-range-picker">
                                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} selectsStart startDate={startDate} endDate={endDate} />
                                <span>to</span>
                                <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} selectsEnd startDate={startDate} endDate={endDate} minDate={startDate} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Export Format</label>
                            <div className="format-selector">
                                {['CSV', 'PDF', 'Excel'].map(f => (
                                    <label key={f} className={format === f ? 'active' : ''}>
                                        <input type="radio" name="format" value={f} checked={format === f} onChange={() => setFormat(f)} />
                                        {f}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Bank Accounts</label>
                            <div className="checkbox-group">
                                {availableAccounts.map(acc => (
                                    <label key={acc.id}>
                                        <input type="checkbox" checked={selectedAccounts.has(acc.id)} onChange={() => handleAccountToggle(acc.id)} />
                                        {acc.name} ({acc.last4})
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Transaction Types (optional)</label>
                            <div className="checkbox-group">
                                {availableTypes.map(type => (
                                    <label key={type.id}>
                                        <input type="checkbox" checked={selectedTypes.has(type.id)} onChange={() => handleTypeToggle(type.id)} />
                                        {type.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button onClick={handleExport} disabled={isExporting} className="button-primary">Start Export</button>
                    </div>
                )}
            </div>
            <Toaster position="top-right" />
        </div>
    );
};

// --- Export History Component ---
export const ExportHistory = () => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchHistory = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getExportHistory();
            setHistory(data);
        } catch (error) {
            toast.error('Could not fetch export history.');
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleDownload = async (fileUrl, format) => {
        toast.loading('Preparing download...');
        try {
            await downloadExportFile(fileUrl, `export-${new Date().toISOString()}.${format.toLowerCase()}`);
            toast.dismiss();
            toast.success('Download started!');
        } catch (error) {
            toast.dismiss();
            toast.error('Download failed.');
        }
    }

    const getStatusIcon = (status) => {
        switch(status) {
            case 'Completed': return <FiCheckCircle color="green" title="Completed" />;
            case 'Processing': return <FiClock color="orange" title="Processing" />;
            case 'Failed': return <FiXCircle color="red" title="Failed" />;
            default: return null;
        }
    }

    return (
        <div className="export-history-container">
            <div className="header">
                <h2>Export History</h2>
                <button onClick={fetchHistory} className="button-secondary">Refresh</button>
            </div>
            {isLoading ? <p>Loading history...</p> : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Format</th>
                                <th>Status</th>
                                <th>Parameters</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length === 0 ? (
                                <tr><td colSpan="5">No export history found.</td></tr>
                            ) : (
                                history.map(item => (
                                    <tr key={item.id}>
                                        <td>{new Date(item.createdAt).toLocaleString()}</td>
                                        <td>{item.params.format}</td>
                                        <td><div style=>{getStatusIcon(item.status)} {item.status}</div></td>
                                        <td>
                                            <small>
                                                {item.params.startDate} to {item.params.endDate}<br/>
                                                {item.params.accountIds.length} accounts, {item.params.transactionTypes.length} types
                                            </small>
                                        </td>
                                        <td>
                                            {item.status === 'Completed' && (
                                                <button onClick={() => handleDownload(item.fileUrl, item.params.format)} className="button-icon">
                                                    <FiDownload /> Download
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            <Toaster position="top-right" />
        </div>
    );
};


// --- Enhanced Bank Details View Component ---
export const BankDetailsEnhancement = ({ bankId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Mock data for charts and recent transactions. Replace with API calls.
    const chartData = [
        { name: 'Groceries', amount: 400 },
        { name: 'Utilities', amount: 300 },
        { name: 'Transport', amount: 200 },
        { name: 'Dining', amount: 280 },
        { name: 'Shopping', amount: 500 },
    ];

    const recentTransactions = [
        { id: 1, date: '2023-10-26', description: 'SuperMart', amount: -75.50 },
        { id: 2, date: '2023-10-25', description: 'Salary Deposit', amount: 2500.00 },
        { id: 3, date: '2023-10-25', description: 'Gas Station', amount: -45.00 },
    ];

    return (
        <div className="bank-details-enhancement">
            <ExportOptionsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} preselectedBankIds={[bankId]} />
            
            <div className="section">
                <div className="header">
                    <h3>Transaction Summary</h3>
                    <button className="button-secondary" onClick={() => setIsModalOpen(true)}><FiDownload /> Quick Export</button>
                </div>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="amount" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="section">
                <div className="header">
                    <h3>Recent Transactions</h3>
                    <button className="button-link" onClick={() => setIsModalOpen(true)}>Export All</button>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr><th>Date</th><th>Description</th><th>Amount</th></tr>
                        </thead>
                        <tbody>
                            {recentTransactions.map(tx => (
                                <tr key={tx.id}>
                                    <td>{tx.date}</td>
                                    <td>{tx.description}</td>
                                    <td style=>{tx.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Toaster position="top-right" />
        </div>
    );
};