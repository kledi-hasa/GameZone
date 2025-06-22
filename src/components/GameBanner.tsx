import React, { useState, useEffect } from "react";
import styles from "./GameBanner.module.css";
import ReviewModal from "./ReviewModal.tsx";

type GameBannerProps = {
  title: string;
  releaseDate: string;
  rating: number;
  description: string;
  backgroundImage: string;
  price: number;
  trailerUrl?: string;
  isFavorited?: boolean;
  isInCart?: boolean;
  onPlayTrailer?: () => void;
  onAddToFavorites?: () => void;
  onAddToCart?: () => void;
  onAddReview?: () => void;
};

const GameBanner: React.FC<GameBannerProps> = ({
  title,
  releaseDate,
  rating,
  description,
  backgroundImage,
  isFavorited = false,
  isInCart = false,
  onPlayTrailer,
  price,
  onAddToFavorites,
  onAddToCart}) => {
  const [isHeartFilled, setIsHeartFilled] = useState(isFavorited);
  const [showDetailedCard, setShowDetailedCard] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Sync heart state with parent component
  useEffect(() => {
    setIsHeartFilled(isFavorited);
  }, [isFavorited]);

  // Manage scroll position when detailed card opens
  useEffect(() => {
    if (showDetailedCard) {
      // Just scroll to top to ensure modal is visible, but don't prevent scrolling
      window.scrollTo(0, 0);
    }
  }, [showDetailedCard]);

  // Render stars based on rating (max 5)
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? styles.star : styles.starInactive}
          aria-label={i <= rating ? "Filled star" : "Empty star"}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const handleHeartClick = () => {
    setIsHeartFilled(!isHeartFilled);
    if (onAddToFavorites) {
      onAddToFavorites();
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setShowDetailedCard(true);
  };

  const handleCloseDetailedCard = () => {
    setShowDetailedCard(false);
  };

  const handleButtonClick = (e: React.MouseEvent, callback?: () => void) => {
    e.stopPropagation();
    if (callback) {
      callback();
    }
  };

  const handleReviewClick = () => {
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
  };

  // Extended description for detailed card
  const extendedDescription = `${description} This game offers an immersive experience with stunning graphics, engaging gameplay mechanics, and a compelling storyline that will keep you entertained for hours. Whether you're a casual gamer or a hardcore enthusiast, this title delivers exceptional value and entertainment.`;

  // Sample tags/categories
  const gameTags = ['Action', 'Adventure', 'RPG', 'Open World'];

  // Sample system requirements
  const systemRequirements = {
    minimum: {
      os: 'Windows 10 64-bit',
      processor: 'Intel Core i5-4460',
      memory: '8 GB RAM',
      graphics: 'NVIDIA GTX 760',
      storage: '50 GB'
    }
  };

  return (
    <div className={styles.bannerContainer}>
      <div
        className={`${styles.banner} game-card`}
        style={{ backgroundImage: `url(${backgroundImage})` }}
        role="region"
        aria-label={`Game banner for ${title}`}
        onClick={handleCardClick}
      >
        <div className={styles.overlay} />
        <div className={styles.content}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.releaseDate}>Released: {releaseDate}</p>
          <div className={`${styles.rating} rating-stars`}>{renderStars()}</div>
          <p className={styles.description}>{description}</p>
          <div className="price-tag">${price}</div>
          <div className={`${styles.buttons} button-group`}>
            {onPlayTrailer && (
              <button 
                className="trailer-button" 
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Trailer button clicked in GameBanner');
                  console.log('Trailer button clicked in GameBanner - calling onPlayTrailer');
                  onPlayTrailer();
                }}
              >
                Trailer
              </button>
            )}
            {onAddToCart && (
              <button 
                className={`buy-button ${isInCart ? styles.inCart : ''}`} 
                onClick={(e) => handleButtonClick(e, onAddToCart)}
              >
                {isInCart ? 'In Cart' : 'Buy'}
              </button>
            )}
            <button 
              className="secondary-button" 
              onClick={(e) => handleButtonClick(e, handleReviewClick)}
            >
              Review
            </button>
            {onAddToFavorites && (
              <button 
                className={`${styles.heartButton} ${isHeartFilled ? styles.filled : ''}`}
                onClick={(e) => handleButtonClick(e, handleHeartClick)}
                aria-label="Add to favorites"
              >
                {isHeartFilled ? '❤️' : '♡'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Click Card */}
      {showDetailedCard && (
        <div className={styles.detailedCardOverlay} onClick={handleCloseDetailedCard}>
          <div className={styles.detailedCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.detailedCardContent}>
              <div className={styles.detailedHeader}>
                <div className={styles.detailedImage}>
                  <img src={backgroundImage} alt={title} />
                </div>
                <div className={styles.detailedInfo}>
                  <h2 className={styles.detailedTitle}>{title}</h2>
                  <div className={styles.detailedMeta}>
                    <span className={styles.detailedReleaseDate}>Released: {releaseDate}</span>
                    <div className={styles.detailedRating}>
                      <span className={styles.detailedStars}>{renderStars()}</span>
                      <span className={styles.detailedRatingText}>({rating}/5)</span>
                    </div>
                  </div>
                  <div className={styles.detailedPrice}>
                    <span className={styles.detailedPriceTag}>${price}</span>
                  </div>
                </div>
                <button className={styles.closeButton} onClick={handleCloseDetailedCard}>
                  ×
                </button>
              </div>

              <div className={styles.detailedDescription}>
                <h3>About This Game</h3>
                <p>{extendedDescription}</p>
              </div>

              <div className={styles.detailedTags}>
                <h3>Categories</h3>
                <div className={styles.tagsList}>
                  {gameTags.map((tag, index) => (
                    <span key={index} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>

              <div className={styles.detailedRequirements}>
                <h3>System Requirements</h3>
                <div className={styles.requirementsList}>
                  <div className={styles.requirementItem}>
                    <strong>OS:</strong> {systemRequirements.minimum.os}
                  </div>
                  <div className={styles.requirementItem}>
                    <strong>Processor:</strong> {systemRequirements.minimum.processor}
                  </div>
                  <div className={styles.requirementItem}>
                    <strong>Memory:</strong> {systemRequirements.minimum.memory}
                  </div>
                  <div className={styles.requirementItem}>
                    <strong>Graphics:</strong> {systemRequirements.minimum.graphics}
                  </div>
                  <div className={styles.requirementItem}>
                    <strong>Storage:</strong> {systemRequirements.minimum.storage}
                  </div>
                </div>
              </div>

              <div className={styles.detailedActions}>
                {onPlayTrailer && (
                  <button 
                    className={styles.detailedTrailerButton}
                    onClick={() => {
                      console.log('Trailer button clicked in detailed card');
                      onPlayTrailer();
                    }}
                  >
                    Watch Trailer
                  </button>
                )}
                {onAddToCart && (
                  <button 
                    className={`${styles.detailedBuyButton} ${isInCart ? styles.inCart : ''}`}
                    onClick={onAddToCart}
                  >
                    {isInCart ? 'In Cart' : 'Add to Cart'}
                  </button>
                )}
                <button 
                  className={styles.detailedReviewButton}
                  onClick={handleReviewClick}
                >
                  Read Reviews
                </button>
                {onAddToFavorites && (
                  <button 
                    className={`${styles.detailedHeartButton} ${isHeartFilled ? styles.filled : ''}`}
                    onClick={handleHeartClick}
                    aria-label="Add to favorites"
                  >
                    {isHeartFilled ? '❤️' : '♡'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={handleCloseReviewModal}
        gameTitle={title}
        gameRating={rating}
      />
    </div>
  );
};

export default GameBanner;
