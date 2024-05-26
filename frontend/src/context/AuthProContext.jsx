// context/AuthProContext.jsx

import { createContext, useContext, useState } from "react";

export const AuthProContext = createContext();

export const useAuthProContext = () => {
  return useContext(AuthProContext);
};

export const AuthProContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("pro-user")) || null);

  const login = (userData) => {
    const formattedUserData = {
      ...userData,
      categories: userData.categories.map(categoryId => ({ _id: categoryId }))
    };
    setAuthUser(formattedUserData);
    localStorage.setItem("pro-user", JSON.stringify(formattedUserData));
    console.log(formattedUserData);
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
