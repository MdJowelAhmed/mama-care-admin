'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetBookingsQuery } from '@/lib/store';
import { Calendar, Clock, User, MapPin, DollarSign } from 'lucide-react';

type BookingStatus = 'completed' | 'confirmed' | 'pending' | 'cancelled';

interface Booking {
  id: string;
  motherName: string;
  nannyName: string;
  date: string;
  time: string;
  duration: string;
  status: BookingStatus;
  amount: number;
  location: string;
  services: string[];
}

type StatusColors = Record<BookingStatus, string>;

// Mock booking data
const mockBookings: Booking[] = [
  {
    id: 'BK001',
    motherName: 'Sarah Johnson',
    nannyName: 'Emily Brown',
    date: '2024-01-15',
    time: '09:00 AM',
    duration: '4 hours',
    status: 'completed',
    amount: 120,
    location: 'Downtown, NYC',
    services: ['Babysitting', 'Light Housework']
  },
  {
    id: 'BK002',
    motherName: 'Maria Garcia',
    nannyName: 'Jennifer Smith',
    date: '2024-01-18',
    time: '02:00 PM',
    duration: '6 hours',
    status: 'confirmed',
    amount: 180,
    location: 'Brooklyn, NYC',
    services: ['Babysitting', 'Meal Preparation']
  },
  {
    id: 'BK003',
    motherName: 'Lisa Chen',
    nannyName: 'Amanda Davis',
    date: '2024-01-20',
    time: '10:00 AM',
    duration: '8 hours',
    status: 'pending',
    amount: 240,
    location: 'Queens, NYC',
    services: ['Full Day Care', 'Educational Activities']
  }
];

const statusColors: StatusColors = {
  completed: 'bg-green-100 text-green-800',
  confirmed: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function BookingManagement() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  // const { data: bookings, isLoading } = useGetBookingsQuery();

  const columns = [
    {
      key: 'id',
      header: 'Booking ID',
      className: 'font-medium'
    },
    {
      key: 'motherName',
      header: 'Mother',
      className: ''
    },
    {
      key: 'nannyName',
      header: 'Nanny',
      className: ''
    },
    {
      key: 'date',
      header: 'Date',
      className: '',
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'time',
      header: 'Time',
      className: ''
    },
    {
      key: 'amount',
      header: 'Amount',
      className: 'text-right font-medium',
      render: (value: number) => `$${value}`
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
      key: 'status',
      label: 'Status',
      options: [
        { value: 'completed', label: 'Completed' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'pending', label: 'Pending' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    }
  ];

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="p-6 ">
        <div className="my-6">
          <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600">Manage and monitor all booking activities</p>
        </div>

        <Card>
          {/* <CardHeader>
            <CardTitle>All Bookings</CardTitle>
            <CardDescription>
              View and manage all booking requests and appointments
            </CardDescription>
          </CardHeader> */}
          <CardContent className='mt-6'>
            <DataTable
              columns={columns}
              data={mockBookings}
              searchKey="motherName"
              filters={filters}
              onViewDetails={handleViewDetails}
              itemsPerPage={10}
            />
          </CardContent>
        </Card>

        {/* Booking Details Modal */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>
                Complete information about booking {selectedBooking?.id}
              </DialogDescription>
            </DialogHeader>
            
            {selectedBooking && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Mother</p>
                      <p className="font-medium">{selectedBooking.motherName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Nanny</p>
                      <p className="font-medium">{selectedBooking.nannyName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Date & Time</p>
                      <p className="font-medium">
                        {new Date(selectedBooking.date).toLocaleDateString()} at {selectedBooking.time}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-medium">{selectedBooking.duration}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{selectedBooking.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-medium text-lg">${selectedBooking.amount}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Status</p>
                    <Badge className={statusColors[selectedBooking.status]}>
                      {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Services</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedBooking.services.map((service, index) => (
                        <Badge key={index} variant="outline">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}