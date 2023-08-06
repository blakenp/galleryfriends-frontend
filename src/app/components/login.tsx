'use client';

import { useUser } from '../contexts/userContext';
import { backendLink } from '../backend/config';
import { useAuth } from '../contexts/authContext';
import { useState } from 'react';
import useStorage from './useStorage';
import axios from 'axios';

const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const { username, setUsername, password, setPassword } = useUser();
  const { authenticated } = useAuth();
  const { setItem } = useStorage();

  if (authenticated) {
    window.location.href = '/community';
  }

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');

    // Validate the form fields
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter your username/email and password.');
      return;
    }

    try {
      const response = await axios.post(backendLink + '/api/users/login', { username, password });

      // Handle the successful login response
      const { user, sessionToken } = response.data;

      // Store the session token securely in session storage
      setItem('sessionToken', sessionToken);

      // Redirect to the user's home page
      console.log('username: ', username);
      sessionStorage.setItem('username', user.username);
      sessionStorage.setItem('email', user.email);
      window.location.href = '/community';
    } catch (error: any) {
      console.log('error message: ', error.message);
      if (error.response && error.response.status === 400) {
        setErrorMessage('Invalid username.');
      } else if (error.response && error.response.status === 401) {
        setErrorMessage('Invalid password');
      } else {
        // Handle login error
        console.error(error);
        setErrorMessage('Sorry, an error has occurred. Please try again!');
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-transparent to-white">
      {authenticated ? (
        <p>redirecting...</p>
      ) : (
        <form onSubmit={handleLogin} className="container mt-4 p-8 bg-white rounded shadow-lg" style={{ maxWidth: '400px' }}>
          <div className="mb-3">
            <label className="form-label">Username/Email:</label>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="form-control w-full mb-3" // Use w-full to make the input span the full width of the container
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="form-control w-full mb-3" // Use w-full to make the input span the full width of the container
            />
          </div>
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <button type="submit" className="btn-custom" disabled={false}>
            Login
          </button>
        </form>
      )}
    </div>
  );
};

export default function LoginComponent() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}
