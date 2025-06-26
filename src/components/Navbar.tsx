import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import UserProfile from './UserProfile';

interface NavbarProps {
  onSearch: (query: string) => void;
  onShowFavorites: () => void;
  onShowCart: () => void;
  onLogoClick: () => void;
  favoritesCount: number;
  cartCount: number;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  currentUser: {id: string; username: string; email: string; role?: string} | null;
  setCurrentUser: (user: {id: string; username: string; email: string; role?: string} | null) => void;
}

export default function Navbar({
  onSearch,
  onShowFavorites,
  onShowCart,
  onLogoClick,
  favoritesCount,
  cartCount,
  isAuthenticated,
  setIsAuthenticated,
  currentUser,
  setCurrentUser,
}: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      // Check for duplicate email
      const usersRes = await fetch('http://localhost:3000/users');
      const users = await usersRes.json();
      if (users.some((u: any) => u.email === formData.email)) {
        setMessage('Email is already registered.');
        return;
      }

      const userData = {
        ...formData,
        role: formData.username.toLowerCase() === 'admin' ? 'admin' : 'user',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active'
      };

      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setMessage('Signup successful! You can now log in.');
        setTimeout(() => {
          setFormData({ username: '', email: '', password: '', role: '' });
          setShowSignupModal(false);
          setMessage('');
        }, 1500);
      } else {
        setMessage('Error registering user.');
      }
    } catch (err) {
      setMessage('Signup error. Please try again.');
      console.error('Signup error:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      setLoginMessage('Please fill in all fields.');
      return;
    }

    // Check for admin credentials first
    if (loginData.email === 'admin' && loginData.password === 'admin123') {
      const adminUser = {
        id: 'admin',
        username: 'Admin',
        email: 'admin',
        role: 'admin'
      };
      setCurrentUser(adminUser);
      setLoginMessage('Admin login successful!');
      alert('Welcome, Admin!');
      setIsAuthenticated(true);
      setLoginData({ email: '', password: '' });
      setShowLoginModal(false);
      // Save to localStorage
      localStorage.setItem('gamezone_currentUser', JSON.stringify(adminUser));
      localStorage.setItem('gamezone_isAuthenticated', 'true');
      // Redirect to admin dashboard
      navigate('/admin');
      return;
    }

    // Regular user login
    try {
      const response = await fetch('http://localhost:3000/users');
      const users = await response.json();

      const user = users.find(
        (u: any) => u.email === loginData.email && u.password === loginData.password
      );

      if (user) {
        // Set joinDate if missing
        if (!user.joinDate) {
          const today = new Date().toISOString().split('T')[0];
          await fetch(`http://localhost:3000/users/${user.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ joinDate: today })
          });
          user.joinDate = today;
        }
        setCurrentUser(user);
        setLoginMessage('Login successful!');
        alert(`Welcome back, ${user.username}!`);
        setIsAuthenticated(true);
        setLoginData({ email: '', password: '' });
        setShowLoginModal(false);
        // Save to localStorage
        localStorage.setItem('gamezone_currentUser', JSON.stringify(user));
        localStorage.setItem('gamezone_isAuthenticated', 'true');
      } else {
        setLoginMessage('Invalid email or password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginMessage('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('gamezone_isAuthenticated');
    localStorage.removeItem('gamezone_currentUser');
    localStorage.removeItem('gamezone_cart');
    localStorage.removeItem('gamezone_favorites');
    closeUserProfile();
  };

  const handleGoToAdminDashboard = () => {
    navigate('/admin');
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    setLoginData({ email: '', password: '' });
    setLoginMessage('');
  };

  const closeSignupModal = () => {
    setShowSignupModal(false);
    setFormData({ username: '', email: '', password: '', role: '' });
    setMessage('');
  };

  const closeUserProfile = () => {
    setShowUserProfile(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#" onClick={(e) => { e.preventDefault(); onLogoClick(); }} style={{ fontSize: 28, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 32, marginRight: 6 }}>🎮</span> <span className="brand-gradient" style={{ fontSize: 28, fontWeight: 'bold', letterSpacing: 1 }}>GameZone</span>
          </a>

          <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav" style={{ marginLeft: 0 }}>
            {/* Search */}
            <div className="g2a-search-container mx-auto" style={{ maxWidth: '600px', flex: 1, marginLeft: 0, padding: '14px 16px' }}>
              <input
                className="g2a-search-input"
                type="text"
                placeholder="Search for games..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }}
              />
              <button className="g2a-search-button" onClick={handleSearch}>🔍</button>
            </div>

            {/* Buttons */}
            <div className="navbar-nav d-flex align-items-center">
              <button className="btn btn-outline-primary me-2 position-relative" onClick={onShowFavorites}>
                ♥ {favoritesCount > 0 && <span className="badge bg-danger">{favoritesCount}</span>}
              </button>
              <button className="btn btn-outline-success me-2 position-relative" onClick={onShowCart}>
                🛒 {cartCount > 0 && <span className="badge bg-danger">{cartCount}</span>}
              </button>
              
              {isAuthenticated && currentUser ? (
                <button 
                  className="btn btn-primary me-2" 
                  onClick={() => setShowUserProfile(true)}
                  style={{ 
                    background: 'linear-gradient(135deg, #00a651 0%, #00d4aa 100%)',
                    border: 'none',
                    color: 'white',
                    fontWeight: '600'
                  }}
                >
                  👤 {currentUser.username}
                </button>
              ) : (
                <>
                  <button className="btn btn-light me-2" onClick={() => setShowLoginModal(true)}>🔐 Login</button>
                  <button className="btn btn-success" onClick={() => setShowSignupModal(true)}>📝 Sign Up</button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* User Profile Modal */}
      {showUserProfile && currentUser && (
        <div 
          className="custom-modal-overlay" 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 2000,
            backdropFilter: 'blur(5px)'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeUserProfile();
          }}
        >
          <div 
            className="custom-modal-content"
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
              borderRadius: '15px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'hidden',
              animation: 'modalSlideIn 0.3s ease-out',
              marginTop: '20px'
            }}
          >
            <UserProfile 
              user={currentUser}
              onLogout={handleLogout}
              onClose={closeUserProfile}
              onGoToAdminDashboard={handleGoToAdminDashboard}
            />
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div 
          className="custom-modal-overlay" 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 2000,
            backdropFilter: 'blur(5px)'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLoginModal();
          }}
        >
          <div 
            className="custom-modal-content"
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
              borderRadius: '15px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'hidden',
              animation: 'modalSlideIn 0.3s ease-out',
              marginTop: '20px'
            }}
          >
            <form onSubmit={handleLogin} style={{ margin: 0 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 25px',
                background: 'linear-gradient(90deg, #00a651 0%, #00d4aa 100%)',
                color: 'white'
              }}>
                <h5 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '600' }}>Login</h5>
                <button 
                  type="button" 
                  onClick={closeLoginModal}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    color: 'white',
                    fontSize: '24px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  ×
                </button>
              </div>
              <div style={{ padding: '25px' }}>
                <input 
                  type="text" 
                  name="email" 
                  className="form-control mb-3" 
                  placeholder="Username or Email" 
                  value={loginData.email} 
                  onChange={handleLoginChange}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', color: 'white' }}
                />
                <input 
                  type="password" 
                  name="password" 
                  className="form-control mb-3" 
                  placeholder="Password" 
                  value={loginData.password} 
                  onChange={handleLoginChange}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', color: 'white' }}
                />
                {loginMessage && <p className="text-danger">{loginMessage}</p>}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                padding: '20px 25px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <button 
                  type="submit" 
                  style={{
                    background: 'linear-gradient(135deg, #00a651 0%, #00d4aa 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Login
                </button>
                <button 
                  type="button" 
                  onClick={closeLoginModal}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {showSignupModal && (
        <div 
          className="custom-modal-overlay" 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 2000,
            backdropFilter: 'blur(5px)'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeSignupModal();
          }}
        >
          <div 
            className="custom-modal-content"
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
              borderRadius: '15px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'hidden',
              animation: 'modalSlideIn 0.3s ease-out',
              marginTop: '20px'
            }}
          >
            <form onSubmit={handleSubmit} style={{ margin: 0 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 25px',
                background: 'linear-gradient(90deg, #00a651 0%, #00d4aa 100%)',
                color: 'white'
              }}>
                <h5 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '600' }}>Sign Up</h5>
                <button 
                  type="button" 
                  onClick={closeSignupModal}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    color: 'white',
                    fontSize: '24px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  ×
                </button>
              </div>
              <div style={{ padding: '25px' }}>
                <input 
                  type="text" 
                  name="username" 
                  className="form-control mb-3" 
                  placeholder="Username" 
                  value={formData.username} 
                  onChange={handleChange}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', color: 'white' }}
                />
                <input 
                  type="email" 
                  name="email" 
                  className="form-control mb-3" 
                  placeholder="Email" 
                  value={formData.email} 
                  onChange={handleChange}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', color: 'white' }}
                />
                <input 
                  type="password" 
                  name="password" 
                  className="form-control mb-3" 
                  placeholder="Password" 
                  value={formData.password} 
                  onChange={handleChange}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', color: 'white' }}
                />
                {message && <p className="text-success">{message}</p>}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                padding: '20px 25px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <button 
                  type="submit" 
                  style={{
                    background: 'linear-gradient(135deg, #00a651 0%, #00d4aa 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Sign Up
                </button>
                <button 
                  type="button" 
                  onClick={closeSignupModal}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
