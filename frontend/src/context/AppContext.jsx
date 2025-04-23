import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Get initial data from localStorage or use defaults
  const [statements, setStatements] = useState(() => {
    const savedStatements = localStorage.getItem('statements');
    return savedStatements ? JSON.parse(savedStatements) : [];
  });
  
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users');
    return savedUsers ? JSON.parse(savedUsers) : [
      { id: '1', username: 'player1', score: 150, createdAt: new Date().toISOString() },
      { id: '2', username: 'player2', score: 120, createdAt: new Date().toISOString() },
      { id: '3', username: 'player3', score: 100, createdAt: new Date().toISOString() }
    ];
  });
  
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) return JSON.parse(savedUser);
    
    // Create a default user if none exists
    const newUser = { 
      id: uuidv4(),
      username: `player${Math.floor(Math.random() * 1000)}`, 
      score: 0,
      createdAt: new Date().toISOString(),
      statementIds: []
    };
    
    return newUser;
  });
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('statements', JSON.stringify(statements));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Add current user to users list if they don't exist
    if (!users.some(user => user.id === currentUser.id)) {
      setUsers(prev => [...prev, currentUser]);
    } else {
      // Update user in users list
      setUsers(prev => prev.map(user => 
        user.id === currentUser.id ? currentUser : user
      ));
    }
  }, [statements, users, currentUser]);

  // Add new statements submission
  const addStatements = (newStatements) => {
    const statementId = uuidv4();
    const statementObj = {
      id: statementId,
      userId: currentUser.id,
      username: currentUser.username,
      statements: newStatements.statements,
      lieIndex: newStatements.lieIndex,
      createdAt: new Date().toISOString(),
      playCount: 0
    };
    
    setStatements(prev => [...prev, statementObj]);
    
    // Update current user's statements
    setCurrentUser(prev => ({
      ...prev,
      statementIds: [...prev.statementIds, statementId]
    }));
    
    return statementId;
  };

  // Submit a guess for a statement
  const submitGuess = (statementId, guessIndex) => {
    const statement = statements.find(s => s.id === statementId);
    if (!statement) return { success: false, message: 'Statement not found' };
    
    const isCorrect = guessIndex === statement.lieIndex;
    const scoreChange = isCorrect ? 10 : -5;
    
    // Update statement play count
    setStatements(prev => prev.map(s => 
      s.id === statementId 
        ? { ...s, playCount: s.playCount + 1 } 
        : s
    ));
    
    // Update user score
    setCurrentUser(prev => ({
      ...prev,
      score: Math.max(0, prev.score + scoreChange)
    }));
    
    return {
      success: true,
      isCorrect,
      scoreChange,
      lieIndex: statement.lieIndex
    };
  };

  // Update username
  const updateUsername = (newUsername) => {
    if (!newUsername || newUsername.trim() === '') return false;
    
    setCurrentUser(prev => ({
      ...prev,
      username: newUsername
    }));
    
    return true;
  };

  // Get random statements for play (excluding user's own statements)
  const getRandomStatement = (excludeIds = []) => {
    const filteredStatements = statements.filter(s => 
      s.userId !== currentUser.id && !excludeIds.includes(s.id)
    );
    
    if (filteredStatements.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * filteredStatements.length);
    return filteredStatements[randomIndex];
  };

  // Get specific statement by ID
  const getStatementById = (id) => {
    return statements.find(s => s.id === id) || null;
  };

  // Get user statements
  const getUserStatements = () => {
    return statements.filter(s => s.userId === currentUser.id);
  };

  // Get leaderboard data
  const getLeaderboard = () => {
    return [...users].sort((a, b) => b.score - a.score);
  };

  const contextValue = {
    currentUser,
    statements,
    addStatements,
    submitGuess,
    updateUsername,
    getRandomStatement,
    getStatementById,
    getUserStatements,
    getLeaderboard
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};