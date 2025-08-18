import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth, ApiResponse } from '../baseApi';

// Dashboard API slice
export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Dashboard'],
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/analytics/monthly/user/stats',
      providesTags: ['Dashboard'],
    }),
    totalRevenue: builder.query({
      query: () => '/analytics/monthly/revenue/stats',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useTotalRevenueQuery,
} = dashboardApi;