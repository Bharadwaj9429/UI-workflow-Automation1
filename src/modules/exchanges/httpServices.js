import { appClientMethods } from '~/core/http.client';
import { deriveErrorMessage } from '~/core/http.service';

export const exportExchanges = (params, onSuccess, onError) => {
  appClientMethods.post('/exchanges/export', params)
    .then(res => onSuccess(res.data))
    .catch(err => onError(deriveErrorMessage(err)));
};

export const getExportHistory = (params, onSuccess, onError) => {
    appClientMethods.get('/export-history', { params })
      .then(res => onSuccess(res.data))
      .catch(err => onError(deriveErrorMessage(err)));
};

export const uploadInvoiceAttachment = (id, file, onSuccess, onError) => {
  const formData = new FormData();
  formData.append('file', file);

  appClientMethods.put(`/invoices/${id}/attachment`, formData, {
      headers: {
          'Content-Type': 'multipart/form-data'
      }
  })
  .then(res => onSuccess(res.data))
  .catch(err => onError(deriveErrorMessage(err)));
};
