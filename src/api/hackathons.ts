import api from './client';
import { HackathonFilters } from '../types';

export const hackathonApi = {
  getAll: (filters?: HackathonFilters) =>
    api.get('/hackathons/public', { params: filters }),

  getById: (id: number) =>
    api.get(`/hackathons/public/${id}`),

  create: (data: unknown) =>
    api.post('/hackathons', data),

  update: (id: number, data: unknown) =>
    api.put(`/hackathons/${id}`, data),

  delete: (id: number) =>
    api.delete(`/hackathons/${id}`),

  register: (id: number, teamId?: number) =>
    api.post(`/hackathons/${id}/register`, { teamId }),

  getRegistrations: (id: number) =>
    api.get(`/hackathons/${id}/registrations`),

  getUserRegistrations: () =>
    api.get('/hackathons/my-registrations'),
};
