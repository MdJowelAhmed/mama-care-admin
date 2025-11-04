'use client';

import React, { useState, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';
import toast from 'react-hot-toast';
import { useGetAboutUsQuery, useUpdateAboutUsMutation } from '@/lib/store';

export function AboutUsSettings() {
  const { data: aboutData, isLoading, isError } = useGetAboutUsQuery({});
  const [updateAbout, { isLoading: isUpdatingAbout }] = useUpdateAboutUsMutation();
  
  const [aboutContent, setAboutContent] = useState<string>(
    aboutData?.data?.content || ''
  );

  useEffect(() => {
    if (aboutData?.data?.content) {
      setAboutContent(aboutData.data.content);
    }
  }, [aboutData]);

  const handleSaveAbout = async () => {
    try {
     const res= await updateAbout({
        content: aboutContent,
        type: 'about'
      }).unwrap();
      console.log(res)
      toast.success('About Us content saved successfully!');
    } catch (error) {
      toast.error('Failed to save About Us content');
      console.error('Error saving about us:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64 ">
        <div className="text-lg text-red-500">About Us data not found</div>
      </div>
    );
  }

  return (
    <RichTextEditor
      title="About Us"
      description="Edit your application's about us content"
      content={aboutContent}
      onContentChange={setAboutContent}
      onSave={handleSaveAbout}
      placeholder="Enter your about us content here..."
      isLoading={isUpdatingAbout}
    />
  );
}