import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const DEFAULT_USERS = [
  {
    id: 'usr-1',
    name: 'Alex Morgan',
    email: 'admin@courier.com',
    password: 'password123',
    role: 'Admin Dispatcher',
    phone: '+1 (555) 019-2834',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-2',
    name: 'Sarah Connor',
    email: 'sarah@courier.com',
    password: 'password123',
    role: 'Logistics Manager',
    phone: '+1 (555) 018-4421',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString()
  }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize Auth state & LocalStorage database
  useEffect(() => {
    // Load registered users database
    const storedUsers = localStorage.getItem('courier_users');
    if (!storedUsers) {
      localStorage.setItem('courier_users', JSON.stringify(DEFAULT_USERS));
      setUsers(DEFAULT_USERS);
    } else {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch (e) {
        setUsers(DEFAULT_USERS);
      }
    }

    // Load active session user
    const sessionUser = localStorage.getItem('courier_auth_user');
    if (sessionUser) {
      try {
        setCurrentUser(JSON.parse(sessionUser));
      } catch (e) {
        localStorage.removeItem('courier_auth_user');
      }
    }
    setLoading(false);
  }, []);

  // Save users list to LocalStorage whenever modified
  const updateUsersList = (newUsersList) => {
    setUsers(newUsersList);
    localStorage.setItem('courier_users', JSON.stringify(newUsersList));
  };

  // Login handler
  const login = (email, password) => {
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );

    if (user) {
      const sessionData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'Staff Member',
        phone: user.phone || '',
        avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`,
        loginTime: new Date().toISOString()
      };
      setCurrentUser(sessionData);
      localStorage.setItem('courier_auth_user', JSON.stringify(sessionData));
      toast.success(`Welcome back, ${user.name}!`);
      return { success: true };
    } else {
      toast.error('Invalid email or password. Try admin@courier.com / password123');
      return { success: false, message: 'Invalid credentials' };
    }
  };

  // Register new user
  const register = (userData) => {
    const existing = users.find(
      (u) => u.email.toLowerCase() === userData.email.toLowerCase().trim()
    );

    if (existing) {
      toast.error('An account with this email already exists.');
      return { success: false, message: 'User already exists' };
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
      role: userData.role || 'Courier Staff',
      phone: userData.phone || '',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=4f46e5&color=fff`,
      createdAt: new Date().toISOString()
    };

    const updated = [...users, newUser];
    updateUsersList(updated);

    // Auto login after successful registration
    const sessionData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      avatar: newUser.avatar,
      loginTime: new Date().toISOString()
    };

    setCurrentUser(sessionData);
    localStorage.setItem('courier_auth_user', JSON.stringify(sessionData));
    toast.success('Account registered successfully! Welcome aboard.');
    return { success: true };
  };

  // Forgot password / Reset password
  const resetPassword = (email, newPassword) => {
    const index = users.findIndex(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (index === -1) {
      toast.error('No account found with this email address.');
      return { success: false };
    }

    const updatedUsers = [...users];
    updatedUsers[index].password = newPassword;
    updateUsersList(updatedUsers);

    toast.success('Password reset successfully! You can now log in.');
    return { success: true };
  };

  // Logout handler
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('courier_auth_user');
    toast.info('You have logged out successfully.');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        loading,
        login,
        register,
        resetPassword,
        logout,
        users
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
