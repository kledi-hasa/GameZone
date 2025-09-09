import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext, type User, type Game } from '../context/GameContext';
import styles from './AdminPage.module.css';

type Tab = 'overview' | 'users' | 'games' | 'comments' | 'purchases' | 'profit-report';

// Modal Component
function Modal({ title, onClose, children }: { title: string, onClose: () => void, children: React.ReactNode }) {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      background: 'rgba(0,0,0,0.7)', 
      zIndex: 10000, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ 
        background: 'white', 
        borderRadius: 12, 
        padding: 32, 
        minWidth: 320, 
        maxWidth: '600px',
        maxHeight: '90vh',
        width: '100%', 
        position: 'relative',
        overflow: 'auto'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, fontSize: 24, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        <h2 style={{ marginTop: 0, marginRight: 40 }}>{title}</h2>
        {children}
      </div>
    </div>
  );
}

// Memoized form components
const UserForm = React.memo(({ form, onChange, onSubmit, type, onClose }: { 
  form: Omit<User, 'id'>, 
  onChange: (field: keyof Omit<User, 'id'>, value: string | number) => void,
  onSubmit: (e: React.FormEvent) => void,
  type: string,
  onClose: () => void
}) => (
  <Modal title={type === 'addUser' ? 'Add User' : 'Edit User'} onClose={onClose}>
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <input 
        value={form.username} 
        onChange={e => onChange('username', e.target.value)} 
        placeholder="Username" 
        required 
        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <input 
        value={form.email} 
        onChange={e => onChange('email', e.target.value)} 
        placeholder="Email" 
        required 
        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <select 
        value={form.role} 
        onChange={e => onChange('role', e.target.value)} 
        required
        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      >
        <option value="user">User</option>
        <option value="moderator">Moderator</option>
        <option value="admin">Admin</option>
      </select>
      <select 
        value={form.status} 
        onChange={e => onChange('status', e.target.value)} 
        required
        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      >
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
        <option value="banned">Banned</option>
      </select>
      <input 
        type="number"
        value={form.totalPurchases || ''} 
        onChange={e => onChange('totalPurchases', parseInt(e.target.value) || 0)} 
        placeholder="Total Purchases" 
        required 
        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <input 
        type="number"
        step="0.01"
        value={form.totalSpent || ''} 
        onChange={e => onChange('totalSpent', parseFloat(e.target.value) || 0)} 
        placeholder="Total Spent" 
        required 
        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <button type="submit" style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
    </form>
  </Modal>
));

const GameForm = React.memo(({ form, onChange, onSubmit, type, onClose }: { 
  form: Omit<Game, 'id'>, 
  onChange: (field: keyof Omit<Game, 'id'>, value: string | number) => void,
  onSubmit: (e: React.FormEvent) => void,
  type: string,
  onClose: () => void
}) => (
  <Modal title={type === 'addGame' ? 'Add Game' : 'Edit Game'} onClose={onClose}>
    <form onSubmit={onSubmit} style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '16px',
      minWidth: '500px',
      maxWidth: '800px'
    }}>
      <input 
        value={form.title} 
        onChange={e => onChange('title', e.target.value)} 
        placeholder="Game Name" 
        required 
        style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
      />
      <textarea 
        value={form.description} 
        onChange={e => onChange('description', e.target.value)} 
        placeholder="Description" 
        required 
        style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '100px', fontSize: '14px', resize: 'vertical' }}
      />
      <input 
        value={form.backgroundImage} 
        onChange={e => onChange('backgroundImage', e.target.value)} 
        placeholder="Picture URL" 
        required 
        style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <input 
          type="number" 
          value={form.price} 
          onChange={e => onChange('price', Number(e.target.value))} 
          placeholder="Selling Price" 
          required 
          min={0} 
          step={0.01} 
          style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
        />
        <input 
          type="number" 
          value={form.cost || ''} 
          onChange={e => onChange('cost', Number(e.target.value))} 
          placeholder="Purchase Cost per Unit" 
          required 
          min={0} 
          step={0.01} 
          style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <input 
          type="number" 
          value={form.quantity || ''} 
          onChange={e => onChange('quantity', Number(e.target.value))} 
          placeholder="Quantity Purchased" 
          required 
          min={1} 
          step={1} 
          style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
        />
        <input 
          type="number"
          min="1"
          max="10"
          value={form.rating} 
          onChange={e => onChange('rating', Number(e.target.value))} 
          placeholder="Rating (1-10)" 
          required 
          style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
        />
      </div>
      <input 
        value={form.trailerUrl || ''} 
        onChange={e => onChange('trailerUrl', e.target.value)} 
        placeholder="YouTube Trailer Link (optional)" 
        style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
      />
      <input 
        value={form.releaseDate} 
        onChange={e => onChange('releaseDate', e.target.value)} 
        placeholder="Release Date" 
        required 
        style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
      />
      <button type="submit" style={{ 
        padding: '14px', 
        backgroundColor: '#007bff', 
        color: 'white', 
        border: 'none', 
        borderRadius: '4px', 
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        marginTop: '8px'
      }}>Save Game</button>
    </form>
  </Modal>
));

