import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminPage.module.css';

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role?: string;
}
interface Game {
  id: string;
  title: string;
  releaseDate: string;
  rating: number;
  description: string;
  backgroundImage: string;
  price: number;
  trailerUrl?: string;
}
interface Review {
  id: string;
  gameId: string;
  username: string;
  content: string;
  date: string;
  rating: number;
  helpful: number;
  verified: boolean;
}
interface Purchase {
  id: string;
  userId: string;
  gameId: string;
  price: number;
  purchaseDate: string;
  paymentMethod: string;
  transactionKey: string;
}

type Tab = 'overview' | 'users' | 'games' | 'purchases' | 'reviews';
const API = 'http://localhost:3000';

// Modal Component
function Modal({ title, onClose, children }: { title: string, onClose: () => void, children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: 12, padding: 32, minWidth: 320, maxWidth: 480, width: '100%', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, fontSize: 24, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        <h2 style={{ marginTop: 0 }}>{title}</h2>
        {children}
      </div>
    </div>
  );
}

// Memoized form components
const UserForm = React.memo(({ form, onChange, onSubmit, type }: { 
  form: Omit<User, 'id'>, 
  onChange: (field: keyof Omit<User, 'id'>, value: string) => void,
  onSubmit: (e: React.FormEvent) => void,
  type: string 
}) => (
  <Modal title={type === 'addUser' ? 'Add User' : 'Edit User'} onClose={() => {}}>
    <form onSubmit={onSubmit}>
      <input value={form.username} onChange={e => onChange('username', e.target.value)} placeholder="Username" required />
      <input value={form.email} onChange={e => onChange('email', e.target.value)} placeholder="Email" required />
      <input value={form.password} onChange={e => onChange('password', e.target.value)} placeholder="Password" required />
      <input value={form.role || ''} onChange={e => onChange('role', e.target.value)} placeholder="Role (optional)" />
      <button type="submit">Save</button>
    </form>
  </Modal>
));

const GameForm = React.memo(({ form, onChange, onSubmit, type }: { 
  form: Omit<Game, 'id'>, 
  onChange: (field: keyof Omit<Game, 'id'>, value: string | number) => void,
  onSubmit: (e: React.FormEvent) => void,
  type: string 
}) => (
  <Modal title={type === 'addGame' ? 'Add Game' : 'Edit Game'} onClose={() => {}}>
    <form onSubmit={onSubmit}>
      <input value={form.title} onChange={e => onChange('title', e.target.value)} placeholder="Game Name" required />
      <textarea value={form.description} onChange={e => onChange('description', e.target.value)} placeholder="Description" required />
      <input value={form.backgroundImage} onChange={e => onChange('backgroundImage', e.target.value)} placeholder="Picture URL" required />
      <input type="number" value={form.price} onChange={e => onChange('price', Number(e.target.value))} placeholder="Price" required min={0} step={0.01} />
      <input value={form.trailerUrl || ''} onChange={e => onChange('trailerUrl', e.target.value)} placeholder="YouTube Trailer Link (optional)" />
      <button type="submit">Save</button>
    </form>
  </Modal>
));

