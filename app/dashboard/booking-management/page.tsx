'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useGetBookingsQuery } from '@/lib/store';
import { Calendar, Clock, User, MapPin, DollarSign, ChevronLeft, ChevronRight, Search, Eye } from 'lucide-react';

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

const statusColors: Record<BookingStatus, string> = {
  completed: 'bg-green-100 text-green-800',
  confirmed: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800'
};

const mapApiStatus = (apiStatus: string): BookingStatus => {
  const statusMap: Record<string, BookingStatus> = {
    'COMPLETED': 'completed',
    'CONFIRMED': 'confirmed',
    'PENDING': 'pending',
    'CANCELLED': 'cancelled'
  };
  return statusMap[apiStatus] || 'pending';
};

export default function BookingManagement() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage] = useState<number>(10);

  // Build query params
  const queryParams: Array<{ name: string; value: string }> = [
    { name: "page", value: String(currentPage) },
    { name: "limit", value: String(perPage) }
  ];

  if (searchText.trim()) {
    queryParams.push({ name: "searchTerm", value: searchText.trim() });
  }
  
  if (statusFilter && statusFilter !== "all") {
    queryParams.push({ name: "bookingStatus", value: statusFilter.toUpperCase() });
  }

  const { data: bookings, isLoading, isFetching } = useGetBookingsQuery(queryParams);
  const bookingData = bookings?.data?.data || [];
  const totalPages = bookings?.data?.meta?.totalPage || 1;
  const totalItems = bookings?.data?.meta?.total || 0;
  console.log(bookings)

  // Transform API data
  const transformedBookings: Booking[] = bookingData.map((booking: any) => ({
    id: booking._id,
    motherName: booking.parent?.name || 'N/A',
    nannyName: booking.nanny?.name || 'N/A',
    date: booking.hourlyBooking?.date || booking.fullDayBooking?.fullDays?.[0] || 'N/A',
    time: booking.hourlyBooking?.startTime || 'N/A',
    duration: booking.hourlyBooking ? 
      `${booking.hourlyBooking.startTime} - ${booking.hourlyBooking.endTime}` : 
      'Full Day',
    status: mapApiStatus(booking.bookingStatus),
    amount: booking.totalPayable || 0,
    location: 'N/A',
    services: [booking.bookingType || 'Standard Care']
  }));

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="my-6">
          <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600">Manage and monitor all booking activities</p>
        </div>

        <Card>
          <CardContent className='mt-6'>
            {/* Search and Filter */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by mother name..."
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 w-1/3"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading bookings...</div>
            ) : transformedBookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No bookings found</div>
            ) : (
              <>
                {/* Table */}
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className='bg-[#cd671c] text-white'>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Parent</TableHead>
                        <TableHead>Nanny</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transformedBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.id}</TableCell>
                          <TableCell>{booking.motherName}</TableCell>
                          <TableCell>{booking.nannyName}</TableCell>
                          <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                          <TableCell>{booking.time}</TableCell>
                          <TableCell className="text-right font-medium">${booking.amount}</TableCell>
                          <TableCell>
                            <Badge className={statusColors[booking.status]}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(booking)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination - Only show if totalPages > 1 */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, totalItems)} of {totalItems} bookings
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1 || isFetching}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              disabled={isFetching}
                              className="min-w-[40px]"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages || isFetching}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
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