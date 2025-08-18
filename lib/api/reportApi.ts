import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth, ApiResponse, PaginatedResponse } from '../baseApi';

// Report API slice
export const reportApi = createApi({
  reducerPath: 'reportApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Report'],
  endpoints: (builder) => ({
    getReports: builder.query({
      query: (params) => ({
        url: '/reports',
        params,
      }),
      providesTags: ['Report'],
    }),
  }),
});

export const {
  useGetReportsQuery,
} = reportApi;