const AdminPage: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const navigate = useNavigate();
  const { 
    games, 
    addGame, 
    editGame, 
    deleteGame,
    comments,
    deleteComment,
    flagComment,
    users,
    addUser,
    updateUser,
    deleteUser,
    purchases,
    deletePurchase,
    getStatistics,
    getProfitReport,
    refreshData
  } = useGameContext();

  // Debug logging
  console.log('AdminPage rendered with data:', {
    games: games.length,
    comments: comments.length,
    users: users.length,
    purchases: purchases.length,
    purchasesData: purchases
  });

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<{type: string, data?: any} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const filteredUsers = useMemo(() => {
    const q = userSearchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter(user =>
      user.username.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q)
    );
  }, [users, userSearchQuery]);
  
  // Form states
  const [userForm, setUserForm] = useState<Omit<User, 'id'>>({ 
    username: '', 
    email: '', 
    role: 'user', 
    status: 'active'
  });
  const [gameForm, setGameForm] = useState<Omit<Game, 'id'>>({ 
    title: '', 
    releaseDate: '', 
    rating: 5, 
    description: '', 
    price: 0,
    cost: 0,
    quantity: 1,
    backgroundImage: '', 
    trailerUrl: ''
  });

  // Optimized form handlers
  const handleUserFormChange = useCallback((field: keyof Omit<User, 'id'>, value: string | number) => {
    setUserForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleGameFormChange = useCallback((field: keyof Omit<Game, 'id'>, value: string | number) => {
    setGameForm(prev => ({ ...prev, [field]: value }));
  }, []);

  // Reset forms when modal opens
  useEffect(() => {
    if (modal) {
      if (modal.type === 'addUser' || modal.type === 'editUser') {
        setUserForm(modal.data || { username: '', email: '', role: 'user', status: 'active' });
      } else if (modal.type === 'addGame' || modal.type === 'editGame') {
        setGameForm(modal.data || { title: '', releaseDate: '', rating: 5, description: '', backgroundImage: '', price: 0, cost: 0, quantity: 1, trailerUrl: '' });
      }
    }
  }, [modal]);

  useEffect(() => {
    if (activeTab !== 'users' && userSearchQuery) {
      setUserSearchQuery('');
    }
  }, [activeTab]);

  // CRUD Operations
  const handleAddUser = async (user: Omit<User, 'id'>) => {
    setLoading(true);
    try {
      addUser(user);
      setModal(null);
      setError('');
    } catch (err) { 
      setError('Failed to add user.'); 
    }
    setLoading(false);
  };

  const handleEditUser = async (user: User) => {
    setLoading(true);
    try {
      updateUser(user);
      setModal(null);
      setError('');
    } catch (err) { 
      setError('Failed to edit user.'); 
    }
    setLoading(false);
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Delete this user?')) return;
    setLoading(true);
    try {
      deleteUser(id);
      setError('');
    } catch (err) { 
      setError('Failed to delete user.'); 
    }
    setLoading(false);
  };

  const handleAddGame = async (game: Omit<Game, 'id'>) => {
    setLoading(true);
    try {
      addGame(game);
      setModal(null);
      setError('');
    } catch (err) { 
      setError('Failed to add game.'); 
    }
    setLoading(false);
  };

  const handleEditGame = async (game: Game) => {
    setLoading(true);
    try {
      editGame(game);
      setModal(null);
      setError('');
    } catch (err) { 
      setError('Failed to edit game.'); 
    }
    setLoading(false);
  };

  const handleDeleteGame = async (id: string) => {
    if (!window.confirm('Delete this game?')) return;
    setLoading(true);
    try {
      deleteGame(id);
      setError('');
    } catch (err) { 
      setError('Failed to delete game.'); 
    }
    setLoading(false);
  };

  const handleDeleteComment = async (id: string) => {
    if (!window.confirm('Delete this comment?')) return;
    setLoading(true);
    try {
      deleteComment(id);
      setError('');
    } catch (err) { 
      setError('Failed to delete comment.'); 
    }
    setLoading(false);
  };

  const handleFlagComment = async (id: string) => {
    setLoading(true);
    try {
      flagComment(id);
      setError('');
    } catch (err) { 
      setError('Failed to flag comment.'); 
    }
    setLoading(false);
  };

  // Get statistics
  const stats = getStatistics();

  const handleRefreshData = async () => {
    setLoading(true);
    try {
      await refreshData();
      setError('');
    } catch (err) {
      setError('Failed to refresh data.');
    }
    setLoading(false);
  };

  const handleDeletePurchase = async (id: string) => {
    if (!window.confirm('Delete this purchase? This action cannot be undone.')) return;
    setLoading(true);
    try {
      await deletePurchase(id);
      setError('');
    } catch (err) {
      setError('Failed to delete purchase.');
    }
    setLoading(false);
  };

  // Helper functions
  const getGameTitle = (id: string) => games.find(g => g.id === id)?.title || id;
  const getUserName = (id: string) => users.find(u => u.id === id)?.username || id;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#00a651';
      case 'suspended': return '#f39c12';
      case 'banned': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#e74c3c';
      case 'moderator': return '#f39c12';
      case 'user': return '#3498db';
      default: return '#95a5a6';
    }
  };

  // Render modal
  const renderModal = useMemo(() => {
    if (!modal) return null;
    const { type } = modal;
    
    if (type === 'addUser' || type === 'editUser') {
      return (
        <UserForm
          form={userForm}
          onChange={handleUserFormChange}
          onSubmit={(e) => { 
            e.preventDefault(); 
            type === 'addUser' ? handleAddUser(userForm) : handleEditUser(userForm as User); 
          }}
          type={type}
          onClose={() => setModal(null)}
        />
      );
    }
    
    if (type === 'addGame' || type === 'editGame') {
      return (
        <GameForm
          form={gameForm}
          onChange={handleGameFormChange}
          onSubmit={(e) => { 
            e.preventDefault(); 
            type === 'addGame' ? handleAddGame(gameForm) : handleEditGame(gameForm as Game); 
          }}
          type={type}
          onClose={() => setModal(null)}
        />
      );
    }
    
    return null;
  }, [modal, userForm, gameForm, handleUserFormChange, handleGameFormChange]);

  // Auto refresh data when switching to purchases tab
  useEffect(() => {
    if (activeTab === 'purchases') {
      console.log('AdminPage: Purchases tab activated, refreshing data...');
      handleRefreshData();
    }
  }, [activeTab]);

  return (
    <div className={styles['admin-page']}>
      <div className={styles['admin-header']}>
        <div className={styles['admin-header-content']}>
          <div className={styles['admin-header-left']}>
            <button className={styles['back-button']} onClick={() => navigate('/')}>← Back to Store</button>
            <h1 className={styles['page-title']}>Admin Dashboard</h1>
          </div>
          <div className={styles['admin-header-right']}>
            <span className={styles['admin-badge']}>Administrator</span>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleRefreshData} disabled={loading} className={`${styles['header-btn']} ${styles['refresh-btn']}`}>
                {loading ? '🔄 Loading...' : '🔄 Refresh Data'}
              </button>
              <button onClick={() => { onLogout(); navigate('/'); }} className={`${styles['header-btn']} ${styles['logout-btn']}`}>🚪 Logout</button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles['admin-tabs']}>
        {(['overview', 'users', 'games', 'comments', 'purchases', 'profit-report'] as Tab[]).map(tab => (
          <button key={tab} className={`${styles['admin-tab']} ${activeTab === tab ? styles.active : ''}`} onClick={() => setActiveTab(tab)}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
        ))}
      </div>
      <div className={styles['admin-content']}>
        {loading ? <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div> : error ? <div style={{ color: 'red', textAlign: 'center', padding: 40 }}>{error}</div> : (
          <>
            {activeTab === 'overview' && (
              <div className={styles['overview-section']}>
                <div className={styles['stats-grid']}>
                  <div className={styles['stat-card']}><h3>Total Users</h3><div className={styles['stat-number']}>{stats.totalUsers}</div></div>
                  <div className={styles['stat-card']}><h3>Total Games</h3><div className={styles['stat-number']}>{stats.totalGames}</div></div>
                  <div className={styles['stat-card']}><h3>Total Comments</h3><div className={styles['stat-number']}>{stats.totalComments}</div></div>
                  <div className={styles['stat-card']}><h3>Total Purchases</h3><div className={styles['stat-number']}>{stats.totalPurchases}</div></div>
                </div>
                
                <div className={styles['user-activity-stats']}>
                  <h3>User Activity</h3>
                  <div className={styles['activity-grid']}>
                    <div className={styles['activity-card']} style={{ backgroundColor: '#00a651' }}>
                      <h4>Active Users</h4>
                      <p>{stats.userActivity.active}</p>
                    </div>
                    <div className={styles['activity-card']} style={{ backgroundColor: '#f39c12' }}>
                      <h4>Suspended Users</h4>
                      <p>{stats.userActivity.suspended}</p>
                    </div>
                    <div className={styles['activity-card']} style={{ backgroundColor: '#e74c3c' }}>
                      <h4>Banned Users</h4>
                      <p>{stats.userActivity.banned}</p>
                    </div>
                  </div>
                </div>

                <div className={styles['popular-games']}>
                  <h3>Popular Games</h3>
                  <div className={styles['popular-games-grid']}>
                    {stats.popularGames.map(game => (
                      <div key={game.id} className={styles['popular-game-card']}>
                        <img src={game.backgroundImage} alt={game.title} />
                        <h4>{game.title}</h4>
                        <p>${game.price}</p>
                        <div className={styles['game-stats']}>
                          <span>👀 {game.views || 0}</span>
                          <span>🛒 {game.purchases || 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'users' && (
              <div className={styles['users-section']}>
                <h3 style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span>Users</span>
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                  <div className={styles['search-bar']} style={{ flex: 1 }}>
                    <input
                      type="text"
                      placeholder="Search users by username or email..."
                      value={userSearchQuery || ''}
                      onChange={e => setUserSearchQuery(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={handleRefreshData} 
                    disabled={loading} 
                    className={`${styles['header-btn']} ${styles['refresh-btn']}`}
                    style={{ fontSize: '14px', padding: '8px 16px' }}
                  >
                    {loading ? '🔄 Loading...' : '🔄 Refresh Users'}
                  </button>
                  <button 
                    className={styles['add-btn']}
                    onClick={() => setModal({ type: 'addUser' })}
                  >
                    <span style={{fontSize: '22px'}}>➕</span> Add New User
                  </button>
                </div>
                <div className={styles['table-container']}>
                  <table className={styles['admin-table']}>
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Join Date</th>
                        <th>Purchases</th>
                        <th>Total Spent</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map(user => (
                        <tr key={user.id}>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>
                            <span 
                              className={styles['role-badge']}
                              style={{ backgroundColor: getRoleColor(user.role) }}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td>
                            <span 
                              className={styles['status-badge']}
                              style={{ backgroundColor: getStatusColor(user.status) }}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td>{user.joinDate || '-'}</td>
                          <td>{user.totalPurchases ?? 0}</td>
                          <td>${(user.totalSpent ?? 0).toFixed(2)}</td>
                          <td>
                            <button onClick={() => setModal({ type: 'editUser', data: user })} className={styles['edit-btn']}>Edit</button>
                            <button onClick={() => handleDeleteUser(user.id)} className={styles['delete-btn']}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === 'games' && (
              <div className={styles['games-section']}>
                <h3 style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span>Games</span>
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                  <div className={styles['search-bar']} style={{ flex: 1 }}>
                    <input
                      type="text"
                      placeholder="Search games by title or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <div className={styles['search-results-count']}>
                        {games.filter(game => 
                          game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase())
                        ).length} results
                      </div>
                    )}
                  </div>
                  <button 
                    className={`${styles['add-btn']} ${styles['add-btn--game']}`}
                    onClick={() => setModal({ type: 'addGame' })}
                  >
                    <span style={{fontSize: '23px'}}>🎮</span> Add New Game
                  </button>
                </div>
                <div className={styles['table-container']}>
                  <table className={styles['admin-table']}>
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Release Date</th>
                        <th>Rating</th>
                        <th>Price</th>
                        <th>Views</th>
                        <th>Purchases</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {games
                        .filter(game => 
                          game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map(game => {
                          // Calculate real stats for this game
                          const gamePurchases = purchases.filter(p => p.gameId === game.id);
                          const gameComments = comments.filter(c => c.gameId === game.id);
                          const realViews = gameComments.length + (gamePurchases.length * 3);
                          const realPurchases = gamePurchases.length;
                          
                          return (
                            <tr key={game.id}>
                              <td>
                                <img src={game.backgroundImage} alt={game.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                              </td>
                              <td>{game.title}</td>
                              <td>{game.releaseDate}</td>
                              <td>{game.rating}/10</td>
                              <td>${game.price}</td>
                              <td>{realViews}</td>
                              <td>{realPurchases}</td>
                              <td>
                                <button onClick={() => setModal({ type: 'editGame', data: game })} className={styles['edit-btn']}>Edit</button>
                                <button onClick={() => handleDeleteGame(game.id)} className={styles['delete-btn']}>Delete</button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === 'comments' && (
              <div className={styles['comments-section']}>
                <h3 style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span>Comment Moderation</span>
                </h3>
                <div className={styles['table-container']}>
                  <table className={styles['admin-table']}>
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
                          <tr key={comment.id} className={comment.isInappropriate ? styles['inappropriate'] : ''}>
                            <td>{game?.title || 'Unknown Game'}</td>
                            <td>{comment.username}</td>
                            <td className={styles['comment-content']}>{comment.content}</td>
                            <td>{comment.date}</td>
                            <td>
                              <span className={`${styles['status']} ${comment.isInappropriate ? styles['flagged'] : styles['clean']}`}>
                                {comment.isInappropriate ? '🚩 Flagged' : '✅ Clean'}
                              </span>
                            </td>
                            <td>
                              <button onClick={() => handleFlagComment(comment.id)} className={styles['flag-btn']}>
                                {comment.isInappropriate ? '✅ Unflag' : '🚩 Flag'}
                              </button>
                              <button onClick={() => handleDeleteComment(comment.id)} className={styles['delete-btn']}>Delete</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === 'purchases' && (
              <div className={styles['purchases-section']}>
                <h3>Purchases ({purchases.length})</h3>
                {purchases.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    <p>No purchases found. {loading ? 'Loading...' : 'Try refreshing the data.'}</p>
                    {!loading && (
                      <button onClick={handleRefreshData} className={`${styles['header-btn']} ${styles['refresh-btn']}`}>
                        🔄 Refresh Data
                      </button>
                    )}
                  </div>
                ) : (
                  <div className={styles['table-container']}>
                    <table className={styles['admin-table']}>
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Game</th>
                          <th>Price</th>
                          <th>Date</th>
                          <th>Payment Method</th>
                          <th>Transaction Key</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchases.map(purchase => (
                          <tr key={purchase.id}>
                            <td>{getUserName(purchase.userId)}</td>
                            <td>{getGameTitle(purchase.gameId)}</td>
                            <td>${purchase.price}</td>
                            <td>{purchase.purchaseDate}</td>
                            <td>{purchase.paymentMethod}</td>
                            <td>{purchase.transactionKey}</td>
                            <td>
                              <button 
                                onClick={() => handleDeletePurchase(purchase.id)} 
                                className={styles['delete-btn']}
                                title="Delete Purchase"
                              >
                                🗑️ Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'profit-report' && (
              <div className={styles['profit-report-section']}>
                <h3 style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span>Profit Report</span>
                </h3>
                {/* Summary Cards */}
                <div className={styles['stats-grid']} style={{ marginBottom: '32px' }}>
                  {(() => {
                    const profitReport = getProfitReport();
                    return (
                      <>
                        <div className={styles['stat-card']}>
                          <h3>Total Cost</h3>
                          <div className={styles['stat-number']} style={{ color: '#e74c3c' }}>
                            ${profitReport.totalCost.toFixed(2)}
                          </div>
                        </div>
                        <div className={styles['stat-card']}>
                          <h3>Total Revenue</h3>
                          <div className={styles['stat-number']} style={{ color: '#27ae60' }}>
                            ${profitReport.totalRevenue.toFixed(2)}
                          </div>
                        </div>
                        <div className={styles['stat-card']}>
                          <h3>Total Profit</h3>
                          <div className={styles['stat-number']} style={{ 
                            color: profitReport.overallStatus === 'profit' ? '#27ae60' : 
                                   profitReport.overallStatus === 'loss' ? '#e74c3c' : '#f39c12'
                          }}>
                            ${profitReport.totalProfit.toFixed(2)}
                          </div>
                        </div>
                        <div className={styles['stat-card']}>
                          <h3>Profit Margin</h3>
                          <div className={styles['stat-number']} style={{ 
                            color: profitReport.totalProfitMargin > 0 ? '#27ae60' : 
                                   profitReport.totalProfitMargin < 0 ? '#e74c3c' : '#f39c12'
                          }}>
                            {profitReport.totalProfitMargin.toFixed(1)}%
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
                {/* Detailed Game Profits Table */}
                <div className={styles['table-container']}>
                  <table className={styles['admin-table']}>
                    <thead>
                      <tr>
                        <th>Game</th>
                        <th>Cost per Unit</th>
                        <th>Quantity Purchased</th>
                        <th>Total Cost</th>
                        <th>Sold Quantity</th>
                        <th>Revenue</th>
                        <th>Profit/Loss</th>
                        <th>Profit Margin</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const profitReport = getProfitReport();
                        return profitReport.gameProfits.map(game => (
                          <tr key={game.gameId}>
                            <td>{game.title}</td>
                            <td>${game.cost.toFixed(2)}</td>
                            <td>{game.quantity}</td>
                            <td>${game.totalCost.toFixed(2)}</td>
                            <td>{game.soldQuantity}</td>
                            <td>${game.revenue.toFixed(2)}</td>
                            <td style={{ 
                              color: game.status === 'profit' ? '#27ae60' : 
                                     game.status === 'loss' ? '#e74c3c' : '#f39c12',
                              fontWeight: 'bold'
                            }}>
                              ${game.profit.toFixed(2)}
                            </td>
                            <td style={{ 
                              color: game.profitMargin > 0 ? '#27ae60' : 
                                     game.profitMargin < 0 ? '#e74c3c' : '#f39c12'
                            }}>
                              {game.profitMargin.toFixed(1)}%
                            </td>
                            <td>
                              <span style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                backgroundColor: game.status === 'profit' ? '#d5f4e6' : 
                                               game.status === 'loss' ? '#fadbd8' : '#fef9e7',
                                color: game.status === 'profit' ? '#27ae60' : 
                                       game.status === 'loss' ? '#e74c3c' : '#f39c12'
                              }}>
                                {game.status === 'profit' ? '💰 Profit' : 
                                 game.status === 'loss' ? '📉 Loss' : '⚖️ Break-even'}
                              </span>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
        {modal && renderModal}
      </div>
    </div>
  );
};

export default AdminPage; 