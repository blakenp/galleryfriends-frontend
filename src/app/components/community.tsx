'use client'

import { useAuth } from '../contexts/authContext';
import useStorage from './useStorage';

export default function CommunityPage() {
  const { getItem } = useStorage();
  const username = getItem('username')
  const { authenticated } = useAuth();
  console.log('auth state: ', authenticated)

  return (
    <div>
      {authenticated ? (
        <h1>Welcome, {username}!</h1>
      ) : (
        <h1>Verification failed. Please log in again.</h1>
      )}
      {/* Render the main contents of the protected route here */}
    </div>
  );
}

