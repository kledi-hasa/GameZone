import React, { useEffect } from 'react';
import styles from './ReviewModal.module.css';
import { useGameContext } from '../context/GameContext';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameTitle: string;
  gameRating: number;
  gameId: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  gameTitle,
  gameRating,
  gameId
}) => {
  const { comments, addComment } = useGameContext();

  // Manage scroll position when modal opens
  useEffect(() => {
    if (isOpen) {
      // Scroll to top to ensure modal is visible
      window.scrollTo(0, 0);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scrolling when modal closes
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore body scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Filter comments for this game
  const reviews = comments.filter(comment => comment.gameId === gameId);

  // Render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? styles.star : styles['star-inactive']}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + (review.rating ?? 0), 0) / reviews.length
      : gameRating;
  const totalReviews = reviews.length;

  // Filter reviews by rating
  const [selectedRating, setSelectedRating] = React.useState<number | null>(null);
  const [showAddReview, setShowAddReview] = React.useState(false);
  const [userRating, setUserRating] = React.useState(0);
  const [userComment, setUserComment] = React.useState('');
  const [userName, setUserName] = React.useState('');
  
  const filteredReviews = selectedRating 
    ? reviews.filter(review => review.rating === selectedRating)
    : reviews;

  const handleSubmitReview = () => {
    if (userRating === 0) {
      alert('Please select a rating');
      return;
    }
    if (userComment.trim() === '') {
      alert('Please write a review comment');
      return;
    }
    if (userName.trim() === '') {
      alert('Please enter your name');
      return;
    }
    // Add review to context
    addComment({
      gameId,
      username: userName.trim(),
      content: userComment.trim(),
      isInappropriate: false,
      userId: '', // Optionally, set userId if you have user auth
      rating: userRating
    });
  };

  const handleStarClick = (rating: number) => {
    setUserRating(rating);
  };

  if (!isOpen) return null;

  return (
    <div className={styles['review-modal-overlay']} onClick={onClose}>
      <div className={styles['review-modal']} onClick={(e) => e.stopPropagation()}>
        <div className={styles['review-modal-header']}>
          <div className={styles['review-header-info']}>
            <h2 className={styles['review-modal-title']}>Customer Reviews</h2>
            <p className={styles['review-game-title']}>{gameTitle}</p>
          </div>
          <button className={styles['review-close-button']} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles['review-summary-section']}>
          <div className={styles['overall-rating']}>
            <div className={styles['rating-display']}>
              <span className={styles['rating-number']}>{averageRating.toFixed(1)}</span>
              <div className={styles['rating-stars']}>{renderStars(Math.round(averageRating))}</div>
            </div>
            <span className={styles['total-reviews']}>Based on {totalReviews} reviews</span>
          </div>
          
          <div className={styles['rating-breakdown']}>
            <h3>Rating Breakdown</h3>
            <div className={styles['rating-bars']}>
              {[5, 4, 3, 2, 1].map(rating => {
                const count = reviews.filter(r => r.rating === rating).length;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={rating} className={styles['rating-bar-item']}>
                    <span className={styles['rating-label']}>{rating} stars</span>
                    <div className={styles['rating-bar']}>
                      <div 
                        className={styles['rating-bar-fill']} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className={styles['rating-count']}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles['review-filters']}>
          <button 
            className={`${styles['filter-button']} ${selectedRating === null ? styles.active : ''}`}
            onClick={() => setSelectedRating(null)}
          >
            All Reviews ({totalReviews})
          </button>
          {[5, 4, 3, 2, 1].map(rating => {
            const count = reviews.filter(r => r.rating === rating).length;
            return (
              <button 
                key={rating}
                className={`${styles['filter-button']} ${selectedRating === rating ? styles.active : ''}`}
                onClick={() => setSelectedRating(rating)}
              >
                {rating} Stars ({count})
              </button>
            );
          })}
        </div>

        <div className={styles['reviews-list']}>
          {filteredReviews.map((review) => (
            <div key={review.id} className={styles['review-item']}>
              <div className={styles['review-header']}>
                <div className={styles['reviewer-info']}>
                  <div className={styles['reviewer-details']}>
                    <span className={styles['reviewer-name']}>{review.username}</span>
                    {/* Optionally, add verified badge if you have purchase info */}
                  </div>
                  <div className={styles['review-rating']}>
                    <div className={styles['review-stars']}>{renderStars(review.rating ?? 0)}</div>
                    <span className={styles['review-date']}>{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                </div>
                {/* Helpful button can be implemented if needed */}
              </div>
              <div className={styles['review-content']}>
                <p className={styles['review-comment']}>{review.content}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className={styles['no-reviews']}>
            <p>No reviews found for the selected rating.</p>
          </div>
        )}

        {/* Add Review Section */}
        <div className={styles['add-review-section']}>
          <div className={styles['add-review-header']}>
            <h3>Write Your Review</h3>
            <button 
              className={styles['toggle-review-button']}
              onClick={() => setShowAddReview(!showAddReview)}
            >
              {showAddReview ? 'Cancel' : 'Add Review'}
            </button>
          </div>

          {showAddReview && (
            <div className={styles['review-form']}>
              <div className={styles['form-group']}>
                <label>Your Name:</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className={styles['form-input']}
                />
              </div>

              <div className={styles['form-group']}>
                <label>Rating:</label>
                <div className={styles['user-rating-stars']}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`${styles['user-star']} ${star <= userRating ? styles['user-star-filled'] : ''}`}
                      onClick={() => handleStarClick(star)}
                    >
                      ★
                    </span>
                  ))}
                  <span className={styles['rating-text']}>
                    {userRating > 0 ? `${userRating} star${userRating > 1 ? 's' : ''}` : 'Click to rate'}
                  </span>
                </div>
              </div>

              <div className={styles['form-group']}>
                <label>Your Review:</label>
                <textarea
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder="Share your thoughts about this game..."
                  className={styles['form-textarea']}
                  rows={4}
                  maxLength={500}
                />
                <span className={styles['char-count']}>
                  {userComment.length}/500 characters
                </span>
              </div>

              <div className={styles['form-actions']}>
                <button 
                  className={styles['submit-review-button']}
                  onClick={handleSubmitReview}
                >
                  Submit Review
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal; 