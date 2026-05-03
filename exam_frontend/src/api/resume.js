import client from './client';

export const getResume = () =>
  client.get('/api/resume/');

export const updateResume = (data) =>
  client.put('/api/resume/', data);

export const downloadResume = () =>
  client.get('/api/resume/download/', { responseType: 'blob' });
