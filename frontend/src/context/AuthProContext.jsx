// context/AuthProContext.jsx

import { createContext, useContext, useState } from "react";

export const AuthProContext = createContext();

export const useAuthProContext = () => {
  return useContext(AuthProContext);
};

export const AuthProContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("pro-user")) || null);

  const login = (userData) => {
    setAuthUser(userData);
    localStorage.setItem("pro-user", JSON.stringify(userData));
  };

  const logout = () => {
    setAuthUser(null);
    localStorage.removeItem("pro-user");
  };

  return (
    <AuthProContext.Provider value={{ authUser, login, logout }}>
      {children}
    </AuthProContext.Provider>
  );
};
