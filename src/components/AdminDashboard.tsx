import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext, type Comment } from '../context/GameContext';
import './AdminDashboard.css';

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { 
    games, 
    addGame, 
    editGame, 
    deleteGame,
    comments,
    deleteComment: deleteCommentFromContext
  } = useGameContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('games');
  const [showAddGameModal, setShowAddGameModal] = useState(false);
  const [showEditGameModal, setShowEditGameModal] = useState(false);
  const [editingGame, setEditingGame] = useState<any>(null);
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo admin credentials
    if (loginCredentials.username === 'admin' && loginCredentials.password === 'admin123') {
      setIsAuthenticated(true);
      setMessage('Login successful!');
    } else {
      setMessage('Invalid credentials. Use admin/admin123');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginCredentials({ username: '', password: '' });
    setMessage('');
  };

  const handleAddGame = (newGame: any) => {
    console.log('Adding new game:', newGame);
    addGame(newGame);
    setShowAddGameModal(false);
    setMessage('Game added successfully!');
  };

  const handleEditGame = (updatedGame: any) => {
    console.log('Editing game:', updatedGame);
    editGame(updatedGame);
    setShowEditGameModal(false);
    setEditingGame(null);
    setMessage('Game updated successfully!');
  };

  const handleDeleteGame = (gameId: string) => {
    console.log('Deleting game:', gameId);
    if (window.confirm('Are you sure you want to delete this game?')) {
      deleteGame(gameId);
      setMessage('Game deleted successfully!');
    }
  };

  const deleteComment = (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteCommentFromContext(commentId);
      setMessage('Comment deleted successfully!');
    }
  };

  const getPopularGames = () => {
    return games.slice(0, 3); // Demo: return first 3 games as popular
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-overlay">
        <div className="admin-login-container">
          <div className="admin-login-header">
            <h2>🔐 Admin Login</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                value={loginCredentials.username}
                onChange={(e) => setLoginCredentials({...loginCredentials, username: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={loginCredentials.password}
                onChange={(e) => setLoginCredentials({...loginCredentials, password: e.target.value})}
                required
              />
            </div>
            {message && <div className="message">{message}</div>}
            <div className="login-actions">
              <button type="submit" className="login-btn">Login</button>
              <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            </div>
            
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="admin-dashboard">
        <div className="admin-header">
          <h1>🎮 Admin Dashboard</h1>
          <div className="admin-actions">
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
        </div>

        {message && (
          <div className="message-banner">
            {message}
            <button onClick={() => setMessage('')}>×</button>
          </div>
        )}

        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'games' ? 'active' : ''}`}
            onClick={() => setActiveTab('games')}
          >
            🎮 Manage Games
          </button>
          <button 
            className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            💬 Moderate Comments
          </button>
          <button 
            className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📊 Statistics
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'games' && (
            <div className="games-section">
              <div className="section-header">
                <h2>Game Management</h2>
                <button 
                  className="add-btn" 
                  onClick={() => {
                    setShowAddGameModal(true);
                  }}
                >
                  ➕ Add New Game
                </button>
              </div>
              <div className="games-table-container">
                <table className="games-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Release Date</th>
                      <th>Rating</th>
                      <th>Price</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {games.map(game => (
                      <tr key={game.id}>
                        <td>
                          <img src={game.backgroundImage} alt={game.title} className="game-thumbnail" />
                        </td>
                        <td>{game.title}</td>
                        <td>{game.releaseDate}</td>
                        <td>{game.rating}</td>
                        <td>${game.price}</td>
                        <td>{game.description}</td>
                        <td>
                          <button 
                            className="edit-btn"
                            onClick={() => {
                              setEditingGame(game);
                              setShowEditGameModal(true);
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteGame(game.id)}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="comments-section">
              <div className="section-header">
                <h2>Comment Moderation</h2>
              </div>
              <div className="comments-table-container">
                <table className="comments-table">
                  <thead>
                    <tr>
                      <th>Game</th>
                      <th>Username</th>
                      <th>Comment</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comments.map(comment => {
                      const game = games.find(g => g.id === comment.gameId);
                      return (
                        <tr key={comment.id} className={comment.isInappropriate ? 'inappropriate' : ''}>
                          <td>{game?.title || 'Unknown Game'}</td>
                          <td>{comment.username}</td>
                          <td>{comment.content}</td>
                          <td>{comment.date}</td>
                          <td>
                            <span className={`status ${comment.isInappropriate ? 'flagged' : 'clean'}`}>
                              {comment.isInappropriate ? '🚩 Flagged' : '✅ Clean'}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="delete-btn"
                              onClick={() => deleteComment(comment.id)}
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="stats-section">
              <div className="section-header">
                <h2>Statistics Dashboard</h2>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>📊 Total Games</h3>
                  <p className="stat-number">{games.length}</p>
                </div>
                <div className="stat-card">
                  <h3>💬 Total Comments</h3>
                  <p className="stat-number">{comments.length}</p>
                </div>
                <div className="stat-card">
                  <h3>🚩 Flagged Comments</h3>
                  <p className="stat-number">{comments.filter(c => c.isInappropriate).length}</p>
                </div>
                <div className="stat-card">
                  <h3>👥 Active Users</h3>
                  <p className="stat-number">{new Set(comments.map(c => c.username)).size}</p>
                </div>
              </div>
              
              <div className="popular-games">
                <h3>🔥 Popular Games</h3>
                <div className="popular-games-grid">
                  {getPopularGames().map(game => (
                    <div key={game.id} className="popular-game-card">
                      <img src={game.backgroundImage} alt={game.title} />
                      <h4>{game.title}</h4>
                      <p>${game.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Edit Game Modal with inline styles */}
        {showEditGameModal && editingGame && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1002
          }}>
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '30px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
            }}>
              <GameModal
                onClose={() => {
                  setShowEditGameModal(false);
                  setEditingGame(null);
                }}
                onSubmit={handleEditGame}
                title="Edit Game"
                game={editingGame}
              />
            </div>
          </div>
        )}
      </div>

      {/* Add Game Modal with inline styles */}
      {showAddGameModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1002 // Ensure it's above other elements
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <div className="modal-header">
              <h3>Add New Game</h3>
              <button className="close-btn" onClick={() => setShowAddGameModal(false)}>×</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newGame = {
                title: formData.get('title') as string,
                releaseDate: formData.get('releaseDate') as string,
                rating: parseInt(formData.get('rating') as string),
                description: formData.get('description') as string,
                price: parseFloat(formData.get('price') as string),
                backgroundImage: formData.get('backgroundImage') as string
              };
              handleAddGame(newGame);
            }} className="modal-form">
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Release Date:</label>
                <input
                  type="text"
                  name="releaseDate"
                  placeholder="e.g., 2024-01-15"
                  required
                />
              </div>
              <div className="form-group">
                <label>Rating:</label>
                <input
                  type="number"
                  name="rating"
                  min="1"
                  max="10"
                  defaultValue="5"
                  required
                />
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  min="0"
                  defaultValue="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  required
                />
              </div>
              <div className="form-group">
                <label>Background Image URL:</label>
                <input
                  type="url"
                  name="backgroundImage"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setShowAddGameModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// Game Modal Component
interface GameModalProps {
  onClose: () => void;
  onSubmit: (game: any) => void;
  title: string;
  game?: any;
}

const GameModal: React.FC<GameModalProps> = ({ onClose, onSubmit, title, game }) => {
  const [formData, setFormData] = useState({
    title: game?.title || '',
    releaseDate: game?.releaseDate || '',
    rating: game?.rating || 5,
    description: game?.description || '',
    price: game?.price || 0,
    backgroundImage: game?.backgroundImage || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const gameData = game ? { ...formData, id: game.id } : { ...formData, id: Date.now().toString() };
    onSubmit(gameData);
  };

  return (
    <>
      <div className="modal-header">
        <h3>{title}</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Release Date:</label>
          <input
            type="text"
            value={formData.releaseDate}
            onChange={(e) => setFormData({...formData, releaseDate: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Rating:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.rating}
            onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
            required
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Background Image URL:</label>
          <input
            type="url"
            value={formData.backgroundImage}
            onChange={(e) => setFormData({...formData, backgroundImage: e.target.value})}
            required
          />
        </div>
        <div className="modal-actions">
          <button type="submit" className="save-btn">Save</button>
          <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </>
  );
};

export default AdminDashboard; 