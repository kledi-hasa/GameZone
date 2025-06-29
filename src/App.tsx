import './App.css'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.tsx'
import GameBanner from "./components/GameBanner.tsx";
import VideoModal from "./components/VideoModal.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import LoginModal from "./components/LoginModal.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Footer from "./components/Footer.tsx";
import GameCarousel from './components/GameCarousel.tsx';
import CheckoutModal from './components/CheckoutModal.tsx';
import { GameProvider } from './context/GameContext';
import { useState, useEffect } from 'react';

function HomePage({ 
  isAuthenticated, 
  setIsAuthenticated, 
  isLoginModalOpen, 
  setIsLoginModalOpen, 
  loginError, 
  setLoginError 
}: {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (value: boolean) => void;
  loginError: string;
  setLoginError: (value: string) => void;
}) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<{id: string; username: string; email: string; role?: string} | null>(null);
  
  // List of games
  const games = [
    {
      id: 1,
      title: "Elden Ring",
      releaseDate: "February 25, 2022",
      rating: 5,
      description: "An expansive open-world action RPG where you explore the Lands Between, uncover mysteries, and face epic bosses.",
      backgroundImage: "https://buyonline.games/wp-content/uploads/2023/07/Xbox-Series-S-Games-1.jpg",
      price: 39.99,
      trailerUrl: "https://www.youtube.com/watch?v=E3Huy2cdih0",
    },
    {
      id: 2,
      title: "GTA V",
      releaseDate: "2013",
      rating: 9,
      description: "A sprawling open-world crime adventure set in Los Santos.",
      backgroundImage: "https://static1.dualshockersimages.com/wordpress/wp-content/uploads/2022/05/gta-5-update-may-17.jpg",
      price: 29.99,
      trailerUrl: "https://www.youtube.com/watch?v=QkkoHAzjnUs",
    },
    {
      id: 3,
      title: "The Witcher 3: Wild Hunt",
      releaseDate: "May 19, 2015",
      rating: 10,
      description: "A story-driven open world RPG set in a visually stunning fantasy universe full of meaningful choices and impactful consequences.",
      backgroundImage: "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg",
      price: 19.99,
      trailerUrl: "https://www.youtube.com/watch?v=XHrskkHf958",
    },
    {
      id: 4,
      title: "Red Dead Redemption 2",
      releaseDate: "October 26, 2018",
      rating: 10,
      description: "An epic tale of life in America at the dawn of the modern age.",
      backgroundImage: "https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg",
      price: 34.99,
      trailerUrl: "https://www.youtube.com/watch?v=gmA-BOIVKQU",
    },
    {
      id: 5,
      title: "Cyberpunk 2077",
      releaseDate: "December 10, 2020",
      rating: 8,
      description: "An open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification.",
      backgroundImage: "https://www.cyberpunk.net/build/images/social-thumbnail-en-ddcf4d23.jpg",
      price: 24.99,
      trailerUrl: "https://www.youtube.com/watch?v=8X2kIfS6fb8",
    },
    {
      id: 6,
      title: "Minecraft",
      releaseDate: "November 18, 2011",
      rating: 9,
      description: "A game about placing blocks and going on adventures.",
      backgroundImage: "https://media.rawg.io/media/games/198/1988a337305e008b41d7f536ce9b73f6.jpg",
      price: 26.95,
      trailerUrl: "https://www.youtube.com/watch?v=MmB9b5nj_Vb",
    },
    {
      id: 7,
      title: "Fortnite",
      releaseDate: "July 21, 2017",
      rating: 7,
      description: "A free-to-play battle royale game with numerous game modes for every type of game player.",
      backgroundImage: "https://cdn2.unrealengine.com/keyart-overscan-nologo-2-2276x1280-aa06338f9aae.jpg",
      price: 50.5,
      trailerUrl: "https://www.youtube.com/watch?v=2gUtfBmw86Y",
    },
    {
      id: 8,
      title: "Call of Duty: Modern Warfare",
      releaseDate: "October 25, 2019",
      rating: 8,
      description: "A gritty, dramatic single-player campaign and classic multiplayer modes.",
      backgroundImage: "https://images.ctfassets.net/vfkpgemp7ek3/1240004181/8b1fdb1ab8330de77e0f8ecf1f5757c1/call-of-duty-mobile-hero-a.jpg",
      price: 59.99,
      trailerUrl: "https://www.youtube.com/watch?v=bH1lHCirCGI",
    },
    {
      id: 9,
      title: "Overwatch",
      releaseDate: "May 24, 2016",
      rating: 9,
      description: "A vibrant team-based shooter set on a near-future earth.",
      backgroundImage: "https://th.bing.com/th/id/R.8ddaa1c3a73e1ad4354cc4d31577d21c?rik=Gj9Rh3u%2fyyzy2A&pid=ImgRaw&r=0",
      price: 39.99,
      trailerUrl: "https://www.youtube.com/watch?v=FqnKB22pOC0",
    },
    {
      id: 10,
      title: "League of Legends",
      releaseDate: "October 27, 2009",
      rating: 8,
      description: "A fast-paced, competitive online game that blends the speed and intensity of an RTS with RPG elements.",
      backgroundImage: "https://www.talkesport.com/wp-content/uploads/league-of-legends.webp",
      price: 65.4,
      trailerUrl: "https://www.youtube.com/watch?v=BGtROJeMPeE",
    },
    {
      id: 11,
      title: "Valorant",
      releaseDate: "June 2, 2020",
      rating: 8,
      description: "A 5v5 character-based tactical shooter.",
      backgroundImage: "https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg",
      price: 70.5,
      trailerUrl: "https://www.youtube.com/watch?v=lWr6dhTcu-E",
    },
    {
      id: 12,
      title: "Apex Legends",
      releaseDate: "February 4, 2019",
      rating: 8,
      description: "A free-to-play Battle Royale game where legendary competitors battle for glory, fame, and fortune on the fringes of the Frontier.",
      backgroundImage: "https://bleedingcool.com/wp-content/uploads/2024/05/Apex-Legends-Upheaval-Art-2-2000x1125.jpg",
      price: 80.2,
      trailerUrl: "https://www.youtube.com/watch?v=innmNewjkuk",
    },
    {
      id: 13,
      title: "Assassin's Creed Valhalla",
      releaseDate: "November 10, 2020",
      rating: 8,
      description: "Become Eivor, a legendary Viking raider on a quest for glory.",
      backgroundImage: "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg",
      price: 49.99,
      trailerUrl: "https://www.youtube.com/watch?v=ssrNcwxALS4",
    },
    {
      id: 14,
      title: "FIFA 23",
      releaseDate: "September 30, 2022",
      rating: 7,
      description: "The world's game comes to life with new ways to play and new competitions.",
      backgroundImage: "https://cdn.mos.cms.futurecdn.net/67hnqFzV58p8A3dHavqU8N.jpg",
      price: 59.99,
      trailerUrl: "https://www.youtube.com/watch?v=o3V-GvvzjE4",
    },
    {
      id: 15,
      title: "Horizon Zero Dawn",
      releaseDate: "February 28, 2017",
      rating: 9,
      description: "An exhilarating action role playing game developed by the award winning Guerrilla Games.",
      backgroundImage: "https://th.bing.com/th/id/R.84654eb36a8bc173944105cc8332c2a0?rik=s%2fWqw93qWl1nqA&riu=http%3a%2f%2fimages.pushsquare.com%2fscreenshots%2f68777%2flarge.jpg&ehk=88%2b8aRO9erCuRLDh8mlgnv338Z4402i4sTluUJikQGE%3d&risl=&pid=ImgRaw&r=0",
      price: 19.99,
      trailerUrl: "https://www.youtube.com/watch?v=u4-FCsiF5x4",
    },
    {
      id: 16,
      title: "DOOM Eternal",
      releaseDate: "March 20, 2020",
      rating: 9,
      description: "The ultimate combination of speed and power with the next leap in push-forward, first-person combat.",
      backgroundImage: "https://media.rawg.io/media/games/198/1988a337305e008b41d7f536ce9b73f6.jpg",
      price: 39.99,
      trailerUrl: "https://www.youtube.com/watch?v=FkklG9MA0vM",
    },
    {
      id: 17,
      title: "Sekiro: Shadows Die Twice",
      releaseDate: "March 22, 2019",
      rating: 9,
      description: "A shinobi must take revenge on his enemies in late 1500s Sengoku Japan.",
      backgroundImage: "https://th.bing.com/th/id/OIP.bk5I3DdP_jCJ7BFgDY3jewHaFI?r=0&rs=1&pid=ImgDetMain",
      price: 29.99,
      trailerUrl: "https://www.youtube.com/watch?v=rXMX4YJ7Lks",
    },
    {
      id: 18,
      title: "Among Us",
      releaseDate: "June 15, 2018",
      rating: 8,
      description: "An online and local party game of teamwork and betrayal for 4-15 players.",
      backgroundImage: "https://th.bing.com/th/id/R.c482e0fe378a66bdcb3de7b1373b829c?rik=%2fWP3TtRt4ryvhg&pid=ImgRaw&r=0",
      price: 4.99,
      trailerUrl: "https://www.youtube.com/watch?v=NSJ4cESNQfE",
    },
    {
      id: 19,
      title: "Stardew Valley",
      releaseDate: "February 26, 2016",
      rating: 10,
      description: "You've inherited your grandfather's old farm plot in Stardew Valley.",
      backgroundImage: "https://www.pockettactics.com/wp-content/sites/pockettactics/2023/07/stardew-valley-switch-review.jpg",
      price: 14.99,
      trailerUrl: "https://www.youtube.com/watch?v=ot7uXNQskhs",
    },
    {
      id: 20,
      title: "Terraria",
      releaseDate: "May 16, 2011",
      rating: 9,
      description: "Dig, fight, explore, build! Nothing is impossible in this action-packed adventure game.",
      backgroundImage: "https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg",
      price: 9.99,
      trailerUrl: "https://www.youtube.com/watch?v=H77Zfzy4LWw",
    },
    {
      id: 21,
      title: "The Legend of Zelda: Breath of the Wild",
      releaseDate: "March 3, 2017",
      rating: 10,
      description: "Step into a world of discovery, exploration and adventure in The Legend of Zelda: Breath of the Wild.",
      backgroundImage: "https://gamelegends.it/wp-content/uploads/2023/05/zelda-games-1.jpg",
      price: 59.99,
      trailerUrl: "https://www.youtube.com/watch?v=zw47_q9wBEg",
    },
  ];

  // State management with localStorage persistence
  const [searchQuery, setSearchQuery] = useState('');
  
  // Load favorites from localStorage on component mount
  const [favorites, setFavorites] = useState<string[]>(() => {
    const savedFavorites = localStorage.getItem('gamezone_favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  
  // Load cart from localStorage on component mount
  const [cart, setCart] = useState<string[]>(() => {
    const savedCart = localStorage.getItem('gamezone_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [showFavorites, setShowFavorites] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Load current user from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('gamezone_currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gamezone_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gamezone_cart', JSON.stringify(cart));
  }, [cart]);

  // Debug VideoModal state
  useEffect(() => {
    console.log('App render - VideoModal state:', { isVideoModalOpen, selectedVideo });
  }, [isVideoModalOpen, selectedVideo]);

  // Filter games based on search query
  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowFavorites(false);
    setShowCart(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowFavorites(false);
    setShowCart(false);
  };

  const handleShowFavorites = () => {
    setShowFavorites(true);
    setShowCart(false);
    setSearchQuery('');
  };

  const handleShowCart = () => {
    setShowCart(true);
    setShowFavorites(false);
    setSearchQuery('');
  };

  const handleLogoClick = () => {
    setShowFavorites(false);
    setShowCart(false);
    setSearchQuery('');
  };



  const handlePlayTrailer = (trailerUrl: string, title: string) => {
    console.log('handlePlayTrailer called with:', { trailerUrl, title });
    setSelectedVideo({ url: trailerUrl, title });
    setIsVideoModalOpen(true);
    console.log('Video modal state set to open');
  };

  const handleCloseVideoModal = () => {
    console.log('handleCloseVideoModal called');
    setIsVideoModalOpen(false);
    setSelectedVideo(null);
  };

  const handleAddToFavorites = (title: string) => {
    if (favorites.includes(title)) {
      setFavorites(favorites.filter(game => game !== title));
    } else {
      setFavorites([...favorites, title]);
    }
  };

  const handleAddToCart = (title: string) => {
    if (cart.includes(title)) {
      setCart(cart.filter(game => game !== title));
    } else {
      setCart([...cart, title]);
    }
  };

  const handleAddReview = (title: string) => {
    alert(`Review functionality for ${title} - Coming soon!`);
  };



  const handleLogin = (username: string, password: string) => {
    // Simple authentication - in real app, this would be an API call
    if (username === 'admin' && password === 'admin123') {
      const adminUser = {
        id: 'admin',
        username: 'Admin',
        email: 'admin',
        role: 'admin'
      };
      setCurrentUser(adminUser);
      localStorage.setItem('gamezone_currentUser', JSON.stringify(adminUser));
      localStorage.setItem('gamezone_isAuthenticated', 'true');
      setIsAuthenticated(true);
      setLoginError('');
      // Don't close modal or navigate automatically - let user choose
    } else {
      setLoginError('Invalid username or password. Please try again.');
    }
  };

  const handleGoToAdminDashboard = () => {
    navigate('/admin');
  };

  const handleLogoutFromModal = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('gamezone_isAuthenticated');
    localStorage.removeItem('gamezone_currentUser');
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
    setLoginError('');
  };

  // Get favorite games
  const getFavoriteGames = () => {
    return games.filter(game => favorites.includes(game.title));
  };

  // Get cart games
  const getCartGames = () => {
    return games.filter(game => cart.includes(game.title));
  };

  // Handle checkout
  const handleCheckout = async (purchaseData: {
    userId: string;
    gameId: string;
    price: number;
    purchaseDate: string;
    paymentMethod: string;
    transactionKey: string;
  }) => {
    try {
      const response = await fetch('http://localhost:3002/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData),
      });

      if (!response.ok) {
        throw new Error('Failed to save purchase');
      }

      console.log('Purchase saved successfully:', purchaseData);
    } catch (error) {
      console.error('Error saving purchase:', error);
      throw error;
    }
  };

  // Handle checkout completion
  const handleCheckoutComplete = () => {
    // Clear cart after successful checkout
    setCart([]);
    localStorage.setItem('gamezone_cart', JSON.stringify([]));
    setIsCheckoutModalOpen(false);
    alert('Purchase completed successfully! Your games are now available in your library.');
  };



  return (
    <div className="main-container">
      <div>
        <Navbar 
          onSearch={handleSearch} 
          onClearSearch={handleClearSearch} 
          onShowFavorites={handleShowFavorites} 
          onShowCart={handleShowCart}
          favoritesCount={favorites.length}
          cartCount={cart.length}
          onLogoClick={handleLogoClick}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />
      </div>
      
      <div className="page-header">
        <div className="container">
          <div className="header-content">
            <div className="page-header-content">
              <h1 className="page-title">
                {showFavorites 
                  ? 'My Favorites' 
                  : showCart 
                  ? 'Shopping Cart'
                  : 'Welcome to GameZone'
                }
              </h1>
              <p className="page-subtitle">
                {showFavorites 
                  ? `You have ${favorites.length} favorite game${favorites.length !== 1 ? 's' : ''}`
                  : showCart 
                  ? `You have ${cart.length} game${cart.length !== 1 ? 's' : ''} in your cart`
                  : 'Discover and buy the best games at amazing prices'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Only show GameCarousel on main page when not searching, showing favorites, or showing cart */}
      {!searchQuery && !showFavorites && !showCart && games.length > 0 && (
        <GameCarousel games={games} onPlayTrailer={handlePlayTrailer} />
      )}

      <div className="game-grid">
      {showFavorites ? (
        // Show favorite games
        getFavoriteGames().length > 0 ? (
          getFavoriteGames().map((game, idx) => (
            <GameBanner
              key={idx}
              title={game.title}
              releaseDate={game.releaseDate}
              rating={game.rating}
              description={game.description}
              backgroundImage={game.backgroundImage}
              price={game.price}
              gameId={game.id.toString()}
              trailerUrl={game.trailerUrl}
              isFavorited={favorites.includes(game.title)}
              isInCart={cart.includes(game.title)}
              onPlayTrailer={() => handlePlayTrailer(game.trailerUrl, game.title)}
              onAddToFavorites={() => handleAddToFavorites(game.title)}
              onAddToCart={() => handleAddToCart(game.title)}
              onAddReview={() => handleAddReview(game.title)}
            />
          ))
        ) : (
          <div className="empty-state" style={{ 
            textAlign: 'center', 
            padding: '100px 50px', 
            color: 'white',
            fontSize: '1.2rem',
            gridColumn: '1 / -1',
            gridRow: '1 / -1',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(0, 166, 81, 0.05)',
            borderRadius: '16px',
            border: '1px solid rgba(0, 166, 81, 0.1)',
            margin: '20px 0',
            height: '100%',
            minHeight: 'calc(100vh - 300px)',
            alignSelf: 'stretch'
          }}>
            <h3 style={{ marginBottom: '20px', fontSize: '2rem' }}>No Favorites Yet</h3>
            <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>Start adding games to your favorites by clicking the heart button!</p>
          </div>
        )
      ) : showCart ? (
        // Show cart games
        <>
          {getCartGames().length > 0 ? (
            <>
              {getCartGames().map((game, idx) => (
                <GameBanner
                  key={idx}
                  title={game.title}
                  releaseDate={game.releaseDate}
                  rating={game.rating}
                  description={game.description}
                  backgroundImage={game.backgroundImage}
                  price={game.price}
                  gameId={game.id.toString()}
                  trailerUrl={game.trailerUrl}
                  isFavorited={favorites.includes(game.title)}
                  isInCart={cart.includes(game.title)}
                  onPlayTrailer={() => handlePlayTrailer(game.trailerUrl, game.title)}
                  onAddToFavorites={() => handleAddToFavorites(game.title)}
                  onAddToCart={() => handleAddToCart(game.title)}
                  onAddReview={() => handleAddReview(game.title)}
                />
              ))}
              <div style={{ 
                gridColumn: '1 / -1', 
                display: 'flex', 
                justifyContent: 'center', 
                padding: '40px 20px',
                marginTop: '20px'
              }}>
                <button
                  onClick={() => setIsCheckoutModalOpen(true)}
                  style={{
                    background: 'linear-gradient(135deg, #00ffff 0%, #0096ff 100%)',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 32px',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 8px 25px rgba(0, 255, 255, 0.3)',
                    transition: 'all 0.3s ease',
                    minWidth: '200px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 255, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 255, 255, 0.3)';
                  }}
                >
                  Checkout - ${getCartGames().reduce((sum, game) => sum + game.price, 0).toFixed(2)}
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state" style={{ 
              textAlign: 'center', 
              padding: '100px 50px', 
              color: 'white',
              fontSize: '1.2rem',
              gridColumn: '1 / -1',
              gridRow: '1 / -1',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'rgba(0, 166, 81, 0.05)',
              borderRadius: '16px',
              border: '1px solid rgba(0, 166, 81, 0.1)',
              margin: '20px 0',
              height: '100%',
              minHeight: 'calc(100vh - 300px)',
              alignSelf: 'stretch'
            }}>
              <h3 style={{ marginBottom: '20px', fontSize: '2rem' }}>Your Cart is Empty</h3>
              <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>Add some games to your cart by clicking the Buy button!</p>
            </div>
          )}
        </>
      ) : filteredGames.length > 0 ? (
        filteredGames.map((game, idx) => (
          <GameBanner
            key={idx}
            title={game.title}
            releaseDate={game.releaseDate}
            rating={game.rating}
            description={game.description}
            backgroundImage={game.backgroundImage}
            price={game.price}
            gameId={game.id.toString()}
            trailerUrl={game.trailerUrl}
            isFavorited={favorites.includes(game.title)}
            isInCart={cart.includes(game.title)}
            onPlayTrailer={() => handlePlayTrailer(game.trailerUrl, game.title)}
            onAddToFavorites={() => handleAddToFavorites(game.title)}
            onAddToCart={() => handleAddToCart(game.title)}
            onAddReview={() => handleAddReview(game.title)}
          />
        ))
      ) : searchQuery ? (
        <div className="empty-state" style={{ 
          textAlign: 'center', 
          padding: '100px 50px', 
          color: 'white',
          fontSize: '1.2rem',
          gridColumn: '1 / -1',
          gridRow: '1 / -1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'rgba(0, 166, 81, 0.05)',
          borderRadius: '16px',
          border: '1px solid rgba(0, 166, 81, 0.1)',
          margin: '20px 0',
            height: '100%',
            minHeight: 'calc(100vh - 300px)',
            alignSelf: 'stretch'
        }}>
          <h3 style={{ marginBottom: '20px', fontSize: '2rem' }}>Game Not Found</h3>
          <p style={{ fontSize: '1.1rem', opacity: 0.8, marginBottom: '10px' }}>We could not find any games matching "{searchQuery}"</p>
          <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>Try searching for a different game or check the spelling.</p>
        </div>
      ) : (
        games.map((game, idx) => (
          <GameBanner
            key={idx}
            title={game.title}
            releaseDate={game.releaseDate}
            rating={game.rating}
            description={game.description}
            backgroundImage={game.backgroundImage}
            price={game.price}
            gameId={game.id.toString()}
            trailerUrl={game.trailerUrl}
            isFavorited={favorites.includes(game.title)}
            isInCart={cart.includes(game.title)}
            onPlayTrailer={() => handlePlayTrailer(game.trailerUrl, game.title)}
            onAddToFavorites={() => handleAddToFavorites(game.title)}
            onAddToCart={() => handleAddToCart(game.title)}
            onAddReview={() => handleAddReview(game.title)}
          />
        ))
      )}
      </div>

      {isVideoModalOpen && selectedVideo && (
        <VideoModal
          isOpen={isVideoModalOpen}
          onClose={handleCloseVideoModal}
          videoUrl={selectedVideo.url}
          title={selectedVideo.title}
        />
      )}
      
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        onLogin={handleLogin}
        error={loginError}
        onGoToAdminDashboard={handleGoToAdminDashboard}
        onLogout={handleLogoutFromModal}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cartItems={getCartGames().map(game => ({
          id: game.id.toString(),
          title: game.title,
          price: game.price
        }))}
        userId={currentUser?.id || 'guest-user'}
        onCheckout={async (purchaseData) => {
          await handleCheckout(purchaseData);
          handleCheckoutComplete();
        }}
      />

    </div>
  );
}

