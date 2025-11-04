import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth, ApiResponse, PaginatedResponse } from '../baseApi';

// Type definitions
interface CreatePlatformFeeData {
  todayFee: number;
  futureFee: number
}

// Admin API slice
export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Admin'],
  endpoints: (builder) => ({
    getPlatformFee: builder.query({
      query: () => '/platform-fees',
      providesTags: ['Admin'],
    }),


    
    createPlatformFee: builder.mutation<any, CreatePlatformFeeData>({
      query: (data) => ({
        url: '/platform-fees',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Admin'],
    }),

    // DeleteAdmin: builder.mutation<any, number>({
    //   query: (id) => ({
    //     url: `/admins/${id}`,
    //     method: 'DELETE',
    //   }),
    //   invalidatesTags: ['Admin'],
    // }),
  }),
});

export const {
  useGetPlatformFeeQuery,
  useCreatePlatformFeeMutation,
} = adminApi;

export type { CreatePlatformFeeData };