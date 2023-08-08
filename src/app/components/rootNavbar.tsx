import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MenuItems } from '../data/rootMenuItems';

export default function RootNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleHomeNavigation = () => {
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
          {MenuItems.map((item) => {
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
          {MenuItems.map((item) => {
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
        </div>
      </nav>
    </div>
  );
}
