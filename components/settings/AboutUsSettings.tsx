'use client';

import React, { useState, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';
import toast from 'react-hot-toast';
import { useGetAboutUsQuery, useUpdateAboutUsMutation } from '@/lib/store';

export function AboutUsSettings() {
  const { data: aboutData, isLoading, isError } = useGetAboutUsQuery({});
  const [updateAbout, { isLoading: isUpdatingAbout }] = useUpdateAboutUsMutation();
  
  const [aboutContent, setAboutContent] = useState<string>('');

  // Load API content if available
  useEffect(() => {
    if (aboutData?.data?.content) {
      setAboutContent(aboutData.data.content);
    }
  }, [aboutData]);

  const handleSaveAbout = async () => {
    try {
      // Check if content is empty
      if (!aboutContent || aboutContent.trim() === '') {
        toast.error('Content cannot be empty');
        return;
      }

      console.log('Sending data:', { content: aboutContent, type: 'about' });
      
      const res = await updateAbout({
        content: aboutContent,
        type: 'about'
      }).unwrap();
      
      console.log('Response:', res);
      toast.success('About Us content saved successfully!');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to save About Us content');
      console.error('Error saving About Us:', error);
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

  // Always show editor even if API error or no data
  return (
    <div className="space-y-4">
      {isError && (
        <div className="text-red-500 text-center">
          About Us data not found. You can create it below.
        </div>
      )}
      <RichTextEditor
        title="About Us"
        description="Edit your application's about us content"
        content={aboutContent}
        onContentChange={(newContent) => {
          console.log('Content changed:', newContent);
          setAboutContent(newContent);
        }}
        onSave={handleSaveAbout}
        placeholder="Enter your About Us content here..."
        isLoading={isUpdatingAbout}
      />
    </div>
  );
}