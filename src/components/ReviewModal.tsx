import React, { useEffect } from 'react';
import styles from './ReviewModal.module.css';

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
  verified: boolean;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameTitle: string;
  gameRating: number;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  gameTitle,
  gameRating
}) => {
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

  // Sample reviews data
  const [reviews, setReviews] = React.useState<Review[]>([
    {
      id: 1,
      author: "GamingMaster2024",
      rating: 5,
      date: "2024-01-15",
      comment: "Absolutely incredible game! The graphics are stunning and the gameplay is smooth. The story is engaging and the characters are well-developed. I've spent over 100 hours playing this and still discovering new things. Highly recommend to anyone who loves this genre. The attention to detail is phenomenal and the replay value is excellent.",
      helpful: 24,
      verified: true
    },
    {
      id: 2,
      author: "GameReviewer",
      rating: 4,
      date: "2024-01-10",
      comment: "Great game with amazing mechanics. The story is engaging and the characters are well-developed. Minor bugs but nothing game-breaking. The combat system is fluid and the world design is beautiful. Some performance issues on older systems but overall a solid experience.",
      helpful: 18,
      verified: true
    },
    {
      id: 3,
      author: "PlayerOne",
      rating: 5,
      date: "2024-01-08",
      comment: "One of the best games I've played this year. The attention to detail is phenomenal and the replay value is excellent. The soundtrack is amazing and the voice acting is top-notch. The open world is vast and full of secrets to discover.",
      helpful: 31,
      verified: false
    },
    {
      id: 4,
      author: "CasualGamer",
      rating: 4,
      date: "2024-01-05",
      comment: "Really enjoyable experience. The controls are intuitive and the game runs smoothly on my system. Worth every penny! The difficulty curve is well-balanced and the tutorials are helpful for newcomers.",
      helpful: 12,
      verified: true
    },
    {
      id: 5,
      author: "ProGamer",
      rating: 5,
      date: "2024-01-03",
      comment: "Exceptional quality and polish. The developers really put their heart into this one. Can't wait for the sequel! The multiplayer features are fantastic and the community is very active.",
      helpful: 45,
      verified: true
    },
    {
      id: 6,
      author: "RPG_Fanatic",
      rating: 4,
      date: "2023-12-28",
      comment: "Solid RPG experience with deep customization options. The character progression system is well thought out and the side quests are actually interesting. Some loading times are a bit long but it's forgivable given the scope.",
      helpful: 8,
      verified: false
    },
    {
      id: 7,
      author: "TechGamer",
      rating: 3,
      date: "2023-12-20",
      comment: "Good game overall but has some technical issues. Frame rate drops occasionally and there are some texture pop-in problems. The core gameplay is fun though and the story is decent.",
      helpful: 15,
      verified: true
    },
    {
      id: 8,
      author: "IndieLover",
      rating: 5,
      date: "2023-12-15",
      comment: "This game exceeded all my expectations! The art style is unique and beautiful, the music is atmospheric, and the gameplay mechanics are innovative. It's clear the developers poured their passion into every aspect.",
      helpful: 22,
      verified: false
    }
  ]);

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
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
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
    
    // Create new review
    const newReview: Review = {
      id: Math.max(...reviews.map(r => r.id)) + 1,
      author: userName.trim(),
      rating: userRating,
      date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
      comment: userComment.trim(),
      helpful: 0,
      verified: false
    };
    
    // Add the new review to the beginning of the list
    setReviews(prevReviews => [newReview, ...prevReviews]);
    
    // Show success message
    alert('Thank you for your review! It has been added successfully.');
    
    // Reset form
    setUserRating(0);
    setUserComment('');
    setUserName('');
    setShowAddReview(false);
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
                const percentage = (count / totalReviews) * 100;
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
                    <span className={styles['reviewer-name']}>{review.author}</span>
                    {review.verified && (
                      <span className={styles['verified-badge']}>✓ Verified Purchase</span>
                    )}
                  </div>
                  <div className={styles['review-rating']}>
                    <div className={styles['review-stars']}>{renderStars(review.rating)}</div>
                    <span className={styles['review-date']}>{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className={styles['review-helpful']}>
                  <button className={styles['helpful-button']}>
                    👍 Helpful ({review.helpful})
                  </button>
                </div>
              </div>
              <div className={styles['review-content']}>
                <p className={styles['review-comment']}>{review.comment}</p>
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