'use client';

import Link from 'next/link'
import { usePathname } from 'next/navigation';
import styles from '../styles/navbar.module.css'
import { MenuItems } from '../data/menuitems';

export default function Navbar() {
    const pathname = usePathname()

    return (
        <div className={styles.navbar}>
            <Link href="/">
                <div className={styles.sitetitle}>
                    Gallery Friends
                </div>
            </Link>
            <nav className={ styles.navbar }>
                {MenuItems.map((item) => {
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
            </nav>
        </div>
    )
}