const ReviewForm = React.memo(({ form, onChange, onSubmit, type, games }: { 
  form: Omit<Review, 'id'>, 
  onChange: (field: keyof Omit<Review, 'id'>, value: string | number | boolean) => void,
  onSubmit: (e: React.FormEvent) => void,
  type: string,
  games: Game[]
}) => (
  <Modal title={type === 'addReview' ? 'Add Review' : 'Edit Review'} onClose={() => {}}>
    <form onSubmit={onSubmit}>
      <select value={form.gameId} onChange={e => onChange('gameId', e.target.value)} required>
        <option value="">Select Game</option>
        {games.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
      </select>
      <input value={form.username} onChange={e => onChange('username', e.target.value)} placeholder="Username" required />
      <textarea value={form.content} onChange={e => onChange('content', e.target.value)} placeholder="Review" required />
      <input type="date" value={form.date} onChange={e => onChange('date', e.target.value)} required />
      <input type="number" value={form.rating} onChange={e => onChange('rating', Number(e.target.value))} min={1} max={5} required />
      <input type="number" value={form.helpful} onChange={e => onChange('helpful', Number(e.target.value))} min={0} placeholder="Helpful count" />
      <label><input type="checkbox" checked={form.verified} onChange={e => onChange('verified', e.target.checked)} /> Verified</label>
      <button type="submit">Save</button>
    </form>
  </Modal>
));

const PurchaseForm = React.memo(({ form, onChange, onSubmit, users, games }: { 
  form: Omit<Purchase, 'id'>, 
  onChange: (field: keyof Omit<Purchase, 'id'>, value: string | number) => void,
  onSubmit: (e: React.FormEvent) => void,
  users: User[],
  games: Game[]
}) => (
  <Modal title="Add Purchase" onClose={() => {}}>
    <form onSubmit={onSubmit}>
      <select value={form.userId} onChange={e => onChange('userId', e.target.value)} required>
        <option value="">Select User</option>
        {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
      </select>
      <select value={form.gameId} onChange={e => onChange('gameId', e.target.value)} required>
        <option value="">Select Game</option>
        {games.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
      </select>
      <input type="number" value={form.price} onChange={e => onChange('price', Number(e.target.value))} placeholder="Price" required />
      <input type="date" value={form.purchaseDate} onChange={e => onChange('purchaseDate', e.target.value)} required />
      <input value={form.paymentMethod} onChange={e => onChange('paymentMethod', e.target.value)} placeholder="Payment Method" required />
      <input value={form.transactionKey} onChange={e => onChange('transactionKey', e.target.value)} placeholder="Transaction Key" required />
      <button type="submit">Save</button>
    </form>
  </Modal>
));

const AdminPage: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<{type: string, data?: any} | null>(null);
  
  // Form states
  const [userForm, setUserForm] = useState<Omit<User, 'id'>>({ username: '', email: '', password: '', role: '' });
  const [gameForm, setGameForm] = useState<Omit<Game, 'id'>>({ title: '', releaseDate: '', rating: 5, description: '', backgroundImage: '', price: 0, trailerUrl: '' });
  const [reviewForm, setReviewForm] = useState<Omit<Review, 'id'>>({ gameId: '', username: '', content: '', date: '', rating: 5, helpful: 0, verified: false });
  const [purchaseForm, setPurchaseForm] = useState<Omit<Purchase, 'id'>>({ userId: '', gameId: '', price: 0, purchaseDate: '', paymentMethod: '', transactionKey: '' });

  // Optimized form handlers
  const handleUserFormChange = useCallback((field: keyof Omit<User, 'id'>, value: string) => {
    setUserForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleGameFormChange = useCallback((field: keyof Omit<Game, 'id'>, value: string | number) => {
    setGameForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleReviewFormChange = useCallback((field: keyof Omit<Review, 'id'>, value: string | number | boolean) => {
    setReviewForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handlePurchaseFormChange = useCallback((field: keyof Omit<Purchase, 'id'>, value: string | number) => {
    setPurchaseForm(prev => ({ ...prev, [field]: value }));
  }, []);

  // Reset forms when modal opens
  useEffect(() => {
    if (modal) {
      if (modal.type === 'addUser' || modal.type === 'editUser') {
        setUserForm(modal.data || { username: '', email: '', password: '', role: '' });
      } else if (modal.type === 'addGame' || modal.type === 'editGame') {
        setGameForm(modal.data || { title: '', releaseDate: '', rating: 5, description: '', backgroundImage: '', price: 0, trailerUrl: '' });
      } else if (modal.type === 'addReview' || modal.type === 'editReview') {
        setReviewForm(modal.data || { gameId: '', username: '', content: '', date: '', rating: 5, helpful: 0, verified: false });
      } else if (modal.type === 'addPurchase') {
        setPurchaseForm(modal.data || { userId: '', gameId: '', price: 0, purchaseDate: '', paymentMethod: '', transactionKey: '' });
      }
    }
  }, [modal]);

  // Fetch all data
  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching data from API...');
      const [usersRes, gamesRes, reviewsRes, purchasesRes] = await Promise.all([
        fetch(`${API}/users`),
        fetch(`${API}/games`),
        fetch(`${API}/reviews`),
        fetch(`${API}/purchases`)
      ]);
      
      console.log('API responses:', {
        users: usersRes.status,
        games: gamesRes.status,
        reviews: reviewsRes.status,
        purchases: purchasesRes.status
      });
      
      if (!usersRes.ok || !gamesRes.ok || !reviewsRes.ok || !purchasesRes.ok) {
        console.error('One or more API calls failed:', {
          users: usersRes.status,
          games: gamesRes.status,
          reviews: reviewsRes.status,
          purchases: purchasesRes.status
        });
        throw new Error('Failed to fetch data');
      }
      
      const usersData = await usersRes.json();
      const gamesData = await gamesRes.json();
      const reviewsData = await reviewsRes.json();
      const purchasesData = await purchasesRes.json();
      
      console.log('Fetched data:', {
        users: usersData.length,
        games: gamesData.length,
        reviews: reviewsData.length,
        purchases: purchasesData.length
      });
      
      console.log('Purchases data:', purchasesData);
      
      setUsers(usersData);
      setGames(gamesData);
      setReviews(reviewsData);
      setPurchases(purchasesData);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Could not load data.');
    }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  // --- CRUD Helpers ---
  // Users
  const addUser = async (user: Omit<User, 'id'>) => {
    setLoading(true);
    try {
      await fetch(`${API}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      await fetchAll();
      setModal(null);
    } catch (err) { setError('Failed to add user.'); }
    setLoading(false);
  };
  const editUser = async (user: User) => {
    setLoading(true);
    try {
      await fetch(`${API}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      await fetchAll();
      setModal(null);
    } catch (err) { setError('Failed to edit user.'); }
    setLoading(false);
  };
  const deleteUser = async (id: string) => {
    if (!window.confirm('Delete this user?')) return;
    setLoading(true);
    try {
      await fetch(`${API}/users/${id}`, { method: 'DELETE' });
      await fetchAll();
    } catch (err) { setError('Failed to delete user.'); }
    setLoading(false);
  };
  // Games
  const addGame = async (game: Omit<Game, 'id'>) => {
    setLoading(true);
    try {
      await fetch(`${API}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(game)
      });
      await fetchAll();
      setModal(null);
    } catch (err) { setError('Failed to add game.'); }
    setLoading(false);
  };
  const editGame = async (game: Game) => {
    setLoading(true);
    try {
      await fetch(`${API}/games/${game.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(game)
      });
      await fetchAll();
      setModal(null);
    } catch (err) { setError('Failed to edit game.'); }
    setLoading(false);
  };
  const deleteGame = async (id: string) => {
    if (!window.confirm('Delete this game?')) return;
    setLoading(true);
    try {
      await fetch(`${API}/games/${id}`, { method: 'DELETE' });
      await fetchAll();
    } catch (err) { setError('Failed to delete game.'); }
    setLoading(false);
  };
  // Reviews
  const addReview = async (review: Omit<Review, 'id'>) => {
    setLoading(true);
    try {
      await fetch(`${API}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      });
      await fetchAll();
      setModal(null);
    } catch (err) { setError('Failed to add review.'); }
    setLoading(false);
  };
  const editReview = async (review: Review) => {
    setLoading(true);
    try {
      await fetch(`${API}/reviews/${review.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      });
      await fetchAll();
      setModal(null);
    } catch (err) { setError('Failed to edit review.'); }
    setLoading(false);
  };
  const deleteReview = async (id: string) => {
    if (!window.confirm('Delete this review?')) return;
    setLoading(true);
    try {
      await fetch(`${API}/reviews/${id}`, { method: 'DELETE' });
      await fetchAll();
    } catch (err) { setError('Failed to delete review.'); }
    setLoading(false);
  };
  // Purchases
  const addPurchase = async (purchase: Omit<Purchase, 'id'>) => {
    setLoading(true);
    try {
      await fetch(`${API}/purchases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(purchase)
      });
      await fetchAll();
      setModal(null);
    } catch (err) { setError('Failed to add purchase.'); }
    setLoading(false);
  };
  const deletePurchase = async (id: string) => {
    if (!window.confirm('Delete this purchase?')) return;
    setLoading(true);
    try {
      console.log('=== DELETE PURCHASE DEBUG ===');
      console.log('Deleting purchase with ID:', id);
      console.log('Current purchases before delete:', purchases);
      console.log('Purchase to delete:', purchases.find(p => p.id === id));
      
      // Try the standard DELETE method first
      const response = await fetch(`${API}/purchases/${id}`, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Delete response status:', response.status);
      console.log('Delete response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`Failed to delete purchase: ${response.status}`);
      }
      
      // Check if the delete was successful by fetching purchases again
      const checkResponse = await fetch(`${API}/purchases`);
      const remainingPurchases = await checkResponse.json();
      console.log('Remaining purchases after delete:', remainingPurchases);
      console.log('=== END DELETE DEBUG ===');
      
      await fetchAll();
    } catch (err) { 
      console.error('Delete purchase error:', err);
      setError('Failed to delete purchase.'); 
    }
    setLoading(false);
  };

  // --- Stats ---
  const totalUsers = users.length;
  const totalGames = games.length;
  const totalPurchases = purchases.length;
  const totalRevenue = purchases.reduce((sum, p) => sum + p.price, 0);
  const totalReviews = reviews.length;
  const averageRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : 0;

  // --- Render ---
  const renderModal = useMemo(() => {
    if (!modal) return null;
    const { type } = modal;
    
    if (type === 'addUser' || type === 'editUser') {
      return (
        <UserForm
          form={userForm}
          onChange={handleUserFormChange}
          onSubmit={(e) => { e.preventDefault(); type === 'addUser' ? addUser(userForm) : editUser(userForm as User); }}
          type={type}
        />
      );
    }
    
    if (type === 'addGame' || type === 'editGame') {
      return (
        <GameForm
          form={gameForm}
          onChange={handleGameFormChange}
          onSubmit={(e) => { e.preventDefault(); type === 'addGame' ? addGame(gameForm) : editGame(gameForm as Game); }}
          type={type}
        />
      );
    }
    
    if (type === 'addReview' || type === 'editReview') {
      return (
        <ReviewForm
          form={reviewForm}
          onChange={handleReviewFormChange}
          onSubmit={(e) => { e.preventDefault(); type === 'addReview' ? addReview(reviewForm) : editReview(reviewForm as Review); }}
          type={type}
          games={games}
        />
      );
    }
    
    if (type === 'addPurchase') {
      return (
        <PurchaseForm
          form={purchaseForm}
          onChange={handlePurchaseFormChange}
          onSubmit={(e) => { e.preventDefault(); addPurchase(purchaseForm); }}
          users={users}
          games={games}
        />
      );
    }
    
    return null;
  }, [modal, userForm, gameForm, reviewForm, purchaseForm, users, games, handleUserFormChange, handleGameFormChange, handleReviewFormChange, handlePurchaseFormChange]);

  // --- Render Table Rows ---
  const getGameTitle = (id: string) => games.find(g => g.id === id)?.title || id;
  const getUserName = (id: string) => users.find(u => u.id === id)?.username || id;

  return (
    <div className={styles['admin-page']}>
      <div className={styles['admin-header']}>
        <div className={styles['admin-header-content']}>
          <div className={styles['admin-header-left']}>
            <button className={styles['back-button']} onClick={() => navigate('/')}>← Back to Store</button>
            <h1>Admin Dashboard</h1>
          </div>
          <div className={styles['admin-header-right']}>
            <span className={styles['admin-badge']}>Administrator</span>
            <button className={styles['logout-button']} onClick={() => { onLogout(); navigate('/'); }}>Logout</button>
          </div>
        </div>
      </div>
      <div className={styles['admin-tabs']}>
        {(['overview', 'users', 'games', 'purchases', 'reviews'] as Tab[]).map(tab => (
          <button key={tab} className={`${styles['admin-tab']} ${activeTab === tab ? styles.active : ''}`} onClick={() => setActiveTab(tab)}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
        ))}
      </div>
      <div className={styles['admin-content']}>
        {loading ? <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div> : error ? <div style={{ color: 'red', textAlign: 'center', padding: 40 }}>{error}</div> : (
          <>
            {activeTab === 'overview' && (
              <div className={styles['overview-section']}>
                <div className={styles['stats-grid']}>
                  <div className={styles['stat-card']}><h3>Total Users</h3><div className={styles['stat-number']}>{totalUsers}</div></div>
                  <div className={styles['stat-card']}><h3>Total Games</h3><div className={styles['stat-number']}>{totalGames}</div></div>
                  <div className={styles['stat-card']}><h3>Total Purchases</h3><div className={styles['stat-number']}>{totalPurchases}</div></div>
                  <div className={styles['stat-card']}><h3>Total Revenue</h3><div className={styles['stat-number']}>${totalRevenue.toFixed(2)}</div></div>
                  <div className={styles['stat-card']}><h3>Total Reviews</h3><div className={styles['stat-number']}>{totalReviews}</div></div>
                  <div className={styles['stat-card']}><h3>Average Rating</h3><div className={styles['stat-number']}>{averageRating.toFixed(1)}</div></div>
                </div>
              </div>
            )}
            {activeTab === 'users' && (
              <div className={styles['users-section']}>
                <h3>Users</h3>
                <div className={styles['table-container']}>
                  <table className={styles['admin-table']}>
                    <thead><tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>{user.role || 'user'}</td>
                          <td>
                            <button onClick={() => setModal({ type: 'editUser', data: user })}>Edit</button>
                            <button onClick={() => deleteUser(user.id)}>Delete</button>
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
                <h3>Games <button onClick={() => setModal({ type: 'addGame' })}>+ Add Game</button></h3>
                {error && (
                  <div style={{ color: 'red', marginBottom: 16 }}>
                    Failed to load games: {error}
                  </div>
                )}
                <div className={styles['table-container']}>
                  <table className={styles['admin-table']}>
                    <thead><tr><th>ID</th><th>Title</th><th>Release Date</th><th>Rating</th><th>Price</th><th>Actions</th></tr></thead>
                    <tbody>
                      {games.length === 0 && !loading && !error ? (
                        <tr><td colSpan={6} style={{ textAlign: 'center' }}>No games found.</td></tr>
                      ) : (
                        games.map(game => (
                          <tr key={game.id}>
                            <td>{game.id}</td>
                            <td>{game.title}</td>
                            <td>{game.releaseDate}</td>
                            <td>{game.rating}</td>
                            <td>${game.price}</td>
                            <td>
                              <button onClick={() => setModal({ type: 'editGame', data: game })}>Edit</button>
                              <button onClick={() => deleteGame(game.id)}>Delete</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === 'purchases' && (
              <div className={styles['purchases-section']}>
                <h3>Purchases</h3>
                <div className={styles['table-container']}>
                  <table className={styles['admin-table']}>
                    <thead><tr><th>ID</th><th>User</th><th>Game</th><th>Price</th><th>Date</th><th>Payment</th><th>Actions</th></tr></thead>
                    <tbody>
                      {purchases.map(purchase => (
                        <tr key={purchase.id}>
                          <td>{purchase.id}</td>
                          <td>{getUserName(purchase.userId)}</td>
                          <td>{getGameTitle(purchase.gameId)}</td>
                          <td>${purchase.price}</td>
                          <td>{purchase.purchaseDate}</td>
                          <td>{purchase.paymentMethod}</td>
                          <td>
                            <button onClick={() => deletePurchase(purchase.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className={styles['reviews-section']}>
                <h3>Reviews</h3>
                <div className={styles['table-container']}>
                  <table className={styles['admin-table']}>
                    <thead><tr><th>ID</th><th>Game</th><th>User</th><th>Rating</th><th>Content</th><th>Date</th><th>Actions</th></tr></thead>
                    <tbody>
                      {reviews.map(review => (
                        <tr key={review.id}>
                          <td>{review.id}</td>
                          <td>{getGameTitle(review.gameId)}</td>
                          <td>{review.username}</td>
                          <td>{review.rating}/5</td>
                          <td className={styles['review-comment']}>{review.content}</td>
                          <td>{review.date}</td>
                          <td>
                            <button onClick={() => setModal({ type: 'editReview', data: review })}>Edit</button>
                            <button onClick={() => deleteReview(review.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
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