"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetDashboardStatsQuery } from "@/lib/store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import {
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  Baby,
  Heart,
} from "lucide-react";
import { set } from "date-fns";

interface MockStats {
  totalRevenue: number;
  totalBookings: number;
  totalUsers: number;
  activeNannies: number;
}

interface UserData {
  name: string;
  parents: number;
  nannies: number;
}

interface RevenueData {
  name: string;
  revenue: number;
  bookings: number;
}

type TimeFilter = "6months" | "1month" | "3months" | "1year";

// Mock data - replace with real API data
const mockStats: MockStats = {
  totalRevenue: 45000,
  totalBookings: 1250,
  totalUsers: 3240,
  activeNannies: 180,
  // revenueChange: '+12%',
  // bookingChange: '+8%',
  // userChange: '+15%',
  // nannyChange: '+5%'
};

const mockUserData: UserData[] = [
  { name: "Jan", parents: 120, nannies: 50 },
  { name: "Feb", parents: 150, nannies: 70 },
  { name: "Mar", parents: 180, nannies: 60 },
  { name: "Apr", parents: 220, nannies: 40 },
  { name: "May", parents: 220, nannies: 75 },
  { name: "Jun", parents: 240, nannies: 42 },
  { name: "Jul", parents: 120, nannies: 60 },
  { name: "Aug", parents: 150, nannies: 18 },
  { name: "Sep", parents: 180, nannies: 22 },
  { name: "Oct", parents: 220, nannies: 86 },
  { name: "Nov", parents: 210, nannies: 35 },
  { name: "Dec", parents: 220, nannies: 42 },
];

const mockRevenueData: RevenueData[] = [
  { name: "Jan", revenue: 12000, bookings: 200 },
  { name: "Feb", revenue: 45000, bookings: 250 },
  { name: "Mar", revenue: 60000, bookings: 100 },
  { name: "Apr", revenue: 22000, bookings: 380 },
  { name: "May", revenue: 28000, bookings: 250 },
  { name: "Jun", revenue: 35000, bookings: 520 },
  { name: "Jul", revenue: 40000, bookings: 200 },
  { name: "Aug", revenue: 15000, bookings: 250 },
  { name: "Sep", revenue: 37000, bookings: 300 },
  { name: "Oct", revenue: 45000, bookings: 280 },
  { name: "Nov", revenue: 28000, bookings: 150 },
  { name: "Dec", revenue: 35000, bookings: 320 },
];

export default function DashboardOverview() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("6months");
  const [user, setUser] = useState<TimeFilter>("1month");
  // const { data: stats, isLoading } = useGetDashboardStatsQuery(timeFilter);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="text-gray-600">
              Welcome back! Here`s what`s happening with your platform.
            </p>
          </div>
          <Select value={timeFilter} onValueChange={(value: TimeFilter) => setTimeFilter(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`$${mockStats.totalRevenue.toLocaleString()}`}
            // change={mockStats.revenueChange}
            changeType="increase"
            icon={DollarSign}
          />
          <StatCard
            title="Total Bookings"
            value={mockStats.totalBookings.toLocaleString()}
            // change={mockStats.bookingChange}
            changeType="increase"
            icon={Calendar}
          />
          <StatCard
            title="Total Users"
            value={mockStats.totalUsers.toLocaleString()}
            // change={mockStats.userChange}
            changeType="increase"
            icon={Users}
          />
          <StatCard
            title="Active Nannies"
            value={mockStats.activeNannies.toString()}
            // change={mockStats.nannyChange}
            changeType="increase"
            icon={Baby}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6">
          {/* User Distribution Chart */}
          <Card>
            <CardHeader >
              <div className="flex justify-between items-center">
                <div>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Users Overview
                </CardTitle>
                <CardDescription>
                  Monthly distribution of mothers and nannies
                </CardDescription>
              </div>

              <div>
                <Select value={user} onValueChange={(value: TimeFilter) => setUser(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">Last Month</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="1year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={mockUserData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="parents" fill="#CD671C" name="Mothers" />
                  <Bar dataKey="nannies" fill="#F59E0B" name="Nannies" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Revenue & Bookings Trend
              </CardTitle>
              <CardDescription>
                Monthly revenue and booking trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={mockRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#CD671C"
                    fill="#CD671C"
                    fillOpacity={0.1}
                    name="Revenue ($)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="bookings"
                    stroke="#CD671C"
                    strokeWidth={2}
                    name="Bookings"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
