import React, { useEffect } from 'react';
import styles from './VideoModal.module.css';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoUrl, title }) => {
  console.log('VideoModal render:', { isOpen, videoUrl, title });
  
  // Manage scroll position when modal opens
  useEffect(() => {
    console.log('VideoModal useEffect triggered, isOpen:', isOpen);
    if (isOpen) {
      // Just scroll to top to ensure modal is visible, but don't prevent scrolling
      window.scrollTo(0, 0);
    }
  }, [isOpen]);

  if (!isOpen) {
    console.log('VideoModal not rendering - isOpen is false');
    return null;
  }

  console.log('VideoModal rendering with videoUrl:', videoUrl);

  // Extract video ID from YouTube URL with better parsing
  const getVideoId = (url: string) => {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
      /youtu\.be\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  const videoId = getVideoId(videoUrl);
  // Remove autoplay to avoid browser restrictions
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : '';

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className={styles['video-modal-overlay']} 
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div 
        className={styles['video-modal-content']}
      >
        <div className={styles['video-modal-header']}>
          <h3>{title} - Trailer</h3>
          <button className={styles['close-button']} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles['video-container']}>
          {videoId ? (
            <iframe
              src={embedUrl}
              title={`${title} Trailer`}
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className={styles['error-message']}>
              <p>Unable to load video trailer</p>
              <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '10px' }}>
                URL: {videoUrl}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoModal; 