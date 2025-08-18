import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithAuth, ApiResponse, PaginatedResponse } from '../baseApi';

// User API slice
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (params) => ({
        url: '/users',
        params,
      }),
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: '/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useUpdateProfileMutation,
} = userApi;