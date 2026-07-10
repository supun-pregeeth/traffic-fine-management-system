import apiClient from './client';

export function loginCitizen(email, password) {
  return apiClient.post('/auth/login', { email, password });
}

export function registerCitizenAccount(payload) {
  return apiClient.post('/auth/register', payload);
}

export function fetchFineByReference(referenceNumber) {
  return apiClient.get(`/fines/${referenceNumber}`);
}

export function payFine(payload) {
  return apiClient.post('/payments/pay', payload);
}
