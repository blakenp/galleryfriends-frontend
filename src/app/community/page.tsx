'use client'

import { AuthProvider } from '../contexts/authContext';
import { UserProvider } from '../contexts/userContext';
import { ImageProvider } from '../contexts/imageContext';
import CommunityPage from '../components/community';

export default function AuthenticatedCommunityPage() {

  return (
    <AuthProvider>
      <ImageProvider>
        <UserProvider>
          <CommunityPage />
        </UserProvider>
      </ImageProvider>
    </AuthProvider>
  );
}

