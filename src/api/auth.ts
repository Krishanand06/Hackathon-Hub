import api from './client';

export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  register: (data: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    role?: string;
  }) => api.post('/auth/register', data),

  me: () => api.get('/auth/me'),

  refreshToken: () => api.post('/auth/refresh'),
};
