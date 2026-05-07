import api from './client';

export const submissionApi = {
  create: (data: unknown) =>
    api.post('/submissions', data),

  update: (id: number, data: unknown) =>
    api.put(`/submissions/${id}`, data),

  getById: (id: number) =>
    api.get(`/submissions/${id}`),

  getByHackathon: (hackathonId: number) =>
    api.get(`/submissions/hackathon/${hackathonId}`),

  getMySubmissions: () =>
    api.get('/submissions/my-submissions'),

  submit: (id: number) =>
    api.post(`/submissions/${id}/submit`),

  delete: (id: number) =>
    api.delete(`/submissions/${id}`),
};

export const evaluationApi = {
  create: (data: unknown) =>
    api.post('/evaluations', data),

  update: (id: number, data: unknown) =>
    api.put(`/evaluations/${id}`, data),

  getBySubmission: (submissionId: number) =>
    api.get(`/evaluations/submission/${submissionId}`),

  getMyEvaluations: () =>
    api.get('/evaluations/my-evaluations'),
};

export const leaderboardApi = {
  getByHackathon: (hackathonId: number) =>
    api.get(`/leaderboard/${hackathonId}`),
};
