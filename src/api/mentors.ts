import api from './client';

export const mentorApi = {
  getAll: (params?: { expertise?: string; hackathonId?: number }) =>
    api.get('/mentors', { params }),

  getById: (id: number) =>
    api.get(`/mentors/${id}`),

  getSlots: (mentorId: number) =>
    api.get(`/mentors/${mentorId}/slots`),

  book: (mentorId: number, data: { slotId: number; teamId: number; notes?: string }) =>
    api.post(`/mentors/${mentorId}/book`, data),

  cancelBooking: (bookingId: number) =>
    api.post(`/mentor-bookings/${bookingId}/cancel`),

  getMyBookings: () =>
    api.get('/mentor-bookings/my-bookings'),

  confirmBooking: (bookingId: number) =>
    api.post(`/mentor-bookings/${bookingId}/confirm`),
};

export const resourceApi = {
  getAll: (params?: { hackathonId?: number; type?: string }) =>
    api.get('/resources', { params }),

  getById: (id: number) =>
    api.get(`/resources/${id}`),

  create: (data: unknown) =>
    api.post('/resources', data),

  delete: (id: number) =>
    api.delete(`/resources/${id}`),
};

export const venueApi = {
  getAll: () =>
    api.get('/venues'),

  getById: (id: number) =>
    api.get(`/venues/${id}`),

  create: (data: unknown) =>
    api.post('/venues', data),

  update: (id: number, data: unknown) =>
    api.put(`/venues/${id}`, data),
};
