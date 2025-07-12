
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  adminLogin: (adminId: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

// Special admin credentials (you can change these)
const ADMIN_CREDENTIALS = {
  adminId: "college_admin_2024",
  password: "IGDTUWAdmin@123"
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession) {
      const session = JSON.parse(adminSession);
      // Check if session is still valid (24 hours)
      const now = new Date().getTime();
      if (now - session.timestamp < 24 * 60 * 60 * 1000) {
        setIsAdmin(true);
      } else {
        localStorage.removeItem('admin_session');
      }
    }
    setLoading(false);
  }, []);

  const adminLogin = async (adminId: string, password: string): Promise<boolean> => {
    if (adminId === ADMIN_CREDENTIALS.adminId && password === ADMIN_CREDENTIALS.password) {
      setIsAdmin(true);
      // Store admin session for 24 hours
      const session = {
        adminId,
        timestamp: new Date().getTime()
      };
      localStorage.setItem('admin_session', JSON.stringify(session));
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('admin_session');
  };

  const value = {
    isAdmin,
    adminLogin,
    adminLogout,
    loading
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
