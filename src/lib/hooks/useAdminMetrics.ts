'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';
import { fetchAdminMetrics } from '@/lib/api/admin';
import { setAuthToken } from '@/lib/api/axios';
import { MetricsQueryParams } from '@/lib/types/admin-metrics';

export function useAdminMetrics(params: MetricsQueryParams) {
  const { getToken } = useAuth();

  useEffect(() => {
    getToken().then((token) => setAuthToken(token));
  }, [getToken]);

  return useQuery({
    queryKey: ['admin-metrics', params.from, params.to],
    queryFn: async () => {
      const token = await getToken();
      setAuthToken(token);
      return fetchAdminMetrics(params);
    },
    staleTime: 5 * 60 * 1000,
  });
}
