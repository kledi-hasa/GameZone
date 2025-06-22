import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

interface NavbarProps {
  onAdminClick?: () => void;
}

export default function Navbar({ onAdminClick }: NavbarProps) {
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
