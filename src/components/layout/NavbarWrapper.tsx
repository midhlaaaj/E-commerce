'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';

export function NavbarWrapper() {
  const pathname = usePathname();
  
  // Routes where we don't want the global Navbar
  const noNavbarRoutes = ['/login', '/signup', '/search'];
  
  if (noNavbarRoutes.includes(pathname)) {
    return null;
  }

  return <Navbar transparent />;
}
