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
        url: '/users/profile',
        params,
      }),
      providesTags: ['User'],
    }),

    getAllUsers: builder.query({
      query: (args) => {
        const params=new URLSearchParams();
        if (args && Array.isArray(args)) {
          args.forEach((arg: { name: string; value: string }) => {
            params.append(arg.name, arg.value);
          });
        }
       return {
         url: '/users',
        params,
       }
      },
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: '/users/profile',
        method: 'PATCH',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useUpdateProfileMutation,
  useGetAllUsersQuery,
} = userApi;