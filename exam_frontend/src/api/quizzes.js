import client from './client';

export const getQuiz = (id) =>
  client.get(`/api/quizzes/${id}/`);

export const submitQuiz = (id, answers) =>
  client.post(`/api/quizzes/${id}/submit/`, { answers });

export const getMyAttempts = () =>
  client.get('/api/quizzes/my-attempts/');
