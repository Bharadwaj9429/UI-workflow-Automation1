import { appClientMethods, deriveErrorMessage } from '~/core/http.client';

/**
 * Requests the generation of a transaction export file.
 * @param {object} params - The export parameters (dateRange, format, transactionTypes, bankAccountIds).
 * @param {function} onSuccess - Callback for a successful request.
 * @param {function} onError - Callback for a failed request.
 */
export const requestTransactionExport = (params, onSuccess, onError) => {
  appClientMethods.post('/banks/transactions/export', params)
    .then(res => onSuccess(res.data))
    .catch(err => onError(deriveErrorMessage(err)));
};

/**
 * Fetches the history of previously generated exports.
 * @param {object} params - Pagination and filter parameters.
 * @param {function} onSuccess - Callback for a successful request.
 * @param {function} onError - Callback for a failed request.
 */
export const getExportHistory = (params, onSuccess, onError) => {
  appClientMethods.get('/banks/transactions/export-history', { params })
    .then(res => onSuccess(res.data))
    .catch(err => onError(deriveErrorMessage(err)));
};

/**
 * Fetches a list of bank accounts for the export modal selector.
 * @param {function} onSuccess - Callback for a successful request.
 * @param {function} onError - Callback for a failed request.
 */
export const getBankAccountsForExport = (onSuccess, onError) => {
  appClientMethods.get('/banks/accounts/list')
    .then(res => onSuccess(res.data))
    .catch(err => onError(deriveErrorMessage(err)));
};

/**
 * Fetches a list of transaction types for the export modal selector.
 * @param {function} onSuccess - Callback for a successful request.
 * @param {function} onError - Callback for a failed request.
 */
export const getTransactionTypesForExport = (onSuccess, onError) => {
  appClientMethods.get('/transactions/types')
    .then(res => onSuccess(res.data))
    .catch(err => onError(deriveErrorMessage(err)));
};

/**
 * Downloads a previously exported file.
 * @param {string} fileId - The ID of the file to download.
 * @param {function} onSuccess - Callback for a successful request.
 * @param {function} onError - Callback for a failed request.
 */
export const downloadExportedFile = (fileId, onSuccess, onError) => {
  appClientMethods.get(`/banks/transactions/export-history/${fileId}/download`, { responseType: 'blob' })
    .then(res => onSuccess(res))
    .catch(err => onError(deriveErrorMessage(err)));
};
