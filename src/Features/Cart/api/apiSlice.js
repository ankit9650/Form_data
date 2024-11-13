import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

 const token = localStorage.getItem('jwtToken');

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000',
    prepareHeaders: (headers) => {
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        console.log('Authorization header set:', `Bearer ${token}`);
      } else {
        console.log('No token provided');
      }
      return headers;
    },
  }),
  
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/register',  
    }),

    // addUsers: builder.mutation({
    //     query: (user) => ({
    //         url:'/register',
    //         method: 'POST',
    //         body: user
    //     }),
    // }),

    // updateUsers: builder.mutation({
    //     query: (user) => ({
    //         url:`/register/${id}`,
    //         method: 'PATCH',
    //         body:user
    //     })
    // })
    
  }),
});

export const {
  useGetUsersQuery,
//   useAddUsersMutation,
//   useUpdateUsersMutation,
} = apiSlice;
