'use client';

import Link from 'next/link'
import { usePathname } from 'next/navigation';
import styles from '../styles/navbar.module.css'
import { AuthMenuItems } from '../data/authMenuItems';

export default function AuthNavbar() {
    const pathname = usePathname()
    
    const handleLogout = () => {
        sessionStorage.removeItem('sessionToken');
        window.location.href = '/'
    };

    return (
        <div className={styles.navbar}>
            <Link href="/">
                <div className={styles.sitetitle}>
                    Gallery Friends
                </div>
            </Link>
            <nav className={ styles.navbar }>
                {AuthMenuItems.map((item) => {
                    const isActive = pathname

                    return (
                        <Link 
                            key={item.title}
                            href={item.url}
                        >
                            <div className={
                                isActive == item.url
                                    ? styles.activeNavLink
                                    : styles.navLink
                                }>
                                {item.title}
                            </div>
                        </Link>
                    )
                })}
                <div className={styles.logoutLink} onClick={handleLogout}>
                    Logout
                </div>
            </nav>
        </div>
    )
}