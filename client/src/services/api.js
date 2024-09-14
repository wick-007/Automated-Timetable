import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
});

export const createUser = (data) => api.post('/users', data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

export const createCourse = (data) => api.post('/courses', data);

export const createRoom = (data) => api.post('/rooms', data);
export const getAllRooms = () => api.get('/rooms');
export const updateRoom = (id, data) => api.put(`/rooms/${id}`, data);
export const deleteRoom = (id) => api.delete(`/rooms/${id}`);
export const getRoomAvailability = (id) => api.get(`/rooms/${id}/availability`);

export const createSchedule = (data) => api.post('/schedules', data);
export const getTeacherSchedule = (id) => api.get(`/teachers/${id}/schedule`);
export const getStudentSchedule = (id) => api.get(`/students/${id}/schedule`);
export const createPreference = (data) => api.post('/preferences', data);
export const createConflictReport = (data) => api.post('/conflict-reports', data);
export const getPreferences = () => api.get('/preferences');
export const getConflictReports = () => api.get('/conflict-reports');
