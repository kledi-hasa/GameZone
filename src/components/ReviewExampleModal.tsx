import React from 'react';
import './ReviewExampleModal.module.css';

interface ReviewExampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameTitle: string;
}

const ReviewExampleModal: React.FC<ReviewExampleModalProps> = ({ isOpen, onClose, gameTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="review-example-modal-overlay">
      <div className="review-example-modal">
        <div className="review-example-header">
          <h2>👁️ What others see when reading reviews</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="review-example-content">
          <div className="review-user-info">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="profile-pic" />
            <span className="username">GamerDude42</span>
            <span className="anonymous">(or Anonymous)</span>
          </div>
          <div className="review-stars">
            {[1,2,3,4,5].map(i => (
              <span key={i} className="star filled">★</span>
            ))}
          </div>
          <div className="review-title">Amazing Game!</div>
          <div className="review-text">
            I absolutely loved playing <b>{gameTitle}</b>. The graphics are stunning and the gameplay kept me hooked for hours. Highly recommended!
          </div>
          <div className="review-meta">
            <span className="game-time">Played for 45 hours</span>
          </div>
          <div className="review-helpful">
            <span>Was this helpful?</span>
            <button className="thumb-btn">👍</button>
            <button className="thumb-btn">👎</button>
          </div>
          <div className="review-dev-response">
            <div className="dev-label">Developer Response:</div>
            <div className="dev-text">Thank you for your feedback! We're glad you enjoyed the game and appreciate your support.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewExampleModal; 