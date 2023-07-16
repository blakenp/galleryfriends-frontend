'use client';

import { useUser } from '../contexts/userContext';
import { backendLink } from '../backend/config';
import { useAuth } from '../contexts/authContext';
import useStorage from './useStorage';
import axios from 'axios';

const LoginForm = () => {
  const { username, setUsername, password, setPassword } = useUser();
  const { authenticated } = useAuth();
  const { setItem } = useStorage();
  
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
      setItem('sessionToken', sessionToken);

      // Redirect to the user's home page
      console.log('username: ', username)
      sessionStorage.setItem('username', user.username);
      sessionStorage.setItem('email', user.email);
      window.location.href = '/community'
    } catch (error: any) {
      console.log('error message: ', error.message);
      if (error.response && error.response.status === 400) {
        window.alert('Invalid username!');
      }
      else if (error.response && error.response.status === 401) {
        window.alert('Invalid password!')
      }
      else {
        // Handle login error
        console.error(error);
        window.alert('Sorry, an error has occurred. Please try again!');
      }
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

