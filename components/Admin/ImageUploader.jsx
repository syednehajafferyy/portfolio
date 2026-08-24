'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ImageUploader({ value, onChange, label = "Project Image" }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (.png, .jpg, .jpeg, .webp, .svg)');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onChange(data.url);
      } else {
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      setError('Network error during upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <label style={{
        display: 'block',
        fontSize: '1.3rem',
        fontWeight: '600',
        marginBottom: '0.8rem',
        color: '#cbd5e1',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {label} (Drag & Drop or Browse File)
      </label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? 'hsl(var(--color-primary))' : '#334155'}`,
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: isDragging ? 'rgba(255, 214, 0, 0.05)' : '#11141c',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          position: 'relative'
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            cursor: 'pointer',
            width: '100%',
            height: '100%'
          }}
        />

        {value ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '120px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #334155' }}>
              <Image src={value} alt="Preview" fill style={{ objectFit: 'cover' }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ color: '#86efac', fontWeight: '600', fontSize: '1.3rem' }}>✓ Image Uploaded</p>
              <p style={{ color: '#94a3b8', fontSize: '1.2rem', wordBreak: 'break-all', maxWidth: '280px' }}>{value}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange('');
                }}
                style={{
                  marginTop: '0.5rem',
                  background: 'none',
                  border: 'none',
                  color: '#f87171',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Remove / Upload Another
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem', color: 'hsl(var(--color-primary))' }}>📁</div>
            <p style={{ fontSize: '1.4rem', color: '#e2e8f0', fontWeight: '600' }}>
              {uploading ? 'Uploading image...' : 'Drag & Drop your image here'}
            </p>
            <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginTop: '0.4rem' }}>
              or click anywhere to browse images from your PC
            </p>
          </div>
        )}
      </div>

      {error && <p style={{ color: '#f87171', fontSize: '1.2rem', marginTop: '0.5rem' }}>{error}</p>}
    </div>
  );
}
