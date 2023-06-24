'use client'

import { AuthProvider } from '../contexts/authContext';
import { UserProvider } from '../contexts/userContext';
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

