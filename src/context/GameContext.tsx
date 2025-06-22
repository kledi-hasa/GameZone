import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface Game {
  id: string;
  title: string;
  releaseDate: string;
  rating: number;
  description: string;
  price: number;
  backgroundImage: string;
}

export interface Comment {
  id: string;
  gameId: string;
  username: string;
  content: string;
  date: string;
  isInappropriate: boolean;
}

interface GameContextType {
  games: Game[];
  addGame: (game: Omit<Game, 'id'>) => void;
  editGame: (game: Game) => void;
  deleteGame: (gameId: string) => void;
  getGameById: (gameId: string) => Game | undefined;
  comments: Comment[];
  deleteComment: (commentId: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Initial games data to be used as a fallback
const initialGames: Game[] = [
  {
    id: '1',
    title: 'Elden Ring',
    releaseDate: 'February 25, 2022',
    rating: 5,
    description: 'An expansive open-world action RPG where you explore the Lands Between, uncover mysteries, and face epic bosses.',
    backgroundImage: 'https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg',
    price: 39.99
  },
  {
    id: '2',
    title: 'GTA V',
    releaseDate: '2013',
    rating: 9,
    description: 'An expansive open-world action RPG where you explore the Lands Between, uncover mysteries, and face epic bosses.',
    backgroundImage: 'https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg',
    price: 39.99
  },
  {
    id: '3',
    title: 'The Witcher 3: Wild Hunt',
    releaseDate: 'May 19, 2015',
    rating: 10,
    description: 'A story-driven, next-generation open world role-playing game, set in a visually stunning fantasy universe.',
    backgroundImage: 'https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg',
    price: 29.99
  },
  {
    id: '4',
    title: 'Red Dead Redemption 2',
    releaseDate: 'October 26, 2018',
    rating: 10,
    description: 'A western-themed action-adventure game set in an open world environment.',
    backgroundImage: 'https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg',
    price: 49.99
  }
];

// Initial comments data
const initialComments: Comment[] = [
  {
    id: '1',
    gameId: '1',
    username: 'gamer123',
    content: 'Amazing game! Love the graphics and story.',
    date: '2024-01-15',
    isInappropriate: false
  },
  {
    id: '2',
    gameId: '1',
    username: 'user456',
    content: 'This game is terrible, waste of money!',
    date: '2024-01-16',
    isInappropriate: true
  },
  {
    id: '3',
    gameId: '2',
    username: 'witcherfan',
    content: 'Best RPG I\'ve ever played!',
    date: '2024-01-17',
    isInappropriate: false
  }
];

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [games, setGames] = useState<Game[]>(() => {
    try {
      const storedGames = localStorage.getItem('games');
      return storedGames ? JSON.parse(storedGames) : initialGames;
    } catch (error) {
      console.error("Could not parse games from localStorage", error);
      return initialGames;
    }
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const storedComments = localStorage.getItem('comments');
      return storedComments ? JSON.parse(storedComments) : initialComments;
    } catch (error) {
      console.error("Could not parse comments from localStorage", error);
      return initialComments;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('games', JSON.stringify(games));
    } catch (error) {
      console.error("Could not save games to localStorage", error);
    }
  }, [games]);

  useEffect(() => {
    try {
      localStorage.setItem('comments', JSON.stringify(comments));
    } catch (error) {
      console.error("Could not save comments to localStorage", error);
    }
  }, [comments]);

  const addGame = (newGame: Omit<Game, 'id'>) => {
    const game: Game = {
      ...newGame,
      id: Date.now().toString()
    };
    setGames(prevGames => [...prevGames, game]);
  };

  const editGame = (updatedGame: Game) => {
    setGames(prevGames => 
      prevGames.map(game => game.id === updatedGame.id ? updatedGame : game)
    );
  };

  const deleteGame = (gameId: string) => {
    setGames(prevGames => prevGames.filter(game => game.id !== gameId));
  };

  const deleteComment = (commentId: string) => {
    setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
  };

  const getGameById = (gameId: string) => {
    return games.find(game => game.id === gameId);
  };

  const value: GameContextType = {
    games,
    addGame,
    editGame,
    deleteGame,
    getGameById,
    comments,
    deleteComment
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}; 