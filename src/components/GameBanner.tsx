import React from "react";
import styles from "./GameBanner.module.css";

type GameBannerProps = {
  title: string;
  releaseDate: string;
  rating: number;
  description: string;
  backgroundImage: string;
  price: number;
  onPlayTrailer?: () => void;
  onAddToWishlist?: () => void;
  onAddToCart?: () => void;
};

const GameBanner: React.FC<GameBannerProps> = ({
  title,
  releaseDate,
  rating,
  description,
  backgroundImage,
  onPlayTrailer,
  price,
  onAddToWishlist,
  onAddToCart
}) => {
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


  
  return (
    <div
      className={styles.banner}
      style={{ backgroundImage: `url(${backgroundImage})` }}
      role="region"
      aria-label={`Game banner for ${title}`}
    >
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.releaseDate}>Released: {releaseDate}</p>
        <div className={styles.rating}>{renderStars()}</div>
        <p className={styles.description}>{description}</p>
        <p>Price: {price}$</p>
        <div className={styles.buttons}>
          {onPlayTrailer && (
            <button className={styles.playButton} onClick={onPlayTrailer}>
              ▶ Play Trailer
            </button>
          )}
          {onAddToWishlist && (
            <button className={styles.wishlistButton} onClick={onAddToWishlist}>
              + Add to Wishlist
            </button>
          )}
          {onAddToCart && (
            <button className={styles.playButton} onClick={onAddToCart}>
              + Buy Game
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameBanner;
