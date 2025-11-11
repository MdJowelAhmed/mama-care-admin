'use client';

import React, { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save, Loader2 } from 'lucide-react';

// Dynamically import JoditEditor (no SSR)
const JoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[300px] border rounded-md">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  ),
});

// Simple debounce utility
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

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
  isLoading = false,
}: RichTextEditorProps) {
  const editor = useRef(null);
  const [localContent, setLocalContent] = useState(content);
  const isInitialMount = useRef(true);

  // 🕒 Debounce local content before syncing to parent
  const debouncedContent = useDebounce(localContent, 500);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder,
      height: 300,
      toolbar: true,
      spellcheck: true,
      language: 'en',
      toolbarButtonSize: 'middle' as const,
      theme: 'default',
      enableDragAndDropFileToEditor: true,
      uploader: { insertImageAsBase64URI: true },
      buttons: [
        'source', '|',
        'bold', 'italic', 'underline', 'strikethrough', '|',
        'ul', 'ol', '|',
        'outdent', 'indent', '|',
        'font', 'fontsize', 'brush', 'paragraph', '|',
        'image', 'link', 'table', '|',
        'align', 'undo', 'redo', '|',
        'hr', 'eraser', 'copyformat', '|',
        'symbol', 'fullsize', 'print', 'about',
      ],
      processPasteHTML: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: 'insert_clear_html' as const,
    }),
    [placeholder]
  );

  // Update local editor content when external content changes (only if different)
  useEffect(() => {
    if (isInitialMount.current) {
      setLocalContent(content);
      isInitialMount.current = false;
    } else if (content && content !== localContent) {
      setLocalContent(content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  // 🔁 Send debounced content updates to parent
  useEffect(() => {
    onContentChange(debouncedContent);
  }, [debouncedContent, onContentChange]);

  // Handle live typing
  const handleContentChange = useCallback((newContent: string) => {
    setLocalContent(newContent);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`content-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              Content
            </Label>
            <div className="min-h-[300px] border rounded-md overflow-hidden">
              <JoditEditor
                ref={editor}
                value={localContent}
                config={{ ...config, readonly: isLoading }}
                onChange={handleContentChange}
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button
              onClick={onSave}
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
