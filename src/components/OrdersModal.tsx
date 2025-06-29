import React, { useState, useEffect } from 'react';
import styles from './OrdersModal.module.css';

interface Purchase {
  id: string;
  userId: string;
  gameId: string;
  price: number;
  purchaseDate: string;
  paymentMethod: string;
  transactionKey: string;
}

interface Game {
  id: string;
  title: string;
  backgroundImage: string;
  price: number;
}

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const OrdersModal: React.FC<OrdersModalProps> = ({ isOpen, onClose, userId }) => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen, userId]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch purchases for the current user
      const purchasesResponse = await fetch('http://localhost:3002/purchases');
      const allPurchases: Purchase[] = await purchasesResponse.json();
      
      // Filter purchases for the current user (handle both guest and registered users)
      const userPurchases = allPurchases.filter(purchase => {
        // For registered users, match by user ID
        if (userId !== 'guest-user' && userId !== 'admin') {
          return purchase.userId === userId;
        }
        // For guest users and admin, show all purchases (or you could filter differently)
        return purchase.userId === 'guest-user' || purchase.userId === userId;
      });
      
      setPurchases(userPurchases);

      // Fetch games data to get game titles
              const gamesResponse = await fetch('http://localhost:3002/games');
      const gamesData: Game[] = await gamesResponse.json();
      setGames(gamesData);
      
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getGameInfo = (gameId: string) => {
    return games.find(game => game.id === gameId) || {
      title: 'Unknown Game',
      backgroundImage: 'https://via.placeholder.com/300x200?text=Game+Image',
      price: 0
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTotalSpent = () => {
    return purchases.reduce((total, purchase) => total + purchase.price, 0);
  };

  if (!isOpen) return null;

  return (
    <div 
      className={styles['orders-modal-overlay']}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles['orders-modal-container']}>
        <div className={styles['orders-modal-header']}>
          <h2>My Orders</h2>
          <button className={styles['close-button']} onClick={onClose}>×</button>
        </div>
        
        <div className={styles['orders-modal-content']}>
          {loading ? (
            <div className={styles['loading-state']}>
              <div className={styles['loading-spinner']}></div>
              <p>Loading your orders...</p>
            </div>
          ) : error ? (
            <div className={styles['error-state']}>
              <p>{error}</p>
              <button onClick={fetchOrders} className={styles['retry-button']}>
                Try Again
              </button>
            </div>
          ) : purchases.length === 0 ? (
            <div className={styles['empty-state']}>
              <div className={styles['empty-icon']}>📦</div>
              <h3>No Orders Yet</h3>
              <p>You haven't made any purchases yet. Start shopping to see your orders here!</p>
            </div>
          ) : (
            <>
              <div className={styles['orders-summary']}>
                <div className={styles['summary-item']}>
                  <span className={styles['summary-label']}>Total Orders:</span>
                  <span className={styles['summary-value']}>{purchases.length}</span>
                </div>
                <div className={styles['summary-item']}>
                  <span className={styles['summary-label']}>Total Spent:</span>
                  <span className={styles['summary-value']}>${getTotalSpent().toFixed(2)}</span>
                </div>
              </div>
              
              <div className={styles['orders-list']}>
                {purchases.map((purchase) => {
                  const gameInfo = getGameInfo(purchase.gameId);
                  return (
                    <div key={purchase.id} className={styles['order-item']}>
                      <div className={styles['order-game-info']}>
                        <div className={styles['game-image']}>
                          <img src={gameInfo.backgroundImage} alt={gameInfo.title} />
                        </div>
                        <div className={styles['game-details']}>
                          <h4 className={styles['game-title']}>{gameInfo.title}</h4>
                          <p className={styles['game-price']}>${purchase.price.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className={styles['order-details']}>
                        <div className={styles['detail-row']}>
                          <span className={styles['detail-label']}>Order Date:</span>
                          <span className={styles['detail-value']}>{formatDate(purchase.purchaseDate)}</span>
                        </div>
                        <div className={styles['detail-row']}>
                          <span className={styles['detail-label']}>Payment Method:</span>
                          <span className={styles['detail-value']}>{purchase.paymentMethod}</span>
                        </div>
                        <div className={styles['detail-row']}>
                          <span className={styles['detail-label']}>Transaction ID:</span>
                          <span className={`${styles['detail-value']} ${styles['transaction-id']}`}>{purchase.transactionKey}</span>
                        </div>
                      </div>
                      
                      <div className={styles['order-status']}>
                        <span className={`${styles['status-badge']} ${styles['completed']}`}>Completed</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersModal; 