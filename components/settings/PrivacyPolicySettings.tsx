'use client';

import React, { useState, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';
import toast from 'react-hot-toast';
import { useGetPrivacyPolicyQuery, useUpdatePrivacyPolicyMutation } from '@/lib/store';

export function PrivacyPolicySettings() {
  const { data: privacyData, isLoading, isError } = useGetPrivacyPolicyQuery({});
  const [updatePrivacy, { isLoading: isUpdatingPrivacy }] = useUpdatePrivacyPolicyMutation();
  
  const [privacyContent, setPrivacyContent] = useState<string>('');

  // Load API content when it arrives
  useEffect(() => {
    if (privacyData?.data?.content) {
      setPrivacyContent(privacyData.data.content);
    }
  }, [privacyData]);

  const handleSavePrivacy = async () => {
    try {
      await updatePrivacy({
        content: privacyContent,
        type: 'privacy'
      }).unwrap();
      
      toast.success('Privacy Policy saved successfully!');
    } catch (error: any) {
      toast.error('Failed to save Privacy Policy');
      console.error('Error saving privacy policy:', error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Render editor even if there's no content or API error
  return (
    <div className="space-y-4">
      {isError && (
        <div className="text-red-500 text-center">
          Privacy Policy data not found. You can create it below.
        </div>
      )}
      <RichTextEditor
        title="Privacy Policy"
        description="Edit your application's privacy policy"
        content={privacyContent}
        onContentChange={setPrivacyContent}
        onSave={handleSavePrivacy}
        placeholder="Enter your privacy policy here..."
        isLoading={isUpdatingPrivacy}
      />
    </div>
  );
}
