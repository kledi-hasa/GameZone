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
import { useGameContext } from './context/GameContext';
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
  const [currentUserState, setCurrentUserState] = useState<{id: string; username: string; email: string; role?: string} | null>(null);
  const { games } = useGameContext();
  
  // Games now come from GameContext (database-backed)

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
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Load current user from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('gamezone_currentUser');
    if (savedUser) {
      setCurrentUserState(JSON.parse(savedUser));
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

  // Show scroll-to-top button after scrolling down
  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Filter games based on search query
  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowFavorites(false);
    setShowCart(false);
  };

  // Removed handleClearSearch; input clears in Navbar after search

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
      setCurrentUserState(adminUser);
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
    setCurrentUserState(null);
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
          onShowFavorites={handleShowFavorites} 
          onShowCart={handleShowCart}
          favoritesCount={favorites.length}
          cartCount={cart.length}
          onLogoClick={handleLogoClick}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          currentUser={currentUserState}
          setCurrentUser={setCurrentUserState}
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
              onPlayTrailer={() => game.trailerUrl && handlePlayTrailer(game.trailerUrl, game.title)}
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
                  onPlayTrailer={() => game.trailerUrl && handlePlayTrailer(game.trailerUrl, game.title)}
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
                  onClick={() => {
                    if (!isAuthenticated || !currentUserState) {
                      alert('Please log in or register to complete your purchase.');
                      return;
                    }
                    setIsCheckoutModalOpen(true);
                  }}
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
                  {!isAuthenticated || !currentUserState ? 'Login to Checkout' : `Checkout - $${getCartGames().reduce((sum, game) => sum + game.price, 0).toFixed(2)}`}
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
            onPlayTrailer={() => game.trailerUrl && handlePlayTrailer(game.trailerUrl, game.title)}
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
            onPlayTrailer={() => game.trailerUrl && handlePlayTrailer(game.trailerUrl, game.title)}
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
        userId={currentUserState?.id || 'guest-user'}
        onCheckout={async (purchaseData) => {
          await handleCheckout(purchaseData);
          handleCheckoutComplete();
        }}
      />

      {showScrollTop && (
        <button
          className="scroll-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          title="Back to top"
        >
          ↑
        </button>
      )}

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
