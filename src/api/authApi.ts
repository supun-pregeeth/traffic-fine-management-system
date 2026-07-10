import apiClient from './client';

export function loginAdmin(email: string, password: string) {
  return apiClient.post('/auth/login', { email, password });
}
