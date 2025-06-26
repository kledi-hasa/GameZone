import React, { useState, useEffect } from 'react';
import './LoginModal.module.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, password: string) => void;
  error: string;
  onGoToAdminDashboard?: () => void;
  onLogout?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose, 
  onLogin, 
  error, 
  onGoToAdminDashboard, 
  onLogout 
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Manage scroll position when modal opens
  useEffect(() => {
    if (isOpen) {
      // Just scroll to top to ensure modal is visible, but don't prevent scrolling
      window.scrollTo(0, 0);
    }
  }, [isOpen]);

  // Reset success state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onLogin(username, password);
      setIsLoading(false);
      // Check if login was successful (no error)
      if (!error) {
        setIsSuccess(true);
      }
    }, 1000);
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setIsSuccess(false);
    onClose();
  };

  const handleGoToAdminDashboard = () => {
    if (onGoToAdminDashboard) {
      onGoToAdminDashboard();
    }
    handleClose();
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="login-overlay" onClick={handleClose}>
      <div className="login-content" onClick={(e) => e.stopPropagation()}>
        {!isSuccess ? (
          <>
            <div className="login-header">
              <h2>Admin Login</h2>
              <button className="login-close-button" onClick={handleClose}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading-spinner">⏳</span>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            <div className="login-footer">
              <p>Demo Credentials:</p>
              <p><strong>Username:</strong> admin</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
          </>
        ) : (
          <>
            <div className="login-header">
              <h2>Welcome, Admin!</h2>
              <button className="login-close-button" onClick={handleClose}>×</button>
            </div>

            <div className="login-success-content">
              <div className="success-icon">✅</div>
              <h3>Login Successful</h3>
              <p>What would you like to do?</p>
              
              <div className="admin-options">
                <button 
                  className="admin-option-button dashboard-button"
                  onClick={handleGoToAdminDashboard}
                >
                  🏠 Go to Admin Dashboard
                </button>
                
                <button 
                  className="admin-option-button logout-button"
                  onClick={handleLogout}
                >
                  🚪 Log Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginModal; 