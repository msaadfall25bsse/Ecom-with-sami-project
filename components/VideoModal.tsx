import React from 'react';
import { X, Play } from 'lucide-react';

export function VideoModal({ 
  isOpen, 
  onClose, 
  videoUrl, 
  title 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  videoUrl?: string; 
  title?: string;
}) {
  if (!isOpen) return null;

  const url = videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ";

  // Check if it's a direct video file uploaded to server or ending in video extension
  const isDirectVideo = Boolean(
    url.startsWith('/uploads/') ||
    url.startsWith('http://localhost:5000/uploads/') ||
    url.startsWith('blob:') ||
    /\.(mp4|webm|mov|mkv|ogg|m4v)($|\?)/i.test(url)
  );

  // Normalize YouTube URLs if user entered standard watch URL
  let embedUrl = url;
  if (!isDirectVideo) {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '18px'
      }} 
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#0F172A',
          borderRadius: '16px',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '860px',
          boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#1E293B',
          color: '#FFFFFF'
        }}>
          <h3 style={{ fontSize: '0.98rem', fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Play size={16} color="var(--primary)" fill="var(--primary)" />
            <span>{title || 'Video Player'}</span>
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.3)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
            aria-label="Close Video"
          >
            <X size={18} />
          </button>
        </div>

        {/* Video Player Box */}
        <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000000' }}>
          {isDirectVideo ? (
            <video
              src={embedUrl}
              controls
              autoPlay={false}
              preload="metadata"
              playsInline
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                backgroundColor: '#000000'
              }}
            >
              Your browser does not support HTML5 video playback.
            </video>
          ) : (
            <iframe
              src={embedUrl}
              title={title || "Video Player"}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  );
}
