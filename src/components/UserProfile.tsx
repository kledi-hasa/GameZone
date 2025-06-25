import React, { useState } from 'react';
import styles from './UserProfile.module.css';
import OrdersModal from './OrdersModal';

interface User {
  id: string;
  username: string;
  email: string;
  role?: string;
}

interface UserProfileProps {
  user: User;
  onLogout: () => void;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout, onClose }) => {
  const [showOrdersModal, setShowOrdersModal] = useState(false);

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  const handleViewOrders = () => {
    setShowOrdersModal(true);
  };

  const closeOrdersModal = () => {
    setShowOrdersModal(false);
  };

  return (
    <>
      <div className={styles['user-profile-container']}>
        <div className={styles['user-profile-header']}>
          <div className={styles['user-avatar']}>
            <span className={styles['avatar-text']}>{user.username.charAt(0).toUpperCase()}</span>
          </div>
          <div className={styles['user-info']}>
            <h4 className={styles.username}>{user.username}</h4>
            <p className={styles['user-email']}>{user.email}</p>
            <span className={styles['user-role']}>{user.role || 'User'}</span>
          </div>
          <button className={styles['close-btn']} onClick={onClose}>×</button>
        </div>
        
        <div className={styles['user-profile-content']}>
          <div className={styles['profile-section']}>
            <h5>Account Information</h5>
            <div className={styles['info-item']}>
              <label>Username:</label>
              <span>{user.username}</span>
            </div>
            <div className={styles['info-item']}>
              <label>Email:</label>
              <span>{user.email}</span>
            </div>
            <div className={styles['info-item']}>
              <label>Role:</label>
              <span className={styles['role-badge']}>{user.role || 'User'}</span>
            </div>
            <div className={styles['info-item']}>
              <label>Member Since:</label>
              <span>Today</span>
            </div>
          </div>
          
          <div className={styles['profile-section']}>
            <h5>Quick Actions</h5>
            <div className={styles['action-buttons']}>
              <button className={`${styles['action-btn']} ${styles['edit-profile']}`}>
                ✏️ Edit Profile
              </button>
              <button className={`${styles['action-btn']} ${styles['change-password']}`}>
                🔒 Change Password
              </button>
              <button 
                className={`${styles['action-btn']} ${styles['view-orders']}`}
                onClick={handleViewOrders}
              >
                📦 View Orders
              </button>
            </div>
          </div>
          
          <div className={styles['profile-section']}>
            <button className={styles['logout-btn']} onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      <OrdersModal
        isOpen={showOrdersModal}
        onClose={closeOrdersModal}
        userId={user.id}
      />
    </>
  );
};

export default UserProfile; 