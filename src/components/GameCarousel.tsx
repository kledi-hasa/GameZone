import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import styles from './GameCarousel.module.css';

interface Game {
  id: number;
  title: string;
  releaseDate: string;
  rating: number;
  description: string;
  backgroundImage: string;
  price: number;
  trailerUrl?: string;
}

interface GameCarouselProps {
  games: Game[];
  onPlayTrailer: (trailerUrl: string, title: string) => void;
}

const GameCarousel: React.FC<GameCarouselProps> = ({ games, onPlayTrailer }) => {
  return (
    <div className={styles.carouselContainer}>
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
        className={styles.mySwiper}
      >
        {games.map((game) => (
          <SwiperSlide 
            key={game.id} 
            className={styles.swiperSlide} 
            onClick={() => game.trailerUrl && onPlayTrailer(game.trailerUrl, game.title)}
          >
            <img src={game.backgroundImage} alt={game.title} />
            <div className={styles.slideContent}>
              <h3>{game.title}</h3>
              <p>${game.price}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default GameCarousel; 