function App() {
  // Load authentication state from localStorage on app start
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem('gamezone_isAuthenticated');
    return savedAuth === 'true';
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Clear all user-related data from localStorage
    localStorage.removeItem('gamezone_isAuthenticated');
    localStorage.removeItem('gamezone_currentUser');
    // Optionally clear cart and favorites on logout (uncomment if desired)
    // localStorage.removeItem('gamezone_cart');
    // localStorage.removeItem('gamezone_favorites');
  };

  // Wrapper component to use useLocation hook
  const AppContent = () => {
    const location = useLocation();
    
    return (
      <>
        <Routes>
          <Route path="/" element={
            <HomePage 
              isAuthenticated={isAuthenticated} 
              setIsAuthenticated={setIsAuthenticated} 
              isLoginModalOpen={isLoginModalOpen} 
              setIsLoginModalOpen={setIsLoginModalOpen} 
              loginError={loginError} 
              setLoginError={setLoginError} 
            />
          } />
          <Route
            path="/admin"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AdminPage onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
        </Routes>
        {/* Only show footer when not on admin page */}
        {location.pathname !== '/admin' && <Footer />}
      </>
    );
  };

  return (
    <GameProvider>
      <Router>
        <AppContent />
      </Router>
    </GameProvider>
  );
}

export default App
