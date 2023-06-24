'use client';

import { useUser } from '../contexts/userContext';
import { backendLink } from '../backend/config';
import { useAuth } from '../contexts/authContext';
import axios from 'axios';

const LoginForm = () => {
  const { username, setUsername, password, setPassword } = useUser();
  const { authenticated } = useAuth();
  
  if (authenticated) {
    window.location.href = '/community'
  }

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post(backendLink + '/api/users/login', { username, password });

      // Handle the successful login response
      const { user, sessionToken } = response.data;

      // Store the session token securely in session storage
      sessionStorage.setItem('sessionToken', sessionToken);

      // Redirect to the user's home page
      console.log('username: ', username)
      sessionStorage.setItem('username', user.username);
      window.location.href = '/community'
    } catch (error) {
      // Handle login error
      console.error(error);
    }
  };

  return (
    <>
      { authenticated ? (
        <p>redirecting...</p>
      ) : (
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
      )}
    </>
  );
};

export default function LoginComponent() {
  return (
      <div>
          <LoginForm />
      </div>
  )
}

