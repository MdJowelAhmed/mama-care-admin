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

type ReportStatus = 'pending' | 'in_review' | 'resolved' | 'dismissed';
type ReportPriority = 'high' | 'medium' | 'low';
type ReportType = 'inappropriate_behavior' | 'safety_concern' | 'service_quality' | 'payment_issue' | 'other';
type DateFilter = 'all' | 'today' | 'week' | 'month';

interface Report {
  id: string;
  reporterName: string;
  reporterEmail: string;
  reportedUser: string;
  reportType: ReportType;
  description: string;
  date: string;
  status: ReportStatus;
  priority: ReportPriority;
  avatar: string;
}

type StatusColors = Record<ReportStatus, string>;
type PriorityColors = Record<ReportPriority, string>;
type ReportTypeLabels = Record<ReportType, string>;

// Mock report data
const mockReports: Report[] = [
  {
    id: 'R001',
    reporterName: 'Sarah Johnson',
    reporterEmail: 'sarah.johnson@email.com',
    reportedUser: 'Emily Brown',
    reportType: 'inappropriate_behavior',
    description: 'Nanny was late multiple times and showed unprofessional behavior',
    date: '2024-01-15',
    status: 'pending',
    priority: 'high',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 'R002',
    reporterName: 'Maria Garcia',
    reporterEmail: 'maria.garcia@email.com',
    reportedUser: 'Jennifer Smith',
    reportType: 'safety_concern',
    description: 'Safety protocols were not followed during childcare session',
    date: '2024-01-12',
    status: 'resolved',
    priority: 'high',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 'R003',
    reporterName: 'Lisa Chen',
    reporterEmail: 'lisa.chen@email.com',
    reportedUser: 'Amanda Davis',
    reportType: 'service_quality',
    description: 'Services provided did not match the agreed terms',
    date: '2024-01-10',
    status: 'in_review',
    priority: 'medium',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100&h=100&fit=crop&crop=face'
  }
];

const statusColors: StatusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_review: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  dismissed: 'bg-gray-100 text-gray-800'
};

const priorityColors: PriorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-orange-100 text-orange-800',
  low: 'bg-blue-100 text-blue-800'
};

const reportTypeLabels: ReportTypeLabels = {
  inappropriate_behavior: 'Inappropriate Behavior',
  safety_concern: 'Safety Concern',
  service_quality: 'Service Quality',
  payment_issue: 'Payment Issue',
  other: 'Other'
};

export default function ReportsPage() {
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  // const { data: reports, isLoading } = useGetReportsQuery({ dateFilter });

  const columns = [
    {
      key: 'reporter',
      header: 'Reporter',
      className: '',
      render: (_: any, report: Report) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={report.avatar} alt={report.reporterName} />
            <AvatarFallback>
              {report.reporterName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900">{report.reporterName}</p>
            <p className="text-sm text-gray-500">{report.reporterEmail}</p>
          </div>
        </div>
      )
    },
    {
      key: 'reportedUser',
      header: 'Reported User',
      className: 'font-medium'
    },
    {
      key: 'reportType',
      header: 'Report Type',
      className: '',
      render: (value: ReportType) => reportTypeLabels[value] || value
    },
    {
      key: 'date',
      header: 'Date',
      className: '',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'priority',
      header: 'Priority',
      className: '',
      render: (value: ReportPriority) => (
        <Badge className={priorityColors[value] || 'bg-gray-100 text-gray-800'}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      )
    },
    {
      key: 'status',
      header: 'Status',
      className: '',
      render: (value: ReportStatus) => (
        <div className="flex items-center space-x-2">
          {value === 'pending' && <Clock className="h-4 w-4 text-yellow-500" />}
          {value === 'in_review' && <AlertTriangle className="h-4 w-4 text-blue-500" />}
          {value === 'resolved' && <CheckCircle className="h-4 w-4 text-green-500" />}
          {value === 'dismissed' && <XCircle className="h-4 w-4 text-gray-500" />}
          <Badge className={statusColors[value] || 'bg-gray-100 text-gray-800'}>
            {value.replace('_', ' ').charAt(0).toUpperCase() + value.replace('_', ' ').slice(1)}
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
        { value: 'pending', label: 'Pending' },
        { value: 'in_review', label: 'In Review' },
        { value: 'resolved', label: 'Resolved' },
        { value: 'dismissed', label: 'Dismissed' }
      ]
    },
    {
      key: 'reportType',
      label: 'Category',
      options: [
        { value: 'inappropriate_behavior', label: 'Inappropriate Behavior' },
        { value: 'safety_concern', label: 'Safety Concern' },
        { value: 'service_quality', label: 'Service Quality' },
        { value: 'payment_issue', label: 'Payment Issue' },
        { value: 'other', label: 'Other' }
      ]
    }
    ];

  

  const getFilteredData = () => {
    if (dateFilter === 'all') return mockReports;
    
    const today = new Date();
    const filterDate = new Date();
    
    switch (dateFilter) {
      case 'today':
        filterDate.setHours(0, 0, 0, 0);
        return mockReports.filter(report => 
          new Date(report.date) >= filterDate
        );
      case 'week':
        filterDate.setDate(today.getDate() - 7);
        return mockReports.filter(report => 
          new Date(report.date) >= filterDate
        );
      case 'month':
        filterDate.setMonth(today.getMonth() - 1);
        return mockReports.filter(report => 
          new Date(report.date) >= filterDate
        );
      default:
        return mockReports;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600">Review and manage user reports</p>
          </div>
          
     
        </div>

        {/* Report Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {mockReports.length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {mockReports.filter(r => r.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">In Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {mockReports.filter(r => r.status === 'in_review').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {mockReports.filter(r => r.status === 'resolved').length}
              </div>
            </CardContent>
          </Card>
        </div> */}

        <Card>
          
          <CardContent className='mt-6'>
            <DataTable
              columns={columns}
              data={getFilteredData()}
              searchKey="reporterName"
              filters={filters}
              
              itemsPerPage={10}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}