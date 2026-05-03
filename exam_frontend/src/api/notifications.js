import client from './client';

export const getNotifications = () =>
  client.get('/api/notifications/');

export const markRead = (id) =>
  client.post(`/api/notifications/${id}/read/`);

export const markAllRead = () =>
  client.post('/api/notifications/read-all/');
