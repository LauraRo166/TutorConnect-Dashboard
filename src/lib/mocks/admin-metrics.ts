import { AdminMetrics, MetricsQueryParams } from '@/lib/types/admin-metrics';

// Real values from DB (tutorconnect @ localhost:5432), used as 30-day baseline
const DB_BASE = {
  tutors: 7,
  learners: 5,
  sessions: { total: 22, completed: 11, confirmed: 9, cancelled: 1, pending: 1 },
  revenue: { gross: 565_000, commission: 84_750 },
  reviews: { total: 8, avg: 4.75, dist: { 1: 0, 2: 0, 3: 0, 4: 2, 5: 6 } },
  topTutors: [
    { tutorId: '587f32c4-18a8-43c3-a708-f4d94ba7ac68', name: 'Laura Rodríguez',  gross: 1_360_000, commission: 204_000, sessions: 12, avgRating: 4.75 },
    { tutorId: 'bdf22f9b-2be0-40f6-a407-d7420b183807', name: 'Elena Rodríguez',  gross:   260_000, commission:  39_000, sessions:  6, avgRating: 4.5  },
    { tutorId: '805ea94a-54ea-43ab-a00d-738e6e2048c4', name: 'Marcos Santos',    gross:   190_000, commission:  28_500, sessions:  4, avgRating: 5.0  },
    { tutorId: '7e45cde8-afd9-4aca-a9cc-9346837b7c75', name: 'Javier Ruiz',      gross:    75_000, commission:  11_250, sessions:  2, avgRating: 4.0  },
    { tutorId: '214e57a7-191d-4fb3-921a-da80083df64c', name: 'Sofía Mendoza',    gross:    50_000, commission:   7_500, sessions:  1, avgRating: null },
  ],
} as const;


function getDates(from: string, to: string): string[] {
  const dates: string[] = [];
  const d = new Date(from + 'T12:00:00');
  const end = new Date(to + 'T12:00:00');
  while (d <= end) {
    dates.push(d.toISOString().split('T')[0]);
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

// Weekday weight: Mon-Thu peak, Fri lighter, weekend low
function dayWeight(dateStr: string): number {
  const dow = new Date(dateStr + 'T12:00:00').getDay();
  return [0.35, 1.25, 1.30, 1.20, 1.10, 0.90, 0.40][dow];
}

function distribute(total: number, dates: string[]): number[] {
  const weights = dates.map(dayWeight);
  const sum = weights.reduce((a, b) => a + b, 0);
  let remaining = Math.round(total);
  const result = weights.map((w, i) => {
    const v = i === weights.length - 1 ? remaining : Math.round(total * w / sum);
    remaining -= v;
    return Math.max(0, v);
  });
  return result;
}

// last-month gets 0.82x (platform was smaller); custom ranges get neutral 1x
function periodMultiplier(from: string, to: string, days: number): number {
  const today = new Date().toISOString().split('T')[0];
  const toDate = new Date(to + 'T12:00:00');
  const todayDate = new Date(today + 'T12:00:00');
  const isHistorical = toDate < todayDate;
  return isHistorical ? 0.82 : 1;
}

export function generateMockMetrics(params: MetricsQueryParams): AdminMetrics {
  const dates = getDates(params.from, params.to);
  const days = dates.length;
  const scale = (days / 30) * periodMultiplier(params.from, params.to, days);

  const totalSessions = Math.max(1, Math.round(DB_BASE.sessions.total * scale));
  const completedSessions = Math.round(totalSessions * (DB_BASE.sessions.completed / DB_BASE.sessions.total));
  const cancelledSessions = Math.max(0, Math.round(totalSessions * (DB_BASE.sessions.cancelled / DB_BASE.sessions.total)));
  const pendingSessions = Math.max(0, Math.round(totalSessions * (DB_BASE.sessions.pending / DB_BASE.sessions.total)));
  const confirmedSessions = totalSessions - completedSessions - cancelledSessions - pendingSessions;

  const grossTotal = Math.round(DB_BASE.revenue.gross * scale);
  const commissionTotal = Math.round(DB_BASE.revenue.commission * scale);

  const totalReviews = Math.max(0, Math.round(DB_BASE.reviews.total * scale));
  const npsScore = 75; // (6/8 promoters) - 0 detractors = 75

  // Distribute sessions by day
  const sessionCounts = distribute(totalSessions, dates);
  const grossAmounts = distribute(grossTotal, dates);

  // User growth: distribute new users (some days get 0, some 1-2)
  const newTutors = Math.max(0, Math.round(DB_BASE.tutors * scale * 0.4));
  const newLearners = Math.max(0, Math.round(DB_BASE.learners * scale * 0.4));
  const tutorCounts = distribute(newTutors, dates);
  const learnerCounts = distribute(newLearners, dates);

  // NPS distribution scaled
  const distScale = totalReviews / DB_BASE.reviews.total;
  const npsDistribution = [1, 2, 3, 4, 5].map((rating) => {
    const base = DB_BASE.reviews.dist[rating as keyof typeof DB_BASE.reviews.dist];
    const count = Math.round(base * distScale);
    return {
      rating,
      count,
      percentage: totalReviews > 0 ? Math.round((count / totalReviews) * 1000) / 10 : 0,
    };
  });

  // Top tutors scaled
  const topTutors = DB_BASE.topTutors.map((t) => ({
    tutorId: t.tutorId,
    name: t.name,
    grossRevenue: Math.round(t.gross * scale),
    commission: Math.round(t.commission * scale),
    sessionsCount: Math.max(0, Math.round(t.sessions * scale)),
    averageRating: t.avgRating,
  }));

  return {
    generatedAt: new Date().toISOString(),
    period: { from: params.from, to: params.to },

    users: {
      totalTutors: DB_BASE.tutors,
      totalLearners: DB_BASE.learners,
      totalUsers: DB_BASE.tutors + DB_BASE.learners,
      newThisWeek: Math.max(1, Math.round((DB_BASE.tutors + DB_BASE.learners) * (7 / 30) * 0.4)),
      newThisMonth: Math.max(1, Math.round((DB_BASE.tutors + DB_BASE.learners) * 0.4)),
      growthByDay: dates.map((date, i) => ({
        date,
        tutors: tutorCounts[i],
        learners: learnerCounts[i],
      })),
    },

    sessions: {
      total: totalSessions,
      completed: completedSessions,
      completionRate: Math.round((completedSessions / totalSessions) * 100),
      byDay: dates.map((date, i) => ({ date, count: sessionCounts[i] })),
      byStatus: [
        { status: 'completed', count: completedSessions },
        { status: 'confirmed', count: Math.max(0, confirmedSessions) },
        { status: 'cancelled', count: cancelledSessions },
        { status: 'pending', count: pendingSessions },
      ],
    },

    revenue: {
      grossTotal,
      commissionTotal,
      currency: 'COP',
      byDay: dates.map((date, i) => ({
        date,
        gross: grossAmounts[i],
        commission: Math.round(grossAmounts[i] * (DB_BASE.revenue.commission / DB_BASE.revenue.gross)),
      })),
      byPaymentStatus: [
        { status: 'completed', count: completedSessions },
        { status: 'pending', count: pendingSessions },
      ],
    },

    nps: {
      score: npsScore,
      averageRating: DB_BASE.reviews.avg,
      totalReviews,
      distribution: npsDistribution,
    },

    topTutors,
  };
}
