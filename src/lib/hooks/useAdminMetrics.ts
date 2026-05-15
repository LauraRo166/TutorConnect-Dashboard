'use client';

import { MOCK_ADMIN_METRICS } from '@/lib/mocks/admin-metrics';
import { MetricsQueryParams } from '@/lib/types/admin-metrics';

export function useAdminMetrics(_params: MetricsQueryParams) {
  return {
    data: MOCK_ADMIN_METRICS,
    isLoading: false,
    isError: false,
    isFetching: false,
    refetch: () => Promise.resolve(),
  };
}
