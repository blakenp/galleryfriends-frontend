import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '../styles/navbar.module.css';
import useAuthMenuItems from '../data/authMenuItems';
import useStorage from './useStorage';

export default function AuthNavbar() {
  const { removeItem } = useStorage();
  const pathname = usePathname();
  const authMenuItems = useAuthMenuItems();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleHomeNavigation = () => {
    window.location.href = '/';
  };

  const handleLogout = () => {
    removeItem('sessionToken');
    window.location.href = '/';
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="bg-gray-900 text-white">
      <div className="flex justify-between items-center p-4">
        <button className="text-2xl font-semibold cursive" onClick={handleHomeNavigation}>
          Gallery Friends
        </button>
        <nav className="hidden md:flex md:items-center md:space-x-6">
          {authMenuItems.map((item) => {
            const isActive = pathname === item.url;

            return (
              <Link key={item.title} href={item.url}>
                <div
                  className={`${
                    isActive ? 'text-white' : 'text-gray-300'
                  } py-2 md:py-0 md:hover:text-white`}
                >
                  {item.title}
                </div>
              </Link>
            );
          })}
          <div className={`text-gray-300 py-2 md:py-0 md:hover:text-white cursor-pointer`} onClick={handleLogout}>
            Logout
          </div>
        </nav>
        <button
          className="text-xl md:hidden"
          onClick={handleMobileMenuToggle}
        >
          &#9776; {/* Hamburger icon */}
        </button>
      </div>
      <nav className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="md:flex md:items-center md:flex-col md:p-4">
          {authMenuItems.map((item) => {
            const isActive = pathname === item.url;

            return (
              <Link key={item.title} href={item.url}>
                <div
                  className={`${
                    isActive ? 'text-white' : 'text-gray-300'
                  } py-2 md:py-0 md:hover:text-white`}
                >
                  {item.title}
                </div>
              </Link>
            );
          })}
          <div className={`text-gray-300 py-2 md:py-0 md:hover:text-white cursor-pointer`} onClick={handleLogout}>
            Logout
          </div>
        </div>
      </nav>
    </div>
  );
}
