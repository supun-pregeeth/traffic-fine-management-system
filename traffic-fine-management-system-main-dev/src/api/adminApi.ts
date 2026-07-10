import apiClient from './client';

export function fetchDashboardSummary() {
  return apiClient.get('/admin/analytics/dashboard');
}

export function fetchDistrictCollections() {
  return apiClient.get('/admin/analytics/district');
}

export function fetchCategoryCollections() {
  return apiClient.get('/admin/analytics/category');
}

export function fetchRevenueSummary(period = 'monthly') {
  return apiClient.get('/admin/analytics/revenue', {
    params: { period }
  });
}

export function fetchAllPayments() {
  return apiClient.get('/admin/payments');
}

export function fetchAllFines() {
  return apiClient.get('/fines');
}
