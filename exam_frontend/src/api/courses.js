import client from './client';

export const getHome = () =>
  client.get('/api/home/');

export const getCategories = () =>
  client.get('/api/categories/');

export const getCourses = (params = {}) =>
  client.get('/api/courses/', { params });

export const getCourseDetail = (id) =>
  client.get(`/api/courses/${id}/`);

export const enrollCourse = (id) =>
  client.post(`/api/courses/${id}/enroll/`);

export const getMyCourses = () =>
  client.get('/api/courses/my/');

export const getLessonDetail = (id) =>
  client.get(`/api/lessons/${id}/`);

export const completeLesson = (id) =>
  client.post(`/api/lessons/${id}/complete/`);
