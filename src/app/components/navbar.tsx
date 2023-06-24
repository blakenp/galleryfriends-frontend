'use client';

import { useAuth } from '../contexts/authContext';
import AuthNavbar from './authNavbar';
import RootNavbar from './rootNavbar';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();
    const { authenticated } = useAuth();
    console.log('auth state: ', authenticated);

    return (
        <>
            { authenticated && !['/', '/signup', '/login'].includes(pathname)  ? (
                <AuthNavbar />
            ) : (
                <RootNavbar />
            )}
        </>
    );
}