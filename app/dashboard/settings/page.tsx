import React, { Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import SettingsContent from './settings-content';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-6">Loading settings...</div>}>
        <SettingsContent />
      </Suspense>
    </DashboardLayout>
  );
}
