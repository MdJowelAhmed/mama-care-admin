'use client';

import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save, Loader2 } from 'lucide-react';

const JoditEditor = dynamic(() => import('jodit-react'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-[300px] border rounded-md">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  </div>
});

interface RichTextEditorProps {
  title: string;
  description: string;
  content: string;
  onContentChange: (content: string) => void;
  onSave: () => void;
  placeholder?: string;
  isLoading?: boolean;
}

export default function RichTextEditor({
  title,
  description,
  content,
  onContentChange,
  onSave,
  placeholder = 'Enter your content here...',
  isLoading = false
}: RichTextEditorProps) {
  const editor = useRef(null);
  const contentRef = useRef(content);

  const config = useMemo(() => ({
    readonly: false,
    placeholder: placeholder,
    height: 300,
    toolbar: true,
    spellcheck: true,
    language: 'en',
    toolbarButtonSize: 'medium',
    theme: 'default',
    enableDragAndDropFileToEditor: true,
    uploader: {
      insertImageAsBase64URI: true
    },
    buttons: [
      'source', '|',
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'superscript', 'subscript', '|',
      'ul', 'ol', '|',
      'outdent', 'indent', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'image', 'link', 'table', '|',
      'align', 'undo', 'redo', '|',
      'hr', 'eraser', 'copyformat', '|',
      'symbol', 'fullsize', 'print', 'about'
    ],
    processPasteHTML: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_clear_html' as const
  }), [placeholder]);

  const [localContent, setLocalContent] = useState(content);
  
  useEffect(() => {
    setLocalContent(content);
    contentRef.current = content;
  }, [content]);

  const handleContentChange = useCallback((newContent: string) => {
    setLocalContent(newContent);
    contentRef.current = newContent;
  }, []);

  const handleBlur = useCallback((newContent: string) => {
    contentRef.current = newContent;
    onContentChange(newContent);
  }, [onContentChange]);

  const handleSaveClick = useCallback(() => {
    onContentChange(contentRef.current);
    setTimeout(() => {
      onSave();
    }, 100);
  }, [onContentChange, onSave]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`content-${title.toLowerCase().replace(/\s+/g, '-')}`}>Content</Label>
            {JoditEditor ? (
              <div className="min-h-[300px] border rounded-md overflow-hidden">
                <JoditEditor
                  ref={editor}
                  value={localContent}
                  config={{
                    ...config,
                    toolbarButtonSize: 'middle' as const,
                    readonly: isLoading
                  }}
                  onBlur={handleBlur}
                  onChange={handleContentChange}
                />
              </div>
            ) : (
              <Textarea
                id={`content-${title.toLowerCase().replace(/\s+/g, '-')}`}
                placeholder={placeholder}
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                rows={15}
                className="resize-none min-h-[300px]"
                disabled={isLoading}
              />
            )}
          </div>
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSaveClick}
              disabled={isLoading}
              className="bg-[#CD671C] hover:bg-[#B85A18] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save {title}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}