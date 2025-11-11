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
import { useBookingTransactionQuery } from '@/lib/store';
import { Calendar, DollarSign, User, ChevronLeft, ChevronRight, Search, Eye, CreditCard } from 'lucide-react';

type PaymentStatus = 'PAID' | 'PENDING' | 'FAILED';
type BookingStatus = 'COMPLETED' | 'CONFIRMED' | 'PENDING' | 'CANCELLED';

interface Transaction {
  id: string;
  parentName: string;
  parentEmail: string;
  nannyName: string;
  nannyEmail: string;
  bookingType: string;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  totalPayable: number;
  paymentIntentId: string;
  createdAt: string;
}

const paymentStatusColors: Record<PaymentStatus, string> = {
  PAID: 'bg-green-100 text-green-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  FAILED: 'bg-red-100 text-red-800'
};

const bookingStatusColors: Record<BookingStatus, string> = {
  COMPLETED: 'bg-green-100 text-green-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  CANCELLED: 'bg-red-100 text-red-800'
};

export default function TransactionManagement() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage] = useState<number>(1);

  // Build query params
  const queryParams: Array<{ name: string; value: string }> = [
    { name: "page", value: String(currentPage) },
    { name: "limit", value: String(perPage) }
  ];

  if (searchText.trim()) {
    queryParams.push({ name: "searchTerm", value: searchText.trim() });
  }
  
  if (dateFilter && dateFilter !== "all") {
    queryParams.push({ name: "dateFilter", value: dateFilter });
  }

  const { data: transactions, isLoading, isFetching, error } = useBookingTransactionQuery(queryParams);
//   console.log(transactions);
  
  // Handle both successful empty response and error response
  const hasError = error || transactions?.success === false;
  const transactionData = hasError ? [] : (transactions?.data?.data || []);
  const totalPages = hasError ? 1 : (transactions?.data?.meta?.totalPage || 1);
  const totalItems = hasError ? 0 : (transactions?.data?.meta?.total || 0);

  // Transform API data
  const transformedTransactions: Transaction[] = transactionData.map((transaction: any) => ({
    id: transaction._id,
    parentName: transaction.parentId?.name || 'N/A',
    parentEmail: transaction.parentId?.email || 'N/A',
    nannyName: transaction.nannyId?.name || 'N/A',
    nannyEmail: transaction.nannyId?.email || 'N/A',
    bookingType: transaction.bookingType || 'N/A',
    bookingStatus: transaction.bookingStatus || 'PENDING',
    paymentStatus: transaction.paymentStatus || 'PENDING',
    totalPayable: transaction.totalPayable || 0,
    paymentIntentId: transaction.paymentIntentId || 'N/A',
    createdAt: transaction.createdAt
  }));

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleDateFilter = (value: string) => {
    setDateFilter(value);
    setCurrentPage(1);
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="my-6">
          <h1 className="text-3xl font-bold text-gray-900">Transaction Management</h1>
          <p className="text-gray-600">Manage and monitor all payment transactions</p>
        </div>

        <Card>
          <CardContent className='mt-6'>
            {/* Search and Filter */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by parent or nanny name..."
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={dateFilter} onValueChange={handleDateFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading && !isFetching ? (
              <div className="text-center py-8">Loading transactions...</div>
            ) : transformedTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {hasError ? 'No transactions found for the selected filters' : 'No transactions found'}
              </div>
            ) : (
              <>
                {/* Table */}
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Parent</TableHead>
                        <TableHead>Nanny</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Payment Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transformedTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{transaction.id.slice(-8)}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{transaction.parentName}</div>
                              <div className="text-xs text-gray-500">{transaction.parentEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{transaction.nannyName}</div>
                              <div className="text-xs text-gray-500">{transaction.nannyEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {transaction.bookingType}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">${transaction.totalPayable}</TableCell>
                          <TableCell>
                            <Badge className={paymentStatusColors[transaction.paymentStatus]}>
                              {transaction.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{formatDate(transaction.createdAt)}</TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(transaction)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination - Only show if we have data */}
                {!hasError && totalPages > 0 && (
                  <div className="flex items-center justify-end mt-6 pt-4 border-t">
                    {/* <div className="text-sm text-gray-600">
                      {totalItems > 0 ? (
                        <>
                          Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, totalItems)} of {totalItems} transactions
                        </>
                      ) : (
                        'No transactions to display'
                      )}
                    </div> */}
                    
                    {totalPages > 1 && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages || isFetching}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Transaction Details Modal */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
              <DialogDescription>
                Complete information about transaction
              </DialogDescription>
            </DialogHeader>
            
            {selectedTransaction && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Parent</p>
                      <p className="font-medium">{selectedTransaction.parentName}</p>
                      <p className="text-xs text-gray-500">{selectedTransaction.parentEmail}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Nanny</p>
                      <p className="font-medium">{selectedTransaction.nannyName}</p>
                      <p className="text-xs text-gray-500">{selectedTransaction.nannyEmail}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Transaction Date</p>
                      <p className="font-medium">{formatDate(selectedTransaction.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Payment Intent ID</p>
                      <p className="font-medium text-xs">{selectedTransaction.paymentIntentId}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-medium text-2xl">${selectedTransaction.totalPayable}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Booking Type</p>
                    <Badge variant="outline" className="text-sm">
                      {selectedTransaction.bookingType}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Payment Status</p>
                    <Badge className={paymentStatusColors[selectedTransaction.paymentStatus]}>
                      {selectedTransaction.paymentStatus}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Booking Status</p>
                    <Badge className={bookingStatusColors[selectedTransaction.bookingStatus]}>
                      {selectedTransaction.bookingStatus}
                    </Badge>
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