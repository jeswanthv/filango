// authContext.js
import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check local storage for user data on initial load
    const storedUserId = localStorage.getItem("userId");
    const storedUserName = localStorage.getItem("userName");
    const userInfo = { storedUserId, storedUserName };
    if (userInfo) {
      setUser(userInfo);
    }
  }, [user]);

  const login = (userId, userName) => {
    // Set user data in state and local storage upon login
    const userInfo = { userId, userName };
    setUser(userInfo);
    localStorage.setItem("userId", userId);
    localStorage.setItem("userName", userName);
  };

  const logout = () => {
    // Clear user data from state and local storage upon logout
    setUser(null);
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
