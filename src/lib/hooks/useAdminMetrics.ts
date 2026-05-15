'use client';

import { generateMockMetrics } from '@/lib/mocks/admin-metrics';
import { MetricsQueryParams } from '@/lib/types/admin-metrics';

export function useAdminMetrics(params: MetricsQueryParams) {
  return {
    data: generateMockMetrics(params),
    isLoading: false,
    isError: false,
    isFetching: false,
    refetch: () => Promise.resolve(),
  };
}
