import api from './client';
import { TeamFilters } from '../types';

export const teamApi = {
  getAll: (filters?: TeamFilters) =>
    api.get('/teams', { params: filters }),

  getById: (id: number) =>
    api.get(`/teams/${id}`),

  create: (data: unknown) =>
    api.post('/teams', data),

  update: (id: number, data: unknown) =>
    api.put(`/teams/${id}`, data),

  join: (id: number) =>
    api.post(`/teams/${id}/join`),

  leave: (id: number) =>
    api.post(`/teams/${id}/leave`),

  removeMember: (teamId: number, userId: number) =>
    api.delete(`/teams/${teamId}/members/${userId}`),

  getMyTeams: () =>
    api.get('/teams/my-teams'),

  findBySkills: (skills: string[]) =>
    api.get('/teams/match', { params: { skills: skills.join(',') } }),
};
