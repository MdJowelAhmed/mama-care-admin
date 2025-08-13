'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetUsersQuery } from '@/lib/store';

// User interface
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  status: string;
  bookings: number;
  avatar: string;
}

// Mock user data
const mockUsers = [
  {
    id: 'U001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    role: 'mother',
    joinDate: '2023-12-15',
    status: 'active',
    bookings: 8,
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 'U002',
    name: 'Emily Brown',
    email: 'emily.brown@email.com',
    role: 'nanny',
    joinDate: '2023-11-20',
    status: 'active',
    bookings: 15,
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 'U003',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    role: 'mother',
    joinDate: '2024-01-10',
    status: 'active',
    bookings: 3,
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 'U004',
    name: 'Jennifer Smith',
    email: 'jennifer.smith@email.com',
    role: 'nanny',
    joinDate: '2023-10-05',
    status: 'inactive',
    bookings: 12,
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100&h=100&fit=crop&crop=face'
  }
];

const roleColors = {
  mother: 'bg-pink-100 text-pink-800',
  nanny: 'bg-blue-100 text-blue-800',
  admin: 'bg-purple-100 text-purple-800'
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  suspended: 'bg-red-100 text-red-800'
};

export default function UserManagement() {
  // const { data: users, isLoading } = useGetUsersQuery();

  const columns = [
    {
      key: 'user',
      header: 'User',
      className: '',
      render: (_: any, user: User) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Role',
      className: '',
      render: (value: string) => (
        <Badge className={roleColors[value as keyof typeof roleColors] || 'bg-gray-100 text-gray-800'}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    },
    {
      key: 'joinDate',
      header: 'Join Date',
      className: '',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'bookings',
      header: 'Total Bookings',
      className: 'text-center font-medium'
    },
    {
      key: 'status',
      header: 'Status',
      className: '',
      render: (value: string) => (
        <Badge className={statusColors[value as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    }
  ];

  const filters = [
    {
      key: 'role',
      label: 'Role',
      options: [
        { value: 'mother', label: 'Mothers' },
        { value: 'nanny', label: 'Nannies' },
        // { value: 'admin', label: 'Admins' }
      ]
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage and monitor all platform users</p>
        </div>

        {/* User Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {mockUsers.length.toLocaleString()}
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Mothers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {mockUsers.filter(u => u.role === 'mother' && u.status === 'active').length}
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                +8% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Nannies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {mockUsers.filter(u => u.role === 'nanny' && u.status === 'active').length}
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                +15% from last month
              </p>
            </CardContent>
          </Card>
        </div> */}

        <Card>
          {/* <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              Manage all registered users on your platform
            </CardDescription>
          </CardHeader> */}
          <CardContent className='mt-6'>
            <DataTable
              columns={columns}
              data={mockUsers}
              searchKey="name"
              filters={filters}
              itemsPerPage={10}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}