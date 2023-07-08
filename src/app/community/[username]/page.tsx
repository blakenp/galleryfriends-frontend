'use client';

import { AuthProvider } from "@/app/contexts/authContext";
import { ImageProvider } from "@/app/contexts/imageContext";
import UserComponent from "@/app/components/userpage";

export default function UserPage() {

  return (
    <div>
      <AuthProvider>
        <ImageProvider>
          <UserComponent />
        </ImageProvider>
      </AuthProvider>
    </div>
  );
};
