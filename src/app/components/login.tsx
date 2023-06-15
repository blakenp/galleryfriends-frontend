'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { backendLink } from '../backend/config';
import axios from 'axios';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post(backendLink + '/api/users/login', { username, password });
      // Handle the successful login response
      console.log(response.data);
      router.push('/home');
    } catch (error) {
      // Handle login error
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <label>
        Username/Email:
        <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      <br />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
