'use client'

import { AuthProvider } from '../contexts/authContext';
import { UserProvider } from '../contexts/userContext';
import { useUser } from '../contexts/userContext';
import { useRouter } from 'next/router';
import CommunityPage from '../components/community';

export default function AuthenticatedCommunityPage() {

  return (
    <AuthProvider>
      <UserProvider>
        <CommunityPage />
      </UserProvider>
    </AuthProvider>
  );
}

