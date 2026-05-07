import { AdminMetrics, MetricsQueryParams } from '@/lib/types/admin-metrics';
import { apiClient } from './axios';

export async function fetchAdminMetrics(params: MetricsQueryParams): Promise<AdminMetrics> {
  const { data } = await apiClient.get<AdminMetrics>('/admin/metrics', { params });
  return data;
}
