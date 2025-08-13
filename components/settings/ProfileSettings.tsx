'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUpdateProfileMutation } from '@/lib/store';
import { Save, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

interface CurrentUser {
  name: string;
  email: string;
  role: string;
  avatar: string;
  joinDate: string;
}

interface ProfileData {
  name: string;
  email: string;
}

interface ProfileSettingsProps {
  currentUser: CurrentUser;
}

export function ProfileSettings({ currentUser }: ProfileSettingsProps) {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: currentUser.name,
    email: currentUser.email
  });
  
  const [profileError, setProfileError] = useState<string>('');
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileError('');
    
    try {
      await updateProfile(profileData).unwrap();
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      const errorMessage = err.data?.message || 'Failed to update profile';
      setProfileError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal information and profile details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          {profileError && (
            <Alert variant="destructive">
              <AlertDescription>{profileError}</AlertDescription>
            </Alert>
          )}
          
          {/* Avatar Section */}
          <div className="flex items-center space-x-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Change Photo
              </Button>
              <p className="text-sm text-gray-500 mt-1">
                JPG, GIF or PNG. 1MB max.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={currentUser.role} disabled />
            </div>
            
            <div className="space-y-2">
              <Label>Member Since</Label>
              <Input value={new Date(currentUser.joinDate).toLocaleDateString()} disabled />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-[#CD671C] hover:bg-[#B85A18] text-white"
              disabled={isUpdatingProfile}
            >
              <Save className="mr-2 h-4 w-4" />
              {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}