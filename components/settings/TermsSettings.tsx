'use client';

import React, { useState, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';
import toast from 'react-hot-toast';
import { useGetTermsAndConditionQuery, useUpdateTermsAndConditionMutation } from '@/lib/store';

export function TermsSettings() {
  const { data: termsData, isLoading, isError, refetch } = useGetTermsAndConditionQuery({});
  const [updateTerms, { isLoading: isUpdatingTerms }] = useUpdateTermsAndConditionMutation();

  // Initialize with empty string if no data
  const [termsContent, setTermsContent] = useState<string>('');

  useEffect(() => {
    if (termsData?.data?.content) {
      setTermsContent(termsData.data.content);
    }
  }, [termsData]);

  const handleSaveTerms = async () => {
    try {
      console.log('Sending data to backend:', {
        content: termsContent,
        type: 'terms'
      });

      const response = await updateTerms({
        content: termsContent,
        type: 'terms'
      }).unwrap();

      console.log('Backend response:', response);
      await refetch();
      toast.success('Terms & Conditions saved successfully!');
    } catch (error: any) {
      console.error('Error details:', {
        message: error?.message,
        status: error?.status,
        data: error?.data,
        fullError: error
      });
      toast.error('Failed to save Terms & Conditions');
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

  // Show a message if there is an actual API/network error
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-lg text-red-500">Failed to load Terms & Conditions</div>
        {/* Still show the editor */}
        <RichTextEditor
          title="Terms & Conditions"
          description="Edit your application's terms and conditions"
          content={termsContent}
          onContentChange={setTermsContent}
          onSave={handleSaveTerms}
          placeholder="Enter your terms and conditions here..."
          isLoading={isUpdatingTerms}
        />
      </div>
    );
  }

  // Render the editor always
  return (
    <RichTextEditor
      title="Terms & Conditions"
      description="Edit your application's terms and conditions"
      content={termsContent}
      onContentChange={setTermsContent}
      onSave={handleSaveTerms}
      placeholder="Enter your terms and conditions here..."
      isLoading={isUpdatingTerms}
    />
  );
}
