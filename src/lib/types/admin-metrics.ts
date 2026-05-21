export interface AdminMetrics {
  totalUsers: number;
  totalTutors: number;
  totalLearners: number;
  totalCourses: number;
  period: {
    from: string | null;
    to: string | null;
  };
}

export interface MetricsQueryParams {
  from: string;
  to: string;
}
