'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div style={{ height: '300px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>Loading editor...</div>
});

/**
 * Rich Text Editor component for blog content editing.
 * Provides WYSIWYG editing with headings, formatting, highlights, lists, and more.
 */
export default function RichTextEditor({ value, onChange, placeholder = 'Write your content here...' }) {
  // Quill toolbar configuration
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'background': ['#fef08a', '#bbf7d0', '#bfdbfe', '#fecaca', '#e9d5ff', false] }], // Highlight colors
        [{ 'color': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['blockquote'],
        ['link'],
        ['clean']
      ]
    }
  }), []);

  // Quill formats configuration
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'background', 'color',
    'list', 'bullet',
    'blockquote',
    'link'
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ minHeight: '300px' }}
      />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          min-height: 250px;
          font-size: 1rem;
          font-family: inherit;
        }
        
        .rich-text-editor .ql-editor {
          min-height: 250px;
          line-height: 1.8;
        }
        
        .rich-text-editor .ql-toolbar {
          border-radius: 8px 8px 0 0;
          background: var(--bg-secondary);
          border-color: var(--border-color);
        }
        
        .rich-text-editor .ql-container {
          border-radius: 0 0 8px 8px;
          border-color: var(--border-color);
          background: var(--bg-primary);
        }
        
        .rich-text-editor .ql-editor.ql-blank::before {
          color: var(--text-muted);
          font-style: normal;
        }
        
        /* Dark theme adjustments */
        [data-theme="dark"] .rich-text-editor .ql-toolbar {
          background: var(--bg-secondary);
        }
        
        [data-theme="dark"] .rich-text-editor .ql-stroke {
          stroke: var(--text-secondary);
        }
        
        [data-theme="dark"] .rich-text-editor .ql-fill {
          fill: var(--text-secondary);
        }
        
        [data-theme="dark"] .rich-text-editor .ql-picker-label {
          color: var(--text-secondary);
        }
        
        [data-theme="dark"] .rich-text-editor .ql-editor {
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
