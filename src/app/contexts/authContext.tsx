'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { backendLink } from '../backend/config';
import axios from 'axios';

export const AuthContext = createContext<any | null>(null);

export function useAuth() {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }: any) => {
  const [authenticated, setAuthenticated] = useState(false);

  const verifyUser = async () => {
    try {
      const sessionToken = sessionStorage.getItem('sessionToken');
      
      if (!sessionToken) {
        console.log('token not found!');
        setAuthenticated(false);
        return;
      }

      const response = await axios.get(backendLink + `/api/users/verify`, {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
      });
      if (response.data.verified) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    } catch (error) {
      console.error(error);
      setAuthenticated(false);
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);


  return (
    <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
