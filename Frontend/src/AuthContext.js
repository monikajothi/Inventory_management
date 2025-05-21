// import { createContext } from "react";

// let AuthContext = createContext(null);

// export default AuthContext;

import React, { createContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const signin = async (email, password) => {
    try {
      const response = await axios.post("https://inventory-management-s29k.onrender.com/api/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      setUser(user);

      return user;
    } catch (error) {
      throw new Error("Login failed");
    }
  };

  const signout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
