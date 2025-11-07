import React, { useState, useEffect, useCallback } from 'react';
import { 
    Box, Button, Typography, Modal, TextField, FormControl, InputLabel, Select, MenuItem, OutlinedInput, 
    ListItemText, Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    CircularProgress, Chip, IconButton, Alert, Snackbar 
} from '@mui/material';
import { Download as DownloadIcon, FileUpload as ExportIcon } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import dayjs from 'dayjs';
import { getExportHistory, requestTransactionExport, downloadExportFile } from './httpServices';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const MOCK_TRANSACTION_TYPES = ['Deposit', 'Withdrawal', 'Transfer', 'Payment', 'Interest'];
const MOCK_BANK_ACCOUNTS = [
    { id: 'acc_1', name: 'Checking - 1234' },
    { id: 'acc_2', name: 'Savings - 5678' },
    { id: 'acc_3', name: 'Business - 9012' },
];

const ExportOptionsModal = ({ open, handleClose, preselectedBankId }) => {
    const [dateRange, setDateRange] = useState([null, null]);
    const [format, setFormat] = useState('CSV');
    const [transactionTypes, setTransactionTypes] = useState([]);
    const [accounts, setAccounts] = useState(preselectedBankId ? [preselectedBankId] : []);
    const [isExporting, setIsExporting] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

    useEffect(() => {
        if (preselectedBankId) {
            setAccounts([preselectedBankId]);
        }
    }, [preselectedBankId]);

    const handleExport = async () => {
        if (!dateRange[0] || !dateRange[1] || accounts.length === 0) {
            setNotification({ open: true, message: 'Please select a date range and at least one account.', severity: 'error' });
            return;
        }
        setIsExporting(true);
        try {
            const options = {
                startDate: dateRange[0].toISOString(),
                endDate: dateRange[1].toISOString(),
                format,
                transactionTypes: transactionTypes.length > 0 ? transactionTypes : MOCK_TRANSACTION_TYPES,
                accountIds: accounts,
            };
            await requestTransactionExport(options);
            setNotification({ open: true, message: 'Export started! You will be notified when it is ready.', severity: 'success' });
            handleClose(true); // pass true to indicate a refresh is needed
        } catch (error) {
            setNotification({ open: true, message: 'Failed to start export.', severity: 'error' });
        } finally {
            setIsExporting(false);
        }
    };

    const handleNotificationClose = () => {
        setNotification({ ...notification, open: false });
    };

    return (
        <>
            <Modal open={open} onClose={() => handleClose(false)} aria-labelledby="export-options-title">
                <Box sx={modalStyle}>
                    <Typography id="export-options-title" variant="h6" component="h2">Export Transactions</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateRangePicker
                            value={dateRange}
                            onChange={(newValue) => setDateRange(newValue)}
                            renderInput={(startProps, endProps) => (
                                <>
                                    <TextField {...startProps} />
                                    <Box sx={{ mx: 2 }}> to </Box>
                                    <TextField {...endProps} />
                                </>
                            )}
                        />
                    </LocalizationProvider>
                    <FormControl fullWidth>
                        <InputLabel id="format-select-label">Format</InputLabel>
                        <Select
                            labelId="format-select-label"
                            value={format}
                            label="Format"
                            onChange={(e) => setFormat(e.target.value)}
                        >
                            <MenuItem value="CSV">CSV</MenuItem>
                            <MenuItem value="PDF">PDF</MenuItem>
                            <MenuItem value="Excel">Excel (XLSX)</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="accounts-select-label">Bank Accounts</InputLabel>
                        <Select
                            labelId="accounts-select-label"
                            multiple
                            value={accounts}
                            onChange={(e) => setAccounts(e.target.value)}
                            input={<OutlinedInput label="Bank Accounts" />}
                            renderValue={(selected) => selected.map(id => MOCK_BANK_ACCOUNTS.find(acc => acc.id === id)?.name).join(', ')}
                        >
                            {MOCK_BANK_ACCOUNTS.map((account) => (
                                <MenuItem key={account.id} value={account.id}>
                                    <Checkbox checked={accounts.indexOf(account.id) > -1} />
                                    <ListItemText primary={account.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="transaction-types-label">Transaction Types (Optional)</InputLabel>
                        <Select
                            labelId="transaction-types-label"
                            multiple
                            value={transactionTypes}
                            onChange={(e) => setTransactionTypes(e.target.value)}
                            input={<OutlinedInput label="Transaction Types (Optional)" />}
                            renderValue={(selected) => selected.join(', ')}
                        >
                            {MOCK_TRANSACTION_TYPES.map((type) => (
                                <MenuItem key={type} value={type}>
                                    <Checkbox checked={transactionTypes.indexOf(type) > -1} />
                                    <ListItemText primary={type} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                        <Button onClick={() => handleClose(false)} variant="outlined">Cancel</Button>
                        <Button onClick={handleExport} variant="contained" disabled={isExporting}>
                            {isExporting ? <CircularProgress size={24} /> : 'Generate Export'}
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleNotificationClose}>
                <Alert onClose={handleNotificationClose} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </>
    );
};

const ExportHistory = ({ history, onDownload, loading }) => {
    const getStatusChip = (status) => {
        switch (status) {
            case 'Completed': return <Chip label={status} color="success" />;
            case 'Processing': return <Chip label={status} color="info" />;
            case 'Failed': return <Chip label={status} color="error" />;
            default: return <Chip label={status} />;
        }
    };

    return (
        <Paper sx={{ p: 2, mt: 4 }}>
            <Typography variant="h6" gutterBottom>Export History</Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Format</TableCell>
                            <TableCell>Date Range</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={5} align="center"><CircularProgress /></TableCell></TableRow>
                        ) : history.length === 0 ? (
                            <TableRow><TableCell colSpan={5} align="center">No export history found.</TableCell></TableRow>
                        ) : (
                            history.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{dayjs(item.createdAt).format('YYYY-MM-DD HH:mm')}</TableCell>
                                    <TableCell>{item.params.format}</TableCell>
                                    <TableCell>{`${dayjs(item.params.startDate).format('YYYY-MM-DD')} - ${dayjs(item.params.endDate).format('YYYY-MM-DD')}`}</TableCell>
                                    <TableCell>{getStatusChip(item.status)}</TableCell>
                                    <TableCell>
                                        {item.status === 'Completed' && (
                                            <IconButton onClick={() => onDownload(item)}>
                                                <DownloadIcon />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default function TransactionExport() {
    const [modalOpen, setModalOpen] = useState(false);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    const fetchHistory = useCallback(async () => {
        setLoadingHistory(true);
        try {
            const data = await getExportHistory();
            setHistory(data);
        } catch (error) {
            console.error("Failed to fetch export history", error);
        } finally {
            setLoadingHistory(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleModalClose = (refresh) => {
        setModalOpen(false);
        if (refresh) {
            // Add a small delay to allow backend processing to start
            setTimeout(fetchHistory, 1000);
        }
    };

    const handleDownload = async (item) => {
        try {
            await downloadExportFile(item.id, item.params.format);
        } catch (error) {
            console.error('Download failed', error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">Transaction Exports</Typography>
                <Button
                    variant="contained"
                    startIcon={<ExportIcon />}
                    onClick={() => setModalOpen(true)}
                >
                    Export Transactions
                </Button>
            </Box>

            <ExportHistory history={history} onDownload={handleDownload} loading={loadingHistory} />

            <ExportOptionsModal open={modalOpen} handleClose={handleModalClose} />
        </Box>
    );
}