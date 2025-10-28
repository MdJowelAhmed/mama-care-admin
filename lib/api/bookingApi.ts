import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth, ApiResponse, PaginatedResponse } from "../baseApi";

// Booking API slice
export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Booking"],
  endpoints: (builder) => ({
    getBookings: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args && Array.isArray(args)) {
          args.forEach((arg: { name: string; value: string }) => {
            params.append(arg.name, arg.value);
          });
        }

        return {
          url: "/bookings",
          params, // or params: params.toString() if needed
        };
      },
      providesTags: ["Booking"],
    }),
  }),
});

export const { useGetBookingsQuery } = bookingApi;
