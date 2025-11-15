import { appClientMethods, deriveErrorMessage } from '~/core/http.client';

export const getKycStatus = (onSuccess, onError) => {
  appClientMethods.get('/kyc/status')
    .then(res => onSuccess(res.data))
    .catch(err => onError(deriveErrorMessage(err)));
};

export const getKycDetails = (onSuccess, onError) => {
  appClientMethods.get('/kyc/details')
    .then(res => onSuccess(res.data))
    .catch(err => onError(deriveErrorMessage(err)));
};

export const submitKycData = (formData, onSuccess, onError) => {
  appClientMethods.post('/kyc/submit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(res => onSuccess(res.data))
    .catch(err => onError(deriveErrorMessage(err)));
};
