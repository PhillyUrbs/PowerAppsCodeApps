import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AppUser } from '../types/user';
import { USERS } from '../data/mock-data';

interface UserContextValue {
  currentUser: AppUser;
  switchUser: (userId: string) => void;
  allUsers: AppUser[];
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser>(USERS[0]);

  const switchUser = useCallback((userId: string) => {
    const user = USERS.find((u) => u.id === userId);
    if (user) setCurrentUser(user);
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, switchUser, allUsers: USERS }}>
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useCurrentUser must be used within UserProvider');
  return ctx;
}
