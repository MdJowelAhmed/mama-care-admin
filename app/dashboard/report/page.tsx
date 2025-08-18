'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetReportsQuery } from '@/lib/store';
import { AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type ReportStatus = 'PENDING' | 'IN_REVIEW' | 'RESOLVED' | 'DISMISSED';
type ReportTopic = 'RUDE_BEHAVIOR' | 'SAFETY_CONCERN' | 'SERVICE_QUALITY' | 'PAYMENT_ISSUE' | 'OTHER';
type DateFilter = 'all' | 'today' | 'week' | 'month';

interface User {
  _id: string;
  name: string;
  role: 'PARENT' | 'NANNY';
  profileImage: string;
}

interface Booking {
  _id: string;
  bookingType: 'HOURLY' | 'FULL_DAY';
  bookingStatus: string;
  totalPayable: number;
  createdAt: string;
  hourlyBooking?: {
    date: string;
    startTime: string;
    endTime: string;
  };
  fullDayBooking?: {
    fullDays: string[];
    hasOverTime: boolean;
    overTimeHours: number;
  };
}

interface Report {
  _id: string;
  reporterId: User;
  reportedUserId: User;
  bookingId: Booking;
  topic: ReportTopic;
  description: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
}

type StatusColors = Record<ReportStatus, string>;
type ReportTopicLabels = Record<ReportTopic, string>;



const statusColors: StatusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_REVIEW: 'bg-blue-100 text-blue-800',
  RESOLVED: 'bg-green-100 text-green-800',
  DISMISSED: 'bg-gray-100 text-gray-800'
};

const reportTopicLabels: ReportTopicLabels = {
  RUDE_BEHAVIOR: 'Rude Behavior',
  SAFETY_CONCERN: 'Safety Concern',
  SERVICE_QUALITY: 'Service Quality',
  PAYMENT_ISSUE: 'Payment Issue',
  OTHER: 'Other'
};

export default function ReportsPage() {
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  
  const { data: reportsData, isLoading, error } = useGetReportsQuery({});
  const reports = reportsData?.data?.data || [];
  const meta = reportsData?.data?.meta || { total: 0, limit: 10, page: 1, totalPage: 1 };
  
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
          <Skeleton className="h-6 w-[80px]" />
          <Skeleton className="h-6 w-[100px]" />
        </div>
      ))}
    </div>
  );

  const columns = [
    {
      key: 'reporter',
      header: 'Reporter',
      className: '',
      render: (_: any, report: Report) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={report.reporterId.profileImage} alt={report.reporterId.name} />
            <AvatarFallback>
              {report.reporterId.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900">{report.reporterId.name}</p>
            <p className="text-sm text-gray-500">{report.reporterId.role}</p>
          </div>
        </div>
      )
    },
    {
      key: 'reportedUser',
      header: 'Reported User',
      className: 'font-medium',
      render: (value: any, report: Report) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={report.reportedUserId.profileImage} alt={report.reportedUserId.name} />
            <AvatarFallback>{report.reportedUserId.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{report.reportedUserId.name}</div>
            <div className="text-sm text-gray-500">{report.reportedUserId.role}</div>
          </div>
        </div>
      )
    },
    {
      key: 'topic',
      header: 'Report Topic',
      className: '',
      render: (value: ReportTopic) => reportTopicLabels[value] || value
    },
    {
      key: 'createdAt',
      header: 'Date',
      className: '',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'bookingId',
      header: 'Booking Type',
      className: '',
      render: (value: any, report: Report) => (
        <Badge className="bg-blue-100 text-blue-800">
          {report.bookingId.bookingType}
        </Badge>
      )
    },
    {
      key: 'status',
      header: 'Status',
      className: '',
      render: (value: ReportStatus) => (
        <div className="flex items-center space-x-2">
          {value === 'PENDING' && <Clock className="h-4 w-4 text-yellow-500" />}
          {value === 'IN_REVIEW' && <AlertTriangle className="h-4 w-4 text-blue-500" />}
          {value === 'RESOLVED' && <CheckCircle className="h-4 w-4 text-green-500" />}
          {value === 'DISMISSED' && <XCircle className="h-4 w-4 text-gray-500" />}
          <Badge className={statusColors[value] || 'bg-gray-100 text-gray-800'}>
            {value.replace('_', ' ').charAt(0).toUpperCase() + value.replace('_', ' ').slice(1).toLowerCase()}
          </Badge>
        </div>
      )
    }
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'PENDING', label: 'Pending' },
        { value: 'IN_REVIEW', label: 'In Review' },
        { value: 'RESOLVED', label: 'Resolved' },
        { value: 'DISMISSED', label: 'Dismissed' }
      ]
    },
    {
      key: 'topic',
      label: 'Topic',
      options: [
        { value: 'RUDE_BEHAVIOR', label: 'Rude Behavior' },
        { value: 'SAFETY_CONCERN', label: 'Safety Concern' },
        { value: 'SERVICE_QUALITY', label: 'Service Quality' },
        { value: 'PAYMENT_ISSUE', label: 'Payment Issue' },
        { value: 'OTHER', label: 'Other' }
      ]
    }
    ];



  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600">Review and manage user reports</p>
          </div>
          
     
        </div>



        <Card>
          <CardContent className='mt-6'>
            {isLoading ? (
              <LoadingSkeleton />
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">Error loading reports. Please try again.</p>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={reports}
                searchKey="reporterId.name"
                filters={filters}
                itemsPerPage={10}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}