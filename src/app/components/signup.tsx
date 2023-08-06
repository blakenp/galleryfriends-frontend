'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../contexts/userContext';
import { backendLink } from '../backend/config';
import axios from 'axios';

export default function SignUpForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const { username, setUsername, password, setPassword, email, setEmail } = useUser();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');

    // Validate the form fields
    if (!username.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Please fill in all the required fields.');
      return;
    }

    try {
      const user = {
        username,
        email,
        password,
      };

      const response = await axios.post(backendLink + '/api/users/create', user);
      console.log(response.data);

      setUsername('');
      setPassword('');
      setEmail('');
      router.push('/login');
    } catch (error: any) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        setErrorMessage('That username already exists in our system!');
      } else if (error.response && error.response.status === 402) {
        setErrorMessage('That email already exists in our system!');
      } else {
        console.log('Error creating user account: ', error);
        setErrorMessage('Sorry, an error occurred. Try again!');
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-transparent to-white">
      <form className="container mt-4 p-8 bg-white rounded shadow-lg" onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div className="mb-3">
          <label className="form-label">Username:</label>
          <input
            type="text"
            className="form-control w-full mb-3" // Adjust the width and margin-bottom as needed
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="text"
            className="form-control w-full mb-3" // Adjust the width and margin-bottom as needed
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password:</label>
          <input
            type="password"
            className="form-control w-full mb-3" // Adjust the width and margin-bottom as needed
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <button type="submit" className="btn-custom" disabled={false}>
          Signup
        </button>
      </form>
    </div>
  );
}
