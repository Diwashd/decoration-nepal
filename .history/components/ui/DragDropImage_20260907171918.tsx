'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface DragDropImageProps {
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'wide';
  maxSizeMB?: number;
  uploadFolder?: 'gallery' | 'services' | 'packages' | 'destinations' | 'blog' | 'misc';
}

export default function DragDropImage({
  value,
  onChange,
  placeholder = 'Drag & drop an image here, or click to browse',
  className = '',
  aspectRatio = 'video',
  maxSizeMB = 5,
  uploadFolder = 'misc',
}: DragDropImageProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string>(value || '');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    wide: 'aspect-[21/9]',
  };

  const handleFile = useCallback((file: File) => {
    setError('');

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image must be under ${maxSizeMB}MB`);
      return;
    }

    const upload = async () => {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', uploadFolder);
      try {
        const response = await fetch('/api/uploads', { method: 'POST', body: formData });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.error || 'Upload failed');
        setPreview(result.url);
        onChange(result.url);
      } catch (uploadError) {
        setError(uploadError instanceof Error ? uploadError.message : 'Upload failed');
      } finally {
        setIsUploading(false);
      }
    };
    void upload();
  }, [onChange, maxSizeMB, uploadFolder]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview('');
    setError('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPreview(url);
    onChange(url);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative cursor-pointer rounded-xl border-2 border-dashed transition-all overflow-hidden
          ${aspectClasses[aspectRatio]}
          ${isDragging
            ? 'border-primary bg-primary/10 scale-[1.02]'
            : preview
              ? 'border-outline-variant hover:border-primary/50'
              : 'border-outline-variant hover:border-primary/50 bg-surface-container-high'
          }
          ${preview ? '' : 'flex items-center justify-center'}
        `}
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-center">
                <Upload className="w-8 h-8 text-white mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Drop new image or click to replace</p>
              </div>
            </div>
            {/* Remove button */}
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
            >
              <X className="w-3 h-3" />
            </button>
          </>
        ) : (
          <div className="text-center p-6">
            <ImageIcon className={`w-10 h-10 mx-auto mb-3 transition-colors ${isDragging ? 'text-primary' : 'text-on-surface-variant/50'}`} />
            <p className="text-sm text-on-surface-variant mb-1">{isUploading ? 'Saving image...' : placeholder}</p>
            <p className="text-xs text-on-surface-variant/50">PNG, JPG, WebP up to {maxSizeMB}MB</p>
          </div>
        )}
      </div>

      {/* URL Input */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-on-surface-variant">Or paste URL:</span>
        <input
          type="url"
          value={typeof preview === 'string' && preview.startsWith('http') ? preview : ''}
          onChange={handleUrlInput}
          placeholder="https://example.com/image.jpg"
          className="flex-1 bg-surface-container-high border border-outline-variant rounded-lg px-3 py-1.5 text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
}
