import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar.tsx'
import AdminDashboard from './components/AdminDashboard.tsx'
import GameBanner from "./components/GameBanner.tsx";
import { GameProvider, useGameContext } from './context/GameContext.tsx'

function App() {
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  return (
    <GameProvider>
      <Router>
        <div>
          <Navbar onAdminClick={() => setShowAdminDashboard(true)} />
          <div className="homepage-container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          {showAdminDashboard && (
            <AdminDashboard onClose={() => setShowAdminDashboard(false)} />
          )}
        </div>
      </Router>
    </GameProvider>
  )
}

// HomePage component with existing GameBanner components
function HomePage() {
  const { games } = useGameContext();

  return (
    <>
      {games.map(game => (
        <GameBanner
          key={game.id}
          title={game.title}
          releaseDate={game.releaseDate}
          rating={game.rating}
          description={game.description}
          backgroundImage={game.backgroundImage}
          price={game.price}
          onPlayTrailer={() => alert("Playing trailer...")}
          onAddToWishlist={() => alert("Added to wishlist!")}
          onAddToCart={() => alert("Added to Cart!")}
        />
      ))}
    </>
  );
}

export default App
