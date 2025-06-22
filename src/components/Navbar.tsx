import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

interface NavbarProps {
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  onShowFavorites: () => void;
  onShowCart: () => void;
  onLogoClick: () => void;
  onAdminClick?: () => void;
  favoritesCount: number;
  cartCount: number;
}

export default function Navbar({
  onSearch,
  onClearSearch,
  onShowFavorites,
  onShowCart,
  onLogoClick,
  onAdminClick,
  favoritesCount,
  cartCount,
}: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
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

  const handleClearSearch = () => {
    setSearchQuery('');
    onClearSearch();
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

    const userData = {
      ...formData,
      role: formData.username.toLowerCase() === 'admin' ? 'admin' : 'user',
    };

    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        setMessage('Signup successful!');
        alert('User registered successfully!');
        setFormData({ username: '', email: '', password: '', role: '' });
        setShowSignupModal(false);
      } else {
        alert('Error registering user.');
      }
    } catch (err) {
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
      setLoginMessage('Admin login successful!');
      alert('Welcome, Admin!');
      setLoginData({ email: '', password: '' });
      setShowLoginModal(false);
      // Redirect to admin dashboard
      navigate('/admin');
      return;
    }

    // Regular user login
    try {
      const response = await fetch('/db.json');
      const data = await response.json();

      const user = data.users.find(
        (u: any) => u.email === loginData.email && u.password === loginData.password
      );

      if (user) {
        setLoginMessage('Login successful!');
        alert(`Welcome back, ${user.username}!`);
        setLoginData({ email: '', password: '' });
        setShowLoginModal(false);
      } else {
        setLoginMessage('Invalid email or password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginMessage('Login failed. Please try again.');
    }
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

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#" onClick={(e) => { e.preventDefault(); onLogoClick(); }}>
            🎮 <span className="brand-gradient">GameZone</span>
          </a>

          <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            {/* Search */}
            <div className="g2a-search-container mx-auto" style={{ maxWidth: '600px', flex: 1 }}>
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
              <button className="btn btn-light me-2" onClick={() => setShowLoginModal(true)}>🔐 Login</button>
              <button className="btn btn-success" onClick={() => setShowSignupModal(true)}>📝 Sign Up</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={handleLogin}>
              <div className="modal-header">
                <h5 className="modal-title">Login</h5>
                <button type="button" className="btn-close" onClick={closeLoginModal}></button>
              </div>
              <div className="modal-body">
                <input type="text" name="email" className="form-control mb-3" placeholder="Username or Email" value={loginData.email} onChange={handleLoginChange} />
                <input type="password" name="password" className="form-control mb-3" placeholder="Password" value={loginData.password} onChange={handleLoginChange} />
                {loginMessage && <p className="text-danger">{loginMessage}</p>}
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Login</button>
                <button type="button" className="btn btn-secondary" onClick={closeLoginModal}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {showSignupModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">Sign Up</h5>
                <button type="button" className="btn-close" onClick={closeSignupModal}></button>
              </div>
              <div className="modal-body">
                <input type="text" name="username" className="form-control mb-3" placeholder="Username" value={formData.username} onChange={handleChange} />
                <input type="email" name="email" className="form-control mb-3" placeholder="Email" value={formData.email} onChange={handleChange} />
                <input type="password" name="password" className="form-control mb-3" placeholder="Password" value={formData.password} onChange={handleChange} />
                {message && <p className="text-success">{message}</p>}
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-success">Sign Up</button>
                <button type="button" className="btn btn-secondary" onClick={closeSignupModal}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {(showLoginModal || showSignupModal) && (
        <div className="modal-backdrop fade show" onClick={showLoginModal ? closeLoginModal : closeSignupModal}></div>
      )}
    </>
  );
}
