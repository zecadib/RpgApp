"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType {
  username: string;
  setUsername: (username: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [username, setUsernameState] = useState<string>('');

  useEffect(() => {
    // Carregar username do localStorage ao iniciar
    const savedUsername = localStorage.getItem('nighshift_username');
    if (savedUsername) {
      setUsernameState(savedUsername);
    }
  }, []);

  const setUsername = (newUsername: string) => {
    setUsernameState(newUsername);
    localStorage.setItem('nighshift_username', newUsername);
  };

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};