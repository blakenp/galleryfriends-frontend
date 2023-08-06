// rootNavbar.tsx
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../styles/navbar.module.css';
import { MenuItems } from '../data/rootMenuItems';

export default function RootNavbar() {
  const pathname = usePathname();

  const handleHomeNavigation = () => {
    window.location.href = '/';
  };

  return (
    <div className={styles.navbar}>
      <button className={styles.sitetitle} onClick={handleHomeNavigation}>
        Gallery Friends
      </button>
      <nav className={styles.navbar}>
        {MenuItems.map((item) => {
          const isActive = pathname === item.url;

          return (
            <Link key={item.title} href={item.url}>
              <div
                className={
                  isActive ? styles.activeNavLink : styles.navLink
                }
              >
                {item.title}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
