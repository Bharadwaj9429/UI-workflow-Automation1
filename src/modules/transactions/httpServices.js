import dayjs from 'dayjs';

// MOCK DATABASE
let mockExportHistory = [
    {
        id: 'export_1',
        createdAt: dayjs().subtract(1, 'day').toISOString(),
        status: 'Completed',
        params: {
            startDate: dayjs().subtract(31, 'day').toISOString(),
            endDate: dayjs().subtract(1, 'day').toISOString(),
            format: 'CSV',
            transactionTypes: ['Deposit', 'Withdrawal'],
            accountIds: ['acc_1']
        },
        fileUrl: '/mock-data/export_1.csv'
    },
    {
        id: 'export_2',
        createdAt: dayjs().subtract(2, 'hour').toISOString(),
        status: 'Processing',
        params: {
            startDate: dayjs().subtract(7, 'day').toISOString(),
            endDate: dayjs().toISOString(),
            format: 'PDF',
            transactionTypes: ['Deposit', 'Withdrawal', 'Transfer', 'Payment', 'Interest'],
            accountIds: ['acc_1', 'acc_2']
        },
        fileUrl: null
    }
];

// Simulate API delay
const apiDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetches the history of all transaction exports.
 */
export const getExportHistory = async () => {
    console.log('Fetching export history...');
    await apiDelay(500);
    // Sort by most recent
    return [...mockExportHistory].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

/**
 * Initiates a new transaction export job.
 * @param {object} options - The export options.
 */
export const requestTransactionExport = async (options) => {
    console.log('Requesting new export with options:', options);
    await apiDelay(1500); // Simulate network and initial processing

    const newExportJob = {
        id: `export_${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'Processing',
        params: options,
        fileUrl: null
    };

    mockExportHistory.push(newExportJob);

    // Simulate the background processing of the export
    setTimeout(() => {
        const job = mockExportHistory.find(j => j.id === newExportJob.id);
        if (job) {
            job.status = 'Completed';
            job.fileUrl = `/mock-data/${job.id}.${options.format.toLowerCase()}`;
            console.log(`Export ${job.id} completed.`);
            // Here you would typically send an email notification
        }
    }, 10000); // 10 seconds to process

    return newExportJob;
};

/**
 * Simulates downloading an exported file.
 * @param {string} fileId - The ID of the export to download.
 * @param {string} format - The file format (e.g., 'CSV', 'PDF').
 */
export const downloadExportFile = async (fileId, format) => {
    console.log(`Downloading file ${fileId}.${format.toLowerCase()}...`);
    await apiDelay(300);

    const fileContent = `Mock file content for ${fileId}\nDate,Amount,Description\n2023-10-26,100.00,Deposit`;
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileId}.${format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return { success: true };
};