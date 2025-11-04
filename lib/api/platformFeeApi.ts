import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth, ApiResponse, PaginatedResponse } from '../baseApi';

// Type definitions
interface CreatePlatformFeeData {
  feeToday: number;
  feeFuture: number;
  id?: number; // Optional for edit mode
}

// Platform Fee API slice
export const platformFeeApi = createApi({
  reducerPath: 'platformFeeApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['PlatformFee'],
  endpoints: (builder) => ({
    getPlatformFee: builder.query({
      query: () => '/platform-fees',
      providesTags: ['PlatformFee'],    
    }),

    createPlatformFee: builder.mutation<any, CreatePlatformFeeData>({
      query: (data) => ({
        url: '/platform-fees',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PlatformFee'],
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
} = platformFeeApi;

export type { CreatePlatformFeeData };