import { appClientMethods } from '~/core/http.client';
import { deriveErrorMessage } from '~/core/http.service';

export const getInvoices = (params, onSuccess, onError) => {
  appClientMethods.get('/invoices', { params })
    .then(res => onSuccess(res.data))
    .catch(err => onError(deriveErrorMessage(err)));
};

export const getInvoice = (id, onSuccess, onError) => {
  appClientMethods.get(`/invoices/${id}`)
    .then(res => onSuccess(res.data))
    .catch(err => onError(deriveErrorMessage(err)));
};

export const createInvoice = (data, onSuccess, onError) => {
  appClientMethods.post('/invoices', data)
    .then(res => onSuccess(res.data))
    .catch(err => onError(deriveErrorMessage(err)));
};

export const updateInvoice = (id, data, onSuccess, onError) => {
  appClientMethods.put(`/invoices/${id}`, data)
    .then(res => onSuccess(res.data))
    .catch(err => onError(deriveErrorMessage(err)));
};

export const deleteInvoice = (id, onSuccess, onError) => {
  appClientMethods.delete(`/invoices/${id}`)
    .then(res => onSuccess(res.data))
    .catch(err => onError(deriveErrorMessage(err)));
};

export const uploadInvoiceAttachment = (id, file, onSuccess, onError) => {
  const formData = new FormData();
  formData.append('attachment', file);
  appClientMethods.put(`/invoices/${id}/attachment`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(res => onSuccess(res.data))
    .catch(err => onError(deriveErrorMessage(err)));
};
