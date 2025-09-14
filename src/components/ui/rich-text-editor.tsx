import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter detailed description...",
  className
}) => {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image'],
      ['blockquote', 'code-block'],
      [{ 'align': [] }],
      ['clean']
    ],
  }), []);

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'link', 'image', 'blockquote', 'code-block', 'align'
  ];

  return (
    <div className={cn("rich-text-editor", className)}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          backgroundColor: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          borderRadius: '6px',
          border: '1px solid hsl(var(--border))'
        }}
      />
      <style>{`
        .ql-toolbar {
          background: hsl(var(--muted));
          border: 1px solid hsl(var(--border)) !important;
          border-bottom: none !important;
          border-radius: 6px 6px 0 0;
        }
        
        .ql-container {
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 0 0 6px 6px;
          background: hsl(var(--background));
          color: hsl(var(--foreground));
        }
        
        .ql-editor {
          color: hsl(var(--foreground));
          min-height: 120px;
        }
        
        .ql-editor.ql-blank::before {
          color: hsl(var(--muted-foreground));
        }
        
        .ql-snow .ql-stroke {
          stroke: hsl(var(--foreground));
        }
        
        .ql-snow .ql-fill {
          fill: hsl(var(--foreground));
        }
        
        .ql-snow .ql-picker-label {
          color: hsl(var(--foreground));
        }
        
        .ql-snow .ql-picker-options {
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
        }
        
        .ql-snow .ql-picker-item:hover {
          background: hsl(var(--muted));
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;