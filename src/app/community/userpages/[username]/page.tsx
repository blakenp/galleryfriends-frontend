'use client';

import { AuthProvider } from "@/app/contexts/authContext";
import { ImageProvider } from "@/app/contexts/imageContext";
import OtherUserComponent from "@/app/components/otherUserPage";

export default function OtherUserPage() {

  return (
    <div>
      <AuthProvider>
        <ImageProvider>
          <OtherUserComponent />
        </ImageProvider>
      </AuthProvider>
    </div>
  );
};
