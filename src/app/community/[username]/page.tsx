'use client';

import { AuthProvider } from "@/app/contexts/authContext";
import UserComponent from "@/app/components/userpage";

export default function UserPage() {

  return (
    <div>
      <AuthProvider>
        <UserComponent />
      </AuthProvider>
    </div>
  );
};
