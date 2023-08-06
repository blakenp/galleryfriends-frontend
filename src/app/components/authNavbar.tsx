// authNavbar.tsx
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../styles/navbar.module.css';
import useAuthMenuItems from '../data/authMenuItems';
import useStorage from './useStorage';

export default function AuthNavbar() {
  const { removeItem } = useStorage();
  const pathname = usePathname();
  const authMenuItems = useAuthMenuItems();

  const handleLogout = () => {
    removeItem('sessionToken');
    window.location.href = '/';
  };

  return (
    <div className={styles.navbar}>
      <button className={styles.sitetitle} onClick={() => window.location.href = '/'}>
        Gallery Friends
      </button>
      <nav className={styles.navbar}>
        {authMenuItems.map((item) => {
          const isActive = pathname === item.url;

          return (
            <Link key={item.title} href={item.url}>
              <div className={isActive ? styles.activeNavLink : styles.navLink}>
                {item.title}
              </div>
            </Link>
          );
        })}
        <div className={styles.logoutLink} onClick={handleLogout}>
          Logout
        </div>
      </nav>
    </div>
  );
}
