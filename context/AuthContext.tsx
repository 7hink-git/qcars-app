import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Booking } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<boolean>;
  signup: (name: string, email: string) => Promise<boolean>;
  logout: () => void;
  addBooking: (booking: Booking) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('q_cars_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simple mock login: retrieve from local storage 'database' of users
    const usersStr = localStorage.getItem('q_cars_users');
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];
    
    const foundUser = users.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('q_cars_current_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const usersStr = localStorage.getItem('q_cars_users');
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];

    if (users.find(u => u.email === email)) {
      return false; // User exists
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      bookings: []
    };

    users.push(newUser);
    localStorage.setItem('q_cars_users', JSON.stringify(users));
    
    setUser(newUser);
    localStorage.setItem('q_cars_current_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('q_cars_current_user');
  };

  const addBooking = (booking: Booking) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      bookings: [booking, ...user.bookings]
    };

    setUser(updatedUser);
    localStorage.setItem('q_cars_current_user', JSON.stringify(updatedUser));

    // Update the 'database' as well
    const usersStr = localStorage.getItem('q_cars_users');
    if (usersStr) {
      const users: User[] = JSON.parse(usersStr);
      const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u);
      localStorage.setItem('q_cars_users', JSON.stringify(updatedUsers));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, addBooking }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};