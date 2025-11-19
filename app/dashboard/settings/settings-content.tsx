'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ProfileSettings, 
  PasswordSettings, 
  TermsSettings, 
  PrivacyPolicySettings, 
  AboutUsSettings 
} from '@/components/settings';
import { User, Lock, FileText, Shield, Info } from 'lucide-react';

type TabValue = 'profile' | 'password' | 'terms' | 'policy' | 'about';

export default function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the current tab from URL (default = 'profile')
  const activeTab = (searchParams.get('tab') as TabValue) || 'profile';

  // When tab changes, update URL (without reload)
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', value);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your profile and application settings</p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User size={16} />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center space-x-2">
            <Lock size={16} />
            <span>Password</span>
          </TabsTrigger>
          <TabsTrigger value="terms" className="flex items-center space-x-2">
            <FileText size={16} />
            <span>Terms</span>
          </TabsTrigger>
          <TabsTrigger value="policy" className="flex items-center space-x-2">
            <Shield size={16} />
            <span>Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center space-x-2">
            <Info size={16} />
            <span>About Us</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="password">
          <PasswordSettings />
        </TabsContent>

        <TabsContent value="terms">
          <TermsSettings />
        </TabsContent>

        <TabsContent value="policy">
          <PrivacyPolicySettings />
        </TabsContent>

        <TabsContent value="about">
          <AboutUsSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
