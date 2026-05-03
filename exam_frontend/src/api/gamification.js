import client from './client';

export const getGameProfile = () =>
  client.get('/api/gamification/profile/');

export const getLeaderboard = () =>
  client.get('/api/gamification/leaderboard/');
