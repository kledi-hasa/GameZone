import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.module.css';

interface User {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  totalPurchases: number;
  totalSpent: number;
}

interface Game {
  id: string;
  title: string;
  price: number;
  sales: number;
  revenue: number;
  reviews: number;
  averageRating: number;
}

interface Purchase {
  id: string;
  userId: string;
  userName: string;
  gameId: string;
  gameTitle: string;
  price: number;
  purchaseDate: string;
  paymentMethod: string;
  transactionKey: string;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  gameId: string;
  gameTitle: string;
  rating: number;
  comment: string;
  reviewDate: string;
  helpful: number;
  verified: boolean;
}

const AdminPage: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'games' | 'purchases' | 'reviews'>('overview');

  // Sample data
  const users: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', joinDate: '2024-01-15', totalPurchases: 5, totalSpent: 149.99 },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', joinDate: '2024-01-10', totalPurchases: 3, totalSpent: 89.99 },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', joinDate: '2024-01-08', totalPurchases: 7, totalSpent: 199.99 },
    { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', joinDate: '2024-01-05', totalPurchases: 2, totalSpent: 59.99 },
    { id: '5', name: 'Alex Brown', email: 'alex@example.com', joinDate: '2024-01-03', totalPurchases: 4, totalSpent: 119.99 },
  ];

  const games: Game[] = [
    { id: '1', title: 'Elden Ring', price: 39.99, sales: 150, revenue: 5998.50, reviews: 45, averageRating: 4.8 },
    { id: '2', title: 'GTA V', price: 29.99, sales: 200, revenue: 5998.00, reviews: 38, averageRating: 4.5 },
    { id: '3', title: 'The Witcher 3', price: 19.99, sales: 180, revenue: 3598.20, reviews: 52, averageRating: 4.9 },
    { id: '4', title: 'Cyberpunk 2077', price: 24.99, sales: 120, revenue: 2998.80, reviews: 28, averageRating: 4.2 },
    { id: '5', title: 'Red Dead Redemption 2', price: 34.99, sales: 95, revenue: 3324.05, reviews: 31, averageRating: 4.7 },
  ];

  const purchases: Purchase[] = [
    { id: '1', userId: '1', userName: 'John Doe', gameId: '1', gameTitle: 'Elden Ring', price: 39.99, purchaseDate: '2024-01-20', paymentMethod: 'Credit Card', transactionKey: 'TXN-2024-001-001' },
    { id: '2', userId: '2', userName: 'Jane Smith', gameId: '2', gameTitle: 'GTA V', price: 29.99, purchaseDate: '2024-01-19', paymentMethod: 'PayPal', transactionKey: 'TXN-2024-001-002' },
    { id: '3', userId: '3', userName: 'Mike Johnson', gameId: '3', gameTitle: 'The Witcher 3', price: 19.99, purchaseDate: '2024-01-18', paymentMethod: 'Credit Card', transactionKey: 'TXN-2024-001-003' },
    { id: '4', userId: '1', userName: 'John Doe', gameId: '4', gameTitle: 'Cyberpunk 2077', price: 24.99, purchaseDate: '2024-01-17', paymentMethod: 'Credit Card', transactionKey: 'TXN-2024-001-004' },
    { id: '5', userId: '4', userName: 'Sarah Wilson', gameId: '5', gameTitle: 'Red Dead Redemption 2', price: 34.99, purchaseDate: '2024-01-16', paymentMethod: 'PayPal', transactionKey: 'TXN-2024-001-005' },
  ];

  const reviews: Review[] = [
    { id: '1', userId: '1', userName: 'John Doe', gameId: '1', gameTitle: 'Elden Ring', rating: 5, comment: 'Amazing game!', reviewDate: '2024-01-21', helpful: 12, verified: true },
    { id: '2', userId: '2', userName: 'Jane Smith', gameId: '2', gameTitle: 'GTA V', rating: 4, comment: 'Great gameplay', reviewDate: '2024-01-20', helpful: 8, verified: true },
    { id: '3', userId: '3', userName: 'Mike Johnson', gameId: '3', gameTitle: 'The Witcher 3', rating: 5, comment: 'Masterpiece!', reviewDate: '2024-01-19', helpful: 15, verified: true },
    { id: '4', userId: '1', userName: 'John Doe', gameId: '4', gameTitle: 'Cyberpunk 2077', rating: 4, comment: 'Good but has bugs', reviewDate: '2024-01-18', helpful: 6, verified: true },
    { id: '5', userId: '4', userName: 'Sarah Wilson', gameId: '5', gameTitle: 'Red Dead Redemption 2', rating: 5, comment: 'Beautiful game', reviewDate: '2024-01-17', helpful: 10, verified: true },
  ];

  // Calculate totals
  const totalUsers = users.length;
  const totalGames = games.length;
  const totalPurchases = purchases.length;
  const totalRevenue = purchases.reduce((sum, p) => sum + p.price, 0);
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star' : 'star-inactive'}>
          ★
        </span>
      );
    }
    return stars;
  };

  const handleBackToStore = () => {
    navigate('/');
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-header-left">
            <button className="back-button" onClick={handleBackToStore}>
              ← Back to Store
            </button>
            <h1>Admin Report Dashboard</h1>
          </div>
          <div className="admin-header-right">
            <span className="admin-badge">Administrator</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={`admin-tab ${activeTab === 'games' ? 'active' : ''}`}
          onClick={() => setActiveTab('games')}
        >
          Games
        </button>
        <button 
          className={`admin-tab ${activeTab === 'purchases' ? 'active' : ''}`}
          onClick={() => setActiveTab('purchases')}
        >
          Purchases
        </button>
        <button 
          className={`admin-tab ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <div className="stat-number">{totalUsers}</div>
              </div>
              <div className="stat-card">
                <h3>Total Games</h3>
                <div className="stat-number">{totalGames}</div>
              </div>
              <div className="stat-card">
                <h3>Total Purchases</h3>
                <div className="stat-number">{totalPurchases}</div>
              </div>
              <div className="stat-card">
                <h3>Total Revenue</h3>
                <div className="stat-number">${totalRevenue.toFixed(2)}</div>
              </div>
              <div className="stat-card">
                <h3>Total Reviews</h3>
                <div className="stat-number">{totalReviews}</div>
              </div>
              <div className="stat-card">
                <h3>Average Rating</h3>
                <div className="stat-number">{averageRating.toFixed(1)}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <h3>User Management</h3>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Join Date</th>
                    <th>Purchases</th>
                    <th>Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.joinDate}</td>
                      <td>{user.totalPurchases}</td>
                      <td>${user.totalSpent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'games' && (
          <div className="games-section">
            <h3>Game Performance</h3>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Game ID</th>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Sales</th>
                    <th>Revenue</th>
                    <th>Reviews</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map(game => (
                    <tr key={game.id}>
                      <td>{game.id}</td>
                      <td>{game.title}</td>
                      <td>${game.price}</td>
                      <td>{game.sales}</td>
                      <td>${game.revenue}</td>
                      <td>{game.reviews}</td>
                      <td>
                        <div className="rating-display">
                          {renderStars(game.averageRating)}
                          <span>({game.averageRating})</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'purchases' && (
          <div className="purchases-section">
            <h3>Purchase Transactions</h3>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>User</th>
                    <th>Game</th>
                    <th>Price</th>
                    <th>Date</th>
                    <th>Payment Method</th>
                    <th>Transaction Key</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map(purchase => (
                    <tr key={purchase.id}>
                      <td>{purchase.id}</td>
                      <td>{purchase.userName}</td>
                      <td>{purchase.gameTitle}</td>
                      <td>${purchase.price}</td>
                      <td>{purchase.purchaseDate}</td>
                      <td>{purchase.paymentMethod}</td>
                      <td className="transaction-key">{purchase.transactionKey}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="reviews-section">
            <h3>User Reviews</h3>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Review ID</th>
                    <th>User</th>
                    <th>Game</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Date</th>
                    <th>Helpful</th>
                    <th>Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map(review => (
                    <tr key={review.id}>
                      <td>{review.id}</td>
                      <td>{review.userName}</td>
                      <td>{review.gameTitle}</td>
                      <td>
                        <div className="rating-display">
                          {renderStars(review.rating)}
                        </div>
                      </td>
                      <td className="review-comment">{review.comment}</td>
                      <td>{review.reviewDate}</td>
                      <td>{review.helpful}</td>
                      <td>{review.verified ? '✓' : '✗'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage; 