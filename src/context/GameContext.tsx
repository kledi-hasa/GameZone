import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';

export interface Game {
  id: string;
  title: string;
  releaseDate: string;
  rating: number;
  description: string;
  price: number;
  cost: number; // Cost to purchase the game
  quantity: number; // Quantity purchased
  backgroundImage: string;
  trailerUrl?: string;
  views?: number;
  purchases?: number;
}

export interface Comment {
  id: string;
  gameId: string;
  username: string;
  content: string;
  date: string;
  isInappropriate: boolean;
  userId: string;
  rating?: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'suspended' | 'banned';
  lastLogin?: string;
  joinDate?: string;
  totalPurchases?: number;
  totalSpent?: number;
}

export interface Purchase {
  id: string;
  userId: string;
  gameId: string;
  price: number;
  purchaseDate: string;
  paymentMethod: string;
  transactionKey: string;
}

interface GameContextType {
  games: Game[];
  addGame: (game: Omit<Game, 'id'>) => Promise<void>;
  editGame: (game: Game) => Promise<void>;
  deleteGame: (gameId: string) => Promise<void>;
  getGameById: (gameId: string) => Game | undefined;

  comments: Comment[];
  addComment: (comment: Omit<Comment, 'id' | 'date'>) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  flagComment: (commentId: string) => Promise<void>;

  users: User[];
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  suspendUser: (userId: string) => Promise<void>;
  banUser: (userId: string) => Promise<void>;
  activateUser: (userId: string) => Promise<void>;

  purchases: Purchase[];
  addPurchase: (purchase: Omit<Purchase, 'id'>) => Promise<void>;

  getStatistics: () => {
    totalGames: number;
    totalUsers: number;
    totalComments: number;
    totalPurchases: number;
    totalRevenue: number;
    flaggedComments: number;
    popularGames: Game[];
    recentPurchases: Purchase[];
    userActivity: { active: number; suspended: number; banned: number };
  };
  
  getProfitReport: () => {
    gameProfits: Array<{
      gameId: string;
      title: string;
      cost: number;
      quantity: number;
      totalCost: number;
      soldQuantity: number;
      revenue: number;
      profit: number;
      profitMargin: number;
      status: 'profit' | 'loss' | 'break-even';
    }>;
    totalCost: number;
    totalRevenue: number;
    totalProfit: number;
    totalProfitMargin: number;
    overallStatus: 'profit' | 'loss' | 'break-even';
  };
}

