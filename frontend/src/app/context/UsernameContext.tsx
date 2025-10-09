'use client';
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

type UsernameContextType = {
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
};

const UsernameContext = createContext<UsernameContextType | undefined>(undefined);

export function UsernameProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string>('');

  return (
    <UsernameContext.Provider value={{ username, setUsername }}>
      {children}
    </UsernameContext.Provider>
  );
}

export function useUsername() {
  const context = useContext(UsernameContext);
  if (!context) throw new Error('useUsername must be used within a UsernameProvider');
  return context;
}
