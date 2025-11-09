import { appClientMethods } from '~/core/http.client';
import { deriveErrorMessage } from '~/core/http.service';

export const getTasks = (params, onSuccess, onError) => {
  appClientMethods.get('/api/tasks', { params })
    .then(res => onSuccess(res.data))
    .catch(err => onError(deriveErrorMessage(err)));
};

export const createTask = (params, onSuccess, onError) => {
  appClientMethods.post('/api/tasks', params)
    .then(res => onSuccess(res.data))
    .catch(err => onError(deriveErrorMessage(err)));
};

export const getTask = (id, onSuccess, onError) => {
  appClientMethods.get(`/api/tasks/${id}`)
    .then(res => onSuccess(res.data))
    .catch(err => onError(deriveErrorMessage(err)));
};

export const updateTask = (id, params, onSuccess, onError) => {
  appClientMethods.put(`/api/tasks/${id}`, params)
    .then(res => onSuccess(res.data))
    .catch(err => onError(deriveErrorMessage(err)));
};

export const deleteTask = (id, onSuccess, onError) => {
  appClientMethods.delete(`/api/tasks/${id}`)
    .then(res => onSuccess(res.data))
    .catch(err => onError(deriveErrorMessage(err)));
};

export const getProjects = (onSuccess, onError) => {
  appClientMethods.get('/api/projects')
    .then(res => onSuccess(res.data))
    .catch(err => onError(deriveErrorMessage(err)));
};

export const addTaskComment = (id, params, onSuccess, onError) => {
  appClientMethods.post(`/api/tasks/${id}/comments`, params)
    .then(res => onSuccess(res.data))
    .catch(err => onError(deriveErrorMessage(err)));
};

export const uploadFile = (file, onSuccess, onError) => {
  appClientMethods.post('/api/upload', file)
    .then(res => onSuccess(res.data))
    .catch(err => onError(deriveErrorMessage(err)));
};