const GameContext = createContext<GameContextType | undefined>(undefined);
const API_URL = 'http://localhost:3002';

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  // Fetch all data on mount
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [gamesRes, commentsRes, usersRes, purchasesRes] = await Promise.all([
          axios.get<Game[]>(`${API_URL}/games`),
          axios.get<Comment[]>(`${API_URL}/comments`),
          axios.get<User[]>(`${API_URL}/users`),
          axios.get<Purchase[]>(`${API_URL}/purchases`)
        ]);
        setGames(gamesRes.data);
        setComments(commentsRes.data);
        setUsers(usersRes.data);
        setPurchases(purchasesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchAll();
  }, []);

  // After fetching users and purchases, compute dynamic fields
  const usersWithStats = users.map(user => {
    const userPurchases = purchases.filter(p => p.userId === user.id);
    const totalPurchases = userPurchases.length;
    const totalSpent = userPurchases.reduce((sum, p) => sum + p.price, 0);
    // For joinDate, if not present, set to first purchase date or null
    let joinDate = user.lastLogin;
    if (!joinDate && userPurchases.length > 0) {
      joinDate = userPurchases[0].purchaseDate;
    }
    return {
      ...user,
      joinDate: joinDate || '',
      totalPurchases,
      totalSpent
    };
  });

  // ========== Games ==========
  const addGame = async (newGame: Omit<Game, 'id'>) => {
    try {
      const res = await axios.post<Game>(`${API_URL}/games`, newGame);
      setGames(prev => [...prev, res.data]);
    } catch (error) {
      console.error('Failed to add game:', error);
    }
  };

  const editGame = async (updatedGame: Game) => {
    try {
      await axios.patch(`${API_URL}/games/${updatedGame.id}`, updatedGame);
      setGames(prev => prev.map(game => game.id === updatedGame.id ? updatedGame : game));
    } catch (error) {
      console.error('Failed to edit game:', error);
    }
  };

  const deleteGame = async (gameId: string) => {
    try {
      await axios.delete(`${API_URL}/games/${gameId}`);
      setGames(prev => prev.filter(game => game.id !== gameId));
    } catch (error) {
      console.error('Failed to delete game:', error);
    }
  };

  const getGameById = (gameId: string) => games.find(game => game.id === gameId);

  // ========== Comments ==========
  const addComment = async (newComment: Omit<Comment, 'id' | 'date'>) => {
    try {
      const comment = {
        ...newComment,
        date: new Date().toISOString().split('T')[0],
      };
      const res = await axios.post<Comment>(`${API_URL}/comments`, comment);
      setComments(prev => [...prev, res.data]);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      await axios.delete(`${API_URL}/comments/${commentId}`);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const flagComment = async (commentId: string) => {
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;
    const updated = { ...comment, isInappropriate: !comment.isInappropriate };
    try {
      await axios.patch(`${API_URL}/comments/${commentId}`, { isInappropriate: updated.isInappropriate });
      setComments(prev => prev.map(c => c.id === commentId ? updated : c));
    } catch (error) {
      console.error('Failed to flag comment:', error);
    }
  };

  // ========== Users ==========
  const addUser = async (newUser: Omit<User, 'id'>) => {
    // Generate a unique id for the new user
    const id = Math.random().toString(36).substr(2, 8);
    const user: User = {
      ...newUser,
      id,
      status: 'active',
      role: newUser.role || 'user',
    };
    try {
      const res = await axios.post<User>(`${API_URL}/users`, user);
      setUsers(prev => [...prev, res.data]);
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  const updateUser = async (updatedUser: User) => {
    try {
      await axios.patch(`${API_URL}/users/${updatedUser.id}`, updatedUser);
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await axios.delete(`${API_URL}/users/${userId}`);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const suspendUser = async (userId: string) => {
    await changeUserStatus(userId, 'suspended');
  };
  const banUser = async (userId: string) => {
    await changeUserStatus(userId, 'banned');
  };
  const activateUser = async (userId: string) => {
    await changeUserStatus(userId, 'active');
  };

  const changeUserStatus = async (userId: string, status: User['status']) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const updated = { ...user, status };
    try {
      await axios.patch(`${API_URL}/users/${userId}`, { status });
      setUsers(prev => prev.map(u => u.id === userId ? updated : u));
    } catch (error) {
      console.error(`Failed to change user status to ${status}:`, error);
    }
  };

  // ========== Purchases ==========
  const addPurchase = async (purchase: Omit<Purchase, 'id'>) => {
    try {
      const res = await axios.post<Purchase>(`${API_URL}/purchases`, purchase);
      setPurchases(prev => [...prev, res.data]);
    } catch (error) {
      console.error('Failed to add purchase:', error);
    }
  };

  // ========== Statistics ==========
  const getStatistics = () => {
    const totalGames = games.length;
    const totalUsers = users.length;
    const totalComments = comments.length;
    const totalPurchases = purchases.length;
    const totalRevenue = purchases.reduce((sum, p) => sum + p.price, 0);
    const flaggedComments = comments.filter(c => c.isInappropriate).length;
    
    // Calculate real views and purchases for each game
    const gamesWithRealStats = games.map(game => {
      const gamePurchases = purchases.filter(p => p.gameId === game.id);
      const gameComments = comments.filter(c => c.gameId === game.id);
      
      // Views: estimated based on comments (each comment represents a view)
      // Purchases: actual purchase count from purchase data
      const realViews = gameComments.length + (gamePurchases.length * 3); // Each purchase = 3 views
      const realPurchases = gamePurchases.length;
      
      return {
        ...game,
        views: realViews,
        purchases: realPurchases
      };
    });
    
    const popularGames = [...gamesWithRealStats]
      .sort((a, b) => ((b.purchases ?? 0) * 10 + (b.views ?? 0)) - ((a.purchases ?? 0) * 10 + (a.views ?? 0)))
      .slice(0, 5);
      
    const recentPurchases = [...purchases]
      .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
      .slice(0, 10);
    const userActivity = {
      active: users.filter(u => u.status === 'active').length,
      suspended: users.filter(u => u.status === 'suspended').length,
      banned: users.filter(u => u.status === 'banned').length
    };
    return {
      totalGames,
      totalUsers,
      totalComments,
      totalPurchases,
      totalRevenue,
      flaggedComments,
      popularGames,
      recentPurchases,
      userActivity
    };
  };

  const getProfitReport = () => {
    const gameProfits = games.map(game => {
      const gamePurchases = purchases.filter(p => p.gameId === game.id);
      const soldQuantity = gamePurchases.length;
      const revenue = gamePurchases.reduce((sum, p) => sum + p.price, 0);
      const totalCost = (game.cost || 0) * (game.quantity || 1);
      const profit = revenue - totalCost;
      const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
      
      let status: 'profit' | 'loss' | 'break-even';
      if (profit > 0) status = 'profit';
      else if (profit < 0) status = 'loss';
      else status = 'break-even';
      
      return {
        gameId: game.id,
        title: game.title,
        cost: game.cost || 0,
        quantity: game.quantity || 1,
        totalCost,
        soldQuantity,
        revenue,
        profit,
        profitMargin,
        status
      };
    });
    
    const totalCost = gameProfits.reduce((sum, game) => sum + game.totalCost, 0);
    const totalRevenue = gameProfits.reduce((sum, game) => sum + game.revenue, 0);
    const totalProfit = totalRevenue - totalCost;
    const totalProfitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    
    let overallStatus: 'profit' | 'loss' | 'break-even';
    if (totalProfit > 0) overallStatus = 'profit';
    else if (totalProfit < 0) overallStatus = 'loss';
    else overallStatus = 'break-even';
    
    return {
      gameProfits,
      totalCost,
      totalRevenue,
      totalProfit,
      totalProfitMargin,
      overallStatus
    };
  };

  const value: GameContextType = {
    games, addGame, editGame, deleteGame, getGameById,
    comments, addComment, deleteComment, flagComment,
    users: usersWithStats, addUser, updateUser, deleteUser, suspendUser, banUser, activateUser,
    purchases, addPurchase,
    getStatistics,
    getProfitReport
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
