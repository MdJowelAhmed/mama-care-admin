import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease';
  icon: LucideIcon;
}

export function StatCard({ title, value, change, changeType, icon: Icon }: StatCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow bg-[#cd671c] text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
        <CardTitle className="text-xl font-medium text-white p-0">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-white ">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            {changeType === 'increase' ? (
              <TrendingUp className="h-3 w-3 text-white mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-white mr-1" />
            )}
            <span className={changeType === 'increase' ? 'text-white' : 'text-white'}>
              {change}
            </span>
            {' '}from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}