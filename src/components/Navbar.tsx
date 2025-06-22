import React, { useState } from 'react'
import '../App.css'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

interface NavbarProps {
  onAdminClick?: () => void;
}

// Add the prop type for onSearch
interface NavbarProps {
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  onShowFavorites: () => void;
  onShowCart: () => void;
  onLogoClick: () => void;
  favoritesCount: number;
  cartCount: number;
}

export default function Navbar({ onSearch, onClearSearch, onShowFavorites, onShowCart, onLogoClick, favoritesCount, cartCount }: NavbarProps) {
const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
export default function Navbar({ onAdminClick }: NavbarProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
  });

  // State for form submission message (optional)
  const [message, setMessage] = useState("");

  // State for search query
  const [searchQuery, setSearchQuery] = useState("");
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search button click
  const handleSearch = () => {
    onSearch(searchQuery);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    onClearSearch();
  };

  // Handle login button click
  const handleLoginClick = () => {
    // Add login logic here
    console.log("Login clicked");
  };

  // Handle signup button click
  const handleSignupClick = () => {
    // Add signup logic here
    console.log("Signup clicked");
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
      const response = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert('User registered successfully!');
        setMessage('Signup successful!');
        setFormData({ username: '', email: '', password: '', role: '' });
      } else {
        alert('Error registering user.');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      setLoginMessage('Please fill in all fields.');
      return;
    }

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
      } else {
        setLoginMessage('Invalid email or password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginMessage('Login failed. Please try again.');
    }
  };

  return (
    
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid">
    <a 
      className="navbar-brand" 
      href="#" 
      onClick={(e) => {
        e.preventDefault();
        onLogoClick();
      }}
      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
    >
      <span style={{ fontSize: '24px' }}>🎮</span>
      <span style={{ 
        background: 'linear-gradient(45deg, #00a651, #00d4aa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: 'bold',
        fontSize: '28px'
      }}>
        GameZone
      </span>
    </a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      {/* Search bar - moved to center and made more prominent */}
      <div className="g2a-search-container mx-auto" role="search" style={{ minWidth: '500px', maxWidth: '600px' }}>
        <input
          className="g2a-search-input"
          type="search"
          placeholder="Search for games, software, gift cards..."
          aria-label="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
        />
        <button 
          className="g2a-search-button" 
          type="button"
          onClick={handleSearch}
          aria-label="Search"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            fill="currentColor" 
            className="g2a-search-icon" 
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </button>
      </div>
      
      {/* Favorites and Cart buttons */}
      <div className="navbar-nav me-3">
        <button 
          type="button" 
          className="btn btn-outline-primary me-2 position-relative"
          onClick={onShowFavorites}
          style={{ minWidth: '60px' }}
        >
          <span style={{ fontSize: '1.2rem' }}>♥</span>
          {favoritesCount > 0 && (
            <span 
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: '0.7rem' }}
            >
              {favoritesCount}
            </span>
          )}
        </button>
        
        <button 
          type="button" 
          className="btn btn-outline-success me-2 position-relative"
          onClick={onShowCart}
          style={{ minWidth: '60px' }}
        >
          <span style={{ fontSize: '1.2rem' }}>🛒</span>
          {cartCount > 0 && (
            <span 
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: '0.7rem' }}
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>
      
      <button type="button" className="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Login
      </button>
      <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#supModal">
        Sign Up
      </button>

<div className="modal fade" id="exampleModal">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Login</h5>
        <button type="button" className="close navCloseMenu" data-bs-dismiss="modal"><span>&times;</span></button>
      </div>
      <div className="modal-body">
  <form className="">
  <div className="input-group row ">
    <label  className="col-sm-2 col-form-label">Email</label>
    <div className="col-sm-6">
      <input type="email" className="form-control" id="inputEmail3"/>
    </div>
  </div>
<br></br>
  <div className="input-group row">
    <label  className="col-sm-2 col-form-label">Password</label>
    <div className="col-sm-6">
      <input type="password" className="form-control" id="inputPassword3"/>
    </div>
  </div>
</form>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary" onClick={handleLoginClick} >Login</button>
    <nav className="navbar navbar-expand-lg" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '15px' }}>
      <div className="container-fluid">
        <Link className="navbar-brand text-white fw-bold fs-4" to="/">🎮 GameZone</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link text-white" to="/">🏠 Home</Link>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link text-white" onClick={onAdminClick}>🧩 Admin</button>
            </li>
          </ul>
          <button className="btn btn-light me-2" data-bs-toggle="modal" data-bs-target="#loginModal">🔐 Login</button>
          <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#signupModal">📝 Sign Up</button>
        </div>
      </div>

      {/* Login Modal */}
      <div className="modal fade" id="loginModal" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleLogin}>
              <div className="modal-header">
                <h5 className="modal-title">Login</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <input type="email" name="email" className="form-control mb-3" placeholder="Email" value={loginData.email} onChange={handleLoginChange} />
                <input type="password" name="password" className="form-control mb-3" placeholder="Password" value={loginData.password} onChange={handleLoginChange} />
                {loginMessage && <p className="text-danger">{loginMessage}</p>}
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Login</button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div className="modal fade" id="supModal">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Login</h5>
        <button type="button" className="close navCloseMenu" data-bs-dismiss="modal"><span>&times;</span></button>
      </div>
      <div className="modal-body">
  <form className="" onSubmit={handleSubmit}>
  <div className="input-group row ">
    <label  className="col-sm-2 col-form-label">Email</label>
    <div className="col-sm-6">
      <input type="email" className="form-control" id="inputEmail3" 
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={{ marginRight: "0.5rem" }}/>
    </div>
  </div>
<br></br>
  <div className="input-group row">
    <label  className="col-sm-2 col-form-label">Password</label>
    <div className="col-sm-6">
      <input type="password" className="form-control" id="inputPassword3"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={{ marginRight: "0.5rem" }}/>
    </div>
  </div>
  <br></br>
  <div className="input-group row ">
    <label  className="col-sm-2 col-form-label">FullName</label>
    <div className="col-sm-6">
      <input type="text" className="form-control" id="inputName" 
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          style={{ marginRight: "0.5rem" }}/>
    </div>
  </div>
</form>
{message && <p style={{ marginTop: "1rem" }}>{message}</p>}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary" onClick={handleSignupClick}  >Login</button>
      </div>
    </div>
  </div>
</div>
    </div>
  </div>
</nav>
  )

      {/* Signup Modal */}
      <div className="modal fade" id="signupModal" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">Sign Up</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <input type="text" name="username" className="form-control mb-3" placeholder="Username" value={formData.username} onChange={handleChange} />
                <input type="email" name="email" className="form-control mb-3" placeholder="Email" value={formData.email} onChange={handleChange} />
                <input type="password" name="password" className="form-control mb-3" placeholder="Password" value={formData.password} onChange={handleChange} />
                {message && <p className="text-success">{message}</p>}
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-success">Sign Up</button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}
