import client from './client';

export const sendOTP = (phone_number) =>
  client.post('/api/auth/otp/send/', { phone_number });

export const verifyOTP = (phone_number, otp_code) =>
  client.post('/api/auth/otp/verify/', { phone_number, otp_code });

export const getProfile = () =>
  client.get('/api/auth/profile/');

export const updateProfile = (data) =>
  client.patch('/api/auth/profile/', data);
