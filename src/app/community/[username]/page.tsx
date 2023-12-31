'use client';

import { AuthProvider } from "@/app/contexts/authContext";
import { ImageProvider } from "@/app/contexts/imageContext";
import { UserProvider } from "@/app/contexts/userContext";
import UserComponent from "@/app/components/userpage";

export default function UserPage() {

  return (
    <div>
      <AuthProvider>
        <ImageProvider>
          <UserProvider>
            <UserComponent />
          </UserProvider>
        </ImageProvider>
      </AuthProvider>
    </div>
  );
};
