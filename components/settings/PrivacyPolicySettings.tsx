'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import RichTextEditor from './RichTextEditor';
import { useGetPrivacyPolicyQuery, useUpdatePrivacyPolicyMutation } from '@/lib/store';

export function PrivacyPolicySettings() {
  const { data: privacyData, isLoading, isError } = useGetPrivacyPolicyQuery({});
  const [updatePrivacy, { isLoading: isUpdatingPrivacy }] = useUpdatePrivacyPolicyMutation();
  
  const [privacyContent, setPrivacyContent] = useState<string>('');

  // Load API content whenever available
  useEffect(() => {
    if (privacyData?.data?.content) {
      setPrivacyContent(privacyData.data.content);
    }
  }, [privacyData]);

  const handleSavePrivacy = async () => {
    if (!privacyContent.trim()) {
      toast.error('Privacy Policy content cannot be empty');
      return;
    }

    try {
      const result = await updatePrivacy({
        content: privacyContent,
        type: 'privacy',
      }).unwrap();

      toast.success('Privacy Policy saved successfully!');
      console.log('Privacy policy updated:', result);
    } catch (error: any) {
      console.error('Error saving privacy policy:', error);
      toast.error(error?.data?.message || 'Failed to save Privacy Policy');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isError && (
        <div className="text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-4 text-center">
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
