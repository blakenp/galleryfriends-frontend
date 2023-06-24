'use client';

import { createContext, useContext, useState } from 'react';

export const UserContext = createContext<any | null>(null);

export function useUser() {
  return useContext(UserContext);
}

export const UserProvider = ({ children }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  return (
    <UserContext.Provider value={ {username, setUsername, password, setPassword, email, setEmail} }>
      {children}
    </UserContext.Provider>
  )
};
